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

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState, useImperativeHandle, useRef } from 'react';
import { useForm, FieldValues as RHFFieldValues, UseFormReturn } from 'react-hook-form';
import {
  SearchContextValue,
  SearchProviderProps,
  SearchFormAPI,
  FieldMeta,
  FieldValues,
  InternalAPI,
  FieldController,
  Option,
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
 * @param formRef - 외부에서 폼 API에 접근하기 위한 ref
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({
  config,
  onSubmit,
  onReset,
  onChange,
  children,
  initialValues,
  onDepends,
  formRef,
}) => {
  /**
   * 동적 필드 메타 상태
   * onDepends 핸들러를 통해 런타임에 변경되는 필드 속성들을 저장
   * 예: disabled, options, placeholder, label 등
   *
   * 구조: { [fieldName]: { disabled: true, options: [...], ... } }
   */
  const [dynamicFieldMeta, setDynamicFieldMeta] = useState<Record<string, Partial<FieldMeta>>>({});

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
    // 폼 제출 - rhfHandleSubmit을 래핑하여 onSubmit 호출
    submit: async () => {
      await rhfHandleSubmit(async (data) => {
        if (onSubmit) {
          await onSubmit(data);
        }
      })(); // 즉시 실행을 위해 () 추가
    },

    // 폼 초기화 - 기본값으로 리셋하고 onReset 콜백 실행
    reset: () => {
      rhfReset(defaultValues);
      if (onReset) {
        onReset();
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
      // onChange는 watch 구독에서 처리되므로 여기서는 호출하지 않음
    },

    // 전체 폼 유효성 검사 수동 실행
    validate: async () => {
      return await trigger();
    },

    /**
     * 폼 값 변경 구독
     * react-hook-form의 watch를 활용하여 폼 값 변경을 실시간으로 구독
     *
     * 동작 방식:
     * 1. 즉시 현재 폼 값으로 콜백을 한 번 호출 (초기값 emit)
     * 2. 이후 값이 변경될 때마다 콜백 호출
     * 3. unsubscribe 함수 반환
     *
     * @param callback - 폼 값이 변경될 때 호출될 콜백
     * @returns unsubscribe 함수
     *
     * @example
     * const unsubscribe = formAPI.subscribe((values) => {
     *   console.log('현재 폼 값:', values);
     * });
     *
     * // 나중에 구독 해제
     * unsubscribe();
     */
    subscribe: (callback: (values: FieldValues) => void) => {
      // 1. 즉시 현재 값으로 콜백 호출 (초기값 emit)
      callback(rhfGetValues());

      // 2. watch를 사용하여 변경 감지
      const subscription = watch((values) => {
        // 값이 변경될 때마다 콜백 호출
        callback(values as FieldValues);
      });

      // 3. unsubscribe 함수 반환
      return () => {
        subscription.unsubscribe();
      };
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
    watch,
  ]);

  /**
   * FieldController 구현
   * onDepends 핸들러에서 필드를 동적으로 제어하기 위한 API
   *
   * 주요 역할:
   * - 필드 값 설정
   * - 필드 속성 동적 변경 (disabled, options, placeholder 등)
   * - 필드 메타 정보 업데이트
   *
   * 각 메서드를 useCallback으로 안정화하여 불필요한 재생성 방지
   */

  /**
   * 필드 값 설정
   * react-hook-form의 setValue를 래핑
   */
  const controllerSetValue = useCallback((fieldName: string, value: any) => {
    rhfSetValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [rhfSetValue]);

  /**
   * 필드 비활성화 상태 설정
   * 동적 메타 상태에 disabled 속성 업데이트
   *
   * @example
   * controller.setFieldDisabled('city', true); // city 필드 비활성화
   */
  const controllerSetFieldDisabled = useCallback((fieldName: string, disabled: boolean) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], disabled },
    }));
  }, []); // setDynamicFieldMeta는 setState이므로 안정적

  /**
   * 필드 읽기 전용 상태 설정
   * 동적 메타 상태에 readonly 속성 업데이트
   */
  const controllerSetFieldReadonly = useCallback((fieldName: string, readonly: boolean) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], readonly },
    }));
  }, []);

  /**
   * 필드 옵션 설정 (select, multiselect 등)
   * 동적 메타 상태에 options 배열 업데이트
   *
   * @example
   * controller.setFieldOptions('city', [
   *   { label: '서울', value: 'seoul' },
   *   { label: '부산', value: 'busan' }
   * ]);
   */
  const controllerSetFieldOptions = useCallback((fieldName: string, options: Option[]) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], options },
    }));
  }, []);

  /**
   * 필드 placeholder 설정
   * 동적 메타 상태에 placeholder 업데이트
   */
  const controllerSetFieldPlaceholder = useCallback((fieldName: string, placeholder: string) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], placeholder },
    }));
  }, []);

  /**
   * 필드 label 설정
   * 동적 메타 상태에 label 업데이트
   */
  const controllerSetFieldLabel = useCallback((fieldName: string, label: string) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], label },
    }));
  }, []);

  /**
   * 필드 메타 정보 일괄 업데이트
   * 여러 속성을 한 번에 업데이트할 때 사용
   *
   * @example
   * controller.updateFieldMeta('discount', {
   *   disabled: false,
   *   placeholder: '최대 30% 할인 가능',
   *   validation: { max: { value: 30, message: '30% 초과 불가' } }
   * });
   */
  const controllerUpdateFieldMeta = useCallback((fieldName: string, meta: Partial<FieldMeta>) => {
    setDynamicFieldMeta((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], ...meta },
    }));
  }, []);

  /**
   * 현재 필드 값 가져오기
   */
  const controllerGetValue = useCallback((fieldName: string) => {
    return rhfGetValues(fieldName);
  }, [rhfGetValues]);

  /**
   * 전체 폼 값 가져오기
   */
  const controllerGetValues = useCallback(() => {
    return rhfGetValues();
  }, [rhfGetValues]);

  /**
   * FieldController 객체 조합
   * 각 useCallback으로 안정화된 메서드들을 하나의 객체로 조합
   */
  const fieldController: FieldController = useMemo(
    () => ({
      setValue: controllerSetValue,
      setFieldDisabled: controllerSetFieldDisabled,
      setFieldReadonly: controllerSetFieldReadonly,
      setFieldOptions: controllerSetFieldOptions,
      setFieldPlaceholder: controllerSetFieldPlaceholder,
      setFieldLabel: controllerSetFieldLabel,
      updateFieldMeta: controllerUpdateFieldMeta,
      getValue: controllerGetValue,
      getValues: controllerGetValues,
    }),
    [
      controllerSetValue,
      controllerSetFieldDisabled,
      controllerSetFieldReadonly,
      controllerSetFieldOptions,
      controllerSetFieldPlaceholder,
      controllerSetFieldLabel,
      controllerUpdateFieldMeta,
      controllerGetValue,
      controllerGetValues,
    ]
  );

  /**
   * onDepends와 fieldController의 최신 값을 참조하기 위한 ref
   * watch 재구독 없이 최신 값을 사용하기 위함
   */
  const onDependsRef = useRef(onDepends);
  const fieldControllerRef = useRef(fieldController);

  /**
   * 초기 마운트 플래그
   * onDepends 초기 실행이 정확히 1회만 실행되도록 보장
   */
  const isInitialMountRef = useRef(true);

  /**
   * onDepends와 fieldController가 변경될 때마다 ref 업데이트
   * 이렇게 하면 watch 콜백에서 항상 최신 값을 참조할 수 있음
   */
  useEffect(() => {
    onDependsRef.current = onDepends;
    fieldControllerRef.current = fieldController;
  });

  /**
   * 필드 메타 정보 가져오기 (동적 메타 병합)
   * config의 정적 메타와 동적으로 변경된 메타를 병합하여 반환
   *
   * 병합 순서: config 정적 메타 <- 동적 메타 (동적 메타가 우선)
   *
   * @example
   * // config에서 city 필드의 disabled가 false였지만
   * // onDepends에서 setFieldDisabled('city', true) 호출 후
   * // getFieldMeta('city')는 disabled: true를 반환
   */
  const getFieldMeta = useCallback(
    (name: string): FieldMeta | undefined => {
      const staticMeta = config.fields.find((field) => field.name === name);
      if (!staticMeta) return undefined;

      // 동적 메타가 있으면 병합
      const dynamicMeta = dynamicFieldMeta[name];
      if (dynamicMeta) {
        return { ...staticMeta, ...dynamicMeta };
      }

      return staticMeta;
    },
    [config.fields, dynamicFieldMeta]
  );

  /**
   * onChange 콜백 처리 - 모든 필드 변경 감지
   * 필드 값이 변경될 때마다 onChange 핸들러 호출
   */
  useEffect(() => {
    if (!onChange) return;

    const subscription = watch((value, { name }) => {
      // name이 있으면 특정 필드가 변경된 것
      if (name) {
        onChange(name, value[name], value);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  /**
   * onDepends 처리 로직 (최적화됨)
   * 필드 간 의존성을 자동으로 관리
   *
   * 최적화 포인트:
   * - useRef로 onDepends와 fieldController의 최신 값 참조
   * - watch는 한 번만 구독하고 재구독 방지
   * - 의존성 배열에서 onDepends와 fieldController 제거
   *
   * 동작 방식:
   * 1. watch를 통해 모든 필드 변경 감지
   * 2. 변경된 필드에 의존하는 핸들러만 찾아서 실행
   * 3. ref를 통해 항상 최신 onDepends와 fieldController 사용
   *
   * @example
   * onDepends={{
   *   city: {
   *     dependencies: ['country'],
   *     handler: (values, controller) => {
   *       if (!values.country) {
   *         controller.setFieldDisabled('city', true);
   *         controller.setFieldOptions('city', []);
   *       } else {
   *         controller.setFieldDisabled('city', false);
   *         controller.setFieldOptions('city', getCities(values.country));
   *       }
   *     }
   *   }
   * }}
   */
  useEffect(() => {
    if (!onDepends) return;

    // 의존성 필드들의 값 변경 감시
    // ref를 통해 항상 최신 onDepends와 fieldController 참조
    const subscription = watch((values, { name }) => {
      // ref에서 최신 값 가져오기
      const currentOnDepends = onDependsRef.current;
      const currentFieldController = fieldControllerRef.current;

      // onDepends가 없거나 변경된 필드명이 없으면 무시
      if (!currentOnDepends || !name) return;

      // 변경된 필드에 의존하는 모든 핸들러 찾아서 실행
      Object.entries(currentOnDepends).forEach(([, handler]) => {
        // dependencies에 변경된 필드가 포함되어 있는지 확인
        if (handler.dependencies.includes(name)) {
          // 핸들러 실행: 현재 폼 값과 최신 필드 컨트롤러 전달
          handler.handler(values, currentFieldController);
        }
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]); // watch만 의존성으로 유지 - onDepends와 fieldController 제거됨

  /**
   * 초기 onDepends 실행 (최적화됨)
   * 컴포넌트 마운트 시 모든 onDepends 핸들러를 정확히 1회만 실행
   *
   * 최적화 포인트:
   * - isInitialMountRef 플래그로 마운트 시에만 실행 보장
   * - fieldController가 안정화되어 의존성에 안전하게 포함 가능
   * - eslint-disable 불필요
   *
   * 이유:
   * - 초기 렌더링 시에도 의존성에 따른 필드 상태를 설정해야 함
   * - 예: country가 초기값으로 설정되어 있으면 city 옵션도 초기화되어야 함
   */
  useEffect(() => {
    // 마운트 시에만 실행
    if (isInitialMountRef.current && onDepends) {
      isInitialMountRef.current = false;

      // 현재 폼의 모든 값 가져오기
      const currentValues = rhfGetValues();

      // 모든 onDepends 핸들러를 초기 실행
      Object.entries(onDepends).forEach(([, handler]) => {
        handler.handler(currentValues, fieldController);
      });
    }
  }, [onDepends, fieldController, rhfGetValues]); // 모든 의존성 명시 - fieldController 안정화됨

  // 자동 제출 처리
  // autoSubmit이 true면 값 변경 후 지정된 시간(기본 500ms) 후 자동 제출
  useEffect(() => {
    if (!config.autoSubmit) {
      return;
    }

    const delay: number = config.autoSubmitDelay ?? 500;
    let timer: ReturnType<typeof setTimeout>;

    const subscription = watch(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        formAPI.submit();
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [config.autoSubmit, config.autoSubmitDelay, formAPI, watch]);

  /**
   * formRef를 통해 외부에 formAPI 노출
   * useImperativeHandle을 사용하여 ref에 formAPI를 할당
   *
   * 이를 통해 SearchProvider 외부에서도 폼을 제어할 수 있음
   *
   * @example
   * const formRef = useRef<SearchFormAPI>(null);
   * <SearchProvider formRef={formRef} config={config}>
   *   ...
   * </SearchProvider>
   *
   * // 외부에서 폼 제어
   * formRef.current?.getValues();
   * formRef.current?.setValue('field', 'value');
   * formRef.current?.submit();
   */
  useImperativeHandle(formRef, () => formAPI, [formAPI]);

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