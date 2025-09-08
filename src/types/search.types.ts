/**
 * 추상화된 검색 컴포넌트 타입 정의
 * react-hook-form 의존성을 숨기고 자체 API 제공
 */

import { ReactNode, ComponentType } from 'react';
import { Control, UseFormReturn, UseFormRegister } from 'react-hook-form';

/**
 * 필드 값 타입 (제네릭)
 */
export type FieldValues = Record<string, any>;

/**
 * 검색 필드 타입
 * 지원하는 필드 타입 목록
 */
export type SearchFieldType = 
  | 'text'           // 텍스트 입력
  | 'select'         // 단일 선택
  | 'multiselect'    // 다중 선택
  | 'date'           // 날짜 선택
  | 'daterange'      // 날짜 범위
  | 'number'         // 숫자 입력
  | 'numberrange'    // 숫자 범위
  | 'checkbox'       // 체크박스
  | 'radio'          // 라디오 버튼
  | 'autocomplete'   // 자동완성
  | 'file'           // 파일 업로드
  | 'tags'           // 태그 입력
  | 'custom';        // 사용자 정의

/**
 * 선택 옵션 타입
 */
export interface Option<T = any> {
  /** 표시 라벨 */
  label: string;
  /** 실제 값 */
  value: T;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 메타데이터 */
  meta?: Record<string, any>;
}

/**
 * 필드 유효성 검사 규칙
 * react-hook-form 규칙을 추상화
 */
export interface ValidationRules {
  /** 필수 여부 */
  required?: boolean | string;
  /** 최소 길이 */
  minLength?: number | { value: number; message: string };
  /** 최대 길이 */
  maxLength?: number | { value: number; message: string };
  /** 최소값 */
  min?: number | { value: number; message: string };
  /** 최대값 */
  max?: number | { value: number; message: string };
  /** 정규식 패턴 */
  pattern?: RegExp | { value: RegExp; message: string };
  /** 커스텀 검증 함수 */
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
}

/**
 * 검색 필드 메타 정의
 * 각 필드의 설정을 정의
 */
export interface FieldMeta {
  /** 필드 고유 ID */
  id: string;
  /** 필드 이름 (폼 데이터의 키) */
  name: string;
  /** 필드 타입 */
  type: SearchFieldType;
  /** 표시 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 기본값 */
  defaultValue?: any;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 */
  readonly?: boolean;
  /** 유효성 검사 규칙 */
  validation?: ValidationRules;
  /** 선택 옵션 (select, radio, checkbox용) */
  options?: Option[];
  /** 비동기 옵션 로드 함수 */
  loadOptions?: (query: string) => Promise<Option[]>;
  /** 그리드 컬럼 span */
  colSpan?: number;
  /** 렌더링 순서 */
  order?: number;
  /** 의존 필드 (다른 필드에 따라 동작 변경) */
  dependsOn?: string[];
  /** 조건부 표시 함수 */
  showWhen?: (values: FieldValues) => boolean;
  /** 추가 설정 */
  config?: Record<string, any>;
}

/**
 * 필드 API (useField 훅이 반환하는 객체)
 * 사용자가 직접 사용하는 인터페이스
 */
export interface FieldAPI {
  /** 현재 필드 값 */
  value: any;
  /** 값 변경 함수 */
  setValue: (value: any) => void;
  /** onChange 핸들러 (input 직접 연결용) */
  onChange: (e: any) => void;
  /** onBlur 핸들러 */
  onBlur: () => void;
  /** 에러 메시지 */
  error?: string;
  /** 필드가 수정되었는지 */
  isDirty: boolean;
  /** 필드가 터치되었는지 */
  isTouched: boolean;
  /** 유효성 검사 중인지 */
  isValidating: boolean;
  /** 필드 메타 정보 */
  meta?: FieldMeta;
  /** 필드 초기화 */
  reset: () => void;
  /** 수동 유효성 검사 */
  validate: () => Promise<boolean>;
}

/**
 * 커스텀 필드 컴포넌트가 받는 Props
 * react-hook-form 의존성 없음
 */
