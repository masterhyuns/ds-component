/**
 * 필드 컴포넌트 Props 매핑 고차 컴포넌트
 * 
 * 각 필드 타입별로 다른 props 이름을 가진 컴포넌트들을
 * 표준화된 FieldRenderProps 인터페이스로 래핑하는 HOC
 * 
 * 주요 기능:
 * 1. 표준 props (value, onChange, onBlur) → 컴포넌트별 props 자동 매핑
 * 2. 타입 안전성 보장
 * 3. 성능 최적화 (React.memo 적용)
 * 4. 디버깅 지원 (displayName 설정)
 */

import { ComponentType, memo } from 'react';
import { FieldRenderProps, FieldPropsMapping, SearchFieldType } from '../types';

/**
 * 필드 타입별 Props 매핑 설정
 * 각 필드 타입에서 사용하는 실제 props 이름을 정의
 */
export const FIELD_PROPS_MAPPING: Record<SearchFieldType, FieldPropsMapping> = {
  // 기본 텍스트 입력
  text: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 드롭다운 선택
  select: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 다중 선택
  multiselect: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  // 날짜 선택
  date: {
    value: 'selected',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 날짜 범위
  daterange: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 숫자 입력
  number: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  // 숫자 범위
  numberrange: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  // 체크박스
  checkbox: {
    value: 'checked',
    onChange: 'onCheckedChange',
    onBlur: 'onBlur'
  },
  
  // 라디오 버튼
  radio: {
    value: 'value',
    onChange: 'onValueChange',
    onBlur: 'onBlur'
  },
  
  // 자동완성
  autocomplete: {
    value: 'value',
    onChange: 'onInputChange',
    onBlur: 'onBlur'
  },
  
  // 파일 업로드
  file: {
    value: 'files',
    onChange: 'onFilesChange',
    onBlur: 'onBlur'
  },
  
  // 태그 입력
  tags: {
    value: 'tags',
    onChange: 'onTagsChange',
    onBlur: 'onBlur'
  },
  
  // 텍스트 영역
  textarea: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 숨김 필드
  hidden: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  },
  
  // 사용자 정의
  custom: {
    value: 'value',
    onChange: 'onChange',
    onBlur: 'onBlur'
  }
};

/**
 * Props 매핑을 수행하는 유틸리티 함수
 * 표준 props를 컴포넌트별 props로 변환
 */
function mapProps(
  standardProps: FieldRenderProps, 
  mapping: FieldPropsMapping
): Record<string, any> {
  const mappedProps: Record<string, any> = {};
  
  // 표준 props를 매핑에 따라 변환
  if (mapping.value && standardProps.value !== undefined) {
    mappedProps[mapping.value] = standardProps.value;
  }
  
  if (mapping.onChange && standardProps.onChange) {
    mappedProps[mapping.onChange] = standardProps.onChange;
  }
  
  if (mapping.onBlur && standardProps.onBlur) {
    mappedProps[mapping.onBlur] = standardProps.onBlur;
  }
  
  // 추가 매핑 처리 (value, onChange, onBlur 외의 다른 props)
  Object.entries(mapping).forEach(([standardProp, componentProp]) => {
    if (!['value', 'onChange', 'onBlur'].includes(standardProp) && componentProp) {
      const propValue = (standardProps as any)[standardProp];
      if (propValue !== undefined) {
        mappedProps[componentProp] = propValue;
      }
    }
  });
  
  return mappedProps;
}

/**
 * 필드 컴포넌트를 표준 인터페이스로 래핑하는 고차 컴포넌트
 * 
 * @param Component - 래핑할 원본 컴포넌트
 * @param fieldType - 필드 타입 (매핑 설정 조회용)
 * @returns 표준화된 인터페이스를 가진 래핑된 컴포넌트
 * 
 * @example
 * // 체크박스 컴포넌트 래핑
 * const CheckboxField = ({ checked, onCheckedChange }) => ...;
 * const WrappedCheckbox = withFieldProps(CheckboxField, 'checkbox');
 * 
 * // 사용 시 표준 props로 전달
 * <WrappedCheckbox value={true} onChange={handleChange} />
 * // 내부적으로 <CheckboxField checked={true} onCheckedChange={handleChange} />로 변환
 */
export function withFieldProps<P extends Record<string, any>>(
  Component: ComponentType<P>,
  fieldType: SearchFieldType
): ComponentType<FieldRenderProps> {
  
  const FieldWrapper = memo((props: FieldRenderProps) => {
    const mapping = FIELD_PROPS_MAPPING[fieldType];
    
    if (!mapping) {
      console.warn(`No props mapping found for field type: ${fieldType}`);
      // 매핑이 없으면 원본 props 그대로 전달
      return <Component {...(props as any)} />;
    }
    
    // props 매핑 수행
    const mappedProps = mapProps(props, mapping);
    
    // 매핑되지 않은 나머지 props도 함께 전달
    const { value, onChange, onBlur, ...restProps } = props;
    
    return <Component {...mappedProps} {...(restProps as any)} />;
  });
  
  // 디버깅을 위한 displayName 설정
  FieldWrapper.displayName = `withFieldProps(${Component.displayName || Component.name || 'Component'}, ${fieldType})`;
  
  return FieldWrapper;
}

/**
 * 필드 타입에 대한 매핑 설정을 런타임에 추가/수정하는 함수
 * 동적으로 새로운 필드 타입을 등록할 때 사용
 * 
 * @param fieldType - 필드 타입
 * @param mapping - Props 매핑 설정
 * 
 * @example
 * // 새로운 필드 타입 등록
 * registerFieldMapping('custom-slider', {
 *   value: 'sliderValue',
 *   onChange: 'onSliderChange',
 *   onBlur: 'onBlur'
 * });
 */
export function registerFieldMapping(fieldType: string, mapping: FieldPropsMapping): void {
  (FIELD_PROPS_MAPPING as any)[fieldType] = mapping;
}

/**
 * 특정 필드 타입의 매핑 설정을 조회하는 함수
 * 디버깅이나 런타임 검사 시 사용
 * 
 * @param fieldType - 필드 타입
 * @returns 해당 타입의 매핑 설정 또는 undefined
 */
export function getFieldMapping(fieldType: SearchFieldType): FieldPropsMapping | undefined {
  return FIELD_PROPS_MAPPING[fieldType];
}