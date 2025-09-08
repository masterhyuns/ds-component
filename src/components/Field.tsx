/**
 * Field 컴포넌트
 * 메타 정의 기반 자동 렌더링 또는 커스텀 렌더링 지원
 */

import React, { useMemo } from 'react';
import { useField } from '../hooks/useField';
import { useSearchContext } from '../context/SearchContext';
import { FieldComponentProps } from '../types/search.types';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';

/**
 * 필드 타입별 기본 컴포넌트 매핑
 */
const defaultFieldComponents: Record<string, React.ComponentType<any>> = {
  text: TextField,
  select: SelectField,
  // TODO: 추가 필드 타입 컴포넌트
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
  const isVisible = useMemo(() => {
    if (!meta?.showWhen) return true;
    const values = context.form.getValues();
    return meta.showWhen(values);
  }, [meta, context.form]);
  
  if (!isVisible) {
    return null;
  }
  
  // render prop 패턴 (우선순위 1)
  if (render) {
    return <>{render(field)}</>;
  }
  
  // children 함수 패턴 (우선순위 2)
  if (typeof children === 'function') {
    return <>{children(field)}</>;
  }
  
  // 커스텀 컴포넌트 (우선순위 3)
  if (CustomComponent) {
    return (
      <CustomComponent
        value={field.value}
        onChange={field.setValue}
        onBlur={field.onBlur}
        error={field.error}
        meta={meta}
        isDirty={field.isDirty}
        isTouched={field.isTouched}
        isValidating={field.isValidating}
        disabled={meta?.disabled}
        {...restProps}
      />
    );
  }
  
  // 메타 정의 기반 자동 렌더링 (우선순위 4)
  if (meta) {
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