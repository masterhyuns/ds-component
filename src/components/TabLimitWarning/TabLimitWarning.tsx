import React from 'react';
import styles from './TabLimitWarning.module.scss';

export interface TabLimitWarningProps {
  /** 현재 메모리 사용량 (MB) */
  currentMemory: number;
  /** 최대 메모리 임계값 (MB) */
  maxMemory: number;
  /** 현재 탭 개수 */
  currentTabs: number;
  /** 최대 탭 개수 */
  maxTabs: number;
  /** 경고 표시 여부 */
  isVisible: boolean;
  /** 자동 정리 실행 콜백 */
  onAutoCleanup: () => Promise<string[]>;
  /** 수동 탭 정리 콜백 */
  onManualCleanup: (tabIds: string[]) => Promise<void>;
  /** 경고 닫기 콜백 */
  onClose: () => void;
}

/**
 * 탭 제한 및 메모리 경고 컴포넌트
 * - 메모리 사용량 초과 시 경고 표시
 * - 탭 개수 제한 도달 시 알림
 * - 자동/수동 정리 옵션 제공
 */
export const TabLimitWarning: React.FC<TabLimitWarningProps> = ({
  currentMemory,
  maxMemory,
  currentTabs,
  maxTabs,
  isVisible,
  onAutoCleanup,
  onManualCleanup,
  onClose
}) => {
  const [isAutoCleanupRunning, setIsAutoCleanupRunning] = React.useState(false);
  const [cleanupResult, setCleanupResult] = React.useState<string[] | null>(null);

  const memoryUsagePercent = Math.min((currentMemory / maxMemory) * 100, 100);
  const tabUsagePercent = Math.min((currentTabs / maxTabs) * 100, 100);

  const isMemoryOverLimit = currentMemory > maxMemory;
  const isTabOverLimit = currentTabs >= maxTabs;

  /**
   * 자동 정리 실행
   */
  const handleAutoCleanup = async () => {
    setIsAutoCleanupRunning(true);
    setCleanupResult(null);

    try {
      const cleanedTabs = await onAutoCleanup();
      setCleanupResult(cleanedTabs);
      
      if (cleanedTabs.length === 0) {
        alert('정리할 수 있는 탭이 없습니다. 활성 탭을 수동으로 정리해주세요.');
      }
    } catch (error) {
      console.error('자동 정리 실패:', error);
      alert('자동 정리 중 오류가 발생했습니다.');
    } finally {
      setIsAutoCleanupRunning(false);
    }
  };

  /**
   * 권장 정리 탭 목록 생성
   */
  const getRecommendedTabsForCleanup = (): string[] => {
    // 실제 구현에서는 useTabMemoryManager의 탭 정보를 props로 받아야 함
    // 현재는 예시로 빈 배열 반환
    return [];
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isMemoryOverLimit ? '메모리 사용량 초과' : '탭 개수 제한 도달'}
          </h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 사용량 표시 */}
        <div className={styles.usageSection}>
          <div className={styles.usageItem}>
            <div className={styles.usageLabel}>
              메모리 사용량: {Math.round(currentMemory)}MB / {maxMemory}MB
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${isMemoryOverLimit ? styles.overLimit : ''}`}
                style={{ width: `${memoryUsagePercent}%` }}
              />
            </div>
            <div className={styles.usagePercent}>{Math.round(memoryUsagePercent)}%</div>
          </div>

          <div className={styles.usageItem}>
            <div className={styles.usageLabel}>
              탭 개수: {currentTabs}개 / {maxTabs}개
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${isTabOverLimit ? styles.overLimit : ''}`}
                style={{ width: `${tabUsagePercent}%` }}
              />
            </div>
            <div className={styles.usagePercent}>{Math.round(tabUsagePercent)}%</div>
          </div>
        </div>

        {/* 경고 메시지 */}
        <div className={styles.messageSection}>
          {isMemoryOverLimit && (
            <div className={styles.warningMessage}>
              <span className={styles.warningIcon}>⚠️</span>
              메모리 사용량이 한계를 초과했습니다. 성능 저하 및 브라우저 불안정이 발생할 수 있습니다.
            </div>
          )}
          
          {isTabOverLimit && (
            <div className={styles.warningMessage}>
              <span className={styles.warningIcon}>⚠️</span>
              최대 탭 개수에 도달했습니다. 새 탭을 열려면 기존 탭을 정리해주세요.
            </div>
          )}

          <div className={styles.infoMessage}>
            비활성 탭을 자동으로 정리하거나 필요한 탭만 선택하여 정리할 수 있습니다.
          </div>
        </div>

        {/* 정리 결과 표시 */}
        {cleanupResult && cleanupResult.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✅</span>
              {cleanupResult.length}개의 탭이 정리되었습니다.
            </div>
            <div className={styles.cleanedTabsList}>
              {cleanupResult.map(tabId => (
                <span key={tabId} className={styles.cleanedTab}>#{tabId}</span>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className={styles.actionSection}>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleAutoCleanup}
            disabled={isAutoCleanupRunning}
          >
            {isAutoCleanupRunning ? (
              <>
                <span className={styles.spinner} />
                자동 정리 중...
              </>
            ) : (
              '자동 정리 실행'
            )}
          </button>

          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={() => {
              const recommendedTabs = getRecommendedTabsForCleanup();
              if (recommendedTabs.length > 0) {
                onManualCleanup(recommendedTabs);
              } else {
                alert('정리 가능한 탭이 없습니다.');
              }
            }}
          >
            수동 선택 정리
          </button>

          <button
            className={`${styles.button} ${styles.tertiaryButton}`}
            onClick={onClose}
          >
            나중에 정리하기
          </button>
        </div>

        {/* 팁 섹션 */}
        <div className={styles.tipsSection}>
          <h4 className={styles.tipsTitle}>💡 메모리 절약 팁</h4>
          <ul className={styles.tipsList}>
            <li>장시간 사용하지 않는 탭은 자동으로 정리됩니다</li>
            <li>동일한 사이트의 여러 탭보다는 탭 내 페이지 이동을 권장합니다</li>
            <li>리소스가 많은 페이지(동영상, 대용량 이미지)는 메모리 사용량이 높습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};