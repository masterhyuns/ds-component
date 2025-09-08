/**
 * useArrayField 훅
 * 동적 배열 필드를 관리하기 위한 훅
 * 
 * 주요 역할:
 * 1. 동적으로 필드를 추가/제거할 수 있는 배열 형태의 폼 관리
 * 2. react-hook-form의 useFieldArray를 추상화하여 간단한 API 제공
 * 3. 항목 추가, 삭제, 이동, 삽입 등의 기능 제공
 * 4. 각 배열 항목은 고유한 ID를 가지고 있어 React key로 사용 가능
 * 
 * 사용 예시:
 * const products = useArrayField('products');
 * 
 * // 항목 추가
 * products.add({ name: '', price: 0 });
 * 
 * // 항목 렌더링
 * products.items.map((item, index) => (
 *   <div key={item.id}>
 *     <Field name={`products.${index}.name`} />
 *     <Field name={`products.${index}.price`} />
 *     <button onClick={() => products.remove(index)}>삭제</button>
 *   </div>
 * ))
 */

import { useFieldArray } from 'react-hook-form';
import { useSearchContext } from '../context/SearchContext';
import { ArrayFieldAPI } from '../types/search.types';
import { useCallback } from 'react';

/**
 * 배열 필드를 관리하는 훅
 * SearchProvider 내부에서만 사용 가능
 * 
 * @param name - 배열 필드 이름 (예: 'products', 'users', 'items')
 * @returns ArrayFieldAPI - 배열 관리를 위한 메서드와 현재 항목 목록
 */
export const useArrayField = (name: string): ArrayFieldAPI => {
  const context = useSearchContext();
  
  // react-hook-form의 useFieldArray 사용 (내부적으로)
  // useFieldArray는 react-hook-form에서 동적 배열 필드를 관리하는 훅
  // 반환값:
  // - fields: 현재 배열 항목들 (각 항목은 id를 포함)
  // - append: 배열 끝에 항목 추가
  // - remove: 특정 인덱스 항목 제거 (또는 전체 제거)
  // - move: 항목 위치 이동
  // - insert: 특정 위치에 항목 삽입
  const arrayMethods = useFieldArray({
    name,                               // 배열 필드 경로
    control: context._internal.control, // react-hook-form 컨트롤 객체
  });
  
  // 항목 추가 메서드
  // 배열 끝에 새 항목 추가
  // value가 제공되지 않으면 빈 객체 {} 추가
  const add = useCallback((value?: any) => {
    arrayMethods.append(value || {});
  }, [arrayMethods]);
  
  // 항목 제거 메서드
  // 특정 인덱스의 항목 제거
  const remove = useCallback((index: number) => {
    arrayMethods.remove(index);
  }, [arrayMethods]);
  
  // 항목 이동 메서드
  // from 인덱스의 항목을 to 인덱스로 이동
  // 드래그 앤 드롭 기능 구현 시 유용
  const move = useCallback((from: number, to: number) => {
    arrayMethods.move(from, to);
  }, [arrayMethods]);
  
  // 항목 삽입 메서드
  // 특정 인덱스 위치에 새 항목 삽입
  // 기존 항목들은 뒤로 밀림
  const insert = useCallback((index: number, value?: any) => {
    arrayMethods.insert(index, value || {});
  }, [arrayMethods]);
  
  // 전체 항목 삭제 메서드
  // remove()를 인덱스 없이 호출하면 모든 항목 제거
  const clear = useCallback(() => {
    arrayMethods.remove();
  }, [arrayMethods]);
  
  // ArrayFieldAPI 반환
  // 사용자에게 제공할 깔끔한 API
  return {
    items: arrayMethods.fields as any[],  // 현재 배열 항목 목록 (각 항목은 id 포함)
    add,                                   // 항목 추가
    remove,                                // 항목 제거
    move,                                  // 항목 순서 변경
    insert,                                // 특정 위치에 항목 삽입
    clear,                                 // 모든 항목 제거
  };
};