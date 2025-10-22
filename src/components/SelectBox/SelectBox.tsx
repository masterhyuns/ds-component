/**
 * SelectBox 컴포넌트
 *
 * react-select 기반의 독립적인 SelectBox 컴포넌트
 * SearchProvider나 Field 없이도 사용 가능한 일반 컴포넌트
 */

import React, { useMemo, useState } from 'react';
import Select, { MultiValue, SingleValue, Props as SelectProps } from 'react-select';
import { Option } from '../../types/search.types';
import styles from './SelectBox.module.scss';

/**
 * react-select Option 타입
 */
type ReactSelectOption = {
  readonly label: string;
  readonly value: any;
  readonly isDisabled?: boolean;
};

/**
 * SelectBox Props
 */
export interface SelectBoxProps {
  /** 현재 선택된 값 (controlled) */
  value?: any;
  /** 기본 선택 값 (uncontrolled) */
  defaultValue?: any;
  /** 값 변경 핸들러 */
  onChange?: (value: any) => void;
  /** 선택 옵션 목록 */
  options: Option[];

  /** 라벨 */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** 에러 메시지 */
  error?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 필수 여부 (라벨에 * 표시) */
  required?: boolean;

  /** Multiple 선택 여부 */
  isMulti?: boolean;
  /** 검색 가능 여부 (기본: true) */
  isSearchable?: boolean;
  /** Clear 버튼 표시 여부 (기본: true) */
  isClearable?: boolean;

  /** 커스텀 CSS 클래스 */
  className?: string;
  /** 입력 필드 ID */
  id?: string;
  /** 입력 필드 name */
  name?: string;

  /** 비동기 옵션 로드 함수 */
  loadOptions?: (query: string) => Promise<Option[]>;

  /** Blur 이벤트 핸들러 */
  onBlur?: () => void;
  /** Focus 이벤트 핸들러 */
  onFocus?: () => void;
}

/**
 * SelectBox 컴포넌트
 *
 * @example
 * // Uncontrolled 사용
 * <SelectBox
 *   label="카테고리"
 *   options={[{ label: '전체', value: 'all' }]}
 *   onChange={(value) => console.log(value)}
 * />
 *
 * @example
 * // Controlled 사용
 * const [value, setValue] = useState('all');
 * <SelectBox
 *   value={value}
 *   onChange={setValue}
 *   options={options}
 * />
 *
 * @example
 * // Multiple 선택
 * <SelectBox
 *   isMulti
 *   options={options}
 *   onChange={(values) => console.log(values)}
 * />
 */
export const SelectBox: React.FC<SelectBoxProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  label,
  placeholder = '선택하세요',
  error,
  disabled = false,
  required = false,
  isMulti = false,
  isSearchable = true,
  isClearable = true,
  className,
  id,
  name,
  onBlur,
  onFocus,
}) => {
  // Uncontrolled 모드를 위한 내부 state
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Controlled vs Uncontrolled 모드 판단
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  /**
   * 옵션 배열을 react-select 형식으로 변환
   */
  const selectOptions: ReactSelectOption[] = useMemo(() => {
    return options.map((opt) => ({
      label: opt.label,
      value: opt.value,
      isDisabled: opt.disabled,
    }));
  }, [options]);

  /**
   * 현재 값을 react-select 형식으로 변환
   */
  const selectedValue = useMemo(() => {
    if (!currentValue) return isMulti ? [] : null;

    if (isMulti) {
      const valueArray = Array.isArray(currentValue) ? currentValue : [currentValue];
      return selectOptions.filter((opt) => valueArray.includes(opt.value));
    } else {
      return selectOptions.find((opt) => opt.value === currentValue) || null;
    }
  }, [currentValue, selectOptions, isMulti]);

  /**
   * react-select 변경 이벤트 핸들러
   */
  const handleChange = (
    newValue: MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>
  ) => {
    let transformedValue: any;

    if (isMulti) {
      const selected = (newValue as MultiValue<ReactSelectOption>) || [];
      transformedValue = selected.map((opt) => opt.value);
    } else {
      const selected = newValue as SingleValue<ReactSelectOption>;
      transformedValue = selected ? selected.value : null;
    }

    // Uncontrolled 모드에서는 내부 state 업데이트
    if (!isControlled) {
      setInternalValue(transformedValue);
    }

    // onChange 콜백 호출
    if (onChange) {
      onChange(transformedValue);
    }
  };

  /**
   * react-select 커스텀 스타일
   */
  const customStyles: SelectProps<ReactSelectOption>['styles'] = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '30px',
      height: isMulti ? 'auto' : '30px',
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
    valueContainer: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: isMulti ? 'auto' : '30px',
      padding: isMulti ? '2px 8px' : '0 8px',
      display: 'flex',
      alignItems: 'center',
      gap: isMulti ? '4px' : '0',
    }),
    multiValue: (provided) => ({
      ...provided,
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--color-primary-light, #e7f1ff)',
      borderRadius: '3px',
      fontSize: '0.875rem',
      height: '22px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      padding: '0 6px',
      fontSize: '0.875rem',
      color: 'var(--color-primary, #0d6efd)',
      display: 'flex',
      alignItems: 'center',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      padding: '0 4px',
      cursor: 'pointer',
      color: 'var(--color-primary, #0d6efd)',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: 'var(--color-primary, #0d6efd)',
        color: '#fff',
      },
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: isMulti ? 'auto' : '30px',
      alignItems: 'center',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '4px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '4px',
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
    <div className={`${styles.selectBox} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <Select<ReactSelectOption, boolean>
        inputId={id}
        name={name}
        options={selectOptions}
        value={selectedValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        isDisabled={disabled}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        placeholder={placeholder}
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
