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
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  onClear?: () => void;
  onManualInput?: (inputValue: string) => void;
  error?: boolean;
}

const CustomInputWithIcons = forwardRef<HTMLInputElement, CustomInputProps>(
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

/**
 * 커스텀 캘린더 헤더
 * < 월 Select, 년 Select, Today >
 */
interface CustomHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const CustomCalendarHeader: React.FC<CustomHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  // 년도 범위: 현재 년도 기준 -100년 ~ +10년
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  /**
   * 오늘 날짜로 이동
   */
  const handleTodayClick = () => {
    const today = new Date();
    changeYear(today.getFullYear());
    changeMonth(today.getMonth());
  };

  return (
    <div className={styles.customHeader}>
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={styles.navButton}
        aria-label="이전 달"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 10L2 6L6 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.selectWrapper}>
        <select
          value={date.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className={styles.yearSelect}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <select
          value={date.getMonth()}
          onChange={(e) => changeMonth(Number(e.target.value))}
          className={styles.monthSelect}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleTodayClick} className={styles.todayButton} aria-label="오늘">
          Today
        </button>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={styles.navButton}
        aria-label="다음 달"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 2L6 6L2 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

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
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            renderCustomHeader={(headerProps) => <CustomCalendarHeader {...headerProps} />}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
                onManualInput={handleManualInput}
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
            onBlur={onBlur}
            onFocus={onFocus}
            calendarClassName={styles.calendar}
            wrapperClassName={styles.wrapper}
            renderCustomHeader={(headerProps) => <CustomCalendarHeader {...headerProps} />}
            customInput={
              <CustomInputWithIcons
                disabled={disabled}
                error={!!error}
                onClear={isClearable ? handleClear : undefined}
                onManualInput={handleManualInput}
              />
            }
          />
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
