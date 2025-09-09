/**
 * 날짜 범위 선택 필드 컴포넌트
 * react-datepicker를 사용한 시작일/종료일 선택
 */

import React from 'react';
import DatePicker from 'react-datepicker';
import { FieldRenderProps } from '../../types';
import styles from './DateRangeField.module.scss';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeValue {
  start?: string | null;
  end?: string | null;
}

export const DateRangeField: React.FC<FieldRenderProps> = ({
  value,
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  // 기본값 설정
  const rangeValue: DateRangeValue = value || { start: null, end: null };
  
  // 문자열 날짜를 Date 객체로 변환
  const startDate = rangeValue.start ? new Date(rangeValue.start) : null;
  const endDate = rangeValue.end ? new Date(rangeValue.end) : null;

  const handleStartChange = (date: Date | null) => {
    const newValue = {
      ...rangeValue,
      start: date ? date.toISOString().split('T')[0] : null
    };
    
    // 시작일이 종료일보다 늦으면 종료일 초기화
    if (date && endDate && date > endDate) {
      newValue.end = null;
    }
    
    onChange(newValue);
  };

  const handleEndChange = (date: Date | null) => {
    onChange({
      ...rangeValue,
      end: date ? date.toISOString().split('T')[0] : null
    });
  };

  return (
    <div className={styles.dateRangeField}>
      {meta?.label && (
        <label className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.dateInputs}>
        <div className={styles.dateInput}>
          <DatePicker
            selected={startDate}
            onChange={handleStartChange}
            onBlur={onBlur}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate || undefined}
            dateFormat="yyyy-MM-dd"
            placeholderText={meta?.placeholder?.split('~')[0]?.trim() || "시작일"}
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
        </div>
        
        <span className={styles.separator}>~</span>
        
        <div className={styles.dateInput}>
          <DatePicker
            selected={endDate}
            onChange={handleEndChange}
            onBlur={onBlur}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            dateFormat="yyyy-MM-dd"
            placeholderText={meta?.placeholder?.split('~')[1]?.trim() || "종료일"}
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
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};