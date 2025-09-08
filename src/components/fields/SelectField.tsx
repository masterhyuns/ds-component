/**
 * 선택 필드 컴포넌트
 * 새로운 추상화된 API 사용
 */

import React from 'react';
import { FieldProps } from '../../types/search.types';
import styles from './SelectField.module.scss';

export const SelectField: React.FC<FieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.selectField}>
      {meta?.label && (
        <label htmlFor={meta.id} className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        id={meta?.id}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled || meta?.disabled}
        className={`${styles.select} ${error ? styles.error : ''}`}
      >
        <option value="">{meta?.placeholder || '선택하세요'}</option>
        {meta?.options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};