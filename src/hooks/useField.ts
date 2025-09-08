/**
 * useField 훅
 * react-hook-form의 useController를 추상화하여
 * 사용자가 react-hook-form을 몰라도 사용할 수 있도록 함
 */

import { useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useSearchContext } from '../context/SearchContext';
import { FieldAPI } from '../types/search.types';

/**
 * 필드 관리 훅
 * @param name - 필드 이름
 * @returns FieldAPI 객체
 */
export const useField = (name: string): FieldAPI => {
  const context = useSearchContext();
  const meta = context.getFieldMeta(name);
  
  // ValidationRules를 react-hook-form 형식으로 변환
  const rhfRules = useMemo(() => {
    if (!meta?.validation) return undefined;
    
    const rules: any = {};
    const validation = meta.validation;
    
    if (validation.required !== undefined) {
      rules.required = typeof validation.required === 'string' 
        ? validation.required 
        : validation.required ? `${meta.label || name}은(는) 필수입니다` : false;
    }
    
    if (validation.minLength !== undefined) {
      rules.minLength = typeof validation.minLength === 'object'
        ? validation.minLength
        : { value: validation.minLength, message: `최소 ${validation.minLength}자 이상이어야 합니다` };
    }
    
    if (validation.maxLength !== undefined) {
      rules.maxLength = typeof validation.maxLength === 'object'
        ? validation.maxLength
        : { value: validation.maxLength, message: `최대 ${validation.maxLength}자까지 가능합니다` };
    }
    
    if (validation.min !== undefined) {
      rules.min = typeof validation.min === 'object'
        ? validation.min
        : { value: validation.min, message: `최소값은 ${validation.min}입니다` };
    }
    
    if (validation.max !== undefined) {
      rules.max = typeof validation.max === 'object'
        ? validation.max
        : { value: validation.max, message: `최대값은 ${validation.max}입니다` };
    }
    
    if (validation.pattern !== undefined) {
      rules.pattern = typeof validation.pattern === 'object'
        ? validation.pattern
        : { value: validation.pattern, message: '올바른 형식이 아닙니다' };
    }
    
    if (validation.validate !== undefined) {
      rules.validate = validation.validate;
    }
    
    return rules;
  }, [meta, name]);
  
  // react-hook-form의 useController 사용 (내부적으로만)
  const controller = useController({
    name,
    control: context._internal.control,
    rules: rhfRules,
  });
  
  // 값 설정 함수
  const setValue = useCallback((value: any) => {
    controller.field.onChange(value);
  }, [controller.field]);
  
  // onChange 핸들러 (input 요소에 직접 연결 가능)
  const onChange = useCallback((e: any) => {
    // 이벤트 객체인 경우
    if (e && typeof e === 'object' && 'target' in e) {
      controller.field.onChange(e.target.value);
    } else {
      // 값을 직접 전달한 경우
      controller.field.onChange(e);
    }
  }, [controller.field]);
  
  // 필드 초기화
  const reset = useCallback(() => {
    const defaultValue = meta?.defaultValue ?? '';
    controller.field.onChange(defaultValue);
  }, [controller.field, meta]);
  
  // 수동 유효성 검사
  const validate = useCallback(async () => {
    return await context._internal.rhfForm.trigger(name);
  }, [context._internal.rhfForm, name]);
  
  // FieldAPI 객체 생성
  const fieldAPI: FieldAPI = useMemo(() => ({
    value: controller.field.value,
    setValue,
    onChange,
    onBlur: controller.field.onBlur,
    error: controller.fieldState.error?.message,
    isDirty: controller.fieldState.isDirty,
    isTouched: controller.fieldState.isTouched,
    isValidating: controller.formState.isValidating,
    meta,
    reset,
    validate,
  }), [
    controller.field.value,
    controller.field.onBlur,
    controller.fieldState,
    controller.formState.isValidating,
    setValue,
    onChange,
    meta,
    reset,
    validate,
  ]);
  
  return fieldAPI;
};