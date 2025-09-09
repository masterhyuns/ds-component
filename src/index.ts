/**
 * SD Search Box - 헤드리스 검색 컴포넌트 라이브러리
 * react-hook-form을 완전히 추상화한 헤드리스 구조
 */

// Context & Provider
export { SearchProvider, useSearchContext } from './context/SearchContext';

// 컴포넌트
export { Field } from './components/Field';
export { SearchButtons } from './components/SearchButtons';
export { TextField } from './components/fields/TextField';
export { SelectField } from './components/fields/SelectField';

// 훅
export {
  useField,
  useSearchForm,
  useFieldValue,
  useArrayField,
  useFieldMeta,
} from './hooks';

// 타입 - 새로운 API
export type {
  FieldValues,
  SearchFieldType,
  Option,
  ValidationRules,
  FieldMeta,
  FieldAPI,
  FieldProps,
  ArrayFieldAPI,
  SearchConfig,
  SearchProviderProps,
  FieldComponentProps,
  SearchFormAPI,
  SearchContextValue,
} from './types/search.types';

// 레거시 컴포넌트 (deprecated)
export { SearchBox } from './components/SearchBox';
export { useSearchBox } from './hooks/useSearchBox';
export type { UseSearchBoxReturn } from './hooks/useSearchBox';

// 레거시 타입 (deprecated)
export type {
  SearchBoxProps,
  SearchResult,
} from './types/types';