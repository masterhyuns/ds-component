/**
 * React Select 기반 선택 필드 컴포넌트
 *
 * react-select 라이브러리를 사용한 고급 선택 필드
 * 검색, single/multiple 선택, 비동기 옵션 로드 지원
 */

import React, { useMemo } from 'react';
import Select, { MultiValue, SingleValue, Props as SelectProps } from 'react-select';
import { FieldProps, Option } from '../../types/search.types';
import styles from './ReactSelectField.module.scss';

/**
 * react-select의 Option 타입
 * FieldProps의 Option과 호환되도록 정의
 */
type ReactSelectOption = {
  readonly label: string;
  readonly value: any;
  readonly isDisabled?: boolean;
};

export const ReactSelectField: React.FC<FieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  meta,
  disabled,
}) => {
  /**
   * 옵션 배열을 react-select 형식으로 변환
   */
  const options: ReactSelectOption[] = useMemo(() => {
    return (meta?.options || []).map((opt: Option) => ({
      label: opt.label,
      value: opt.value,
      isDisabled: opt.disabled,
    }));
  }, [meta?.options]);

  /**
   * 현재 값을 react-select 형식으로 변환
   * single: value → { label, value }
   * multiple: [value1, value2] → [{ label, value }, ...]
   */
  const selectedValue = useMemo(() => {
    if (!value) return meta?.isMulti ? [] : null;

    if (meta?.isMulti) {
      // Multiple 모드: 배열 값을 배열 옵션으로 변환
      const valueArray = Array.isArray(value) ? value : [value];
      return options.filter((opt) => valueArray.includes(opt.value));
    } else {
      // Single 모드: 단일 값을 단일 옵션으로 변환
      return options.find((opt) => opt.value === value) || null;
    }
  }, [value, options, meta?.isMulti]);

  /**
   * react-select 변경 이벤트 핸들러
   * react-select 옵션을 폼 값으로 변환
   */
  const handleChange = (
    newValue: MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>
  ) => {
    if (meta?.isMulti) {
      // Multiple 모드: 옵션 배열을 값 배열로 변환
      const selected = (newValue as MultiValue<ReactSelectOption>) || [];
      const values = selected.map((opt) => opt.value);
      onChange(values);
    } else {
      // Single 모드: 단일 옵션을 단일 값으로 변환
      const selected = newValue as SingleValue<ReactSelectOption>;
      onChange(selected ? selected.value : null);
    }
  };

  /**
   * react-select blur 이벤트 핸들러
   */
  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  /**
   * react-select 커스텀 스타일
   * 프로젝트 디자인 시스템과 일관성 유지
   */
  const customStyles: SelectProps<ReactSelectOption>['styles'] = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '38px',
      borderColor: error
        ? 'var(--color-error, #dc3545)'
        : state.isFocused
        ? 'var(--color-primary, #0d6efd)'
        : 'var(--color-border, #ced4da)',
      boxShadow: state.isFocused
        ? error
          ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)'
          : '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
        : 'none',
      '&:hover': {
        borderColor: error
          ? 'var(--color-error, #dc3545)'
          : 'var(--color-primary, #0d6efd)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--color-primary, #0d6efd)'
        : state.isFocused
        ? 'var(--color-hover, #f8f9fa)'
        : 'transparent',
      color: state.isSelected ? '#fff' : 'inherit',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      '&:active': {
        backgroundColor: state.isDisabled
          ? undefined
          : state.isSelected
          ? 'var(--color-primary-dark, #0a58ca)'
          : 'var(--color-active, #e9ecef)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--color-placeholder, #6c757d)',
    }),
  };

  return (
    <div className={styles.reactSelectField}>
      {meta?.label && (
        <label htmlFor={meta.id} className={styles.label}>
          {meta.label}
          {meta.validation?.required && <span className={styles.required}>*</span>}
        </label>
      )}

      <Select<ReactSelectOption, boolean>
        inputId={meta?.id}
        name={meta?.name}
        options={options}
        value={selectedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        isDisabled={disabled || meta?.disabled}
        isMulti={meta?.isMulti}
        isSearchable={meta?.isSearchable ?? true}
        isClearable={meta?.isClearable ?? true}
        placeholder={meta?.placeholder || '선택하세요'}
        noOptionsMessage={() => '옵션이 없습니다'}
        loadingMessage={() => '로딩 중...'}
        styles={customStyles}
        className={styles.select}
        classNamePrefix="react-select"
      />

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
