/**
 * 검색 컨텍스트 및 Provider
 * react-hook-form을 완전히 캡슐화
 */

import React, { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useForm, FieldValues as RHFFieldValues } from 'react-hook-form';
import {
  SearchContextValue,
  SearchProviderProps,
  SearchFormAPI,
  FieldMeta,
  FieldValues,
} from '../types/search.types';

/**
 * SearchContext
 */
const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * SearchProvider 컴포넌트
 * react-hook-form을 내부에서 관리하고 추상화된 API 제공
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({
  config,
  children,
  initialValues,
}) => {
  // 기본값 설정
  const defaultValues = useMemo(() => {
    const values: FieldValues = { ...initialValues };
    
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined && values[field.name] === undefined) {
        values[field.name] = field.defaultValue;
      }
    });
    
    return values;
  }, [config.fields, initialValues]);

  // react-hook-form 초기화 (내부적으로만 사용)
  const rhfForm = useForm<RHFFieldValues>({
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit: rhfHandleSubmit,
    reset: rhfReset,
    getValues: rhfGetValues,
    setValue: rhfSetValue,
    watch,
    formState,
    trigger,
  } = rhfForm;

  // 폼 API 구현 (react-hook-form 추상화)
  const formAPI: SearchFormAPI = useMemo(() => ({
    submit: async () => {
      await rhfHandleSubmit(async (data) => {
        if (config.onSubmit) {
          await config.onSubmit(data);
        }
      })();
    },
    
    reset: () => {
      rhfReset(defaultValues);
      if (config.onReset) {
        config.onReset();
      }
    },
    
    getValues: () => rhfGetValues(),
    
    setValues: (values: FieldValues) => {
      Object.entries(values).forEach(([key, value]) => {
        rhfSetValue(key, value, { shouldValidate: true, shouldDirty: true });
      });
    },
    
    getValue: (name: string) => rhfGetValues(name),
    
    setValue: (name: string, value: any) => {
      rhfSetValue(name, value, { shouldValidate: true, shouldDirty: true });
    },
    
    validate: async () => {
      return await trigger();
    },
    
    isSubmitting: formState.isSubmitting,
    isValidating: formState.isValidating,
    isDirty: formState.isDirty,
    isValid: formState.isValid,
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
  const getFieldMeta = useCallback(
    (name: string): FieldMeta | undefined => {
      return config.fields.find((field) => field.name === name);
    },
    [config.fields]
  );

  // onChange 콜백 처리
  useEffect(() => {
    if (config.onChange) {
      const subscription = watch((data) => {
        config.onChange!(data as FieldValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, config]);

  // 자동 제출 처리
  useEffect(() => {
    if (config.autoSubmit) {
      const delay = config.autoSubmitDelay ?? 500;
      const timer = setTimeout(() => {
        formAPI.submit();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [watch(), config.autoSubmit, config.autoSubmitDelay, formAPI]);

  // Context 값
  const contextValue: SearchContextValue = useMemo(
    () => ({
      config,
      form: formAPI,
      getFieldMeta,
      // react-hook-form 인스턴스는 내부용으로만 (사용자 접근 불가)
      _internal: {
        rhfForm,
        control: rhfForm.control,
        register: rhfForm.register,
      },
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
 */
export const useSearchContext = (): SearchContextValue => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
};