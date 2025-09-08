/**
 * Swiper 탭 아이템 타입 정의
 * 각 탭의 고유 식별자와 표시 텍스트를 포함
 */
export interface SwiperTabItem {
  /** 탭의 고유 식별자 */
  id: string;
  /** 탭에 표시될 텍스트 */
  label: string;
}

/**
 * Swiper 컴포넌트의 Props 타입 정의
 * 필수 props만 포함하여 간소화
 */
export interface SwiperTabsProps {
  /** 탭 아이템 목록 (필수) */
  tabs: SwiperTabItem[];
  /** 현재 활성화된 탭의 ID */
  activeTabId?: string;
  /** 탭 클릭 시 호출되는 콜백 함수 */
  onTabChange?: (tabId: string) => void;
  /** 컨테이너의 추가 클래스명 (스타일 커스터마이징용) */
  className?: string;
}