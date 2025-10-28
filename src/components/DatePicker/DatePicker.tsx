/**
 * DatePicker 컴포넌트
 *
 * react-datepicker 기반의 독립적인 DatePicker 컴포넌트
 * SearchProvider나 Field 없이도 사용 가능한 일반 컴포넌트
 */

import React, { useState, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePickerProps } from './types';
import { CustomInputWithIcons } from './CustomInputWithIcons';
import { CustomCalendarHeader } from './CustomCalendarHeader';
import styles from './DatePicker.module.scss';

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
  className,
  id,
  name,
  onBlur,
  onFocus,
}) => {
  // ReactDatePicker ref (캘린더 제어용)
  const datePickerRef = useRef<ReactDatePicker>(null);

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
    console.log('[DatePicker handleDatePickerChange] Received:', date, 'Type:', Array.isArray(date) ? 'Array' : typeof date);
    console.log('[DatePicker] isRange:', isRange);
    console.log('[DatePicker] currentValue before:', currentValue);

    let newValue: Date | null | [Date | null, Date | null];

    if (isRange) {
      // 범위 선택 모드
      if (Array.isArray(date)) {
        newValue = date;
        console.log('[Range] Array received:', newValue);
      } else {
        newValue = [date, null];
        console.log('[Range] Single date received, converting to:', newValue);
      }
    } else {
      // 단일 선택 모드
      if (Array.isArray(date)) {
        newValue = date[0];
      } else {
        newValue = date;
      }
    }

    console.log('[DatePicker] Final newValue:', newValue);

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      console.log('[DatePicker] Updating internal state');
      setInternalValue(newValue);
    }

    // onChange 콜백 호출
    if (onChange) {
      console.log('[DatePicker] Calling onChange with:', newValue);
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

  /**
   * 날짜 문자열 파싱 함수
   * 다양한 형식을 지원: yyyy-MM-dd, yyyy/MM/dd, yyyy.MM.dd, yyyyMMdd
   *
   * @returns { success: boolean, date: Date }
   *   - success: true면 파싱 성공, false면 실패
   *   - date: 파싱된 날짜 또는 실패 시 오늘 날짜
   */
  const parseDateString = (inputStr: string): { success: boolean; date: Date } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!inputStr || inputStr.trim() === '') {
      return { success: false, date: today };
    }

    // 공백 제거
    const cleaned = inputStr.trim();

    // 다양한 구분자 통일 (-, /, .)
    const normalized = cleaned.replace(/[./]/g, '-');

    // yyyy-MM-dd 형식으로 파싱 시도
    let match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

    // yyyyMMdd 형식 (구분자 없음)
    if (!match) {
      match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
    }

    if (!match) {
      // 파싱 실패
      console.warn(`Invalid date format: "${inputStr}". Using today's date.`);
      return { success: false, date: today };
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // 날짜 유효성 검증
    const parsedDate = new Date(year, month - 1, day);
    parsedDate.setHours(0, 0, 0, 0);

    // 유효한 날짜인지 확인
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      console.warn(`Invalid date: "${inputStr}". Using today's date.`);
      return { success: false, date: today };
    }

    return { success: true, date: parsedDate };
  };

  /**
   * 직접 입력 핸들러
   *
   * Range 모드 폴백 규칙:
   * - 두 개 입력 (예: "2025-01-01 ~ 2025-01-31")
   *   - start 성공, end 성공 → [startDate, endDate]
   *   - start 실패, end 성공 → [endDate, endDate]
   *   - start 성공, end 실패 → [startDate, startDate]
   *   - start 실패, end 실패 → [today, today]
   * - 하나 입력 (예: "2025-01-01")
   *   - 파싱 성공 → [date, null]
   *   - 파싱 실패 → [today, today]
   *
   * Single 모드:
   * - 파싱 실패 시 오늘 날짜 (parseDateString에서 처리)
   */
  const handleManualInput = (inputStr: string) => {
    if (isRange) {
      // Range 모드: "2025-01-01 ~ 2025-01-31" 형식 지원
      const parts = inputStr.split(/[\s~]+/).filter((p) => p.trim());

      if (parts.length === 2) {
        // 두 개 입력된 경우
        const startResult = parseDateString(parts[0]);
        const endResult = parseDateString(parts[1]);

        let finalStartDate: Date;
        let finalEndDate: Date;

        if (startResult.success && endResult.success) {
          // 둘 다 성공
          finalStartDate = startResult.date;
          finalEndDate = endResult.date;
        } else if (!startResult.success && endResult.success) {
          // start 실패, end 성공 → end를 start에도 사용
          finalStartDate = endResult.date;
          finalEndDate = endResult.date;
        } else if (startResult.success && !endResult.success) {
          // start 성공, end 실패 → start를 end에도 사용
          finalStartDate = startResult.date;
          finalEndDate = startResult.date;
        } else {
          // 둘 다 실패 → 오늘 날짜
          finalStartDate = startResult.date; // 이미 today
          finalEndDate = endResult.date; // 이미 today
        }

        const newValue: [Date | null, Date | null] = [finalStartDate, finalEndDate];

        if (!isControlled) {
          setInternalValue(newValue);
        }
        if (onChange) {
          onChange(newValue);
        }
      } else {
        // 하나만 입력된 경우
        const result = parseDateString(inputStr);

        let newValue: [Date | null, Date | null];

        if (result.success) {
          // 파싱 성공 → [date, null]
          newValue = [result.date, null];
        } else {
          // 파싱 실패 → [today, today]
          newValue = [result.date, result.date];
        }

        if (!isControlled) {
          setInternalValue(newValue);
        }
        if (onChange) {
          onChange(newValue);
        }
      }
    } else {
      // Single 모드: 파싱 실패 시 오늘 날짜 (parseDateString에서 처리)
      const result = parseDateString(inputStr);

      if (!isControlled) {
        setInternalValue(result.date);
      }
      if (onChange) {
        onChange(result.date);
      }
    }
  };

  /**
   * Today 버튼 클릭 핸들러
   * 오늘 날짜를 선택하고 캘린더 뷰를 오늘 날짜의 년월로 이동
   */
  const handleTodayClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newValue: Date | null | [Date | null, Date | null] = isRange ? [today, today] : today;

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(newValue);
    }

    // 캘린더 뷰를 오늘 날짜의 년월로 이동시키기 위해 캘린더를 닫았다가 다시 열기
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
      setTimeout(() => {
        datePickerRef.current?.setOpen(true);
      }, 0);
    }
  };

  // Popper.js modifiers for automatic positioning
  const popperModifiers = [
    {
      name: 'preventOverflow',
      options: {
        rootBoundary: 'viewport',
        padding: 8,
      },
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'bottom', 'right', 'left'],
        padding: 8,
      },
    },
  ];

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
            ref={datePickerRef}
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
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            popperClassName={styles.popper}
            popperModifiers={popperModifiers as any}
            renderCustomHeader={(headerProps) => <CustomCalendarHeader {...headerProps} />}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
                onManualInput={handleManualInput}
              />
            }
          >
            <div className={styles.calendarFooter}>
              <button
                type="button"
                onClick={handleTodayClick}
                className={styles.todayButton}
                aria-label="오늘 날짜 선택"
              >
                Today
              </button>
            </div>
          </ReactDatePicker>
        ) : (
          <ReactDatePicker
            ref={datePickerRef}
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
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            popperClassName={styles.popper}
            popperModifiers={popperModifiers as any}
            renderCustomHeader={(headerProps) => <CustomCalendarHeader {...headerProps} />}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
                onManualInput={handleManualInput}
              />
            }
          >
            <div className={styles.calendarFooter}>
              <button
                type="button"
                onClick={handleTodayClick}
                className={styles.todayButton}
                aria-label="오늘 날짜 선택"
              >
                Today
              </button>
            </div>
          </ReactDatePicker>
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
