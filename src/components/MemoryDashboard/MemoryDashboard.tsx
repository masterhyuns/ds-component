import React, { useMemo } from 'react';
import { TabMemoryInfo } from '../../hooks/useTabMemoryManager';
import styles from './MemoryDashboard.module.scss';

export interface MemoryDashboardProps {
  /** 탭 정보 목록 */
  tabs: TabMemoryInfo[];
  /** 총 메모리 사용량 (MB) */
  totalMemoryUsage: number;
  /** 메모리 경고 상태 */
  isMemoryWarning: boolean;
  /** 메모리 설정 */
  memoryConfig: {
    maxTabs: number;
    memoryThreshold: number;
    warningThreshold: number;
  };
  /** 통계 정보 */
  stats: {
    activeTabsCount: number;
    totalTabsCount: number;
    averageMemoryPerTab: number;
    lowestPerformanceScore: number;
    highestPerformanceScore: number;
  };
  /** 탭 정리 콜백 */
  onCleanupTab: (tabId: string) => Promise<boolean>;
  /** 전체 정리 콜백 */
  onCleanupAll: () => Promise<string[]>;
  /** 설정 변경 콜백 */
  onConfigChange?: (config: Partial<{
    maxTabs: number;
    memoryThreshold: number;
    warningThreshold: number;
  }>) => void;
  /** 대시보드 표시 여부 */
  isVisible?: boolean;
}

/**
 * 메모리 사용량 모니터링 대시보드
 * - 실시간 메모리 사용량 시각화
 * - 탭별 성능 지표 및 관리 기능
 * - 메모리 최적화 권장사항 제시
 */
