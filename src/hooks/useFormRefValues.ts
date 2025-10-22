/**
 * useFormRefValues 훅
 * formRef를 통해 폼 값을 실시간으로 구독하는 훅
 *
 * 이 훅은 SearchProvider 외부에서 폼 값을 실시간으로 렌더링하고 싶을 때 사용합니다.
 * 초기값부터 모든 변경사항을 자동으로 감지하여 state를 업데이트합니다.
 */

import { useEffect, useState, RefObject } from 'react';
import type { SearchFormAPI, FieldValues } from '../types/search.types';

/**
 * formRef를 통해 폼 값을 실시간으로 구독하는 훅
 *
 * SearchProvider 외부에서 폼 값을 실시간으로 렌더링하고 싶을 때 사용
 * onChange와 달리 초기값부터 자동으로 받으며, 모든 변경사항을 추적
 *
 * @param formRef - SearchProvider에 전달한 formRef
 * @returns 현재 폼 값 (실시간 업데이트)
 *
 * @example
 * const formRef = useRef<SearchFormAPI>(null);
 * const formValues = useFormRefValues(formRef);
 * // formValues에 실시간 폼 값이 들어있음
 *
 * @example
 * // 타입 지정
 * interface SearchFormValues {
 *   keyword: string;
 *   category: string;
 * }
 * const formValues = useFormRefValues<SearchFormValues>(formRef);
 */
export const useFormRefValues = <T extends FieldValues = FieldValues>(
  formRef: RefObject<SearchFormAPI | null>
): T => {
  // 폼 값을 저장할 state (초기값은 빈 객체)
  const [values, setValues] = useState<T>({} as T);

  useEffect(() => {
    // formRef가 아직 할당되지 않았으면 대기
    if (!formRef.current?.subscribe) {
      return;
    }

    /**
     * formAPI.subscribe를 사용하여 폼 값 구독
     *
     * subscribe의 동작:
     * 1. 즉시 현재 폼 값으로 콜백 호출 (초기값 emit)
     * 2. 이후 값이 변경될 때마다 콜백 호출
     * 3. unsubscribe 함수 반환
     */
    const unsubscribe = formRef.current.subscribe((newValues) => {
      // 폼 값이 변경될 때마다 state 업데이트
      setValues(newValues as T);
    });

    // cleanup: 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, [formRef]);

  return values;
};
