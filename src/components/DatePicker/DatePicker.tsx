/**
 * DatePicker 컴포넌트
 *
 * react-datepicker 기반의 독립적인 DatePicker 컴포넌트
 * SearchProvider나 Field 없이도 사용 가능한 일반 컴포넌트
 */

import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.scss';

/**
 * DatePicker Props
 */
export interface DatePickerProps {
  /** 현재 선택된 날짜 (controlled) */
  value?: Date | null;
  /** 기본 선택 날짜 (uncontrolled) */
  defaultValue?: Date | null;
  /** 날짜 변경 핸들러 */
  onChange?: (date: Date | null) => void;

  /** 범위 선택 모드 */
  isRange?: boolean;
  /** 범위 선택 시작일 (controlled) */
  startDate?: Date | null;
  /** 범위 선택 종료일 (controlled) */
  endDate?: Date | null;
  /** 범위 변경 핸들러 */
  onRangeChange?: (dates: [Date | null, Date | null]) => void;

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
 * <DatePicker
 *   isRange
 *   startDate={startDate}
 *   endDate={endDate}
 *   onRangeChange={([start, end]) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 * />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  isRange = false,
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  onRangeChange,
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
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
  const [internalStartDate, setInternalStartDate] = useState<Date | null>(controlledStartDate || null);
  const [internalEndDate, setInternalEndDate] = useState<Date | null>(controlledEndDate || null);

  // Controlled vs Uncontrolled 모드 판단
  const isControlled = controlledValue !== undefined;
  const isRangeControlled = controlledStartDate !== undefined || controlledEndDate !== undefined;

  // 현재 값
  const currentValue = isControlled ? controlledValue : internalValue;
  const currentStartDate = isRangeControlled ? controlledStartDate : internalStartDate;
  const currentEndDate = isRangeControlled ? controlledEndDate : internalEndDate;

  /**
   * 단일 날짜 변경 핸들러
   */
  const handleChange = (date: Date | null) => {
    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      setInternalValue(date);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(date);
    }
  };

  /**
   * 범위 날짜 변경 핸들러
   */
  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isRangeControlled) {
      setInternalStartDate(start);
      setInternalEndDate(end);
    }

    // onRangeChange 콜백 호출
    if (onRangeChange) {
      onRangeChange([start, end]);
    }
  };

  /**
   * react-datepicker의 onChange는 단일/범위에 따라 다른 타입 반환
   */
  const handleDatePickerChange = (date: Date | [Date | null, Date | null] | null) => {
    if (isRange) {
      // 범위 선택 모드
      if (Array.isArray(date)) {
        handleRangeChange(date);
      } else {
        handleRangeChange([date, null]);
      }
    } else {
      // 단일 선택 모드
      if (Array.isArray(date)) {
        handleChange(date[0]);
      } else {
        handleChange(date);
      }
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
            isClearable={isClearable && !disabled}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode="select"
            onBlur={onBlur}
            onFocus={onFocus}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
          />
        ) : (
          <ReactDatePicker
            id={id}
            name={name}
            selected={currentValue}
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
            isClearable={isClearable && !disabled}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode="select"
            onBlur={onBlur}
            onFocus={onFocus}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
          />
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
