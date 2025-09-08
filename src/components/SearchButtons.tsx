/**
 * 검색 버튼 컴포넌트
 * 검색 및 초기화 버튼 제공
 */

import React from 'react';
import { useSearchForm } from '../hooks/useSearchForm';
import styles from './SearchButtons.module.scss';

export interface SearchButtonsProps {
  /** 제출 버튼 텍스트 */
  submitText?: string;
  /** 리셋 버튼 텍스트 */
  resetText?: string;
  /** 리셋 버튼 표시 여부 */
  showReset?: boolean;
  /** 버튼 배치 */
  align?: 'left' | 'center' | 'right';
  /** 커스텀 클래스명 */
  className?: string;
}

/**
 * 검색 버튼 그룹
 */
export const SearchButtons: React.FC<SearchButtonsProps> = ({
  submitText = '검색',
  resetText = '초기화',
  showReset = true,
  align = 'right',
  className,
}) => {
  const form = useSearchForm();
  
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await form.submit();
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    form.reset();
  };
  
  return (
    <div 
      className={`${styles.buttons} ${styles[`align-${align}`]} ${className || ''}`}
    >
      <button
        type="button"
        onClick={handleSubmit}
        disabled={form.isSubmitting}
        className={styles.submitButton}
      >
        {form.isSubmitting ? '검색 중...' : submitText}
      </button>
      
      {showReset && (
        <button
          type="button"
          onClick={handleReset}
          disabled={form.isSubmitting}
          className={styles.resetButton}
        >
          {resetText}
        </button>
      )}
    </div>
  );
};