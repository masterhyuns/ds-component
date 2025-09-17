import { forwardRef, useMemo, ElementType } from 'react';
import {
  GridProps,
  GridItemProps,
  SpacingSize,
  ResponsiveValue
} from '../types';
import styles from './Grid.module.scss';

// 브레이크포인트는 SCSS에서 직접 정의됨

/**
 * 기본 간격 설정
 * rem 단위 기반 간격 스케일
 */
const DEFAULT_SPACING: Record<string, string> = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem'       // 32px
};

// DEFAULT_THEME은 필요시 후에 추가할 수 있음

// resolveResponsiveValue는 향후 클라이언트 사이드에서 사용할 수 있음

/**
 * 간격 값을 CSS 값으로 변환
 */
const resolveSpacing = (spacing: SpacingSize): string => {
  if (typeof spacing === 'string' && DEFAULT_SPACING[spacing]) {
    return DEFAULT_SPACING[spacing];
  }
  if (typeof spacing === 'number') {
    return `${spacing}px`;
  }
  return spacing as string;
};

/**
 * CSS 커스텀 속성을 생성하는 유틸리티
 */
const generateCSSProperties = (prefix: string, value: ResponsiveValue<any>, resolver: (val: any) => string) => {
  const properties: Record<string, string> = {};
  
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // 반응형 값인 경우 각 브레이크포인트별로 CSS 변수 생성
    Object.entries(value).forEach(([bp, val]) => {
      if (val !== undefined) {
        properties[`--${prefix}-${bp}`] = resolver(val);
      }
    });
  } else {
    // 단일 값인 경우 기본 CSS 변수 생성
    if (value !== undefined) {
      properties[`--${prefix}`] = resolver(value);
    }
  }
  
  return properties;
};

/**
 * Grid 컨테이너 컴포넌트
 * CSS Grid를 기반으로 한 2차원 레이아웃 시스템
 */
