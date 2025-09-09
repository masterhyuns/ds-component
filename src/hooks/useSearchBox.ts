/**
 * 헤드리스 검색 박스 훅
 * react-hook-form과 통합하여 검색 폼 상태를 관리
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useForm, FieldValues, UseFormReturn, Path } from 'react-hook-form';
import { SearchFormConfig, SearchFieldMeta } from '../types/types';

/**
 * 검색 박스 훅의 반환 타입
 */
export interface UseSearchBoxReturn<TFieldValues extends FieldValues = FieldValues> {
  /** react-hook-form 인스턴스 */
  form: UseFormReturn<TFieldValues>;
  /** 정렬된 필드 메타 정보 */
  sortedFields: SearchFieldMeta<TFieldValues>[];
  /** 표시할 필드 메타 정보 (조건부 필드 필터링) */
  visibleFields: SearchFieldMeta<TFieldValues>[];
  /** 제출 핸들러 */
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** 리셋 핸들러 */
  handleReset: () => void;
  /** 필드 값 변경 핸들러 */
  handleFieldChange: (name: Path<TFieldValues>, value: any) => void;
  /** 검색 중 상태 */
  isSubmitting: boolean;
}

/**
 * 헤드리스 검색 박스 훅
 * @param config - 검색 폼 설정
 * @returns 검색 박스 제어 객체
 */
export const useSearchBox = <TFieldValues extends FieldValues = FieldValues>(
  config: SearchFormConfig<TFieldValues>
): UseSearchBoxReturn<TFieldValues> => {
  // 기본값 설정
  const defaultValues = useMemo(() => {
    const values: Partial<TFieldValues> = {};
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        (values as any)[field.name] = field.defaultValue;
      }
    });
    return values;
  }, [config.fields]);

  // react-hook-form 초기화
  const form = useForm<TFieldValues>({
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const { watch, handleSubmit: rhfHandleSubmit, reset, setValue, formState } = form;

  // 모든 필드 값 감시
  const watchedValues = watch();

  // 필드 정렬 (order 속성 기준)
  const sortedFields = useMemo(() => {
    return [...config.fields].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  }, [config.fields]);

  // 조건부 필드 필터링
  const visibleFields = useMemo(() => {
    return sortedFields.filter((field) => {
      if (!field.showWhen) return true;
      return field.showWhen(watchedValues);
    });
  }, [sortedFields, watchedValues]);

  // 제출 핸들러
  const handleSubmit = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      e?.preventDefault();
      await rhfHandleSubmit(async (data) => {
        if (config.onSubmit) {
          await config.onSubmit(data);
        }
      })();
    },
    [rhfHandleSubmit, config]
  );

  // 리셋 핸들러
  const handleReset = useCallback(() => {
    reset(defaultValues as any);
    if (config.onReset) {
      config.onReset();
    }
  }, [reset, defaultValues, config]);

  // 필드 값 변경 핸들러
  const handleFieldChange = useCallback(
    (name: Path<TFieldValues>, value: any) => {
      setValue(name, value, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true 
      });
    },
    [setValue]
  );

  // onChange 콜백 처리
  useEffect(() => {
    if (config.onChange) {
      const subscription = watch((data) => {
        config.onChange!(data as TFieldValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, config]);

  // 자동 제출 처리
  useEffect(() => {
    if (config.autoSubmit) {
      const delay = config.autoSubmitDelay ?? 500;
      const timer = setTimeout(() => {
        handleSubmit();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [watchedValues, config.autoSubmit, config.autoSubmitDelay, handleSubmit]);

  return {
    form: form as any,
    sortedFields,
    visibleFields,
    handleSubmit,
    handleReset,
    handleFieldChange,
    isSubmitting: formState.isSubmitting,
  };
};