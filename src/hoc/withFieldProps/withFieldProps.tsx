/**
 * withFieldProps 고차 컴포넌트 (Higher-Order Component)
 * 
 * 각 필드 타입별로 다른 props 이름을 가진 컴포넌트들을
 * 표준화된 FieldRenderProps 인터페이스로 래핑하는 HOC
 * 
 * @description
 * 주요 해결 문제:
 * - 써드파티 라이브러리마다 다른 props 이름 (onChange vs onCheckedChange vs onValueChange 등)
 * - 30개 이상의 필드 타입에 대한 일관된 인터페이스 제공
 * - 타입 안전성과 성능 최적화
 * 
 * 핵심 기능:
 * - 표준 props → 컴포넌트별 props 자동 매핑
 * - React.memo를 통한 성능 최적화
 * - 개발 환경에서의 디버깅 지원
 * - 타입 안전성 보장
 * 
 * @author Enterprise Platform Technical Lead
 * @since 2025-09-17
 * 
 * @example
 * ```typescript
 * // 체크박스 컴포넌트 (다른 props 이름 사용)
 * const CheckboxComponent = ({ checked, onCheckedChange }) => ...;
 * 
 * // HOC로 래핑
 * const WrappedCheckbox = withFieldProps(CheckboxComponent, 'checkbox');
 * 
 * // 표준 props로 사용
 * <WrappedCheckbox value={true} onChange={handleChange} />
 * // 내부적으로 <CheckboxComponent checked={true} onCheckedChange={handleChange} />로 변환
 * ```
 */

import { ComponentType, memo } from 'react';
import { FieldRenderProps, SearchFieldType } from '../../types';
import { 
  mapStandardPropsToComponent, 
  extractUnmappedProps, 
  getFieldMapping
} from './utils';

/**
 * 필드 컴포넌트를 표준 인터페이스로 래핑하는 고차 컴포넌트
 * 
 * @description
 * 이 HOC는 다음과 같은 변환 과정을 수행합니다:
 * 1. 표준 FieldRenderProps 수신
 * 2. 필드 타입별 매핑 설정 조회
 * 3. props 이름 자동 변환
 * 4. 변환된 props로 원본 컴포넌트 렌더링
 * 
 * @template P - 원본 컴포넌트의 props 타입
 * @param Component - 래핑할 원본 컴포넌트
 * @param fieldType - 필드 타입 (매핑 설정 조회용)
 * @returns 표준화된 인터페이스를 가진 래핑된 컴포넌트
 * 
 * @performance
 * - React.memo로 불필요한 리렌더링 방지
 * - 매핑 캐싱으로 성능 최적화
 * - 개발 환경에서만 디버깅 정보 생성
 * 
 * @example
 * ```typescript
 * // 1. 써드파티 날짜 선택 컴포넌트
 * const DatePickerComponent = ({ selected, onChange, onBlur }) => (
 *   <ReactDatePicker selected={selected} onChange={onChange} onBlur={onBlur} />
 * );
 * 
 * // 2. HOC로 래핑 (date 타입은 selected/onChange 매핑 사용)
 * const WrappedDatePicker = withFieldProps(DatePickerComponent, 'date');
 * 
 * // 3. 표준 props로 사용
 * <WrappedDatePicker 
 *   value={new Date()} 
 *   onChange={(date) => console.log(date)}
 *   error="날짜를 선택하세요"
 *   meta={{ label: "생년월일" }}
 * />
 * ```
 */
