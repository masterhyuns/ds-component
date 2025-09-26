import React, { useState, useCallback, useEffect } from 'react';
import { useTabMemoryManager } from '../../hooks/useTabMemoryManager';
import { OptimizedIframe } from '../OptimizedIframe/OptimizedIframe';
import { TabLimitWarning } from '../TabLimitWarning/TabLimitWarning';
import { MemoryDashboard } from '../MemoryDashboard/MemoryDashboard';
import { detectSystemMemory, formatMemoryInfo, SystemMemoryInfo } from '../../utils/memoryDetector';
import styles from './TabManager.module.scss';

export interface TabInfo {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  created: Date;
}

export interface TabManagerProps {
  /** 초기 탭 목록 */
  initialTabs?: TabInfo[];
  /** 메모리 설정 */
  memoryConfig?: {
    maxTabs: number;
    memoryThreshold: number;
    warningThreshold: number;
    checkInterval: number;
    autoCleanup: boolean;
  };
  /** 새 탭 생성 콜백 */
  onTabCreate?: (tab: TabInfo) => void;
  /** 탭 닫기 콜백 */
  onTabClose?: (tabId: string) => void;
  /** 탭 활성화 콜백 */
  onTabActivate?: (tabId: string) => void;
  /** 대시보드 표시 여부 */
  showDashboard?: boolean;
  /** CSS 클래스 */
  className?: string;
}

/**
 * 메모리 최적화된 탭 관리자 컴포넌트
 * - 탭별 메모리 모니터링 및 제한
 * - 자동/수동 탭 정리 기능
 * - 성능 최적화된 iframe 관리
 * - 실시간 모니터링 대시보드
 */
