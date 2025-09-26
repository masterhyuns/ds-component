/**
 * 통합 타입 정의 파일
 * 모든 타입을 중앙에서 관리
 * 중복 제거 및 타입 별칭을 통한 하위 호환성 유지
 */

import React, { ReactNode, ComponentType } from 'react';
import { Control, UseFormReturn, UseFormRegister } from 'react-hook-form';

// ========================================
// 기본 타입 정의
// ========================================

/**
 * 필드 값 타입 (제네릭)
 * 모든 폼 데이터의 기본 타입
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
  | 'textarea'       // 텍스트 영역
  | 'hidden'         // 숨김 필드 (폼 데이터에는 포함되지만 UI에 표시되지 않음)
  | 'custom';        // 사용자 정의

/**
 * 선택 옵션 타입
 * select, radio, checkbox 등에서 사용
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

// ========================================
// 유효성 검사 관련
// ========================================

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
  validate?: (value: any, values?: FieldValues) => boolean | string | Promise<boolean | string>;
}

// ========================================
// 통합 필드 메타 정의
// ========================================

/**
 * 통합된 필드 메타 정의
 * 모든 필드 설정을 포함하는 단일 인터페이스
 */
export interface FieldMeta {
  /** 필드 고유 ID */
  id: string;
  /** 필드 이름 (폼 데이터의 키) - string으로 통합 (더 유연함) */
  name: string;
  /** 필드 타입 */
  type: SearchFieldType;
  /** 표시 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 기본값 */
  defaultValue?: any;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 */
  readonly?: boolean;
  /** 유효성 검사 규칙 */
  validation?: ValidationRules | Record<string, any>;
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
  /** 커스텀 렌더 함수 */
  customRender?: (props: FieldRenderProps) => ReactNode;
  /** 추가 설정 */
  config?: Record<string, any>;
  /** 기타 확장 속성 */
  [key: string]: any;
}


// ========================================
// 통합 검색 설정
// ========================================

/**
 * 통합된 검색 설정
 * 모든 검색 폼 설정을 포함하는 단일 인터페이스
 * @template T - 폼 데이터 타입 (선택적)
 */
export interface SearchConfig<T = any> {
  /** 폼 ID */
  id: string;
  /** 폼 이름 */
  name?: string;
  /** 필드 메타 정의 배열 */
  fields: FieldMeta[];
  /** 레이아웃 설정 */
  layout?: {
    /** 그리드 컬럼 수 */
    columns?: number;
    /** 간격 */
    gap?: string | number;
    /** 방향 */
    direction?: 'horizontal' | 'vertical';
  };
  /** 자동 제출 */
  autoSubmit?: boolean;
  /** 자동 제출 지연 (ms) */
  autoSubmitDelay?: number;
  /** 폼 기본값 */
  defaultValues?: T;
  /** 제출 버튼 텍스트 (선택적) */
  submitText?: string;
  /** 리셋 버튼 텍스트 (선택적) */
  resetText?: string;
  /** 버튼 표시 여부 (선택적) */
  showButtons?: boolean;
}


// ========================================
// 필드 Props 매핑 관련
// ========================================

/**
 * 단일 필드 컴포넌트의 props 매핑 정의
 * 표준 props 이름 → 실제 컴포넌트 props 이름 매핑
 */
export interface FieldPropsMapping {
  /** 값 속성 매핑 (예: value → checked, value → selected) - 표준과 동일하면 생략 가능 */
  value?: string;
  /** 변경 핸들러 매핑 (예: onChange → onCheckedChange, onChange → onSelect) */
  onChange: string;
  /** 블러 핸들러 매핑 (예: onBlur → onBlur) */
  onBlur?: string;
  /** 추가 props 매핑 (컴포넌트별 특수 props) */
  [key: string]: string | undefined;
}

/**
 * 모든 필드 타입별 props 매핑 설정
 * 각 필드 타입에 대해 어떻게 props를 매핑할지 정의
 */
