/**
 * withFieldProps HOC 모듈 메인 엔트리 포인트
 * 
 * @description
 * withFieldProps HOC와 관련된 모든 공개 API를 export하는 중앙 집중식 모듈
 * 사용자는 이 파일을 통해 필요한 기능들을 import할 수 있음
 * 
 * 제공되는 주요 기능:
 * - withFieldProps: 메인 HOC 함수
 * - FIELD_PROPS_MAPPING: 필드 타입별 매핑 설정
 * - 유틸리티 함수들: 매핑 관리
 * - 타입 정의들: TypeScript 지원
 * 
 * @author Enterprise Platform Technical Lead
 * @since 2025-09-17
 * 
 * @example
 * ```typescript
 * // 기본 사용법
 * import { withFieldProps } from '@/hoc/withFieldProps';
 * 
 * // 전체 import
 * import { 
 *   withFieldProps, 
 *   FIELD_PROPS_MAPPING, 
 *   registerFieldMapping
 * } from '@/hoc/withFieldProps';
 * ```
 */

// ========================================
// 메인 HOC 및 팩토리 함수
// ========================================

export { 
  withFieldProps,
  createFieldWrapper,
  wrapMultipleComponents
} from './withFieldProps';

// ========================================
// 매핑 설정 및 관련 함수
// ========================================

export { 
  FIELD_PROPS_MAPPING,
  getFieldTypeMapping,
  getSupportedFieldTypes
} from './mapping';

// ========================================
// 유틸리티 함수들
// ========================================

export { 
  mapStandardPropsToComponent,
  extractUnmappedProps,
  registerFieldMapping,
  getFieldMapping
} from './utils';

// ========================================
// 타입 정의 Re-export
// ========================================

export type { 
  FieldRenderProps,
  FieldPropsMapping,
  SearchFieldType,
  FieldPropsMappingConfig
} from '../../types';

// withFieldProps HOC 모듈 v1.0.0