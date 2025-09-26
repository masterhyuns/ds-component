import { useState, useEffect, useCallback, useRef } from 'react';

export interface TabMemoryInfo {
  id: string;
  url: string;
  memoryUsage: number; // MB 단위
  lastAccessed: Date;
  isActive: boolean;
  performanceScore: number; // 0-100점 성능 점수
}

export interface MemoryConfig {
  maxTabs: number;
  memoryThreshold: number; // MB
  warningThreshold: number; // MB
  checkInterval: number; // ms
  autoCleanup: boolean;
}

/**
 * 탭별 메모리 사용량 모니터링 및 제한 관리 훅
 * - Performance Observer API를 활용한 실시간 메모리 모니터링
 * - 탭 개수 제한 및 메모리 기반 자동 정리
 * - iframe 리소스 최적화 및 성능 측정
 */
export const useTabMemoryManager = (config: MemoryConfig = {
  maxTabs: 10,
  memoryThreshold: 500, // 500MB
  warningThreshold: 300, // 300MB
  checkInterval: 5000, // 5초
  autoCleanup: true
}) => {
  const [tabs, setTabs] = useState<Map<string, TabMemoryInfo>>(new Map());
  const [totalMemoryUsage, setTotalMemoryUsage] = useState(0);
  const [isMemoryWarning, setIsMemoryWarning] = useState(false);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * 개별 탭의 메모리 사용량 측정
   * Performance Observer와 Memory API 활용
   */
  const measureTabMemory = useCallback((tabId: string, iframeElement?: HTMLIFrameElement): number => {
    try {
      if (!iframeElement) {
        return 2; // 기본값 2MB
      }

      // iframe 존재 여부와 로딩 상태 확인
      const isLoaded = iframeElement.contentDocument !== null;
      
      // CORS로 인해 contentDocument 접근 불가한 경우
      let baseMemoryEstimate = 3; // 기본 3MB
      
      // iframe의 src URL 기반 추정
      if (iframeElement.src && iframeElement.src !== 'about:blank') {
        // URL 길이와 도메인을 기반으로 추정
        const url = new URL(iframeElement.src);
        const domain = url.hostname;
        
        // 도메인별 대략적인 메모리 사용량 추정
        if (domain.includes('github')) baseMemoryEstimate = 8;
        else if (domain.includes('google')) baseMemoryEstimate = 12;
        else if (domain.includes('stackoverflow')) baseMemoryEstimate = 6;
        else if (domain.includes('wikipedia')) baseMemoryEstimate = 4;
        else if (domain.includes('jsonplaceholder')) baseMemoryEstimate = 2;
        else if (domain.includes('httpbin')) baseMemoryEstimate = 1;
        else baseMemoryEstimate = 5; // 기본값
        
        // 페이지 복잡도 추정 (경로 깊이 기반)
        const pathDepth = url.pathname.split('/').filter(p => p.length > 0).length;
        baseMemoryEstimate += pathDepth * 0.5;
        
        // 쿼리 파라미터가 있으면 추가
        if (url.search) {
          baseMemoryEstimate += 1;
        }
      }
      
      // Performance API로 네트워크 리소스 확인
      try {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const relatedEntries = entries.filter(entry => 
          entry.name.includes(iframeElement.src) || 
          (new URL(entry.name).hostname === new URL(iframeElement.src).hostname)
        );
        
        // 네트워크 리소스 크기 기반 메모리 추가
        const networkMemory = relatedEntries.reduce((sum, entry) => {
          // 전송된 데이터 크기를 메모리로 변환 (압축 해제 등 고려하여 1.5배)
          return sum + ((entry.transferSize || entry.encodedBodySize || 1024) * 1.5);
        }, 0) / (1024 * 1024); // MB 변환
        
        baseMemoryEstimate += networkMemory;
      } catch (perfError) {
        // Performance API 실패 시 무시
        console.warn('Performance API 접근 실패:', perfError);
      }
      
      // Chrome Memory API 활용 (가능한 경우)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const totalMemory = memory.usedJSHeapSize / (1024 * 1024);
        // 전체 메모리의 일정 비율을 해당 iframe으로 추정 (탭 수 고려)
        const iframes = document.querySelectorAll('iframe[data-tab-id]');
        const memoryPerTab = totalMemory / Math.max(iframes.length, 1);
        
        // 추정값과 실제 측정값 중 더 큰 값 사용
        baseMemoryEstimate = Math.max(baseMemoryEstimate, memoryPerTab * 0.8);
      }
      
      // 로딩되지 않은 경우 메모리 사용량 감소
      if (!isLoaded && iframeElement.src !== 'about:blank') {
        baseMemoryEstimate *= 0.3; // 30%만 사용
      }
      
      // 최소 1MB, 최대 100MB로 제한
      return Math.max(1, Math.min(baseMemoryEstimate, 100));
      
    } catch (error) {
      console.warn(`메모리 측정 실패 (탭: ${tabId}):`, error);
      return 3; // 기본값 3MB
    }
  }, []);

  /**
   * 탭 성능 점수 계산
   * 로딩 시간, 메모리 사용량, 응답성을 종합하여 0-100점으로 계산
   */
  const calculatePerformanceScore = useCallback((
    tabId: string, 
    memoryUsage: number, 
    iframeElement?: HTMLIFrameElement
  ): number => {
    try {
      let totalScore = 0;
      let weightSum = 0;

      // 1. 메모리 사용량 기반 점수 (40% 가중치)
      const memoryWeight = 0.4;
      // 메모리 사용량이 적을수록 높은 점수 (1MB = 100점, 20MB = 0점 기준)
      const memoryScore = Math.max(0, Math.min(100, 100 - ((memoryUsage - 1) / 19) * 100));
      totalScore += memoryScore * memoryWeight;
      weightSum += memoryWeight;

      // 2. 로딩 시간 기반 점수 (30% 가중치)
      if (iframeElement) {
        const loadTime = iframeElement.dataset.loadTime;
        if (loadTime) {
          const loadTimeMs = parseInt(loadTime);
          // 1초 이하 = 100점, 10초 = 0점
          const loadingScore = Math.max(0, Math.min(100, 100 - (loadTimeMs / 10000) * 100));
          const loadingWeight = 0.3;
          totalScore += loadingScore * loadingWeight;
          weightSum += loadingWeight;
        } else {
          // 로딩 시간 정보가 없으면 중간값
          totalScore += 50 * 0.3;
          weightSum += 0.3;
        }
      }

      // 3. 마지막 접근 시간 기반 점수 (20% 가중치)
      const currentTab = tabs.get(tabId);
      if (currentTab) {
        const timeSinceAccess = Date.now() - currentTab.lastAccessed.getTime();
        // 최근 접근 = 100점, 1시간 = 0점
        const accessScore = Math.max(0, Math.min(100, 100 - (timeSinceAccess / (1000 * 60 * 60)) * 100));
        const accessWeight = 0.2;
        totalScore += accessScore * accessWeight;
        weightSum += accessWeight;
      }

      // 4. 탭 활성 상태 기반 점수 (10% 가중치)  
      const activeScore = currentTab?.isActive ? 100 : 30;
      const activeWeight = 0.1;
      totalScore += activeScore * activeWeight;
      weightSum += activeWeight;

      // 가중평균 계산
      const finalScore = weightSum > 0 ? totalScore / weightSum : 50;
      
      // 디버깅용 로그
      console.log(`성능 점수 계산 (${tabId}): 메모리=${memoryUsage}MB(${Math.round(memoryScore)}점), 최종=${Math.round(finalScore)}점`);
      
      return Math.round(Math.max(0, Math.min(100, finalScore)));
    } catch (error) {
      console.warn(`성능 점수 계산 실패 (탭: ${tabId}):`, error);
      return 50; // 기본값
    }
  }, [tabs]);

  /**
   * 모든 탭의 메모리 사용량 업데이트
   */
  const updateAllTabsMemory = useCallback(async () => {
    const updatedTabs = new Map(tabs);
    let totalMemory = 0;

    // 모든 iframe 요소 조회
    const iframes = document.querySelectorAll('iframe[data-tab-id]');
    
    for (const iframe of Array.from(iframes)) {
      const tabId = iframe.getAttribute('data-tab-id');
      if (!tabId) continue;

      const iframeElement = iframe as HTMLIFrameElement;
      const memoryUsage = measureTabMemory(tabId, iframeElement);
      const performanceScore = calculatePerformanceScore(tabId, memoryUsage, iframeElement);

      const existingTab = updatedTabs.get(tabId);
      const updatedTab: TabMemoryInfo = {
        id: tabId,
        url: iframeElement.src,
        memoryUsage,
        lastAccessed: existingTab?.isActive ? new Date() : (existingTab?.lastAccessed || new Date()),
        isActive: existingTab?.isActive || false,
        performanceScore
      };

      updatedTabs.set(tabId, updatedTab);
      totalMemory += memoryUsage;
    }

    setTabs(updatedTabs);
    setTotalMemoryUsage(totalMemory);
    setIsMemoryWarning(totalMemory > config.warningThreshold);

    // 자동 정리 실행 (메모리 임계값 초과 시)
    if (config.autoCleanup && totalMemory > config.memoryThreshold) {
      await performMemoryCleanup();
    }
  }, [tabs, config, measureTabMemory, calculatePerformanceScore]);

  /**
   * 메모리 기반 탭 자동 정리
   * 성능 점수가 낮은 순으로 탭 정리
   */
  const performMemoryCleanup = useCallback(async (): Promise<string[]> => {
    const tabList = Array.from(tabs.values());
    
    // 비활성 탭 중 성능 점수가 낮은 순으로 정렬
    const candidatesForCleanup = tabList
      .filter(tab => !tab.isActive)
      .sort((a, b) => a.performanceScore - b.performanceScore);

    const cleanedTabs: string[] = [];
    let currentMemory = totalMemoryUsage;

    for (const tab of candidatesForCleanup) {
      if (currentMemory <= config.warningThreshold) break;

      // 탭 정리 실행
      const success = await cleanupTab(tab.id);
      if (success) {
        cleanedTabs.push(tab.id);
        currentMemory -= tab.memoryUsage;
      }
    }

    return cleanedTabs;
  }, [tabs, totalMemoryUsage, config.warningThreshold]);

  /**
   * 개별 탭 정리
   */
  const cleanupTab = useCallback(async (tabId: string): Promise<boolean> => {
    try {
      const iframe = document.querySelector(`iframe[data-tab-id="${tabId}"]`) as HTMLIFrameElement;
      if (iframe) {
        // iframe 내용 정리
        iframe.src = 'about:blank';
        
        // DOM에서 제거
        setTimeout(() => {
          iframe.remove();
        }, 100);

        // 탭 정보에서 제거
        const updatedTabs = new Map(tabs);
        updatedTabs.delete(tabId);
        setTabs(updatedTabs);

        return true;
      }
      return false;
    } catch (error) {
      console.error(`탭 정리 실패 (${tabId}):`, error);
      return false;
    }
  }, [tabs]);

  /**
   * 새 탭 추가 가능 여부 검사
   */
  const canAddNewTab = useCallback((): { allowed: boolean; reason?: string } => {
    const currentTabCount = tabs.size;
    
    if (currentTabCount >= config.maxTabs) {
      return { 
        allowed: false, 
        reason: `최대 탭 개수 초과 (${config.maxTabs}개)` 
      };
    }

    if (totalMemoryUsage > config.memoryThreshold) {
      return { 
        allowed: false, 
        reason: `메모리 사용량 초과 (${Math.round(totalMemoryUsage)}MB / ${config.memoryThreshold}MB)` 
      };
    }

    return { allowed: true };
  }, [tabs.size, totalMemoryUsage, config]);

  /**
   * 탭 활성화 상태 업데이트
   */
  const setTabActive = useCallback((tabId: string, isActive: boolean) => {
    setTabs(prev => {
      const updated = new Map(prev);
      const tab = updated.get(tabId);
      if (tab) {
        updated.set(tabId, {
          ...tab,
          isActive,
          lastAccessed: isActive ? new Date() : tab.lastAccessed
        });
      }
      return updated;
    });
  }, []);

  /**
   * Performance Observer 설정
   */
  useEffect(() => {
    if (!('PerformanceObserver' in window)) {
      console.warn('Performance Observer not supported');
      return;
    }

    try {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // 메모리 관련 항목 처리
        entries.forEach(entry => {
          if (entry.entryType === 'measure' || entry.entryType === 'resource') {
            // 메모리 사용량 변화 감지 시 업데이트
            updateAllTabsMemory();
          }
        });
      });

      performanceObserverRef.current.observe({ 
        entryTypes: ['measure', 'resource', 'navigation'] 
      });
    } catch (error) {
      console.warn('Performance Observer 설정 실패:', error);
    }

    return () => {
      performanceObserverRef.current?.disconnect();
    };
  }, [updateAllTabsMemory]);

  /**
   * 정기적 메모리 체크
   */
  useEffect(() => {
    intervalRef.current = setInterval(updateAllTabsMemory, config.checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateAllTabsMemory, config.checkInterval]);

  /**
   * 초기 데이터 로딩
   */
  useEffect(() => {
    updateAllTabsMemory();
  }, []);

  return {
    tabs: Array.from(tabs.values()),
    totalMemoryUsage,
    isMemoryWarning,
    canAddNewTab,
    setTabActive,
    cleanupTab,
    performMemoryCleanup,
    updateAllTabsMemory,
    
    // 통계 정보
    stats: {
      activeTabsCount: Array.from(tabs.values()).filter(t => t.isActive).length,
      totalTabsCount: tabs.size,
      averageMemoryPerTab: tabs.size > 0 ? totalMemoryUsage / tabs.size : 0,
      lowestPerformanceScore: Math.min(...Array.from(tabs.values()).map(t => t.performanceScore)),
      highestPerformanceScore: Math.max(...Array.from(tabs.values()).map(t => t.performanceScore))
    }
  };
};