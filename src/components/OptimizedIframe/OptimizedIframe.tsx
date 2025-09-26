import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './OptimizedIframe.module.scss';

export interface OptimizedIframeProps {
  /** 탭 고유 ID */
  tabId: string;
  /** iframe src URL */
  src: string;
  /** iframe 제목 */
  title?: string;
  /** 활성 상태 */
  isActive: boolean;
  /** 지연 로딩 활성화 */
  lazyLoad?: boolean;
  /** 로딩 완료 콜백 */
  onLoad?: (tabId: string, loadTime: number) => void;
  /** 메모리 사용량 변경 콜백 */
  onMemoryChange?: (tabId: string, memoryUsage: number) => void;
  /** 오류 발생 콜백 */
  onError?: (tabId: string, error: string) => void;
  /** 정리 요청 콜백 */
  onCleanupRequest?: (tabId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** iframe 스타일 */
  style?: React.CSSProperties;
}

/**
 * 메모리 최적화된 iframe 컴포넌트
 * - 지연 로딩 및 가상화 지원
 * - 자동 리소스 정리 및 메모리 누수 방지
 * - 성능 모니터링 및 오류 처리
 * - 생명주기 관리 및 최적화
 */
export const OptimizedIframe: React.FC<OptimizedIframeProps> = ({
  tabId,
  src,
  title,
  isActive,
  lazyLoad = true,
  onLoad,
  onMemoryChange,
  onError,
  onCleanupRequest,
  className,
  style
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazyLoad || isActive);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const [lastMemoryCheck, setLastMemoryCheck] = useState(Date.now());
  
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const memoryCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  /**
   * iframe 로딩 시작
   */
  const startLoading = useCallback(() => {
    setLoadStartTime(Date.now());
    setIsLoaded(false);
  }, []);

  /**
   * iframe 로딩 완료 처리
   */
  const handleLoad = useCallback(() => {
    const loadEndTime = Date.now();
    const loadTime = loadStartTime ? loadEndTime - loadStartTime : 0;
    
    setIsLoaded(true);
    
    // 로딩 시간을 data attribute로 저장
    if (iframeRef.current && loadTime > 0) {
      iframeRef.current.dataset.loadTime = loadTime.toString();
    }
    
    onLoad?.(tabId, loadTime);
    
    // 로딩 완료 후 메모리 사용량 측정 시작
    startMemoryMonitoring();
  }, [tabId, loadStartTime, onLoad]);

  /**
   * iframe 오류 처리
   */
  const handleError = useCallback(() => {
    const error = 'iframe 로딩 실패';
    console.error(`iframe 오류 (${tabId}):`, error);
    onError?.(tabId, error);
    setIsLoaded(false);
  }, [tabId, onError]);

  /**
   * 메모리 사용량 측정
   */
  const measureMemoryUsage = useCallback((): number => {
    try {
      if (!iframeRef.current || !isLoaded) return 0;

      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return 0;

      // DOM 기반 메모리 사용량 추정
      const domNodes = iframeDoc.querySelectorAll('*').length;
      const imageElements = iframeDoc.querySelectorAll('img');
      const scripts = iframeDoc.querySelectorAll('script').length;
      const stylesheets = iframeDoc.querySelectorAll('link[rel="stylesheet"], style').length;
      
      // 이미지 크기 계산
      let imageMemory = 0;
      const imageElementsList = Array.from(imageElements) as HTMLImageElement[];
      imageElementsList.forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
          // 추정: width * height * 4 bytes (RGBA) / 1024 / 1024 (MB 변환)
          imageMemory += (img.naturalWidth * img.naturalHeight * 4) / (1024 * 1024);
        }
      });

      // 메모리 사용량 추정 공식
      const baseMemory = domNodes * 0.001; // 노드당 1KB
      const scriptMemory = scripts * 0.05; // 스크립트당 50KB
      const styleMemory = stylesheets * 0.01; // 스타일시트당 10KB
      
      const totalMemory = baseMemory + scriptMemory + styleMemory + imageMemory;
      
      return Math.max(totalMemory, 1); // 최소 1MB
    } catch (error) {
      console.warn(`메모리 측정 실패 (${tabId}):`, error);
      return 5; // 기본값 5MB
    }
  }, [tabId, isLoaded]);

  /**
   * 메모리 모니터링 시작
   */
  const startMemoryMonitoring = useCallback(() => {
    if (memoryCheckIntervalRef.current) {
      clearInterval(memoryCheckIntervalRef.current);
    }

    memoryCheckIntervalRef.current = setInterval(() => {
      const memoryUsage = measureMemoryUsage();
      setLastMemoryCheck(Date.now());
      onMemoryChange?.(tabId, memoryUsage);
      
      // 메모리 사용량이 비정상적으로 높으면 정리 요청
      if (memoryUsage > 100) { // 100MB 초과
        console.warn(`높은 메모리 사용량 감지 (${tabId}): ${Math.round(memoryUsage)}MB`);
        onCleanupRequest?.(tabId);
      }
    }, 10000); // 10초마다 체크
  }, [tabId, measureMemoryUsage, onMemoryChange, onCleanupRequest]);

  /**
   * iframe 리소스 정리
   */
  const cleanupResources = useCallback(() => {
    try {
      if (iframeRef.current) {
        // iframe 내용 정리
        const iframe = iframeRef.current;
        
        // 메시지 리스너 정리
        if (iframe.contentWindow) {
          // postMessage 통신 정리
          iframe.contentWindow.postMessage({ type: 'cleanup' }, '*');
        }

        // iframe src를 빈 페이지로 변경하여 리소스 해제
        iframe.src = 'about:blank';
        
        // DOM 이벤트 정리
        iframe.onload = null;
        iframe.onerror = null;
      }
    } catch (error) {
      console.warn(`리소스 정리 실패 (${tabId}):`, error);
    }

    // 타이머 정리
    if (memoryCheckIntervalRef.current) {
      clearInterval(memoryCheckIntervalRef.current);
      memoryCheckIntervalRef.current = null;
    }

    // Observer 정리
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
    }

    if (performanceObserverRef.current) {
      performanceObserverRef.current.disconnect();
      performanceObserverRef.current = null;
    }
  }, [tabId]);

  /**
   * Intersection Observer 설정 (지연 로딩)
   */
  useEffect(() => {
    if (!lazyLoad || !iframeRef.current) return;

    intersectionObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    intersectionObserverRef.current.observe(iframeRef.current);

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [lazyLoad, isInView]);

  /**
   * Performance Observer 설정
   */
  useEffect(() => {
    if (!('PerformanceObserver' in window) || !isLoaded) return;

    try {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        // 리소스 로딩 성능 모니터링
        entries.forEach(entry => {
          if (entry.entryType === 'resource' && entry.name.includes(src)) {
            console.log(`리소스 로딩 성능 (${tabId}):`, {
              name: entry.name,
              duration: entry.duration,
              size: (entry as PerformanceResourceTiming).transferSize
            });
          }
        });
      });

      performanceObserverRef.current.observe({ 
        entryTypes: ['resource', 'measure', 'navigation'] 
      });
    } catch (error) {
      console.warn(`Performance Observer 설정 실패 (${tabId}):`, error);
    }

    return () => {
      performanceObserverRef.current?.disconnect();
    };
  }, [tabId, src, isLoaded]);

  /**
   * 활성 상태 변경 시 로딩 처리
   */
  useEffect(() => {
    if (isActive && !isInView) {
      setIsInView(true);
    }
  }, [isActive, isInView]);

  /**
   * 활성 상태 변경 시 최적화
   */
  useEffect(() => {
    if (!isActive && isLoaded) {
      // 비활성 상태일 때 불필요한 리소스 일시 정지
      if (iframeRef.current?.contentWindow) {
        try {
          // iframe 내 타이머 및 애니메이션 정지 요청
          iframeRef.current.contentWindow.postMessage({ 
            type: 'pause_resources' 
          }, '*');
        } catch (error) {
          // postMessage 실패는 무시
        }
      }
    } else if (isActive && isLoaded) {
      // 활성 상태일 때 리소스 재시작
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage({ 
            type: 'resume_resources' 
          }, '*');
        } catch (error) {
          // postMessage 실패는 무시
        }
      }
    }
  }, [isActive, isLoaded]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  /**
   * src 변경 시 로딩 시작
   */
  useEffect(() => {
    if (isInView && src && src !== 'about:blank') {
      startLoading();
    }
  }, [src, isInView, startLoading]);

  const shouldRenderIframe = isInView && src && src !== 'about:blank';

  return (
    <div 
      className={`${styles.container} ${className || ''} ${isActive ? styles.active : ''}`}
      style={style}
    >
      {/* 로딩 상태 표시 */}
      {shouldRenderIframe && !isLoaded && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>페이지 로딩 중...</div>
        </div>
      )}

      {/* 지연 로딩 플레이스홀더 */}
      {!isInView && lazyLoad && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🌐</div>
          <div className={styles.placeholderText}>
            스크롤하여 페이지를 로드합니다
          </div>
        </div>
      )}

      {/* 실제 iframe */}
      {shouldRenderIframe && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title || `Tab ${tabId}`}
          className={styles.iframe}
          data-tab-id={tabId}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"
          loading="lazy"
          allow="camera; microphone; geolocation; encrypted-media"
        />
      )}

      {/* 디버그 정보 (개발 환경에서만) */}
      {typeof window !== 'undefined' && isLoaded && (
        <div className={styles.debugInfo}>
          <small>
            탭: {tabId} | 메모리: ~{Math.round(measureMemoryUsage())}MB | 
            마지막 체크: {new Date(lastMemoryCheck).toLocaleTimeString()}
          </small>
        </div>
      )}
    </div>
  );
};