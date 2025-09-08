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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        type="text"
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={meta?.placeholder}
        disabled={disabled || meta?.disabled}
        readOnly={meta?.readonly}
        className={`${styles.input} ${error ? styles.error : ''}`}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};