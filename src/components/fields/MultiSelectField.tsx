/**
 * 다중 선택 필드 컴포넌트
 * 배열 형태의 value를 처리하는 select 필드
 */

import React from 'react';
import { FieldProps } from '../../types/search.types';
import styles from './MultiSelectField.module.scss';

export const MultiSelectField: React.FC<FieldProps> = ({
  value = [],
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  // value가 배열이 아닌 경우 빈 배열로 초기화
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className={styles.multiSelectField}>
      {meta?.label && (
        <label htmlFor={meta.id} className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <select
        id={meta?.id}
        value={selectedValues}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled || meta?.disabled}
        multiple
        className={`${styles.select} ${error ? styles.error : ''}`}
      >
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
      
      {/* 선택된 값들 표시 */}
      {selectedValues.length > 0 && (
        <div className={styles.selectedValues}>
          <span className={styles.selectedLabel}>선택됨:</span>
          {selectedValues.map((val, index) => {
            const option = meta?.options?.find(opt => opt.value === val);
            return (
              <span key={val} className={styles.selectedItem}>
                {option?.label || val}
                {index < selectedValues.length - 1 && ', '}
              </span>
            );
          })}
        </div>
      )}
      
      {error && <span className={styles.errorMessage}>{error}</span>}
      
      <div className={styles.helperText}>
        Ctrl(Cmd) + 클릭으로 여러 항목을 선택할 수 있습니다
      </div>
    </div>
  );
};