export const Grid = forwardRef<HTMLElement, GridProps>(({
  children,
  as = 'div',
  columns = 12,
  gap = 'md',
  rowGap,
  columnGap,
  alignItems,
  justifyContent,
  equalHeight = false,
  maxWidth,
  padding,
  className = '',
  style = {},
  autoFit = false,
  minColumnWidth = '200px',
  maxColumnWidth,
  ...props
}, ref) => {
  const cssProperties = useMemo(() => {
    const properties: Record<string, string> = {};
    
    // 컬럼 수 설정
    Object.assign(properties, generateCSSProperties('grid-columns', columns, (val) => val.toString()));
    
    // 간격 설정
    if (rowGap !== undefined) {
      Object.assign(properties, generateCSSProperties('grid-row-gap', rowGap, resolveSpacing));
    } else {
      Object.assign(properties, generateCSSProperties('grid-gap', gap, resolveSpacing));
    }
    
    if (columnGap !== undefined) {
      Object.assign(properties, generateCSSProperties('grid-column-gap', columnGap, resolveSpacing));
    } else if (rowGap !== undefined) {
      // rowGap이 있고 columnGap이 없으면 gap을 columnGap으로 사용
      Object.assign(properties, generateCSSProperties('grid-column-gap', gap, resolveSpacing));
    }
    
    // 정렬 설정
    if (alignItems) {
      Object.assign(properties, generateCSSProperties('grid-align-items', alignItems, (val) => val));
    }
    
    if (justifyContent) {
      Object.assign(properties, generateCSSProperties('grid-justify-content', justifyContent, (val) => val));
    }
    
    // 자동 크기 조정 설정
    if (autoFit) {
      Object.assign(properties, generateCSSProperties('grid-auto-fit', autoFit, (val) => val ? 'true' : 'false'));
    }
    
    if (minColumnWidth) {
      Object.assign(properties, generateCSSProperties('grid-min-column-width', minColumnWidth, (val) => 
        typeof val === 'number' ? `${val}px` : val
      ));
    }
    
    if (maxColumnWidth) {
      Object.assign(properties, generateCSSProperties('grid-max-column-width', maxColumnWidth, (val) => 
        typeof val === 'number' ? `${val}px` : val
      ));
    }
    
    // 최대 너비 설정
    if (maxWidth) {
      properties['--grid-max-width'] = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    }
    
    // 패딩 설정
    if (padding) {
      Object.assign(properties, generateCSSProperties('grid-padding', padding, resolveSpacing));
    }
    
    return properties;
  }, [columns, gap, rowGap, columnGap, alignItems, justifyContent, autoFit, minColumnWidth, maxColumnWidth, maxWidth, padding]);

  const combinedClassName = useMemo(() => {
    const classes = [styles.grid];
    
    if (equalHeight) {
      classes.push(styles['grid--equal-height']);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [equalHeight, className]);

  const combinedStyle = useMemo(() => ({
    ...cssProperties,
    ...style
  }), [cssProperties, style]);

  const Component = as as ElementType;

  return (
    <Component
      ref={ref}
      className={combinedClassName}
      style={combinedStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';

/**
 * Grid 아이템 컴포넌트
 * Grid 컨테이너 내부의 개별 요소 배치를 담당
 */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(({
  children,
  as = 'div',
  colSpan = 1,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  alignSelf,
  justifySelf,
  order,
  padding,
  margin,
  className = '',
  style = {},
  hidden = false,
  minHeight,
  maxHeight,
  ...props
}, ref) => {
  const cssProperties = useMemo(() => {
    const properties: Record<string, string> = {};
    
    // 컬럼 span 설정
    Object.assign(properties, generateCSSProperties('grid-col-span', colSpan, (val) => val.toString()));
    
    // 행 span 설정
    if (rowSpan) {
      Object.assign(properties, generateCSSProperties('grid-row-span', rowSpan, (val) => val.toString()));
    }
    
    // 시작/끝 위치 설정
    if (colStart) {
      Object.assign(properties, generateCSSProperties('grid-col-start', colStart, (val) => val.toString()));
    }
    
    if (colEnd) {
      Object.assign(properties, generateCSSProperties('grid-col-end', colEnd, (val) => val.toString()));
    }
    
    if (rowStart) {
      Object.assign(properties, generateCSSProperties('grid-row-start', rowStart, (val) => val.toString()));
    }
    
    if (rowEnd) {
      Object.assign(properties, generateCSSProperties('grid-row-end', rowEnd, (val) => val.toString()));
    }
    
    // 정렬 설정
    if (alignSelf) {
      Object.assign(properties, generateCSSProperties('grid-align-self', alignSelf, (val) => val));
    }
    
    if (justifySelf) {
      Object.assign(properties, generateCSSProperties('grid-justify-self', justifySelf, (val) => val));
    }
    
    // 순서 설정
    if (order) {
      Object.assign(properties, generateCSSProperties('grid-order', order, (val) => val.toString()));
    }
    
    // 패딩 설정
    if (padding) {
      Object.assign(properties, generateCSSProperties('grid-item-padding', padding, resolveSpacing));
    }
    
    // 마진 설정
    if (margin) {
      Object.assign(properties, generateCSSProperties('grid-item-margin', margin, resolveSpacing));
    }
    
    // 높이 설정
    if (minHeight) {
      Object.assign(properties, generateCSSProperties('grid-item-min-height', minHeight, (val) => 
        typeof val === 'number' ? `${val}px` : val
      ));
    }
    
    if (maxHeight) {
      Object.assign(properties, generateCSSProperties('grid-item-max-height', maxHeight, (val) => 
        typeof val === 'number' ? `${val}px` : val
      ));
    }
    
    // 숨김 설정
    if (hidden) {
      Object.assign(properties, generateCSSProperties('grid-item-hidden', hidden, (val) => val ? 'true' : 'false'));
    }
    
    return properties;
  }, [colSpan, rowSpan, colStart, colEnd, rowStart, rowEnd, alignSelf, justifySelf, order, padding, margin, minHeight, maxHeight, hidden]);

  const combinedClassName = useMemo(() => {
    const classes = [styles.gridItem];
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [className]);

  const combinedStyle = useMemo(() => ({
    ...cssProperties,
    ...style
  }), [cssProperties, style]);

  // 숨김 조건 확인
  const shouldHide = useMemo(() => {
    if (typeof hidden === 'object' && hidden !== null) {
      // 반응형 숨김 처리는 CSS에서 담당
      return false;
    }
    return hidden as boolean;
  }, [hidden]);

  if (shouldHide) {
    return null;
  }

  const Component = as as ElementType;

  return (
    <Component
      ref={ref}
      className={combinedClassName}
      style={combinedStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

GridItem.displayName = 'GridItem';

// 기본 export
export default Grid;