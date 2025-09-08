import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { SwiperTabsProps } from '../../types/swiper.types';
import styles from './SwiperTabs.module.scss';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';

/**
 * SwiperTabs 컴포넌트
 * ul/li 구조의 스와이프 가능한 탭 네비게이션
 * 활성화된 탭이 항상 보이도록 자동 스크롤
 */
const SwiperTabs: React.FC<SwiperTabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  
  // 현재 활성 탭의 인덱스 계산
  const activeIndex = activeTabId ? tabs.findIndex(tab => tab.id === activeTabId) : -1;

  /**
   * 활성화된 탭으로 자동 스크롤
   * 활성 탭이 변경될 때마다 해당 탭이 중앙에 오도록 이동
   */
  useEffect(() => {
    if (swiperRef.current && activeIndex !== -1) {
      const swiper = swiperRef.current;
      
      // 슬라이드가 업데이트될 때까지 대기
      setTimeout(() => {
        // 직접 슬라이드 요소의 실제 위치 확인
        const activeSlide = swiper.slides[activeIndex] as HTMLElement;
        
        if (activeSlide && swiper.wrapperEl && swiper.el) {
          const containerRect = swiper.el.getBoundingClientRect();
          const slideRect = activeSlide.getBoundingClientRect();
          
          // 슬라이드가 컨테이너 왼쪽보다 왼쪽에 있는 경우
          if (slideRect.left < containerRect.left) {
            swiper.slideTo(activeIndex);
          } 
          // 슬라이드가 컨테이너 오른쪽보다 오른쪽에 있거나 일부만 보이는 경우
          else if (slideRect.right > containerRect.right) {
            // 마지막 탭인 경우 특별 처리
            if (activeIndex === tabs.length - 1) {
              // 마지막 탭이 완전히 보이도록 끝까지 스크롤
              const wrapperWidth = swiper.wrapperEl.scrollWidth;
              const containerWidth = swiper.el.offsetWidth;
              const maxTranslate = wrapperWidth - containerWidth;
              
              if (maxTranslate > 0) {
                // translate 값으로 직접 이동
                swiper.setTranslate(-maxTranslate);
                swiper.updateProgress();
                swiper.updateSlidesClasses();
              }
            } else {
              // 마지막 탭이 아닌 경우, 해당 탭이 오른쪽 끝에 완전히 보이도록
              const containerWidth = swiper.el.offsetWidth;
              const slideWidth = 240;
              const spacing = 8; // 고정값 사용
              
              // 몇 개의 탭을 건너뛰어야 하는지 계산
              const visibleSlides = Math.floor(containerWidth / (slideWidth + spacing));
              const targetIndex = Math.max(0, activeIndex - visibleSlides + 1);
              
              swiper.slideTo(targetIndex);
            }
          }
        }
      }, 100); // DOM 업데이트 대기
    }
  }, [activeIndex, tabs.length]);

  /**
   * Swiper 초기화 시 호출되는 핸들러
   */
  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
  };

  /**
   * 네비게이션 버튼 상태 업데이트 (활성 탭 기준)
   */
  const updateNavigationState = () => {
    setIsPrevDisabled(activeIndex <= 0);
    setIsNextDisabled(activeIndex >= tabs.length - 1);
  };
  
  // 활성 탭이 변경될 때 네비게이션 버튼 상태 업데이트
  useEffect(() => {
    updateNavigationState();
  }, [activeIndex, tabs.length]);
  
  // 탭 개수가 변경될 때 Swiper 업데이트
  useEffect(() => {
    if (swiperRef.current) {
      // Swiper 인스턴스 업데이트
      swiperRef.current.update();
      swiperRef.current.updateSlides();
      swiperRef.current.updateProgress();
      swiperRef.current.updateSlidesClasses();
      
      // 네비게이션 상태도 업데이트
      updateNavigationState();
    }
  }, [tabs.length]);

  /**
   * 탭 클릭 핸들러
   */
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  /**
   * 이전 버튼 클릭 핸들러 - 이전 탭을 활성화
   */
  const handlePrevClick = () => {
    if (!activeTabId) return;
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      if (onTabChange) {
        onTabChange(prevTab.id);
      }
    }
  };

  /**
   * 다음 버튼 클릭 핸들러 - 다음 탭을 활성화
   */
  const handleNextClick = () => {
    if (!activeTabId) return;
    
    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      if (onTabChange) {
        onTabChange(nextTab.id);
      }
    }
  };

  return (
    <div className={`${styles.swiperContainer} ${className || ''}`}>
      {/* Swiper 영역 */}
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={8} // 탭 간격 고정
          slidesPerView={'auto'} // 자동으로 너비 계산
          onSwiper={handleSwiperInit}
          speed={300} // 스크롤 애니메이션 속도
          allowTouchMove={true} // 터치/마우스 드래그 허용
          grabCursor={true} // 드래그 가능 커서 표시
          observer={true} // DOM 변경 감지 (동적 탭 추가/삭제용)
          observeParents={true} // 부모 요소 변경도 감지
          slidesOffsetAfter={120} // 오른쪽 버튼 영역만큼 여백
          wrapperTag="ul" // wrapper를 ul 태그로
          wrapperClass={styles.tabsList}
        >
          {tabs.map((tab) => (
            <SwiperSlide 
              key={tab.id}
              tag="li" 
              className={styles.tabItem}
              style={{ width: '240px', maxWidth: '240px' }}
            >
              <button
                className={`${styles.tabButton} ${
                  activeTabId === tab.id ? styles.active : ''
                }`}
                onClick={() => handleTabClick(tab.id)}
                aria-selected={activeTabId === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 오른쪽 네비게이션 버튼 영역 (항상 표시) */}
      <div className={styles.navigationArea}>
        <button
          className={styles.prevButton}
          onClick={handlePrevClick}
          disabled={isPrevDisabled}
          aria-label="이전 탭으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className={styles.nextButton}
          onClick={handleNextClick}
          disabled={isNextDisabled}
          aria-label="다음 탭으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SwiperTabs;