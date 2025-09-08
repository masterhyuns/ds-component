/**
 * useField 훅
 * react-hook-form의 useController를 추상화하여
 * 사용자가 react-hook-form을 몰라도 사용할 수 있도록 함
 * 
 * 주요 역할:
 * 1. react-hook-form의 useController를 내부적으로 사용하여 필드 상태 관리
 * 2. ValidationRules를 react-hook-form 형식으로 자동 변환
 * 3. 필드 값, 에러, 상태 등을 추상화된 API로 제공
 * 4. onChange, onBlur 등의 이벤트 핸들러 자동 처리
 * 
 * 사용 예시:
 * const field = useField('username');
 * <input {...field} />  // value, onChange, onBlur 자동 연결
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
  // 우리의 간단한 validation 규칙을 react-hook-form이 이해할 수 있는 형식으로 변환
  // 사용자는 { required: true, minLength: 5 } 같은 간단한 형식을 사용하고
  // 내부적으로 react-hook-form의 { required: { value: true, message: '...' }} 형식으로 변환
  const rhfRules = useMemo(() => {
    if (!meta?.validation) return undefined;
    
    const rules: any = {};
    const validation = meta.validation;
    
    // required 규칙 처리
    // - true: 기본 에러 메시지 자동 생성
    // - string: 사용자 정의 에러 메시지 사용
    // - false: 필수 아님
    if (validation.required !== undefined) {
      rules.required = typeof validation.required === 'string' 
        ? validation.required  // 사용자가 제공한 에러 메시지
        : validation.required ? `${meta.label || name}은(는) 필수입니다` : false;
    }
    
    // minLength 규칙 처리
    // - number: { value: number, message: 기본메시지 } 형식으로 변환
    // - object: { value, message } 형식 그대로 사용
    if (validation.minLength !== undefined) {
      rules.minLength = typeof validation.minLength === 'object'
        ? validation.minLength  // 이미 { value, message } 형식
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
    
    // pattern 규칙 처리 (정규표현식 검증)
    // - RegExp: { value: RegExp, message: 기본메시지 } 형식으로 변환
    // - object: { value: RegExp, message: string } 형식 그대로 사용
    // 예: /^[A-Z]+$/ 또는 { value: /^[A-Z]+$/, message: '대문자만 입력하세요' }
    if (validation.pattern !== undefined) {
      rules.pattern = typeof validation.pattern === 'object'
        ? validation.pattern  // 이미 { value, message } 형식
        : { value: validation.pattern, message: '올바른 형식이 아닙니다' };
    }
    
    // validate 규칙 처리 (커스텀 검증 함수)
    // 사용자가 정의한 검증 함수를 그대로 전달
    // 함수는 (value) => true | string 형식
    // - true 반환: 유효함
    // - string 반환: 에러 메시지
    // 예: (value) => value.includes('@') || '이메일 형식이 아닙니다'
    if (validation.validate !== undefined) {
      rules.validate = validation.validate;
    }
    
    return rules;
  }, [meta, name]);
  
  // react-hook-form의 useController 사용 (내부적으로만)
  // useController는 react-hook-form의 핵심 훅으로:
  // - control: 폼 인스턴스와 연결
  // - name: 필드 이름으로 폼 데이터 경로 지정
  // - rules: 유효성 검사 규칙
  // 반환값:
  // - field: { value, onChange, onBlur, ref } 필드 연결용 props
  // - fieldState: { error, isDirty, isTouched } 필드 상태
  // - formState: 전체 폼 상태 (주로 isValidating 사용)
  const controller = useController({
    name,
    control: context._internal.control,
    rules: rhfRules,
  });
  
  // 값 설정 함수
  // controller.field.onChange를 직접 호출하여 값 업데이트
  // react-hook-form이 내부적으로 폼 상태 업데이트 및 유효성 검사 처리
  const setValue = useCallback((value: any) => {
    controller.field.onChange(value);
  }, [controller.field]);
  
  // onChange 핸들러 (input 요소에 직접 연결 가능)
  // 두 가지 방식 모두 지원:
  // 1. DOM 이벤트: <input onChange={field.onChange} />
  // 2. 직접 값 전달: onChange("new value")
  const onChange = useCallback((e: any) => {
    // 이벤트 객체인 경우 (일반 input, textarea 등)
    if (e && typeof e === 'object' && 'target' in e) {
      controller.field.onChange(e.target.value);
    } else {
      // 값을 직접 전달한 경우 (Select, DatePicker 등 커스텀 컴포넌트)
      controller.field.onChange(e);
    }
  }, [controller.field]);
  
  // 필드 초기화
  // 개별 필드를 기본값으로 리셋
  // meta.defaultValue가 있으면 사용, 없으면 빈 문자열
  const reset = useCallback(() => {
    const defaultValue = meta?.defaultValue ?? '';
    controller.field.onChange(defaultValue);
  }, [controller.field, meta]);
  
  // 수동 유효성 검사
  // trigger는 react-hook-form의 메서드로 특정 필드의 유효성 검사를 수동으로 실행
  // 일반적으로 mode: 'onChange'로 자동 검사되지만, 필요시 수동 실행 가능
  // 반환값: boolean (유효하면 true, 에러가 있으면 false)
  const validate = useCallback(async () => {
    return await context._internal.rhfForm.trigger(name);
  }, [context._internal.rhfForm, name]);
  
  // FieldAPI 객체 생성
  // 사용자에게 제공할 깔끔한 API
  // react-hook-form의 복잡한 구조를 단순화하여 제공
  const fieldAPI: FieldAPI = useMemo(() => ({
    value: controller.field.value,                     // 현재 필드 값
    setValue,                                           // 값 설정 함수
    onChange,                                           // onChange 핸들러 (DOM 이벤트 & 직접 값 모두 지원)
    onBlur: controller.field.onBlur,                  // onBlur 핸들러 (포커스 아웃 시 호출)
    error: controller.fieldState.error?.message,       // 유효성 검사 에러 메시지
    isDirty: controller.fieldState.isDirty,           // 값이 변경되었는지 (초기값과 다른지)
    isTouched: controller.fieldState.isTouched,       // 필드가 터치되었는지 (포커스를 받았던 적이 있는지)
    isValidating: controller.formState.isValidating,   // 유효성 검사 중인지 (비동기 검증 시 유용)
    meta,                                              // 필드 메타 정보 (label, placeholder, validation 등)
    reset,                                             // 필드 초기화 함수
    validate,                                          // 수동 유효성 검사 함수
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