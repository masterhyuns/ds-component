/**
 * DatePicker 컴포넌트
 *
 * react-datepicker 기반의 독립적인 DatePicker 컴포넌트
 * SearchProvider나 Field 없이도 사용 가능한 일반 컴포넌트
 */

import React, { useState, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.scss';

/**
 * 캘린더 아이콘과 Clear 버튼이 있는 커스텀 Input 컴포넌트
 */
interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  onClear?: () => void;
  error?: boolean;
}

const CustomInputWithIcons = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { value, onClick, onChange, onBlur, onFocus, placeholder, disabled, className, id, name, onClear, error },
    ref
  ) => {
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear && !disabled) {
        onClear();
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
          value={value}
          onClick={onClick}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.customInput} ${error ? styles.inputError : ''} ${className || ''}`}
          id={id}
          name={name}
          readOnly
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

/**
 * DatePicker Props
 */
export interface DatePickerProps {
  /** 현재 선택된 날짜 (controlled) - Single: Date | null, Range: [Date | null, Date | null] */
  value?: Date | null | [Date | null, Date | null];
  /** 기본 선택 날짜 (uncontrolled) - Single: Date | null, Range: [Date | null, Date | null] */
  defaultValue?: Date | null | [Date | null, Date | null];
  /** 날짜 변경 핸들러 - isRange에 따라 타입이 자동으로 결정됨 */
  onChange?: (value: Date | null | [Date | null, Date | null]) => void;

  /** 범위 선택 모드 */
  isRange?: boolean;

  /** 라벨 */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** 에러 메시지 */
  error?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 필수 여부 (라벨에 * 표시) */
  required?: boolean;

  /** 날짜 표시 형식 (기본: 'yyyy-MM-dd') */
  dateFormat?: string;
  /** 최소 선택 가능 날짜 */
  minDate?: Date;
  /** 최대 선택 가능 날짜 */
  maxDate?: Date;
  /** 선택 불가능한 날짜 배열 */
  excludeDates?: Date[];
  /** 선택 가능한 날짜 배열 (이 날짜들만 선택 가능) */
  includeDates?: Date[];

  /** 시간 선택 표시 여부 */
  showTimeSelect?: boolean;
  /** 시간만 선택 */
  showTimeSelectOnly?: boolean;
  /** 시간 표시 형식 */
  timeFormat?: string;
  /** 시간 간격 (분) */
  timeIntervals?: number;

  /** 인라인 캘린더 표시 */
  inline?: boolean;
  /** Clear 버튼 표시 여부 */
  isClearable?: boolean;
  /** 월/년 선택 드롭다운 표시 */
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;

  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 입력 필드 ID */
  id?: string;
  /** 입력 필드 name */
  name?: string;

  /** Blur 이벤트 핸들러 */
  onBlur?: () => void;
  /** Focus 이벤트 핸들러 */
  onFocus?: () => void;
}

/**
 * DatePicker 컴포넌트
 *
 * @example
 * // Uncontrolled 단일 날짜
 * <DatePicker
 *   label="시작일"
 *   defaultValue={new Date()}
 *   onChange={(date) => console.log(date)}
 * />
 *
 * @example
 * // Controlled 단일 날짜
 * const [date, setDate] = useState<Date | null>(null);
 * <DatePicker value={date} onChange={setDate} />
 *
 * @example
 * // 날짜 범위 선택
 * const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
 * <DatePicker value={dates} onChange={setDates} isRange />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  isRange = false,
  label,
  placeholder = '날짜를 선택하세요',
  error,
  disabled = false,
  required = false,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  excludeDates,
  includeDates,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeFormat = 'HH:mm',
  timeIntervals = 15,
  inline = false,
  isClearable = true,
  showMonthDropdown = false,
  showYearDropdown = false,
  className,
  id,
  name,
  onBlur,
  onFocus,
}) => {
  // Uncontrolled 모드를 위한 내부 state
  const [internalValue, setInternalValue] = useState<Date | null | [Date | null, Date | null]>(
    defaultValue || (isRange ? [null, null] : null)
  );

  // Controlled vs Uncontrolled 모드 판단
  const isControlled = controlledValue !== undefined;

  // 현재 값
  const currentValue = isControlled ? controlledValue : internalValue;

  // Range 모드일 때 startDate, endDate 추출
  const currentStartDate = isRange && Array.isArray(currentValue) ? currentValue[0] : null;
  const currentEndDate = isRange && Array.isArray(currentValue) ? currentValue[1] : null;
  const currentSingleValue = !isRange && !Array.isArray(currentValue) ? currentValue : null;

  /**
   * react-datepicker의 onChange는 단일/범위에 따라 다른 타입 반환
   */
  const handleDatePickerChange = (date: Date | [Date | null, Date | null] | null) => {
    let newValue: Date | null | [Date | null, Date | null];

    if (isRange) {
      // 범위 선택 모드
      if (Array.isArray(date)) {
        newValue = date;
      } else {
        newValue = [date, null];
      }
    } else {
      // 단일 선택 모드
      if (Array.isArray(date)) {
        newValue = date[0];
      } else {
        newValue = date;
      }
    }

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(newValue);
    }
  };

  /**
   * Clear 버튼 핸들러
   */
  const handleClear = () => {
    const clearedValue: Date | null | [Date | null, Date | null] = isRange ? [null, null] : null;

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      setInternalValue(clearedValue);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(clearedValue);
    }
  };

  return (
    <div className={`${styles.datePicker} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {isRange ? (
          <ReactDatePicker
            id={id}
            name={name}
            selected={currentStartDate}
            onChange={handleDatePickerChange}
            startDate={currentStartDate || undefined}
            endDate={currentEndDate || undefined}
            selectsRange
            disabled={disabled}
            placeholderText={placeholder}
            dateFormat={showTimeSelect || showTimeSelectOnly ? `${dateFormat} ${timeFormat}` : dateFormat}
            minDate={minDate}
            maxDate={maxDate}
            excludeDates={excludeDates}
            includeDates={includeDates}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeFormat={timeFormat}
            timeIntervals={timeIntervals}
            inline={inline}
            isClearable={false}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode="select"
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
              />
            }
          />
        ) : (
          <ReactDatePicker
            id={id}
            name={name}
            selected={currentSingleValue}
            onChange={handleDatePickerChange}
            disabled={disabled}
            placeholderText={placeholder}
            dateFormat={showTimeSelect || showTimeSelectOnly ? `${dateFormat} ${timeFormat}` : dateFormat}
            minDate={minDate}
            maxDate={maxDate}
            excludeDates={excludeDates}
            includeDates={includeDates}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeFormat={timeFormat}
            timeIntervals={timeIntervals}
            inline={inline}
            isClearable={false}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode="select"
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
              />
            }
          />
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
