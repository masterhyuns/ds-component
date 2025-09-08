/**
 * 검색 컴포넌트의 기본 타입 정의
 */

import { ReactNode } from 'react';
import { FieldValues, UseFormReturn, Path, PathValue } from 'react-hook-form';

/**
 * 검색 필드의 기본 타입
 * 다양한 검색 컴포넌트를 지원하기 위한 타입
 */
export type SearchFieldType = 
  | 'text'           // 기본 텍스트 입력
  | 'select'         // 드롭다운 선택
  | 'multiselect'    // 다중 선택
  | 'date'           // 날짜 선택
  | 'daterange'      // 날짜 범위 선택
  | 'number'         // 숫자 입력
  | 'numberrange'    // 숫자 범위
  | 'checkbox'       // 체크박스
  | 'radio'          // 라디오 버튼
  | 'autocomplete'   // 자동완성
  | 'custom';        // 사용자 정의 컴포넌트

/**
 * 선택 옵션 타입
 * select, multiselect, radio, checkbox 등에서 사용
 */
export interface Option<T = any> {
  /** 표시할 라벨 */
  label: string;
  /** 실제 값 */
  value: T;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 메타데이터 */
  meta?: Record<string, any>;
}

/**
 * 검색 필드 메타 정의
 * 각 검색 필드의 설정을 정의하는 인터페이스
 */
export interface SearchFieldMeta<TFieldValues extends FieldValues = FieldValues> {
  /** 필드 고유 식별자 */
  id: string;
  /** 필드 이름 (react-hook-form 필드 이름) */
  name: Path<TFieldValues>;
  /** 필드 타입 */
  type: SearchFieldType;
  /** 표시 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 기본값 */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 유효성 검사 규칙 */
  validation?: Record<string, any>;
  /** 선택 옵션 (select, multiselect, radio, checkbox 타입용) */
  options?: Option[];
  /** 옵션을 비동기로 로드하는 함수 */
  loadOptions?: (query: string) => Promise<Option[]>;
  /** 그리드 컬럼 span (레이아웃용) */
  colSpan?: number;
  /** 렌더링 순서 */
  order?: number;
  /** 의존성 필드 (다른 필드 값에 따라 동작이 변경되는 경우) */
  dependsOn?: string[];
  /** 필드 표시 조건 함수 */
  showWhen?: (values: TFieldValues) => boolean;
  /** 커스텀 렌더 함수 */
  customRender?: (props: SearchFieldRenderProps<TFieldValues>) => ReactNode;
  /** 추가 설정 */
  config?: Record<string, any>;
}

/**
 * 검색 필드 렌더링 Props
 * 커스텀 컴포넌트에서 사용할 props
 */
export interface SearchFieldRenderProps<TFieldValues extends FieldValues = FieldValues> {
  /** 필드 메타 정보 */
  field: SearchFieldMeta<TFieldValues>;
  /** react-hook-form 메서드 */
  form: UseFormReturn<TFieldValues>;
  /** 현재 값 */
  value: any;
  /** 값 변경 핸들러 */
  onChange: (value: any) => void;
  /** 에러 메시지 */
  error?: string;
}

/**
 * 검색 폼 설정
 * 전체 검색 폼의 설정을 정의
 */
export interface SearchFormConfig<TFieldValues extends FieldValues = FieldValues> {
  /** 폼 ID */
  id: string;
  /** 폼 이름 */
  name?: string;
  /** 필드 메타 정의 배열 */
  fields: SearchFieldMeta<TFieldValues>[];
  /** 레이아웃 설정 */
  layout?: {
    /** 그리드 컬럼 수 */
    columns?: number;
    /** 간격 */
    gap?: string | number;
    /** 레이아웃 방향 */
    direction?: 'horizontal' | 'vertical';
  };
  /** 제출 핸들러 */
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  /** 리셋 핸들러 */
  onReset?: () => void;
  /** 변경 핸들러 */
  onChange?: (data: TFieldValues) => void;
  /** 제출 버튼 텍스트 */
  submitText?: string;
  /** 리셋 버튼 텍스트 */
  resetText?: string;
  /** 버튼 표시 여부 */
  showButtons?: boolean;
  /** 자동 제출 (디바운스) */
  autoSubmit?: boolean;
  /** 자동 제출 지연 시간 (ms) */
  autoSubmitDelay?: number;
}

/**
 * 헤드리스 검색 컴포넌트 Props
 */
export interface SearchBoxProps<TFieldValues extends FieldValues = FieldValues> {
  /** 검색 폼 설정 */
  config: SearchFormConfig<TFieldValues>;
  /** 커스텀 필드 컴포넌트 매핑 */
  customComponents?: Record<string, React.ComponentType<SearchFieldRenderProps<TFieldValues>>>;
  /** 스타일 클래스명 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 폼 래퍼 렌더 함수 (헤드리스 모드) */
  render?: (props: {
    form: UseFormReturn<TFieldValues>;
    fields: ReactNode[];
    submitButton?: ReactNode;
    resetButton?: ReactNode;
  }) => ReactNode;
}

/**
 * 검색 결과 타입
 */
export interface SearchResult<T = any> {
  /** 결과 데이터 */
  data: T[];
  /** 전체 개수 */
  total: number;
  /** 현재 페이지 */
  page?: number;
  /** 페이지당 개수 */
  pageSize?: number;
}

/**
 * 검색 컨텍스트 타입
 * 전역 상태 관리용
 */
export interface SearchContext<TFieldValues extends FieldValues = FieldValues> {
  /** 현재 검색 값 */
  values: TFieldValues;
  /** 검색 값 설정 */
  setValues: (values: TFieldValues) => void;
  /** 검색 실행 */
  search: (values?: TFieldValues) => Promise<void>;
  /** 검색 중 여부 */
  isSearching: boolean;
  /** 검색 결과 */
  results?: SearchResult;
  /** 에러 */
  error?: Error;
  /** 검색 초기화 */
  reset: () => void;
}