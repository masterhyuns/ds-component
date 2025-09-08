/**
 * useArrayField 훅
 * 배열 필드를 관리하는 훅
 */

import { useFieldArray } from 'react-hook-form';
import { useSearchContext } from '../context/SearchContext';
import { ArrayFieldAPI } from '../types/search.types';
import { useCallback } from 'react';

/**
 * 배열 필드를 관리하는 훅
 * @param name - 배열 필드 이름
 * @returns ArrayFieldAPI
 */
export const useArrayField = (name: string): ArrayFieldAPI => {
  const context = useSearchContext();
  
  // react-hook-form의 useFieldArray 사용 (내부적으로)
  const arrayMethods = useFieldArray({
    name,
    control: context._internal.control,
  });
  
  // 추가 메서드
  const add = useCallback((value?: any) => {
    arrayMethods.append(value || {});
  }, [arrayMethods]);
  
  const remove = useCallback((index: number) => {
    arrayMethods.remove(index);
  }, [arrayMethods]);
  
  const move = useCallback((from: number, to: number) => {
    arrayMethods.move(from, to);
  }, [arrayMethods]);
  
  const insert = useCallback((index: number, value?: any) => {
    arrayMethods.insert(index, value || {});
  }, [arrayMethods]);
  
  const clear = useCallback(() => {
    arrayMethods.remove();
  }, [arrayMethods]);
  
  // ArrayFieldAPI 반환
  return {
    items: arrayMethods.fields as any[],
    add,
    remove,
    move,
    insert,
    clear,
  };
};