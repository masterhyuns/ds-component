/**
 * withFieldProps HOC 유틸리티 함수들
 * 
 * Props 매핑과 관련된 헬퍼 함수들을 제공하여
 * HOC의 핵심 로직을 지원하고 확장성을 제공
 * 
 * @description
 * 주요 기능:
 * - Props 매핑 변환 로직
 * - 런타임 매핑 등록/수정
 * - 디버깅 및 검증 유틸리티
 * 
 * @author Enterprise Platform Technical Lead
 * @since 2025-09-17
 */

import { FieldRenderProps, FieldPropsMapping, SearchFieldType } from '../../types';
import { FIELD_PROPS_MAPPING } from './mapping';

/**
 * 표준 FieldRenderProps를 컴포넌트별 props로 변환하는 핵심 함수
 * 
 * @description
 * HOC의 핵심 로직으로, 매핑 설정에 따라 props 이름을 자동 변환
 * 성능 최적화를 위해 불필요한 객체 생성을 최소화
 * 
 * @param standardProps - 표준 FieldRenderProps 인터페이스 props
 * @param mapping - 필드 타입별 매핑 설정
 * @returns 변환된 컴포넌트 props 객체
 * 
 * @example
 * ```typescript
 * const standardProps = { value: true, onChange: fn, onBlur: fn };
 * const checkboxMapping = { value: 'checked', onChange: 'onCheckedChange', onBlur: 'onBlur' };
 * const result = mapStandardPropsToComponent(standardProps, checkboxMapping);
 * // 결과: { checked: true, onCheckedChange: fn, onBlur: fn }
 * ```
 * 
 * @performance
 * - O(n) 복잡도 (매핑 항목 수에 비례)
 * - 메모리 효율적 (필요한 props만 복사)
 * - 불변성 보장 (원본 props 수정 안함)
 */
export const mapStandardPropsToComponent = (
  standardProps: FieldRenderProps, 
  mapping: FieldPropsMapping
): Record<string, any> => {
  // 성능 최적화: 빈 매핑인 경우 빠른 반환
  if (!mapping || Object.keys(mapping).length === 0) {
    return {};
  }

  const mappedProps: Record<string, any> = {};
  
  // 핵심 props 매핑 (value, onChange, onBlur)
  // value 매핑: 매핑이 정의되어 있으면 사용, 없으면 표준 'value' 그대로 사용
  if (mapping.value) {
    // 커스텀 매핑된 value prop 사용 (예: checked, selected 등)
    if (standardProps.value !== undefined) {
      mappedProps[mapping.value] = standardProps.value;
    }
  } else {
    // 매핑이 없으면 표준 'value' 그대로 사용
    if (standardProps.value !== undefined) {
      mappedProps['value'] = standardProps.value;
    }
  }
  
  if (mapping.onChange && standardProps.onChange) {
    mappedProps[mapping.onChange] = standardProps.onChange;
  }
  
  if (mapping.onBlur && standardProps.onBlur) {
    mappedProps[mapping.onBlur] = standardProps.onBlur;
  }
  
  // 추가 매핑 처리 (확장 가능한 props들)
  // value, onChange, onBlur 외의 다른 매핑들을 동적으로 처리
  Object.entries(mapping).forEach(([standardPropName, componentPropName]) => {
    // 이미 처리된 핵심 props는 스킵
    if (['value', 'onChange', 'onBlur'].includes(standardPropName)) {
      return;
    }
    
    // 컴포넌트 prop 이름이 정의되어 있고, 해당 값이 존재하는 경우만 매핑
    if (componentPropName && (standardProps as any)[standardPropName] !== undefined) {
      mappedProps[componentPropName] = (standardProps as any)[standardPropName];
    }
  });
  
  return mappedProps;
};

/**
 * 매핑되지 않은 나머지 props를 필터링하는 함수
 * 
 * @description
 * 표준 props (value, onChange, onBlur)를 제외한 나머지 props를 반환
 * 이는 컴포넌트에 추가로 전달되어야 하는 props들 (meta, error, disabled 등)
 * 
 * @param props - 원본 FieldRenderProps
 * @returns 매핑되지 않은 나머지 props
 * 
 * @example
 * ```typescript
 * const props = { value: 'test', onChange: fn, meta: {...}, error: 'Required' };
 * const restProps = extractUnmappedProps(props);
 * // 결과: { meta: {...}, error: 'Required', isDirty: true, ... }
 * ```
 */
export const extractUnmappedProps = (props: FieldRenderProps): Omit<FieldRenderProps, 'value' | 'onChange' | 'onBlur'> => {
  const { value, onChange, onBlur, ...restProps } = props;
  return restProps;
};

/**
 * 런타임에 새로운 필드 타입의 매핑을 등록하는 함수
 * 
 * @description
 * 동적으로 새로운 필드 타입을 추가할 때 사용
 * 플러그인이나 확장 모듈에서 새로운 필드를 등록할 때 유용
 * 
 * @param fieldType - 등록할 필드 타입 (기존 타입 덮어쓰기 가능)
 * @param mapping - Props 매핑 설정
 * 
 * @example
 * ```typescript
 * // 새로운 커스텀 슬라이더 필드 등록
 * registerFieldMapping('customSlider', {
 *   value: 'sliderValue',
 *   onChange: 'onSliderChange',
 *   onBlur: 'onBlur',
 *   min: 'minValue',
 *   max: 'maxValue'
 * });
 * ```
 * 
 * @warning
 * 이 함수는 런타임에 전역 매핑 객체를 수정하므로 신중히 사용
 * 가능하면 초기화 시점에만 사용하고, 컴포넌트 렌더링 중에는 사용 금지
 */
export const registerFieldMapping = (fieldType: string, mapping: FieldPropsMapping): void => {
  // 타입 안전성을 위한 유효성 검사
  if (!fieldType || typeof fieldType !== 'string') {
    console.warn('[withFieldProps] Invalid fieldType provided to registerFieldMapping');
    return;
  }
  
  if (!mapping || typeof mapping !== 'object') {
    console.warn('[withFieldProps] Invalid mapping provided to registerFieldMapping');
    return;
  }
  
  // 필수 매핑 속성 검증
  if (!mapping.value || !mapping.onChange) {
    console.warn('[withFieldProps] Missing required mapping properties (value, onChange)');
    return;
  }
  
  // 기존 매핑 덮어쓰기 경고
  if ((FIELD_PROPS_MAPPING as any)[fieldType]) {
    console.warn(`[withFieldProps] Overwriting existing mapping for field type: ${fieldType}`);
  }
  
  // 매핑 등록
  (FIELD_PROPS_MAPPING as any)[fieldType] = mapping;
  
  // 디버깅용 로그
  console.log(`[withFieldProps] Registered mapping for field type '${fieldType}':`, mapping);
};

/**
 * 특정 필드 타입의 매핑 설정을 조회하는 함수
 * 
 * @description
 * 디버깅이나 런타임 검사 시 사용
 * HOC 내부에서도 매핑을 가져올 때 사용
 * 
 * @param fieldType - 조회할 필드 타입
 * @returns 해당 타입의 매핑 설정 또는 undefined
 * 
 * @example
 * ```typescript
 * const checkboxMapping = getFieldMapping('checkbox');
 * if (checkboxMapping) {
 *   console.log('Value prop:', checkboxMapping.value); // 'checked'
 *   console.log('Change handler:', checkboxMapping.onChange); // 'onCheckedChange'
 * }
 * ```
 */
export const getFieldMapping = (fieldType: SearchFieldType): FieldPropsMapping | undefined => {
  return FIELD_PROPS_MAPPING[fieldType];
};