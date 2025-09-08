/**
 * useSearchForm 훅
 * 전체 폼 상태와 메서드에 접근하기 위한 훅
 * 
 * 주요 역할:
 * 1. 폼 전체 제출, 리셋 등의 액션 제공
 * 2. 폼 전체 상태 (isSubmitting, isDirty, isValid 등) 제공
 * 3. 모든 필드의 값을 한번에 가져오거나 설정
 * 4. 폼 전체 유효성 검사 수행
 * 
 * 사용 예시:
 * const form = useSearchForm();
 * 
 * // 폼 제출
 * await form.submit();
 * 
 * // 모든 값 가져오기
 * const values = form.getValues();
 * 
 * // 여러 필드 값 한번에 설정
 * form.setValues({ name: 'John', age: 30 });
 * 
 * // 폼 상태 확인
 * if (form.isValid && !form.isSubmitting) { ... }
 */

import { useSearchContext } from '../context/SearchContext';
import { SearchFormAPI } from '../types/search.types';

/**
 * 검색 폼 전체를 관리하는 훅
 * SearchProvider 내부에서만 사용 가능
 * 
 * @returns SearchFormAPI - 폼 관리를 위한 메서드와 상태를 포함한 객체
 * 
 * 반환되는 API:
 * - submit(): 폼 제출 (onSubmit 콜백 실행)
 * - reset(): 폼을 초기값으로 리셋
 * - getValues(): 모든 필드 값 가져오기
 * - getValue(name): 특정 필드 값 가져오기
 * - setValues(values): 여러 필드 값 설정
 * - setValue(name, value): 특정 필드 값 설정
 * - validate(): 전체 폼 유효성 검사
 * - isSubmitting: 제출 중인지 여부
 * - isValidating: 유효성 검사 중인지 여부
 * - isDirty: 폼이 수정되었는지 여부
 * - isValid: 폼이 유효한지 여부
 * - errors: 필드별 에러 메시지
 */
export const useSearchForm = (): SearchFormAPI => {
  const context = useSearchContext();
  // SearchProvider에서 제공하는 추상화된 폼 API 반환
  // react-hook-form의 복잡한 구조를 숨기고 간단한 인터페이스 제공
  return context.form;
};