export type FieldPropsMappingConfig = Partial<Record<SearchFieldType, FieldPropsMapping>>;

// ========================================
// 통합 필드 렌더링 Props
// ========================================

/**
 * 통합된 필드 렌더링 Props
 * 모든 필드 컴포넌트가 받는 표준 Props
 */
export interface FieldRenderProps {
  /** 현재 값 */
  value: any;
  /** 값 변경 핸들러 */
  onChange: (value: any) => void;
  /** 블러 핸들러 */
  onBlur?: () => void;
  /** 에러 메시지 */
  error?: string;
  /** 필드 메타 정보 */
  meta?: FieldMeta;
  /** 더티 상태 */
  isDirty?: boolean;
  /** 터치 상태 */
  isTouched?: boolean;
  /** 검증 중 상태 */
  isValidating?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** SearchBox용 추가 속성 - 필드 메타 */
  field?: FieldMeta;
  /** SearchBox용 추가 속성 - 폼 인스턴스 */
  form?: UseFormReturn;
}

/**
 * 레거시 호환용 타입 별칭
 * FieldProps를 사용하는 기존 코드와의 호환성 유지
 */
export type FieldProps = FieldRenderProps;


// ========================================
// 컴포넌트 Props
// ========================================

/**
 * 검색 이벤트 핸들러 옵션 (SearchBox, SearchProvider 공통)
 */
export interface SearchEventHandlers<TFieldValues extends FieldValues = FieldValues> {
  /** 제출 핸들러 */
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  /** 리셋 핸들러 */
  onReset?: () => void;
  /** 값 변경 핸들러 */
  onChange?: (name: string, value: any, values: TFieldValues) => void;
}

/**
 * SearchProvider Props
 * 새로운 API의 Provider 컴포넌트 Props
 */
export interface SearchProviderProps<TFieldValues extends FieldValues = FieldValues> extends SearchEventHandlers<TFieldValues> {
  /** 검색 설정 */
  config: SearchConfig<TFieldValues>;
  /** 자식 컴포넌트 */
  children: ReactNode;
  /** 초기값 (URL, localStorage 등에서 복원) */
  initialValues?: TFieldValues;
}

/**
 * Field 컴포넌트 Props
 * 새로운 API의 Field 컴포넌트 Props
 */
export interface FieldComponentProps {
  /** 필드 이름 */
  name: string;
  /** 커스텀 컴포넌트 */
  component?: ComponentType<FieldRenderProps>;
  /** render prop */
  render?: (field: FieldAPI) => ReactNode;
  /** 자식 함수 (render prop) */
  children?: ReactNode | ((field: FieldAPI) => ReactNode);
  /** 추가 props */
  [key: string]: any;
}

/**
 * 레거시 SearchBox Props
 * 기존 SearchBox 컴포넌트와의 호환성 유지
 */
