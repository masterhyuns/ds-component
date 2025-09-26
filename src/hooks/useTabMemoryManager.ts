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
  // 탭별 메모리 측정 기준점 저장
  const tabMemoryBaseline = useRef<Map<string, number>>(new Map());

  const measureTabMemory = useCallback((tabId: string, iframeElement?: HTMLIFrameElement): number => {
    try {
      if (!iframeElement) {
        return 0;
      }

      let measuredMemory = 0;

      // 1. Performance API - Navigation Timing으로 페이지 로드 크기 측정
      try {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const pageLoadEntry = navigationEntries[navigationEntries.length - 1];
        
        if (pageLoadEntry) {
          // 전송된 바이트를 메모리로 추정 (HTML + 기본 리소스)
          const transferSize = pageLoadEntry.transferSize || 0;
          measuredMemory += (transferSize / 1024 / 1024) * 2; // 2배 팽창 계수
        }
      } catch (error) {
        console.warn('Navigation Timing API 실패:', error);
      }

      // 2. Resource Timing API - 해당 iframe 관련 리소스들의 실제 크기 측정
      try {
        const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const iframeSrc = iframeElement.src;
        
        // 현재 iframe과 관련된 리소스들 필터링
        const relatedResources = resourceEntries.filter(entry => {
          try {
            const entryUrl = new URL(entry.name);
            const iframeUrl = new URL(iframeSrc);
            return entryUrl.hostname === iframeUrl.hostname;
          } catch {
            return entry.name.includes(iframeSrc);
          }
        });

        // 실제 전송된 데이터 크기 합계
        const totalTransferredBytes = relatedResources.reduce((sum, entry) => {
          return sum + (entry.transferSize || entry.encodedBodySize || 0);
        }, 0);

        // 네트워크 리소스를 메모리 사용량으로 변환
        // 압축 해제, DOM 생성, 렌더링 등을 고려하여 3배 팽창 계수 적용
        const resourceMemory = (totalTransferredBytes / 1024 / 1024) * 3;
        measuredMemory += resourceMemory;

        console.log(`리소스 기반 측정 (${tabId}):`, {
          관련리소스수: relatedResources.length,
          전송바이트: Math.round(totalTransferredBytes / 1024) + 'KB',
          추정메모리: Math.round(resourceMemory * 10) / 10 + 'MB'
        });

      } catch (error) {
        console.warn('Resource Timing API 실패:', error);
      }

      // 3. Chrome Memory API - 전체적인 메모리 사용량 변화 측정
      if ('memory' in performance) {
        try {
          const memory = (performance as any).memory;
          const currentTotalMemory = memory.usedJSHeapSize / (1024 * 1024);
          
          // 기준점이 없으면 현재 값을 기준점으로 설정
          if (!tabMemoryBaseline.current.has('total')) {
            tabMemoryBaseline.current.set('total', currentTotalMemory);
          }
          
          // 전체 메모리 변화량을 현재 활성 탭 수로 나누어 분배
          const baselineMemory = tabMemoryBaseline.current.get('total') || currentTotalMemory;
          const memoryIncrease = Math.max(0, currentTotalMemory - baselineMemory);
          const activeTabs = document.querySelectorAll('iframe[data-tab-id]').length;
          const memoryPerTab = activeTabs > 0 ? memoryIncrease / activeTabs : 0;
          
          measuredMemory += memoryPerTab;

          console.log(`Chrome Memory API (${tabId}):`, {
            전체현재: Math.round(currentTotalMemory) + 'MB',
            전체기준: Math.round(baselineMemory) + 'MB', 
            증가량: Math.round(memoryIncrease) + 'MB',
            탭할당: Math.round(memoryPerTab * 10) / 10 + 'MB'
          });

        } catch (error) {
          console.warn('Chrome Memory API 실패:', error);
        }
      }

      // 4. PerformanceObserver를 통한 실시간 메모리 측정 (향후 확장용)
      // 현재는 기본값으로 최소 메모리 보장
      if (measuredMemory < 1) {
        measuredMemory = 2; // 최소 2MB 보장
      }

      // 최종 값 정규화 (1MB ~ 200MB 범위)
      const finalMemory = Math.max(1, Math.min(200, measuredMemory));
      
      console.log(`📊 최종 메모리 측정 (${tabId}):`, {
        URL: iframeElement.src.substring(0, 50) + '...',
        측정결과: Math.round(finalMemory * 10) / 10 + 'MB'
      });

      return Math.round(finalMemory * 10) / 10; // 소수점 1자리
      
    } catch (error) {
      console.warn(`메모리 측정 실패 (탭: ${tabId}):`, error);
      return 2.0; // fallback
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