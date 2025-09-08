/**
 * useFieldMeta 훅
 * 필드의 메타 정보에 접근
 */

import { useSearchContext } from '../context/SearchContext';
import { FieldMeta } from '../types/search.types';

/**
 * 필드의 메타 정보를 가져오는 훅
 * @param name - 필드 이름
 * @returns FieldMeta | undefined
 */
export const useFieldMeta = (name: string): FieldMeta | undefined => {
  const context = useSearchContext();
  return context.getFieldMeta(name);
};