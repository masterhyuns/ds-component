/**
 * 검색 컨텍스트 및 Provider
 * react-hook-form을 완전히 캡슐화하여 사용자가 react-hook-form을 몰라도 사용 가능
 * 
 * 주요 역할:
 * 1. react-hook-form 인스턴스 생성 및 관리
 * 2. 폼 상태 관리 (값, 에러, 제출 상태 등)
 * 3. 추상화된 API 제공 (useField, useSearchForm 등의 훅에서 사용)
 * 4. 자동 제출, onChange 콜백 등 부가 기능 처리
 */

import React, { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useForm, FieldValues as RHFFieldValues, UseFormReturn, Unsubscribe } from 'react-hook-form';
import {
  SearchContextValue,
  SearchProviderProps,
  SearchFormAPI,
  FieldMeta,
  FieldValues,
  InternalAPI,
} from '../types/search.types';

/**
 * SearchContext
 * 전역적으로 폼 상태와 메서드를 공유하기 위한 Context
 * Provider로 감싸진 하위 컴포넌트들이 useSearchContext를 통해 접근 가능
 */
const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * SearchProvider 컴포넌트
 * react-hook-form을 내부에서 관리하고 추상화된 API 제공
 * 
 * @param config - 검색 폼 설정 (필드 정의, 제출 핸들러, 자동 제출 설정 등)
 * @param children - 하위 컴포넌트들 (Field, SearchButtons 등)
 * @param initialValues - 초기값 (URL이나 localStorage에서 복원된 값 등)
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({
  config,
  children,
  initialValues,
}) => {
  // 기본값 설정
  // initialValues와 필드별 defaultValue를 병합하여 최종 기본값 생성
  // 우선순위: initialValues > field.defaultValue
  const defaultValues: FieldValues = useMemo(() => {
    const values: FieldValues = { ...initialValues };
    
    // 각 필드의 defaultValue가 있고, initialValues에 해당 값이 없으면 추가
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined && values[field.name] === undefined) {
        values[field.name] = field.defaultValue;
      }
    });
    
    return values;
  }, [config.fields, initialValues]);

  // react-hook-form 초기화 (내부적으로만 사용)
  // 사용자는 이 rhfForm의 존재를 모르고, 우리가 제공하는 API만 사용
  const rhfForm: UseFormReturn<RHFFieldValues> = useForm<RHFFieldValues>({
    defaultValues,
    mode: 'onChange', // 입력할 때마다 유효성 검사 (onBlur, onSubmit, all 옵션도 있음)
    // mode 옵션 설명:
    // - 'onChange': 입력할 때마다 유효성 검사 (실시간 피드백)
    // - 'onBlur': 포커스가 빠져나갈 때 유효성 검사
    // - 'onSubmit': 제출할 때만 유효성 검사
    // - 'onTouched': 터치된 필드만 유효성 검사
    // - 'all': 모든 경우에 유효성 검사
  });

  // react-hook-form에서 필요한 메서드들 추출
  const {
    handleSubmit: rhfHandleSubmit, // 폼 제출 처리
    reset: rhfReset,                // 폼 초기화
    getValues: rhfGetValues,        // 현재 값 가져오기
    setValue: rhfSetValue,          // 특정 필드 값 설정
    watch,                          // 값 변경 감시
    formState,                      // 폼 상태 (에러, 제출중, 더티 등)
    trigger,                        // 수동 유효성 검사 트리거
  } = rhfForm;

  // 폼 API 구현 (react-hook-form 추상화)
  // 사용자가 실제로 사용할 깔끔한 API
  const formAPI: SearchFormAPI = useMemo(() => ({
    // 폼 제출 - rhfHandleSubmit을 래핑하여 config.onSubmit 호출
    submit: async () => {
      await rhfHandleSubmit(async (data) => {
        if (config.onSubmit) {
          await config.onSubmit(data);
        }
      })(); // 즉시 실행을 위해 () 추가
    },
    
    // 폼 초기화 - 기본값으로 리셋하고 onReset 콜백 실행
    reset: () => {
      rhfReset(defaultValues);
      if (config.onReset) {
        config.onReset();
      }
    },
    
    // 전체 폼 값 가져오기
    getValues: () => rhfGetValues(),
    
    // 여러 필드 값을 한번에 설정
    setValues: (values: FieldValues) => {
      Object.entries(values).forEach(([key, value]) => {
        rhfSetValue(key, value, { 
          shouldValidate: true,  // 값 설정 후 유효성 검사 실행
          shouldDirty: true      // 필드를 dirty 상태로 표시 (수정됨)
        });
      });
    },
    
    // 특정 필드 값 가져오기
    getValue: (name: string) => rhfGetValues(name),
    
    // 특정 필드 값 설정
    setValue: (name: string, value: any) => {
      rhfSetValue(name, value, { 
        shouldValidate: true,  // 유효성 검사 실행
        shouldDirty: true      // dirty 상태로 표시
      });
    },
    
    // 전체 폼 유효성 검사 수동 실행
    validate: async () => {
      return await trigger();
    },
    
    // 폼 상태 플래그들
    isSubmitting: formState.isSubmitting,   // 제출 중인지
    isValidating: formState.isValidating,   // 유효성 검사 중인지
    isDirty: formState.isDirty,             // 폼이 수정되었는지
    isValid: formState.isValid,             // 폼이 유효한지
    
    // 에러 객체를 단순화 (FieldError 객체를 문자열로 변환)
    errors: Object.entries(formState.errors).reduce((acc, [key, error]) => {
      acc[key] = (error as any)?.message || 'Validation error';
      return acc;
    }, {} as Record<string, string>),
  }), [
    rhfHandleSubmit,
    rhfReset,
    rhfGetValues,
    rhfSetValue,
    trigger,
    formState,
    defaultValues,
    config,
  ]);

  // 필드 메타 정보 가져오기
  // 필드 이름으로 해당 필드의 설정 정보를 찾아 반환
  const getFieldMeta = useCallback(
    (name: string): FieldMeta | undefined => {
      return config.fields.find((field) => field.name === name);
    },
    [config.fields]
  );

  // onChange 콜백 처리
  // 폼 값이 변경될 때마다 config.onChange 콜백 실행
  useEffect(() => {
    // onChange가 정의되어 있지 않으면 early return
    if (!config.onChange) {
      return;
    }
    
    // watch()는 구독을 반환하며, 값이 변경될 때마다 콜백 실행
    const subscription: Unsubscribe = watch((data) => {
      config.onChange!(data as FieldValues);
    });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe();
  }, [watch, config]);

  // 자동 제출 처리
  // autoSubmit이 true면 값 변경 후 지정된 시간(기본 500ms) 후 자동 제출
  useEffect(() => {
    // autoSubmit이 활성화되어 있지 않으면 early return
    if (!config.autoSubmit) {
      return;
    }
    
    const delay: number = config.autoSubmitDelay ?? 500;
    const timer = setTimeout(() => {
      formAPI.submit();
    }, delay);
    
    // cleanup 함수로 타이머 정리
    return () => clearTimeout(timer);
  }, [watch(), config.autoSubmit, config.autoSubmitDelay, formAPI]); // watch()를 의존성에 포함하여 값 변경 감지

  // Context 값
  // 하위 컴포넌트들이 useSearchContext를 통해 접근할 수 있는 값들
  const contextValue: SearchContextValue = useMemo(
    () => ({
      config,          // 검색 폼 설정
      form: formAPI,   // 추상화된 폼 API
      getFieldMeta,    // 필드 메타 정보 조회 함수
      
      // react-hook-form 인스턴스는 내부용으로만 사용
      // 사용자는 이 _internal에 직접 접근하지 않고, 우리가 제공하는 훅을 통해서만 사용
      _internal: {
        rhfForm,                     // react-hook-form 인스턴스
        control: rhfForm.control,    // Controller나 useController에서 사용
        register: rhfForm.register,  // register 메서드 (직접 사용은 권장하지 않음)
      } as InternalAPI,
    }),
    [config, formAPI, getFieldMeta, rhfForm]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * SearchContext 사용 훅
 * SearchProvider 내부에서만 사용 가능
 * 주로 다른 커스텀 훅들(useField, useSearchForm 등)에서 내부적으로 사용
 */
export const useSearchContext = (): SearchContextValue => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
};