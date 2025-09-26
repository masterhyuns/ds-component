/**
 * 브라우저 메모리 상황 감지 및 동적 임계값 설정 유틸리티
 * 각 사용자의 디바이스 환경에 맞춘 최적의 메모리 임계값을 자동 계산
 */

export interface SystemMemoryInfo {
  /** 전체 시스템 메모리 (GB, 추정값) */
  totalSystemMemory: number;
  /** 현재 브라우저가 사용 중인 메모리 (MB) */
  currentBrowserMemory: number;
  /** 브라우저 메모리 한계치 (MB, 추정값) */
  browserMemoryLimit: number;
  /** 권장 탭 메모리 임계값 (MB) */
  recommendedThreshold: number;
  /** 권장 경고 임계값 (MB) */
  recommendedWarningThreshold: number;
  /** 권장 최대 탭 개수 */
  recommendedMaxTabs: number;
  /** 디바이스 타입 추정 */
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
}

/**
 * 시스템 메모리 정보 감지 및 분석
 */
export async function detectSystemMemory(): Promise<SystemMemoryInfo> {
  const info: SystemMemoryInfo = {
    totalSystemMemory: 8, // 기본값 8GB
    currentBrowserMemory: 0,
    browserMemoryLimit: 0,
    recommendedThreshold: 200,
    recommendedWarningThreshold: 150,
    recommendedMaxTabs: 8,
    deviceType: 'unknown'
  };

  try {
    // 1. Chrome Memory API로 현재 브라우저 메모리 확인
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      info.currentBrowserMemory = memory.usedJSHeapSize / (1024 * 1024); // MB 변환
      
      // 브라우저 메모리 한계 추정 (Chrome은 보통 시스템 메모리의 25-30%)
      const estimatedLimit = memory.jsHeapSizeLimit / (1024 * 1024); // MB 변환
      info.browserMemoryLimit = estimatedLimit;
      
      // 시스템 메모리 추정 (브라우저 한계치의 3-4배)
      info.totalSystemMemory = Math.round((estimatedLimit * 4) / 1024); // GB 변환
      
      console.log('Chrome Memory API 정보:', {
        사용중: Math.round(info.currentBrowserMemory) + 'MB',
        한계치: Math.round(estimatedLimit) + 'MB',
        추정시스템메모리: info.totalSystemMemory + 'GB'
      });
    }

    // 2. Navigator API로 추가 정보 수집
    if ('deviceMemory' in navigator) {
      // Device Memory API (Chrome 63+)
      info.totalSystemMemory = (navigator as any).deviceMemory;
      console.log('Device Memory API:', info.totalSystemMemory + 'GB');
    }

    // 3. 하드웨어 동시성으로 디바이스 성능 추정
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    console.log('CPU 코어 수:', hardwareConcurrency);

    // 4. User Agent로 디바이스 타입 감지
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      info.deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    } else {
      info.deviceType = 'desktop';
    }

    // 5. 연결 속도로 디바이스 성능 간접 추정
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      console.log('네트워크 성능:', effectiveType);
      
      // 네트워크가 느리면 저사양 디바이스일 가능성 높음
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        info.totalSystemMemory = Math.min(info.totalSystemMemory, 4); // 최대 4GB로 제한
      }
    }

    // 6. 디바이스별 권장값 계산
    info.recommendedMaxTabs = calculateRecommendedMaxTabs(info);
    info.recommendedThreshold = calculateRecommendedThreshold(info);
    info.recommendedWarningThreshold = Math.round(info.recommendedThreshold * 0.75);

  } catch (error) {
    console.warn('메모리 감지 실패, 기본값 사용:', error);
  }

  return info;
}

/**
 * 권장 최대 탭 개수 계산
 */
