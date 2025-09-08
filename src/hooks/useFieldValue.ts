/**
 * useFieldValue 훅
 * 특정 필드의 값만 구독
 */

import { useSearchContext } from '../context/SearchContext';
import { useWatch } from 'react-hook-form';

/**
 * 특정 필드의 값만 구독하는 훅
 * @param name - 필드 이름
 * @returns 필드 값
 */
export const useFieldValue = <T = any>(name: string): T => {
  const context = useSearchContext();
  
  // react-hook-form의 useWatch 사용
  const value = useWatch({
    name,
    control: context._internal.control,
  });
  
  return value as T;
};