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
      // Chrome의 Memory API 활용 (지원 시)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const baseMemory = memory.usedJSHeapSize / (1024 * 1024); // MB 변환

        // iframe 특정 메모리 추정
        if (iframeElement) {
          const iframeDoc = iframeElement.contentDocument;
          if (iframeDoc) {
            // DOM 노드 수, 이미지, 스크립트 등을 기반으로 메모리 사용량 추정
            const domNodes = iframeDoc.querySelectorAll('*').length;
            const images = iframeDoc.querySelectorAll('img').length;
            const scripts = iframeDoc.querySelectorAll('script').length;
            
            // 추정 공식: 노드당 1KB + 이미지당 100KB + 스크립트당 50KB
            const estimatedMemory = (domNodes * 0.001) + (images * 0.1) + (scripts * 0.05);
            return Math.max(baseMemory * 0.1, estimatedMemory); // 최소값 보장
          }
        }
        
        return baseMemory * 0.1; // 전체 메모리의 10%를 해당 탭으로 추정
      }

      // Fallback: Resource Timing API 활용
      const entries = performance.getEntriesByType('resource');
      const tabResources = entries.filter(entry => 
        entry.name.includes(tabId) || 
        (iframeElement && entry.name.includes(iframeElement.src))
      );

      // 리소스 크기 기반 메모리 사용량 추정
      const totalSize = tabResources.reduce((sum, resource) => {
        const resourceEntry = resource as PerformanceResourceTiming;
        return sum + (resourceEntry.transferSize || 0);
      }, 0);

      return totalSize / (1024 * 1024); // MB 변환
    } catch (error) {
      console.warn(`메모리 측정 실패 (탭: ${tabId}):`, error);
      return 5; // 기본값 5MB
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
      let score = 100;

      // 메모리 사용량 기반 점수 (50% 가중치)
      const memoryScore = Math.max(0, 100 - (memoryUsage / config.memoryThreshold) * 100);
      score = score * 0.5 + memoryScore * 0.5;

      // iframe 로딩 시간 기반 점수 (30% 가중치)
      if (iframeElement) {
        const loadTime = iframeElement.dataset.loadTime;
        if (loadTime) {
          const loadTimeMs = parseInt(loadTime);
          const loadingScore = Math.max(0, 100 - (loadTimeMs / 5000) * 100); // 5초 기준
          score = score * 0.7 + loadingScore * 0.3;
        }
      }

      // 마지막 접근 시간 기반 점수 (20% 가중치)
      const currentTab = tabs.get(tabId);
      if (currentTab) {
        const timeSinceAccess = Date.now() - currentTab.lastAccessed.getTime();
        const accessScore = Math.max(0, 100 - (timeSinceAccess / (1000 * 60 * 10)) * 100); // 10분 기준
        score = score * 0.8 + accessScore * 0.2;
      }

      return Math.round(score);
    } catch (error) {
      console.warn(`성능 점수 계산 실패 (탭: ${tabId}):`, error);
      return 50; // 기본값
    }
  }, [tabs, config.memoryThreshold]);

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