function calculateRecommendedMaxTabs(info: SystemMemoryInfo): number {
  const { totalSystemMemory, deviceType } = info;
  
  let maxTabs = 8; // 기본값
  
  // 시스템 메모리 기반 계산
  if (totalSystemMemory <= 2) {
    maxTabs = 3; // 2GB 이하
  } else if (totalSystemMemory <= 4) {
    maxTabs = 5; // 4GB 이하
  } else if (totalSystemMemory <= 8) {
    maxTabs = 8; // 8GB 이하
  } else if (totalSystemMemory <= 16) {
    maxTabs = 12; // 16GB 이하
  } else {
    maxTabs = 20; // 16GB 초과
  }
  
  // 디바이스 타입 보정
  switch (deviceType) {
    case 'mobile':
      maxTabs = Math.max(3, Math.round(maxTabs * 0.5)); // 50% 감소
      break;
    case 'tablet':
      maxTabs = Math.round(maxTabs * 0.7); // 30% 감소
      break;
    case 'desktop':
      // 그대로 유지
      break;
  }
  
  return Math.max(3, Math.min(25, maxTabs)); // 3~25개 제한
}

/**
 * 권장 메모리 임계값 계산 (MB)
 */
function calculateRecommendedThreshold(info: SystemMemoryInfo): number {
  const { totalSystemMemory, deviceType, browserMemoryLimit } = info;
  
  let threshold = 200; // 기본값 200MB
  
  // 브라우저 메모리 한계의 10-15% 정도가 안전한 수준
  if (browserMemoryLimit > 0) {
    threshold = Math.round(browserMemoryLimit * 0.12);
  } else {
    // 시스템 메모리 기반 계산 (fallback)
    if (totalSystemMemory <= 2) {
      threshold = 50;   // 2GB 이하
    } else if (totalSystemMemory <= 4) {
      threshold = 100;  // 4GB 이하
    } else if (totalSystemMemory <= 8) {
      threshold = 200;  // 8GB 이하
    } else if (totalSystemMemory <= 16) {
      threshold = 400;  // 16GB 이하
    } else {
      threshold = 800;  // 16GB 초과
    }
  }
  
  // 디바이스 타입 보정
  switch (deviceType) {
    case 'mobile':
      threshold = Math.round(threshold * 0.6); // 40% 감소
      break;
    case 'tablet':
      threshold = Math.round(threshold * 0.8); // 20% 감소
      break;
  }
  
  return Math.max(30, Math.min(1000, threshold)); // 30MB~1GB 제한
}

/**
 * 브라우저가 위험한 메모리 상태인지 확인
 */
export function isDangerousMemoryUsage(): boolean {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      // 80% 이상 사용 시 위험으로 판단
      if (usedRatio > 0.8) {
        console.warn('브라우저 메모리 사용률 위험:', Math.round(usedRatio * 100) + '%');
        return true;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * 실시간 메모리 압박 감지
 */
export function startMemoryPressureMonitoring(callback: (isUnderPressure: boolean) => void): () => void {
  let intervalId: ReturnType<typeof setInterval>;
  
  // Performance Observer로 가비지 컬렉션 감지 시도
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          // GC 관련 엔트리 감지 시 메모리 압박 상황으로 판단
          if (entry.entryType === 'measure' && entry.name.includes('gc')) {
            callback(true);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
    } catch (error) {
      console.warn('Performance Observer 설정 실패:', error);
    }
  }
  
  // 주기적 메모리 상태 체크
  intervalId = setInterval(() => {
    const isDangerous = isDangerousMemoryUsage();
    callback(isDangerous);
  }, 10000); // 10초마다
  
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}

/**
 * 메모리 정보를 읽기 쉽게 포맷팅
 */
export function formatMemoryInfo(info: SystemMemoryInfo): string {
  return `
📊 시스템 메모리 분석 결과:
• 디바이스: ${info.deviceType} (${info.totalSystemMemory}GB RAM)
• 브라우저 현재 사용량: ${Math.round(info.currentBrowserMemory)}MB
• 브라우저 메모리 한계: ${Math.round(info.browserMemoryLimit)}MB
• 권장 탭 임계값: ${info.recommendedThreshold}MB
• 권장 경고 임계값: ${info.recommendedWarningThreshold}MB  
• 권장 최대 탭 수: ${info.recommendedMaxTabs}개
  `.trim();
}