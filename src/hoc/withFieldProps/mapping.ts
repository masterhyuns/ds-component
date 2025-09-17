/**
 * 필드 타입별 Props 매핑 설정
 * 
 * 각 필드 타입에서 사용하는 실제 props 이름을 정의하여
 * 표준 FieldRenderProps 인터페이스와 실제 컴포넌트 props 사이를 매핑
 * 
 * @description
 * 써드파티 라이브러리나 커스텀 컴포넌트마다 다른 props 이름을 사용하는 문제를 해결
 * 예: Checkbox는 'checked', DatePicker는 'selected', TextField는 'value' 등
 * 
 * @example
 * // 표준 props: { value: true, onChange: fn }
 * // checkbox 매핑 적용: { checked: true, onCheckedChange: fn }
 * 
 * @author Enterprise Platform Technical Lead
 * @since 2025-09-17
 */

import { FieldPropsMapping, SearchFieldType } from '../../types';

/**
 * 필드 타입별 Props 매핑 설정 객체
 * 
 * @description
 * 각 필드 타입에 대해 표준 props 이름을 실제 컴포넌트 props 이름으로 매핑
 * 새로운 필드 타입 추가 시 이 객체에 매핑 설정만 추가하면 됨
 * 
 * @example
 * ```typescript
 * // 새로운 필드 타입 추가
 * FIELD_PROPS_MAPPING.customSlider = {
 *   value: 'sliderValue',
 *   onChange: 'onSliderChange',
 *   onBlur: 'onBlur'
 * };
 * ```
 * 
 * @readonly 런타임에서 읽기 전용으로 사용 권장
 */
export const FIELD_PROPS_MAPPING: Record<SearchFieldType, FieldPropsMapping> = {
  /**
   * 기본 텍스트 입력 필드
   * @description 표준 HTML input[type="text"] 사용
   * @props value, onChange, onBlur (표준)
   */
  text: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 드롭다운 선택 필드
   * @description 표준 HTML select 사용
   * @props value, onChange, onBlur (표준)
   */
  select: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 다중 선택 필드
   * @description 커스텀 다중 선택 컴포넌트 (배열 값 처리)
   * @props value → value, onChange → onValueChange
   * @example MultiSelectField 컴포넌트에서 onValueChange(values: Array<any>) 사용
   */
  multiselect: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 날짜 선택 필드
   * @description react-datepicker 라이브러리 사용
   * @props value → selected, onChange → onChange (Date 객체 처리)
   * @example DatePicker에서 selected={date} onChange={(date) => ...} 사용
   */
  date: {
    value: 'selected',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 날짜 범위 선택 필드
   * @description 커스텀 날짜 범위 컴포넌트 또는 react-datepicker range
   * @props value → value, onChange → onChange (범위 객체 처리)
   * @example { startDate: Date, endDate: Date } 형태 값 처리
   */
  daterange: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 숫자 입력 필드
   * @description 숫자 전용 입력 컴포넌트 (유효성 검사 포함)
   * @props value → value, onChange → onValueChange (number 타입 처리)
   * @example NumberField에서 onValueChange(num: number) 사용
   */
  number: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 숫자 범위 입력 필드
   * @description 최소/최대 숫자 범위 입력 컴포넌트
   * @props value → value, onChange → onValueChange (범위 객체 처리)
   * @example { min: number, max: number } 형태 값 처리
   */
  numberrange: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 체크박스 필드
   * @description 불린 값 토글 컴포넌트
   * @props value → checked, onChange → onCheckedChange (boolean 처리)
   * @example CheckboxField에서 checked={bool} onCheckedChange={(checked) => ...} 사용
   */
  checkbox: {
    value: 'checked',
    onChange: 'onCheckedChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 라디오 버튼 필드
   * @description 단일 선택 라디오 그룹 컴포넌트
   * @props value → value, onChange → onValueChange (선택된 값 처리)
   * @example RadioGroup에서 onValueChange(selectedValue: string) 사용
   */
  radio: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 자동완성 입력 필드
   * @description 검색어 기반 자동완성 기능 포함 입력 컴포넌트
   * @props value → value, onChange → onInputChange (검색어 변경 처리)
   * @example AutocompleteField에서 onInputChange(searchTerm: string) 사용
   */
  autocomplete: {
    value: 'value',
    onChange: 'onInputChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 파일 업로드 필드
   * @description 파일 선택 및 업로드 컴포넌트
   * @props value → files, onChange → onFilesChange (File 배열 처리)
   * @example FileUploadField에서 files={fileList} onFilesChange={(files) => ...} 사용
   */
  file: {
    value: 'files',
    onChange: 'onFilesChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 태그 입력 필드
   * @description 동적 태그 추가/제거 컴포넌트
   * @props value → tags, onChange → onTagsChange (문자열 배열 처리)
   * @example TagsField에서 tags={tagArray} onTagsChange={(tags) => ...} 사용
   */
  tags: {
    value: 'tags',
    onChange: 'onTagsChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 텍스트 영역 필드
   * @description 여러 줄 텍스트 입력 컴포넌트
   * @props value, onChange, onBlur (표준 textarea와 동일)
   * @example TextareaField에서 표준 textarea props 사용
   */
  textarea: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 숨김 필드
   * @description 폼 데이터에만 포함되고 UI에는 표시되지 않는 필드
   * @props value, onChange, onBlur (표준, 하지만 UI 렌더링 안함)
   * @example 폼 전송 시 필요한 메타데이터나 ID 값 저장용
   */
  hidden: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  /**
   * 사용자 정의 필드
   * @description 완전히 커스텀한 컴포넌트 (기본 매핑 제공)
   * @props value, onChange, onBlur (기본값, 실제로는 커스텀 매핑 필요)
   * @example 사용자가 직접 withFieldProps로 매핑하거나 render prop 사용
   */
  custom: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  }
} as const;

/**
 * 필드 타입별 매핑 설정의 타입 안전성을 위한 키 목록
 * @description 컴파일 타임에 모든 SearchFieldType이 매핑되었는지 검증
 * @readonly
 */
export const SUPPORTED_FIELD_TYPES = Object.keys(FIELD_PROPS_MAPPING) as SearchFieldType[];

/**
 * 특정 필드 타입의 매핑 정보를 조회하는 헬퍼 함수
 * 
 * @param fieldType - 조회할 필드 타입
 * @returns 해당 타입의 매핑 설정 또는 undefined
 * 
 * @example
 * ```typescript
 * const checkboxMapping = getFieldTypeMapping('checkbox');
 * console.log(checkboxMapping?.onChange); // 'onCheckedChange'
 * ```
 */
export const getFieldTypeMapping = (fieldType: SearchFieldType): FieldPropsMapping | undefined => {
  return FIELD_PROPS_MAPPING[fieldType];
};

/**
 * 지원되는 모든 필드 타입 목록을 반환하는 함수
 * 
 * @returns 지원되는 필드 타입 배열
 * 
 * @example
 * ```typescript
 * const supportedTypes = getSupportedFieldTypes();
 * console.log(supportedTypes); // ['text', 'select', 'checkbox', ...]
 * ```
 */
export const getSupportedFieldTypes = (): SearchFieldType[] => {
  return SUPPORTED_FIELD_TYPES;
};