export const withFieldProps = <P extends Record<string, any>>(
  Component: ComponentType<P>,
  fieldType: SearchFieldType
): ComponentType<FieldRenderProps> => {
  
  /**
   * 래핑된 필드 컴포넌트
   * 
   * @description
   * React.memo로 래핑하여 props가 변경되지 않으면 리렌더링하지 않음
   * 표준 props를 받아서 매핑 후 원본 컴포넌트에 전달
   */
  const FieldWrapper = memo((props: FieldRenderProps) => {
    // 매핑 설정 조회
    const mapping = getFieldMapping(fieldType);
    
    // 매핑이 없는 경우 경고 및 fallback 처리
    if (!mapping) {
      // 경고 출력
      console.warn(
        `[withFieldProps] No props mapping found for field type: ${fieldType}. ` +
        `Component will receive original props as-is.`
      );
      
      // 매핑이 없으면 원본 props 그대로 전달 (fallback)
      return <Component {...(props as any)} />;
    }
    
    // props 매핑 수행
    const mappedProps = mapStandardPropsToComponent(props, mapping);
    
    // 매핑되지 않은 나머지 props 추출 (meta, error, disabled 등)
    const unmappedProps = extractUnmappedProps(props);
    
    
    // 최종 props 병합 및 컴포넌트 렌더링
    return <Component {...mappedProps} {...(unmappedProps as any)} />;
  });
  
  /**
   * 디버깅을 위한 displayName 설정
   * React DevTools에서 컴포넌트 식별에 사용
   * 
   * @example 'withFieldProps(CheckboxField, checkbox)'
   */
  FieldWrapper.displayName = `withFieldProps(${
    Component.displayName || Component.name || 'Component'
  }, ${fieldType})`;
  
  return FieldWrapper;
};

/**
 * HOC 팩토리 함수 (선택적 사용)
 * 
 * @description
 * 여러 컴포넌트를 같은 필드 타입으로 래핑할 때 사용하는 헬퍼 함수
 * 코드 중복을 줄이고 일관성을 높임
 * 
 * @param fieldType - 필드 타입
 * @returns 해당 필드 타입으로 컴포넌트를 래핑하는 함수
 * 
 * @example
 * ```typescript
 * // 체크박스 타입 래퍼 생성
 * const wrapAsCheckbox = createFieldWrapper('checkbox');
 * 
 * // 여러 체크박스 컴포넌트 래핑
 * const StandardCheckbox = wrapAsCheckbox(BasicCheckbox);
 * const PremiumCheckbox = wrapAsCheckbox(AdvancedCheckbox);
 * const CustomCheckbox = wrapAsCheckbox(MyCustomCheckbox);
 * ```
 */
export const createFieldWrapper = (fieldType: SearchFieldType) => {
  /**
   * 특정 필드 타입용 래퍼 함수
   */
  return <P extends Record<string, any>>(
    Component: ComponentType<P>
  ): ComponentType<FieldRenderProps> => {
    return withFieldProps(Component, fieldType);
  };
};

/**
 * 배치 래핑 함수
 * 
 * @description
 * 여러 컴포넌트를 한 번에 래핑할 때 사용
 * 대량의 필드 컴포넌트를 처리할 때 유용
 * 
 * @param componentsConfig - 컴포넌트와 필드 타입 매핑 배열
 * @returns 래핑된 컴포넌트들의 객체
 * 
 * @example
 * ```typescript
 * const wrappedComponents = wrapMultipleComponents([
 *   { component: TextInput, fieldType: 'text', name: 'TextInput' },
 *   { component: Checkbox, fieldType: 'checkbox', name: 'Checkbox' },
 *   { component: DatePicker, fieldType: 'date', name: 'DatePicker' }
 * ]);
 * 
 * // 결과: { TextInput: WrappedTextInput, Checkbox: WrappedCheckbox, ... }
 * ```
 */
export const wrapMultipleComponents = (
  componentsConfig: Array<{
    component: ComponentType<any>;
    fieldType: SearchFieldType;
    name: string;
  }>
): Record<string, ComponentType<FieldRenderProps>> => {
  return componentsConfig.reduce((acc, { component, fieldType, name }) => {
    acc[name] = withFieldProps(component, fieldType);
    return acc;
  }, {} as Record<string, ComponentType<FieldRenderProps>>);
};

