/**
 * 헤드리스 검색 박스 컴포넌트
 * 메타 정의 기반으로 동적으로 검색 폼을 생성
 */

import React, { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { SearchBoxProps, FieldMeta, FieldRenderProps } from '../types/types';
import { useSearchBox } from '../hooks/useSearchBox';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import styles from './SearchBox.module.scss';

/**
 * 필드 타입에 따른 기본 컴포넌트 매핑
 */
const defaultFieldComponents: Record<string, React.ComponentType<FieldRenderProps>> = {
  text: TextField as any,  // 타입 호환성 문제 임시 해결
  select: SelectField as any,  // 타입 호환성 문제 임시 해결
  // 추가 필드 타입은 여기에 매핑
};

/**
 * 검색 박스 컴포넌트
 * @param props - SearchBoxProps
 */
export function SearchBox<TFieldValues extends FieldValues = FieldValues>({
  config,
  customComponents = {},
  className,
  style,
  render,
}: SearchBoxProps<TFieldValues>) {
  const {
    form,
    visibleFields,
    handleSubmit,
    handleReset,
    isSubmitting,
  } = useSearchBox(config);

  const { formState: { errors } } = form;

  // 필드 컴포넌트 매핑 (커스텀 + 기본)
  const fieldComponents = useMemo(
    () => ({ ...defaultFieldComponents, ...customComponents }),
    [customComponents]
  );

  // 필드 렌더링
  const renderField = (field: FieldMeta) => {
    // 커스텀 렌더 함수가 있으면 사용
    if (field.customRender) {
      return field.customRender({
        field,
        form: form as any,
        value: form.watch(field.name as any),
        onChange: (value) => form.setValue(field.name as any, value),
        error: errors[field.name]?.message as string,
      });
    }

    // 필드 타입에 따른 컴포넌트 선택
    const FieldComponent = field.type === 'custom' 
      ? customComponents[field.id]
      : fieldComponents[field.type];

    if (!FieldComponent) {
      console.warn(`No component found for field type: ${field.type}`);
      return null;
    }

    return (
      <FieldComponent
        key={field.id}
        field={field as any}
        form={form as any}
        value={form.watch(field.name as any)}
        onChange={(value) => form.setValue(field.name as any, value)}
        error={errors[field.name]?.message as string}
      />
    );
  };

  // 렌더링된 필드들
  const renderedFields = visibleFields.map(renderField);

  // 제출 버튼
  const submitButton = config.showButtons !== false && (
    <button
      type="submit"
      disabled={isSubmitting}
      className={styles.submitButton}
    >
      {isSubmitting ? '검색 중...' : (config.submitText || '검색')}
    </button>
  );

  // 리셋 버튼
  const resetButton = config.showButtons !== false && (
    <button
      type="button"
      onClick={handleReset}
      className={styles.resetButton}
    >
      {config.resetText || '초기화'}
    </button>
  );

  // 헤드리스 모드 (커스텀 렌더)
  if (render) {
    return (
      <>
        {render({
          form,
          fields: renderedFields,
          submitButton,
          resetButton,
        })}
      </>
    );
  }

  // 기본 렌더링
  const gridColumns = config.layout?.columns || 1;
  const gap = config.layout?.gap || '1rem';

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.searchBox} ${className || ''}`}
      style={style}
    >
      <div
        className={styles.fieldsGrid}
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap,
        }}
      >
        {renderedFields.map((field, index) => {
          const fieldMeta = visibleFields[index];
          const colSpan = fieldMeta?.colSpan || 1;
          return (
            <div
              key={fieldMeta?.id || index}
              style={{ gridColumn: `span ${colSpan}` }}
            >
              {field}
            </div>
          );
        })}
      </div>
      
      {config.showButtons !== false && (
        <div className={styles.buttons}>
          {submitButton}
          {resetButton}
        </div>
      )}
    </form>
  );
}