export interface SearchBoxProps<TFieldValues extends FieldValues = FieldValues> extends SearchEventHandlers<TFieldValues> {
  /** 검색 폼 설정 */
  config: SearchConfig<TFieldValues>;
  /** 커스텀 필드 컴포넌트 매핑 */
  customComponents?: Record<string, ComponentType<FieldRenderProps>>;
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

// ========================================
// API 인터페이스
// ========================================

/**
 * 필드 API (useField 훅이 반환)
 * 필드 조작을 위한 모든 메서드와 상태
 */
export interface FieldAPI {
  /** 현재 값 */
  value: any;
  /** 값 설정 */
  setValue: (value: any) => void;
  /** onChange 핸들러 (DOM 이벤트 지원) */
  onChange: (e: any) => void;
  /** onBlur 핸들러 */
  onBlur: () => void;
  /** 에러 메시지 */
  error?: string;
  /** 더티 상태 */
  isDirty: boolean;
  /** 터치 상태 */
  isTouched: boolean;
  /** 검증 중 상태 */
  isValidating: boolean;
  /** 필드 메타 정보 */
  meta?: FieldMeta;
  /** 필드 리셋 */
  reset: () => void;
  /** 수동 검증 */
  validate: () => Promise<boolean>;
}

/**
 * 배열 필드 API (useArrayField 훅이 반환)
 * 동적 배열 필드 조작을 위한 API
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
 * 검색 폼 API (useSearchForm 훅이 반환)
 * 폼 전체를 제어하는 API
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

// ========================================
// 컨텍스트 타입
// ========================================

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

// ========================================
// 기타 타입
// ========================================

/**
 * 검색 결과 타입
 * API 응답으로 받는 검색 결과 구조
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
 * 버튼 정렬 타입
 * 검색 폼 버튼의 정렬 방식
 */
export type ButtonAlignment = 'left' | 'center' | 'right';

// ========================================
// Grid 레이아웃 관련 타입
// ========================================

/**
 * 반응형 브레이크포인트 타입
 * CSS 미디어 쿼리 기준점 정의
 */
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 반응형 값 타입
 * 브레이크포인트별로 다른 값을 설정할 수 있는 타입
 */
export type ResponsiveValue<T> = T | Partial<Record<BreakpointKey, T>>;

/**
 * 그리드 컨테이너 정렬 방식
 * CSS align-items, justify-content 속성 값
 */
export type GridAlignment = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type GridJustification = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * 간격 크기 타입
 * 미리 정의된 간격 또는 커스텀 값 사용 가능
 */
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

/**
 * Grid 컨테이너 Props
 * 2차원 레이아웃의 최상위 컨테이너 설정
 */
export interface GridProps {
  /** 자식 컴포넌트들 */
  children: ReactNode;
  /** 컨테이너 HTML 태그 (기본: div) */
  as?: keyof React.JSX.IntrinsicElements;
  /** 총 컬럼 수 (반응형 지원) */
  columns?: ResponsiveValue<number>;
  /** 행과 열 간격 (반응형 지원) */
  gap?: ResponsiveValue<SpacingSize>;
  /** 행 간격만 설정 (gap보다 우선순위 높음) */
  rowGap?: ResponsiveValue<SpacingSize>;
  /** 열 간격만 설정 (gap보다 우선순위 높음) */
  columnGap?: ResponsiveValue<SpacingSize>;
  /** 수직 정렬 방식 */
  alignItems?: ResponsiveValue<GridAlignment>;
  /** 수평 정렬 방식 */
  justifyContent?: ResponsiveValue<GridJustification>;
  /** 아이템들의 최소 높이 통일 */
  equalHeight?: boolean;
  /** 컨테이너 최대 너비 */
  maxWidth?: string | number;
  /** 컨테이너 패딩 */
  padding?: ResponsiveValue<SpacingSize>;
  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 자동 크기 조정 (콘텐츠에 맞춰 컬럼 수 자동 결정) */
  autoFit?: ResponsiveValue<boolean>;
  /** 최소 컬럼 너비 (autoFit 사용 시) */
  minColumnWidth?: ResponsiveValue<string | number>;
  /** 최대 컬럼 너비 (autoFit 사용 시) */
  maxColumnWidth?: ResponsiveValue<string | number>;
}

/**
 * Grid 아이템 Props
 * 개별 그리드 아이템의 배치 및 크기 설정
 */
export interface GridItemProps {
  /** 자식 컴포넌트들 */
  children: ReactNode;
  /** 컨테이너 HTML 태그 (기본: div) */
  as?: keyof React.JSX.IntrinsicElements;
  /** 차지할 컬럼 수 (반응형 지원) */
  colSpan?: ResponsiveValue<number>;
  /** 차지할 행 수 (반응형 지원) */
  rowSpan?: ResponsiveValue<number>;
  /** 컬럼 시작 위치 (반응형 지원) */
  colStart?: ResponsiveValue<number>;
  /** 컬럼 끝 위치 (반응형 지원) */
  colEnd?: ResponsiveValue<number>;
  /** 행 시작 위치 (반응형 지원) */
  rowStart?: ResponsiveValue<number>;
  /** 행 끝 위치 (반응형 지원) */
  rowEnd?: ResponsiveValue<number>;
  /** 아이템별 정렬 방식 */
  alignSelf?: ResponsiveValue<GridAlignment>;
  /** 아이템별 수평 정렬 */
  justifySelf?: ResponsiveValue<GridAlignment>;
  /** 렌더링 순서 (CSS order) */
  order?: ResponsiveValue<number>;
  /** 아이템 패딩 */
  padding?: ResponsiveValue<SpacingSize>;
  /** 아이템 마진 */
  margin?: ResponsiveValue<SpacingSize>;
  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 숨김 조건 (반응형 지원) */
  hidden?: ResponsiveValue<boolean>;
  /** 최소 높이 */
  minHeight?: ResponsiveValue<string | number>;
  /** 최대 높이 */
  maxHeight?: ResponsiveValue<string | number>;
}

/**
 * 브레이크포인트 설정 타입
 * 반응형 디자인을 위한 화면 크기별 설정
 */
export interface BreakpointConfig {
  /** 브레이크포인트 이름 */
  name: BreakpointKey;
  /** 최소 너비 (px) */
  minWidth: number;
  /** 최대 너비 (px, 선택적) */
  maxWidth?: number;
  /** 기본 컬럼 수 */
  defaultColumns?: number;
  /** 기본 간격 */
  defaultGap?: SpacingSize;
}

/**
 * Grid 테마 설정 타입
 * 전체 Grid 시스템의 스타일 테마
 */
export interface GridThemeConfig {
  /** 브레이크포인트 설정 */
  breakpoints: Record<BreakpointKey, BreakpointConfig>;
  /** 간격 스케일 정의 */
  spacing: Record<string, string>;
  /** 기본 컬럼 수 */
  defaultColumns: number;
  /** 기본 간격 */
  defaultGap: SpacingSize;
  /** 최대 컨테이너 너비 */
  maxContainerWidth?: string;
}

// ========================================
// 탭 메모리 관리 시스템 타입 정의
// ========================================

/**
 * 탭별 메모리 정보
 * 메모리 사용량 모니터링과 성능 추적을 위한 탭 정보
 */
export interface TabMemoryInfo {
  /** 탭 고유 ID */
  id: string;
  /** 탭에서 로드한 URL */
  url: string;
  /** 메모리 사용량 (MB 단위) */
  memoryUsage: number;
  /** 마지막 접근 시간 */
  lastAccessed: Date;
  /** 현재 활성 상태 여부 */
  isActive: boolean;
  /** 성능 점수 (0-100점, 메모리 사용량과 로딩 시간 기반) */
  performanceScore: number;
}

/**
 * 메모리 관리 설정
 * 탭 메모리 사용량 제한 및 최적화 설정
 */
export interface MemoryConfig {
  /** 최대 허용 탭 개수 */
  maxTabs: number;
  /** 메모리 사용량 임계값 (MB) - 이 값을 초과하면 새 탭 생성 제한 */
  memoryThreshold: number;
  /** 경고 임계값 (MB) - 이 값을 초과하면 경고 표시 */
  warningThreshold: number;
  /** 메모리 체크 간격 (밀리초) */
  checkInterval: number;
  /** 자동 정리 활성화 여부 */
  autoCleanup: boolean;
}

/**
 * 탭 정보
 * UI에서 표시되는 탭의 기본 정보
 */
export interface TabInfo {
  /** 탭 고유 ID */
  id: string;
  /** 탭 제목 */
  title: string;
  /** 탭 URL */
  url: string;
  /** 활성 상태 여부 */
  isActive: boolean;
  /** 탭 생성 시간 */
  created: Date;
  /** 파비콘 URL (선택사항) */
  favicon?: string;
  /** 로딩 상태 */
  loadingState?: TabLoadingState;
}

/**
 * 탭 로딩 상태
 * 탭 내 iframe의 현재 로딩 상태
 */
export enum TabLoadingState {
  /** 초기 상태 */
  IDLE = 'idle',
  /** 로딩 중 */
  LOADING = 'loading',
  /** 로딩 완료 */
  LOADED = 'loaded',
  /** 로딩 실패 */
  ERROR = 'error'
}

/**
 * 메모리 통계 정보
 * 전체 탭 시스템의 메모리 사용 현황 통계
 */
export interface MemoryStats {
  /** 활성 탭 개수 */
  activeTabsCount: number;
  /** 전체 탭 개수 */
  totalTabsCount: number;
  /** 탭당 평균 메모리 사용량 (MB) */
  averageMemoryPerTab: number;
  /** 최저 성능 점수 */
  lowestPerformanceScore: number;
  /** 최고 성능 점수 */
  highestPerformanceScore: number;
  /** 총 메모리 사용량 (MB) */
  totalMemoryUsage: number;
}

/**
 * 탭 정리 결과
 * 자동/수동 탭 정리 작업의 실행 결과
 */
export interface CleanupResult {
  /** 정리된 탭 ID 목록 */
  cleanedTabIds: string[];
  /** 절약된 메모리 양 (MB) */
  memorySaved: number;
  /** 정리 성공 여부 */
  success: boolean;
  /** 오류 메시지 (실패 시) */
  error?: string;
}

/**
 * 새 탭 생성 가능 여부 결과
 * 메모리 및 탭 개수 제한 검사 결과
 */
export interface CanAddTabResult {
  /** 생성 가능 여부 */
  allowed: boolean;
  /** 생성 불가 시 이유 */
  reason?: string;
  /** 권장 조치사항 */
  suggestion?: string;
}

/**
 * iframe 성능 메트릭
 * 개별 iframe의 상세한 성능 및 리소스 사용량 정보
 */
export interface IframePerformanceMetrics {
  /** 탭 ID */
  tabId: string;
  /** 로딩 시작 시간 (timestamp) */
  loadStartTime: number;
  /** 로딩 완료 시간 (timestamp) */
  loadEndTime: number;
  /** 총 로딩 시간 (밀리초) */
  loadDuration: number;
  /** DOM 노드 수 */
  domNodeCount: number;
  /** 이미지 개수 */
  imageCount: number;
  /** 스크립트 개수 */
  scriptCount: number;
  /** 추정 메모리 사용량 (MB) */
  estimatedMemoryUsage: number;
  /** 리소스 로딩 시간들 */
  resourceLoadTimes: ResourceLoadTime[];
}

/**
 * 리소스 로딩 시간 정보
 * 개별 리소스 (이미지, CSS, JS 등)의 로딩 성능 데이터
 */
export interface ResourceLoadTime {
  /** 리소스 URL */
  url: string;
  /** 리소스 타입 (image, script, stylesheet 등) */
  type: string;
  /** 로딩 시간 (밀리초) */
  duration: number;
  /** 리소스 크기 (bytes) */
  size: number;
}

/**
 * 탭 이벤트 타입
 * 탭 생명주기 및 메모리 관련 이벤트 종류
 */
export enum TabEventType {
  /** 탭 생성 */
  CREATE = 'create',
  /** 탭 활성화 */
  ACTIVATE = 'activate',
  /** 탭 비활성화 */
  DEACTIVATE = 'deactivate',
  /** 탭 닫기 */
  CLOSE = 'close',
  /** 메모리 경고 */
  MEMORY_WARNING = 'memory_warning',
  /** 자동 정리 실행 */
  AUTO_CLEANUP = 'auto_cleanup'
}

/**
 * 탭 이벤트 데이터
 * 탭 관련 이벤트의 상세 정보
 */
export interface TabEvent {
  /** 이벤트 타입 */
  type: TabEventType;
  /** 탭 ID */
  tabId: string;
  /** 이벤트 발생 시간 */
  timestamp: Date;
  /** 추가 데이터 */
  data?: {
    /** 메모리 사용량 (MB) */
    memoryUsage?: number;
    /** 성능 점수 */
    performanceScore?: number;
    /** 오류 메시지 */
    error?: string;
    /** 정리된 탭 목록 (자동 정리 시) */
    cleanedTabs?: string[];
  };
}

/**
 * 메모리 최적화 권장사항
 * 시스템이 사용자에게 제안하는 메모리 절약 방안
 */
export interface OptimizationSuggestion {
  /** 권장사항 ID */
  id: string;
  /** 권장사항 타입 */
  type: 'cleanup_tabs' | 'reduce_memory' | 'optimize_performance';
  /** 제목 */
  title: string;
  /** 설명 */
  description: string;
  /** 우선순위 (1-5, 5가 가장 높음) */
  priority: number;
  /** 예상 효과 */
  expectedImpact: {
    /** 절약 가능한 메모리 (MB) */
    memorySaving: number;
    /** 성능 개선 정도 (1-5) */
    performanceImprovement: number;
  };
  /** 대상 탭 ID 목록 */
  targetTabIds: string[];
  /** 실행 가능한 액션 */
  action?: () => Promise<CleanupResult>;
}

/**
 * 대시보드 설정
 * 메모리 모니터링 대시보드의 표시 및 동작 설정
 */
export interface DashboardConfig {
  /** 대시보드 표시 여부 */
  enabled: boolean;
  /** 자동 새로고침 간격 (밀리초) */
  refreshInterval: number;
  /** 차트에 표시할 최대 탭 수 */
  maxDisplayTabs: number;
  /** 성능 기록 보관 기간 (밀리초) */
  historyRetentionPeriod: number;
}

/**
 * 브라우저 호환성 정보
 * 메모리 모니터링에 필요한 브라우저 API 지원 여부
 */
export interface BrowserCompatibility {
  /** Performance Observer 지원 여부 */
  supportsPerformanceObserver: boolean;
  /** Memory API 지원 여부 */
  supportsMemoryAPI: boolean;
  /** Intersection Observer 지원 여부 */
  supportsIntersectionObserver: boolean;
  /** Web Workers 지원 여부 */
  supportsWebWorkers: boolean;
}

/**
 * 에러 타입
 * 탭 메모리 관리 시스템에서 발생할 수 있는 오류 종류
 */
export enum ErrorType {
  /** 메모리 부족 */
  OUT_OF_MEMORY = 'out_of_memory',
  /** 탭 개수 초과 */
  TOO_MANY_TABS = 'too_many_tabs',
  /** iframe 로딩 실패 */
  IFRAME_LOAD_ERROR = 'iframe_load_error',
  /** 네트워크 오류 */
  NETWORK_ERROR = 'network_error',
  /** 브라우저 호환성 오류 */
  COMPATIBILITY_ERROR = 'compatibility_error'
}

/**
 * 시스템 에러
 * 탭 메모리 관리 시스템의 상세한 오류 정보
 */
export interface SystemError {
  /** 에러 타입 */
  type: ErrorType;
  /** 에러 메시지 */
  message: string;
  /** 에러 코드 */
  code: string;
  /** 발생 시간 */
  timestamp: Date;
  /** 관련 탭 ID */
  tabId?: string;
  /** 추가 컨텍스트 정보 */
  context?: Record<string, any>;
  /** 복구 가능 여부 */
  recoverable: boolean;
  /** 권장 조치사항 */
  suggestedAction?: string;
}