export interface FieldProps {
  /** 필드 값 */
  value: any;
  /** 값 변경 핸들러 */
  onChange: (value: any) => void;
  /** Blur 이벤트 핸들러 */
  onBlur?: () => void;
  /** 에러 메시지 */
  error?: string;
  /** 필드 메타 정보 */
  meta?: FieldMeta;
  /** 필드 상태 */
  isDirty?: boolean;
  isTouched?: boolean;
  isValidating?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
}

/**
 * 배열 필드 API (useArrayField 훅이 반환)
 */
export interface ArrayFieldAPI {
  /** 배열 아이템들 */
  items: Array<{ id: string; [key: string]: any }>;
  /** 아이템 추가 */
  add: (value?: any) => void;
  /** 아이템 제거 */
  remove: (index: number) => void;
  /** 아이템 이동 */
  move: (from: number, to: number) => void;
  /** 아이템 삽입 */
  insert: (index: number, value?: any) => void;
  /** 전체 초기화 */
  clear: () => void;
}

/**
 * 검색 폼 설정
 */
export interface SearchConfig {
  /** 폼 ID */
  id: string;
  /** 폼 이름 */
  name?: string;
  /** 필드 메타 정의 배열 */
  fields: FieldMeta[];
  /** 레이아웃 설정 */
  layout?: {
    columns?: number;
    gap?: string | number;
    direction?: 'horizontal' | 'vertical';
  };
  /** 제출 핸들러 */
  onSubmit?: (data: FieldValues) => void | Promise<void>;
  /** 리셋 핸들러 */
  onReset?: () => void;
  /** 변경 핸들러 */
  onChange?: (data: FieldValues) => void;
  /** 자동 제출 */
  autoSubmit?: boolean;
  /** 자동 제출 지연 (ms) */
  autoSubmitDelay?: number;
  /** 폼 기본값 */
  defaultValues?: FieldValues;
}

/**
 * SearchProvider Props
 */
export interface SearchProviderProps {
  /** 검색 설정 */
  config: SearchConfig;
  /** 자식 컴포넌트 */
  children: ReactNode;
  /** 초기값 (URL, localStorage 등에서 복원) */
  initialValues?: FieldValues;
}

/**
 * Field 컴포넌트 Props
 */
export interface FieldComponentProps {
  /** 필드 이름 */
  name: string;
  /** 커스텀 컴포넌트 */
  component?: ComponentType<FieldProps>;
  /** render prop */
  render?: (field: FieldAPI) => ReactNode;
  /** 자식 함수 (render prop) */
  children?: (field: FieldAPI) => ReactNode;
  /** 추가 props */
  [key: string]: any;
}

/**
 * 검색 폼 API (useSearchForm 훅이 반환)
 */
export interface SearchFormAPI {
  /** 폼 제출 */
  submit: () => Promise<void>;
  /** 폼 리셋 */
  reset: () => void;
  /** 전체 값 가져오기 */
  getValues: () => FieldValues;
  /** 전체 값 설정 */
  setValues: (values: FieldValues) => void;
  /** 특정 필드 값 가져오기 */
  getValue: (name: string) => any;
  /** 특정 필드 값 설정 */
  setValue: (name: string, value: any) => void;
  /** 유효성 검사 */
  validate: () => Promise<boolean>;
  /** 폼 상태 */
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isValid: boolean;
  /** 에러 목록 */
  errors: Record<string, string>;
}

/**
 * react-hook-form 내부 API 타입
 * 사용자에게는 노출되지 않고 내부적으로만 사용
 */
export interface InternalAPI {
  /** react-hook-form 인스턴스 */
  rhfForm: UseFormReturn<FieldValues>;
  /** react-hook-form control 객체 */
  control: Control<FieldValues>;
  /** react-hook-form register 함수 */
  register: UseFormRegister<FieldValues>;
}

/**
 * 검색 컨텍스트 타입
 * Provider가 제공하는 전체 컨텍스트
 */
export interface SearchContextValue {
  /** 설정 */
  config: SearchConfig;
  /** 폼 API */
  form: SearchFormAPI;
  /** 필드 메타 가져오기 */
  getFieldMeta: (name: string) => FieldMeta | undefined;
  /** 내부 API (사용자에게 노출 안함) */
  _internal: InternalAPI;
}