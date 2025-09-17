/**
 * Field 컴포넌트
 * 메타 정의 기반 자동 렌더링 또는 커스텀 렌더링 지원
 * 
 * 주요 역할:
 * 1. 다양한 렌더링 방식 지원 (render prop, children, component, 자동)
 * 2. 조건부 렌더링 처리 (showWhen 함수)
 * 3. 필드 타입별 기본 컴포넌트 매핑
 * 4. react-hook-form 상태와 자동 연결
 * 
 * 렌더링 우선순위:
 * 1. render prop
 * 2. children 함수
 * 3. component prop
 * 4. 메타 기반 자동 렌더링
 */

import React, { useMemo } from 'react';
import { useField } from '../hooks/useField';
import { useSearchContext } from '../context/SearchContext';
import { FieldComponentProps } from '../types/search.types';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import { DateField } from './fields/DateField';
import { DateRangeField } from './fields/DateRangeField';
import { withFieldProps } from './withFieldProps';

/**
 * 필드 타입별 기본 컴포넌트 매핑
 * 각 컴포넌트는 withFieldProps HOC로 래핑되어 일관된 props 인터페이스를 제공
 * 필드의 type 속성에 따라 자동으로 선택됨
 * 
 * HOC 래핑 효과:
 * - 표준 props (value, onChange, onBlur) → 컴포넌트별 props 자동 매핑
 * - 타입 안전성 보장
 * - 일관된 API 제공
 */
const defaultFieldComponents: Record<string, React.ComponentType<any>> = {
  // 기본 입력 필드들 (표준 props 사용)
  text: withFieldProps(TextField, 'text'),
  select: withFieldProps(SelectField, 'select'),
  
  // 날짜 관련 필드들
  date: withFieldProps(DateField, 'date'),
  daterange: withFieldProps(DateRangeField, 'daterange'),
  
  // TODO: 추가 필드 타입 컴포넌트 (HOC로 래핑 예정)
  // number: withFieldProps(NumberField, 'number'),
  // numberrange: withFieldProps(NumberRangeField, 'numberrange'),
  // checkbox: withFieldProps(CheckboxField, 'checkbox'),
  // radio: withFieldProps(RadioField, 'radio'),
  // multiselect: withFieldProps(MultiSelectField, 'multiselect'),
  // autocomplete: withFieldProps(AutocompleteField, 'autocomplete'),
  // file: withFieldProps(FileField, 'file'),
  // tags: withFieldProps(TagsField, 'tags'),
  // textarea: withFieldProps(TextareaField, 'textarea'),
  // hidden: withFieldProps(HiddenField, 'hidden'),
};

/**
 * Field 컴포넌트
 * 
 * @example
 * // 기본 사용법 (메타 정의 기반 자동 렌더링)
 * <Field name="email" />
 * 
 * @example
 * // render prop 패턴
 * <Field name="email" render={(field) => (
 *   <CustomInput {...field} />
 * )} />
 * 
 * @example
 * // children 함수 패턴
 * <Field name="email">
 *   {(field) => <CustomInput {...field} />}
 * </Field>
 * 
 * @example
 * // 커스텀 컴포넌트 지정
 * <Field name="email" component={MyEmailInput} />
 */
export const Field: React.FC<FieldComponentProps> = ({
  name,
  component: CustomComponent,
  render,
  children,
  ...restProps
}) => {
  const context = useSearchContext();
  const field = useField(name);
  const meta = context.getFieldMeta(name);
  
  // 조건부 렌더링 체크
  // showWhen 함수가 정의되어 있으면 현재 폼 값을 기반으로 표시 여부 결정
  // 예: showWhen: (values) => values.type === 'advanced'
  const isVisible = useMemo(() => {
    if (!meta?.showWhen) return true;  // showWhen이 없으면 항상 표시
    const values = context.form.getValues();
    return meta.showWhen(values);      // 함수 실행 결과에 따라 표시/숨김
  }, [meta, context.form]);
  
  if (!isVisible) {
    return null;
  }
  
  // render prop 패턴 (우선순위 1)
  // render prop이 제공되면 사용자가 완전히 커스터마이징
  // 예: <Field name="email" render={(field) => <CustomInput {...field} />} />
  if (render) {
    return <>{render(field)}</>;
  }
  
  // children 함수 패턴 (우선순위 2)
  // children이 함수면 render prop과 비슷하게 동작
  // 예: <Field name="email">{(field) => <CustomInput {...field} />}</Field>
  if (typeof children === 'function') {
    return <>{children(field)}</>;
  }
  
  // 커스텀 컴포넌트 (우선순위 3)
  // component prop으로 컴포넌트가 전달되면 해당 컴포넌트 사용
  // FieldProps 인터페이스를 따르는 props를 전달
  // 예: <Field name="email" component={MyEmailInput} />
  if (CustomComponent) {
    return (
      <CustomComponent
        value={field.value}              // 현재 필드 값
        onChange={field.setValue}        // 값 변경 함수
        onBlur={field.onBlur}           // 포커스 아웃 핸들러
        error={field.error}              // 에러 메시지
        meta={meta}                      // 필드 메타 정보
        isDirty={field.isDirty}         // 값 변경 여부
        isTouched={field.isTouched}     // 터치 여부
        isValidating={field.isValidating} // 검증 중 여부
        disabled={meta?.disabled}        // 비활성화 여부
        {...restProps}                   // 추가 props 전달
      />
    );
  }
  
  // 메타 정의 기반 자동 렌더링 (우선순위 4)
  // 사용자가 별도로 렌더링 방법을 지정하지 않으면
  // config.fields에 정의된 meta 정보를 기반으로 자동 렌더링
  if (meta) {
    // 'custom' 타입은 사용자가 반드시 render/component로 처리해야 함
    const FieldComponent = meta.type === 'custom' 
      ? null 
      : defaultFieldComponents[meta.type];
    
    if (!FieldComponent) {
      console.warn(`No component found for field type: ${meta.type}`);
      return null;
    }
    
    return (
      <FieldComponent
        value={field.value}
        onChange={field.setValue}
        onBlur={field.onBlur}
        error={field.error}
        meta={meta}
        isDirty={field.isDirty}
        isTouched={field.isTouched}
        isValidating={field.isValidating}
        disabled={meta.disabled}
        {...restProps}
      />
    );
  }
  
  console.warn(`Field "${name}" not found in config`);
  return null;
};