export const TabManager: React.FC<TabManagerProps> = ({
  initialTabs = [],
  memoryConfig = {
    maxTabs: 10,
    memoryThreshold: 500,
    warningThreshold: 300,
    checkInterval: 5000,
    autoCleanup: true
  },
  onTabCreate,
  onTabClose,
  onTabActivate,
  showDashboard = false,
  className
}) => {
  // 탭 상태 관리
  const [tabs, setTabs] = useState<Map<string, TabInfo>>(
    new Map(initialTabs.map(tab => [tab.id, tab]))
  );
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialTabs.find(tab => tab.isActive)?.id || null
  );
  const [showWarning, setShowWarning] = useState(false);
  const [newTabUrl, setNewTabUrl] = useState('');
  const [systemMemoryInfo, setSystemMemoryInfo] = useState<SystemMemoryInfo | null>(null);
  const [dynamicMemoryConfig, setDynamicMemoryConfig] = useState(memoryConfig);

  // 메모리 관리자 훅
  const {
    tabs: memoryTabs,
    totalMemoryUsage,
    isMemoryWarning,
    canAddNewTab,
    setTabActive,
    cleanupTab,
    performMemoryCleanup,
    updateAllTabsMemory,
    stats
  } = useTabMemoryManager(dynamicMemoryConfig);

  /**
   * 시스템 메모리 감지 및 동적 설정 적용
   */
  useEffect(() => {
    const initializeMemorySettings = async () => {
      try {
        console.log('🔍 시스템 메모리 분석 중...');
        const memoryInfo = await detectSystemMemory();
        setSystemMemoryInfo(memoryInfo);
        
        // 감지된 정보로 메모리 설정 업데이트
        const optimizedConfig = {
          ...memoryConfig,
          maxTabs: memoryInfo.recommendedMaxTabs,
          memoryThreshold: memoryInfo.recommendedThreshold,
          warningThreshold: memoryInfo.recommendedWarningThreshold,
        };
        
        setDynamicMemoryConfig(optimizedConfig);
        
        console.log('📊 동적 메모리 설정 적용:');
        console.log(formatMemoryInfo(memoryInfo));
        console.log('최종 적용 설정:', optimizedConfig);
        
        // 사용자에게 알림 (선택적)
        if (showDashboard) {
          setTimeout(() => {
            alert(`🎯 시스템 분석 완료!\n\n${formatMemoryInfo(memoryInfo)}`);
          }, 1000);
        }
        
      } catch (error) {
        console.warn('시스템 메모리 감지 실패, 기본 설정 사용:', error);
      }
    };

    initializeMemorySettings();
  }, [memoryConfig, showDashboard]);

  /**
   * 새 탭 생성
   */
  const handleCreateTab = useCallback((url: string, title?: string) => {
    const { allowed, reason } = canAddNewTab();
    
    if (!allowed) {
      alert(`새 탭을 생성할 수 없습니다: ${reason}`);
      setShowWarning(true);
      return;
    }

    const newTab: TabInfo = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || new URL(url).hostname,
      url,
      isActive: false,
      created: new Date()
    };

    setTabs(prev => new Map(prev).set(newTab.id, newTab));
    onTabCreate?.(newTab);
    setNewTabUrl('');
    
    // 새 탭을 즉시 활성화
    setTimeout(() => {
      // 이전 활성 탭 비활성화
      if (activeTabId) {
        setTabActive(activeTabId, false);
        setTabs(prev => {
          const updated = new Map(prev);
          const tab = updated.get(activeTabId);
          if (tab) {
            updated.set(activeTabId, { ...tab, isActive: false });
          }
          return updated;
        });
      }

      // 새 탭 활성화
      setActiveTabId(newTab.id);
      setTabActive(newTab.id, true);
      setTabs(prev => {
        const updated = new Map(prev);
        const tab = updated.get(newTab.id);
        if (tab) {
          updated.set(newTab.id, { ...tab, isActive: true });
        }
        return updated;
      });

      updateAllTabsMemory();
    }, 100);
  }, [canAddNewTab, onTabCreate, updateAllTabsMemory, activeTabId, setTabActive]);

  /**
   * 탭 활성화
   */
  const handleActivateTab = useCallback((tabId: string) => {
    // 이전 활성 탭 비활성화
    if (activeTabId) {
      setTabActive(activeTabId, false);
      setTabs(prev => {
        const updated = new Map(prev);
        const tab = updated.get(activeTabId);
        if (tab) {
          updated.set(activeTabId, { ...tab, isActive: false });
        }
        return updated;
      });
    }

    // 새 탭 활성화
    setActiveTabId(tabId);
    setTabActive(tabId, true);
    setTabs(prev => {
      const updated = new Map(prev);
      const tab = updated.get(tabId);
      if (tab) {
        updated.set(tabId, { ...tab, isActive: true });
      }
      return updated;
    });

    onTabActivate?.(tabId);
  }, [activeTabId, setTabActive, onTabActivate]);

  /**
   * 탭 닫기
   */
  const handleCloseTab = useCallback(async (tabId: string): Promise<boolean> => {
    const success = await cleanupTab(tabId);
    
    if (success) {
      setTabs(prev => {
        const updated = new Map(prev);
        updated.delete(tabId);
        return updated;
      });

      // 닫은 탭이 활성 탭이었다면 다른 탭 활성화
      if (activeTabId === tabId) {
        const remainingTabs = Array.from(tabs.values()).filter(tab => tab.id !== tabId);
        if (remainingTabs.length > 0) {
          handleActivateTab(remainingTabs[0].id);
        } else {
          setActiveTabId(null);
        }
      }

      onTabClose?.(tabId);
    }

    return success;
  }, [cleanupTab, activeTabId, tabs, handleActivateTab, onTabClose]);

  /**
   * 자동 정리 실행
   */
  const handleAutoCleanup = useCallback(async (): Promise<string[]> => {
    const cleanedTabs = await performMemoryCleanup();
    
    // 정리된 탭들을 UI에서도 제거
    setTabs(prev => {
      const updated = new Map(prev);
      cleanedTabs.forEach(tabId => updated.delete(tabId));
      return updated;
    });

    return cleanedTabs;
  }, [performMemoryCleanup]);

  /**
   * 수동 정리 실행
   */
  const handleManualCleanup = useCallback(async (tabIds: string[]) => {
    for (const tabId of tabIds) {
      await handleCloseTab(tabId);
    }
  }, [handleCloseTab]);

  /**
   * iframe 로딩 완료 처리
   */
  const handleIframeLoad = useCallback((_tabId: string, loadTime: number) => {
    console.log(`탭 로딩 완료 (${_tabId}): ${loadTime}ms`);
    updateAllTabsMemory();
  }, [updateAllTabsMemory]);

  /**
   * iframe 메모리 변경 처리
   */
  const handleMemoryChange = useCallback((_tabId: string, memoryUsage: number) => {
    // 메모리 사용량이 업데이트되면 경고 상태 체크
    if (memoryUsage > memoryConfig.warningThreshold && !showWarning) {
      setShowWarning(true);
    }
  }, [memoryConfig.warningThreshold, showWarning]);

  const tabList = Array.from(tabs.values());

  return (
    <div className={`${styles.tabManager} ${className || ''}`}>
      {/* 탭 헤더 */}
      <div className={styles.tabHeader}>
        <div className={styles.tabList}>
          {tabList.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${tab.isActive ? styles.active : ''}`}
              onClick={() => handleActivateTab(tab.id)}
              title={tab.url}
            >
              <span className={styles.tabTitle}>{tab.title}</span>
              <button
                className={styles.tabCloseButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                aria-label={`${tab.title} 탭 닫기`}
              >
                ×
              </button>
            </button>
          ))}
        </div>

        {/* 새 탭 추가 */}
        <div className={styles.newTabSection}>
          <input
            type="url"
            placeholder="URL을 입력하세요..."
            value={newTabUrl}
            onChange={(e) => setNewTabUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTabUrl.trim()) {
                handleCreateTab(newTabUrl.trim());
              }
            }}
            className={styles.urlInput}
          />
          <button
            onClick={() => newTabUrl.trim() && handleCreateTab(newTabUrl.trim())}
            disabled={!newTabUrl.trim()}
            className={styles.addTabButton}
          >
            + 탭 추가
          </button>
        </div>

        {/* 메모리 상태 표시 */}
        <div className={styles.memoryStatus}>
          <div className={`${styles.memoryIndicator} ${isMemoryWarning ? styles.warning : styles.normal}`}>
            <span className={styles.memoryText}>
              {Math.round(totalMemoryUsage)}MB / {dynamicMemoryConfig.memoryThreshold}MB
              {systemMemoryInfo && (
                <small style={{ opacity: 0.7, fontSize: '10px', marginLeft: '4px' }}>
                  ({systemMemoryInfo.deviceType})
                </small>
              )}
            </span>
            <span className={styles.tabCount}>
              {tabList.length} / {dynamicMemoryConfig.maxTabs} 탭
            </span>
          </div>
          
          {showDashboard && (
            <button
              onClick={() => setShowWarning(true)}
              className={styles.dashboardButton}
            >
              📊 대시보드
            </button>
          )}
        </div>
      </div>

      {/* 탭 컨텐츠 영역 */}
      <div className={styles.tabContent}>
        {tabList.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🌐</div>
            <div className={styles.emptyStateTitle}>탭이 없습니다</div>
            <div className={styles.emptyStateDescription}>
              위의 입력창에 URL을 입력하여 새 탭을 만들어보세요.
            </div>
          </div>
        ) : (
          tabList.map(tab => (
            <div
              key={tab.id}
              className={`${styles.tabPane} ${tab.isActive ? styles.active : ''}`}
            >
              <OptimizedIframe
                tabId={tab.id}
                src={tab.url}
                title={tab.title}
                isActive={tab.isActive}
                lazyLoad={true}
                onLoad={handleIframeLoad}
                onMemoryChange={handleMemoryChange}
                onError={(tabId, error) => {
                  console.error(`iframe 오류 (${tabId}):`, error);
                }}
                onCleanupRequest={(tabId) => {
                  console.warn(`탭 정리 요청 (${tabId})`);
                  handleCloseTab(tabId);
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* 경고 모달 */}
      <TabLimitWarning
        currentMemory={totalMemoryUsage}
        maxMemory={dynamicMemoryConfig.memoryThreshold}
        currentTabs={tabList.length}
        maxTabs={dynamicMemoryConfig.maxTabs}
        isVisible={showWarning}
        onAutoCleanup={handleAutoCleanup}
        onManualCleanup={handleManualCleanup}
        onClose={() => setShowWarning(false)}
      />

      {/* 대시보드 */}
      {showDashboard && (
        <div className={styles.dashboardSection}>
          <MemoryDashboard
            tabs={memoryTabs}
            totalMemoryUsage={totalMemoryUsage}
            isMemoryWarning={isMemoryWarning}
            memoryConfig={dynamicMemoryConfig}
            stats={stats}
            onCleanupTab={handleCloseTab}
            onCleanupAll={handleAutoCleanup}
            onConfigChange={(config) => {
              console.log('메모리 설정 변경:', config);
              setDynamicMemoryConfig(prev => ({ ...prev, ...config }));
            }}
          />
        </div>
      )}
    </div>
  );
};