/**
 * useSearchForm 훅
 * 전체 폼 상태와 메서드에 접근
 */

import { useSearchContext } from '../context/SearchContext';
import { SearchFormAPI } from '../types/search.types';

/**
 * 검색 폼 전체를 관리하는 훅
 * @returns SearchFormAPI
 */
export const useSearchForm = (): SearchFormAPI => {
  const context = useSearchContext();
  return context.form;
};