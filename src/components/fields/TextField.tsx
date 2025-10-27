/**
 * 텍스트 입력 필드 컴포넌트
 * 새로운 추상화된 API 사용
 */

import React from 'react';
import { FieldProps } from '../../types/search.types';
import styles from './TextField.module.scss';

export const TextField: React.FC<FieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  /**
   * input type 결정
   * meta.type이 'text' 또는 'number'일 경우 해당 타입 사용
   * 기본값: 'text'
   */
  const inputType = meta?.type === 'number' ? 'number' : 'text';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // number 타입인 경우 숫자로 변환, 빈 값이면 null 반환
    if (inputType === 'number') {
      onChange(newValue === '' ? null : Number(newValue));
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.textField}>
      {meta?.label && (
        <label htmlFor={meta.id} className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={meta?.id}
        type={inputType}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={meta?.placeholder}
        disabled={disabled || meta?.disabled}
        readOnly={meta?.readonly}
        className={`${styles.input} ${error ? styles.error : ''}`}
        // number 타입일 때 추가 속성
        min={inputType === 'number' ? meta?.validation?.min : undefined}
        max={inputType === 'number' ? meta?.validation?.max : undefined}
        step={inputType === 'number' ? meta?.config?.step : undefined}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};