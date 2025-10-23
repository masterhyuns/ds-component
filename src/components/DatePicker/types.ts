/**
 * DatePicker 관련 타입 정의
 */

/**
 * CustomInputWithIcons 컴포넌트 Props
 * 캘린더 아이콘과 Clear 버튼이 있는 커스텀 Input
 */
export interface CustomInputProps {
  /** Input value (react-datepicker에서 전달) */
  value?: string;
  /** Input 클릭 핸들러 (달력 토글) */
  onClick?: () => void;
  /** Blur 이벤트 핸들러 */
  onBlur?: () => void;
  /** Focus 이벤트 핸들러 */
  onFocus?: () => void;
  /** Placeholder 텍스트 */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** CSS 클래스명 */
  className?: string;
  /** Input ID */
  id?: string;
  /** Input name */
  name?: string;
  /** Clear 버튼 클릭 핸들러 */
  onClear?: () => void;
  /** 직접 입력된 날짜 문자열 처리 핸들러 */
  onManualInput?: (inputValue: string) => void;
  /** 에러 상태 여부 */
  error?: boolean;
}

/**
 * CustomCalendarHeader 컴포넌트 Props
 * react-datepicker의 커스텀 헤더
 */
export interface CustomHeaderProps {
  /** 현재 표시 중인 날짜 */
  date: Date;
  /** 년도 변경 핸들러 */
  changeYear: (year: number) => void;
  /** 월 변경 핸들러 */
  changeMonth: (month: number) => void;
  /** 이전 달로 이동 */
  decreaseMonth: () => void;
  /** 다음 달로 이동 */
  increaseMonth: () => void;
  /** 이전 달 버튼 비활성화 여부 */
  prevMonthButtonDisabled: boolean;
  /** 다음 달 버튼 비활성화 여부 */
  nextMonthButtonDisabled: boolean;
}

/**
 * DatePicker 컴포넌트 Props
 * react-datepicker 기반 독립 DatePicker
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