export const MemoryDashboard: React.FC<MemoryDashboardProps> = ({
  tabs,
  totalMemoryUsage,
  isMemoryWarning,
  memoryConfig,
  stats,
  onCleanupTab,
  onCleanupAll,
  onConfigChange,
  isVisible = true
}) => {
  /**
   * 메모리 사용량 차트 데이터 계산
   */
  const memoryChartData = useMemo(() => {
    const sortedTabs = [...tabs].sort((a, b) => b.memoryUsage - a.memoryUsage);
    const maxDisplayTabs = 10;
    
    return {
      topTabs: sortedTabs.slice(0, maxDisplayTabs),
      otherTabsMemory: sortedTabs
        .slice(maxDisplayTabs)
        .reduce((sum, tab) => sum + tab.memoryUsage, 0)
    };
  }, [tabs]);

  /**
   * 성능 점수별 탭 분류
   */
  const performanceGroups = useMemo(() => {
    const groups = {
      excellent: tabs.filter(tab => tab.performanceScore >= 90),
      good: tabs.filter(tab => tab.performanceScore >= 70 && tab.performanceScore < 90),
      fair: tabs.filter(tab => tab.performanceScore >= 50 && tab.performanceScore < 70),
      poor: tabs.filter(tab => tab.performanceScore < 50)
    };
    
    return groups;
  }, [tabs]);

  /**
   * 권장 정리 대상 탭
   */
  const recommendedCleanupTabs = useMemo(() => {
    return tabs
      .filter(tab => !tab.isActive && tab.performanceScore < 60)
      .sort((a, b) => a.performanceScore - b.performanceScore)
      .slice(0, 5);
  }, [tabs]);

  /**
   * 메모리 사용률 계산
   */
  const memoryUsagePercent = Math.min((totalMemoryUsage / memoryConfig.memoryThreshold) * 100, 100);
  const tabUsagePercent = Math.min((stats.totalTabsCount / memoryConfig.maxTabs) * 100, 100);

  /**
   * 상태에 따른 색상 클래스
   */
  const getStatusColor = (score: number): string => {
    if (score >= 90) return styles.excellent;
    if (score >= 70) return styles.good;
    if (score >= 50) return styles.fair;
    return styles.poor;
  };

  /**
   * 메모리 사용량 포맷팅
   */
  const formatMemory = (mb: number): string => {
    if (mb < 1) return `${Math.round(mb * 1000)}KB`;
    if (mb > 1000) return `${(mb / 1000).toFixed(1)}GB`;
    return `${Math.round(mb)}MB`;
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.dashboard} ${isMemoryWarning ? styles.warning : ''}`}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>메모리 모니터링 대시보드</h2>
        <div className={styles.status}>
          <span className={`${styles.indicator} ${isMemoryWarning ? styles.warning : styles.normal}`} />
          {isMemoryWarning ? '메모리 부족' : '정상'}
        </div>
      </div>

      {/* 전체 통계 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💾</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatMemory(totalMemoryUsage)}</div>
            <div className={styles.statLabel}>총 메모리 사용량</div>
            <div className={styles.statProgress}>
              <div 
                className={`${styles.statProgressBar} ${isMemoryWarning ? styles.warning : ''}`}
                style={{ width: `${memoryUsagePercent}%` }}
              />
            </div>
            <div className={styles.statDetail}>
              {memoryConfig.memoryThreshold}MB 중 {Math.round(memoryUsagePercent)}%
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📑</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalTabsCount}</div>
            <div className={styles.statLabel}>열린 탭 수</div>
            <div className={styles.statProgress}>
              <div 
                className={`${styles.statProgressBar} ${tabUsagePercent > 80 ? styles.warning : ''}`}
                style={{ width: `${tabUsagePercent}%` }}
              />
            </div>
            <div className={styles.statDetail}>
              {memoryConfig.maxTabs}개 중 {Math.round(tabUsagePercent)}% (활성: {stats.activeTabsCount}개)
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatMemory(stats.averageMemoryPerTab)}</div>
            <div className={styles.statLabel}>평균 탭 메모리</div>
            <div className={styles.statDetail}>
              최고: {Math.round(stats.highestPerformanceScore)}점 / 
              최저: {Math.round(stats.lowestPerformanceScore)}점
            </div>
          </div>
        </div>
      </div>

      {/* 메모리 사용량 차트 */}
      <div className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>탭별 메모리 사용량</h3>
        <div className={styles.memoryChart}>
          {memoryChartData.topTabs.map((tab) => (
            <div key={tab.id} className={styles.chartBar}>
              <div className={styles.chartBarLabel}>
                <span className={styles.tabTitle}>#{tab.id}</span>
                <span className={styles.tabMemory}>{formatMemory(tab.memoryUsage)}</span>
              </div>
              <div className={styles.chartBarContainer}>
                <div 
                  className={`${styles.chartBarFill} ${getStatusColor(tab.performanceScore)}`}
                  style={{ 
                    width: `${(tab.memoryUsage / Math.max(...memoryChartData.topTabs.map(t => t.memoryUsage))) * 100}%` 
                  }}
                />
                <div className={styles.chartBarScore}>
                  {Math.round(tab.performanceScore)}점
                </div>
              </div>
            </div>
          ))}
          
          {memoryChartData.otherTabsMemory > 0 && (
            <div className={styles.chartBar}>
              <div className={styles.chartBarLabel}>
                <span className={styles.tabTitle}>기타 {tabs.length - 10}개 탭</span>
                <span className={styles.tabMemory}>{formatMemory(memoryChartData.otherTabsMemory)}</span>
              </div>
              <div className={styles.chartBarContainer}>
                <div 
                  className={`${styles.chartBarFill} ${styles.other}`}
                  style={{ width: '20%' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 성능 분석 */}
      <div className={styles.performanceSection}>
        <h3 className={styles.sectionTitle}>성능 분석</h3>
        <div className={styles.performanceGrid}>
          <div className={`${styles.performanceCard} ${styles.excellent}`}>
            <div className={styles.performanceIcon}>🟢</div>
            <div className={styles.performanceContent}>
              <div className={styles.performanceValue}>{performanceGroups.excellent.length}</div>
              <div className={styles.performanceLabel}>우수 (90점+)</div>
            </div>
          </div>
          
          <div className={`${styles.performanceCard} ${styles.good}`}>
            <div className={styles.performanceIcon}>🟡</div>
            <div className={styles.performanceContent}>
              <div className={styles.performanceValue}>{performanceGroups.good.length}</div>
              <div className={styles.performanceLabel}>양호 (70-89점)</div>
            </div>
          </div>
          
          <div className={`${styles.performanceCard} ${styles.fair}`}>
            <div className={styles.performanceIcon}>🟠</div>
            <div className={styles.performanceContent}>
              <div className={styles.performanceValue}>{performanceGroups.fair.length}</div>
              <div className={styles.performanceLabel}>보통 (50-69점)</div>
            </div>
          </div>
          
          <div className={`${styles.performanceCard} ${styles.poor}`}>
            <div className={styles.performanceIcon}>🔴</div>
            <div className={styles.performanceContent}>
              <div className={styles.performanceValue}>{performanceGroups.poor.length}</div>
              <div className={styles.performanceLabel}>개선 필요 (50점 미만)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 권장 정리 목록 */}
      {recommendedCleanupTabs.length > 0 && (
        <div className={styles.cleanupSection}>
          <h3 className={styles.sectionTitle}>정리 권장 탭</h3>
          <div className={styles.cleanupList}>
            {recommendedCleanupTabs.map(tab => (
              <div key={tab.id} className={styles.cleanupItem}>
                <div className={styles.cleanupItemInfo}>
                  <div className={styles.cleanupItemTitle}>#{tab.id}</div>
                  <div className={styles.cleanupItemDetails}>
                    {formatMemory(tab.memoryUsage)} · {Math.round(tab.performanceScore)}점 · 
                    {Math.round((Date.now() - tab.lastAccessed.getTime()) / (1000 * 60))}분 전 접근
                  </div>
                </div>
                <button
                  className={styles.cleanupButton}
                  onClick={() => onCleanupTab(tab.id)}
                >
                  정리
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className={styles.actionSection}>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={onCleanupAll}
          disabled={tabs.filter(t => !t.isActive).length === 0}
        >
          전체 자동 정리
        </button>
        
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>

      {/* 설정 섹션 (개발 환경에서만) */}
      {typeof window !== 'undefined' && onConfigChange && (
        <div className={styles.configSection}>
          <h3 className={styles.sectionTitle}>설정</h3>
          <div className={styles.configGrid}>
            <div className={styles.configItem}>
              <label className={styles.configLabel}>최대 탭 수</label>
              <input
                type="number"
                value={memoryConfig.maxTabs}
                onChange={(e) => onConfigChange({ maxTabs: parseInt(e.target.value) })}
                className={styles.configInput}
                min="1"
                max="50"
              />
            </div>
            
            <div className={styles.configItem}>
              <label className={styles.configLabel}>메모리 임계값 (MB)</label>
              <input
                type="number"
                value={memoryConfig.memoryThreshold}
                onChange={(e) => onConfigChange({ memoryThreshold: parseInt(e.target.value) })}
                className={styles.configInput}
                min="100"
                max="2000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};