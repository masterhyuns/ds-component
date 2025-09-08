/**
 * Swiper 탭 아이템 타입 정의
 * 각 탭의 고유 식별자와 표시 텍스트, 활성화 상태를 포함
 */
export interface SwiperTabItem {
  /** 탭의 고유 식별자 */
  id: string;
  /** 탭에 표시될 텍스트 */
  label: string;
  /** 탭의 활성화 상태 */
  isActive?: boolean;
}

/**
 * Swiper 컴포넌트의 Props 타입 정의
 * 탭 목록과 이벤트 핸들러, 스타일 옵션을 포함
 */
export interface SwiperTabsProps {
  /** 탭 아이템 목록 */
  tabs: SwiperTabItem[];
  /** 현재 활성화된 탭의 ID */
  activeTabId?: string;
  /** 탭 클릭 시 호출되는 콜백 함수 */
  onTabChange?: (tabId: string) => void;
  /** 탭 컨테이너의 추가 클래스명 */
  className?: string;
  /** 좌우 네비게이션 버튼 표시 여부 */
  showNavigation?: boolean;
  /** 네비게이션 버튼 커스텀 아이콘 */
  navigationIcons?: {
    prev?: React.ReactNode;
    next?: React.ReactNode;
  };
  /** 탭 간격 (px) */
  spaceBetween?: number;
  /** 한 번에 보여질 탭 개수 (반응형 설정 가능) */
  slidesPerView?: number | 'auto';
  /** 반응형 브레이크포인트 설정 */
  breakpoints?: {
    [width: number]: {
      slidesPerView: number | 'auto';
      spaceBetween?: number;
    };
  };
}

/**
 * Swiper 네비게이션 버튼 Props 타입
 */
export interface SwiperNavigationProps {
  /** 이전 버튼 활성화 상태 */
  isPrevEnabled: boolean;
  /** 다음 버튼 활성화 상태 */
  isNextEnabled: boolean;
  /** 이전 버튼 클릭 핸들러 */
  onPrevClick: () => void;
  /** 다음 버튼 클릭 핸들러 */
  onNextClick: () => void;
  /** 커스텀 아이콘 */
  icons?: {
    prev?: React.ReactNode;
    next?: React.ReactNode;
  };
}