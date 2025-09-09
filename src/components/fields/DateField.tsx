/**
 * 날짜 선택 필드 컴포넌트
 * react-datepicker를 사용한 단일 날짜 선택
 */

import React from 'react';
import DatePicker from 'react-datepicker';
import { FieldRenderProps } from '../../types';
import styles from './DateField.module.scss';
import "react-datepicker/dist/react-datepicker.css";

export const DateField: React.FC<FieldRenderProps> = ({
  value,
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  // 문자열 날짜를 Date 객체로 변환
  const selectedDate = value ? new Date(value) : null;

  const handleChange = (date: Date | null) => {
    if (date) {
      // ISO 날짜 문자열로 변환 (YYYY-MM-DD)
      onChange(date.toISOString().split('T')[0]);
    } else {
      onChange(null);
    }
  };

  return (
    <div className={styles.dateField}>
      {meta?.label && (
        <label htmlFor={meta.id} className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <DatePicker
        id={meta?.id}
        selected={selectedDate}
        onChange={handleChange}
        onBlur={onBlur}
        dateFormat="yyyy-MM-dd"
        placeholderText={meta?.placeholder || "날짜를 선택하세요"}
        disabled={disabled || meta?.disabled}
        readOnly={meta?.readonly}
        className={`${styles.input} ${error ? styles.error : ''}`}
        wrapperClassName={styles.datePickerWrapper}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        isClearable
        autoComplete="off"
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};