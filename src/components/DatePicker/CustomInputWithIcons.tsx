/**
 * CustomInputWithIcons 컴포넌트
 * 캘린더 아이콘과 Clear 버튼이 있는 커스텀 Input
 */

import React, { forwardRef } from 'react';
import { CustomInputProps } from './types';
import styles from './DatePicker.module.scss';

/**
 * react-datepicker를 위한 커스텀 Input 컴포넌트
 * - 캘린더 아이콘 버튼
 * - 직접 입력 지원 (blur, Enter 키)
 * - Clear 버튼
 */
export const CustomInputWithIcons = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      value,
      onClick,
      onBlur,
      onFocus,
      placeholder,
      disabled,
      className,
      id,
      name,
      onClear,
      onManualInput,
      error,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(value || '');
    const [isUserTyping, setIsUserTyping] = React.useState(false);

    // value prop 변경 시 inputValue 동기화
    React.useEffect(() => {
      setInputValue(value || '');
      setIsUserTyping(false); // 외부에서 value 변경 시 typing 플래그 리셋
    }, [value]);

    /**
     * Clear 버튼 클릭 핸들러
     */
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear && !disabled) {
        onClear();
      }
    };

    /**
     * Input 값 변경 핸들러 (직접 입력)
     * onChange는 호출하지 않음 - 캘린더 클릭 시에만 react-datepicker가 자동 호출
     * 직접 입력은 onBlur에서 handleManualInput으로 처리
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsUserTyping(true); // 사용자가 직접 타이핑 중임을 표시
    };

    /**
     * 직접 입력된 값 처리
     * blur 또는 Enter 키 입력 시 호출
     */
    const handleManualInputSubmit = () => {
      console.log('[CustomInput handleManualInputSubmit] inputValue:', inputValue, 'isUserTyping:', isUserTyping);

      // 직접 입력한 경우에만 파싱 실행
      if (onManualInput && inputValue && isUserTyping) {
        console.log('[CustomInput] Calling onManualInput with:', inputValue);
        onManualInput(inputValue);
      } else {
        console.log('[CustomInput] Skipping onManualInput - isUserTyping:', isUserTyping);
      }

      // typing 플래그 리셋
      setIsUserTyping(false);
    };

    /**
     * Blur 핸들러: 직접 입력된 값 파싱 및 검증
     * 사용자가 직접 타이핑한 경우에만 파싱 실행 (캘린더 클릭 시 blur는 무시)
     */
    const handleInputBlur = () => {
      handleManualInputSubmit();

      // 기본 onBlur도 호출
      if (onBlur) {
        onBlur();
      }
    };

    /**
     * 키보드 이벤트 핸들러
     * Enter 키 입력 시 직접 입력 처리
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleManualInputSubmit();
      }
    };

    return (
      <div className={styles.customInputWrapper}>
        <button
          type="button"
          className={styles.calendarIcon}
          onClick={onClick}
          disabled={disabled}
          tabIndex={-1}
          aria-label="캘린더 열기"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.667 2.667h-9.334C2.597 2.667 2 3.264 2 4v9.333c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333zM5.333 1.333v2.667M10.667 1.333v2.667M2 6.667h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onClick={onClick}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.customInput} ${error ? styles.inputError : ''} ${className || ''}`}
          id={id}
          name={name}
        />

        {value && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            tabIndex={-1}
            aria-label="지우기"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

CustomInputWithIcons.displayName = 'CustomInputWithIcons';
