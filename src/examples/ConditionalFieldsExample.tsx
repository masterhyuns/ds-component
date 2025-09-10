import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useFieldValue } from '../hooks';
import { SearchConfig } from '../types/search.types';

// 조건부 필드 상태 표시 컴포넌트
const SearchTypeIndicator = () => {
  const type = useFieldValue('searchType');
  return (
    <div style={{ 
      padding: '0.75rem', 
      backgroundColor: type === 'advanced' ? '#fef3c7' : '#dbeafe',
      borderRadius: '6px',
      marginBottom: '1rem',
      fontSize: '0.875rem',
      color: '#1f2937'
    }}>
      {type === 'advanced' ? '🔍 상세 검색 모드' : '⚡ 빠른 검색 모드'}
    </div>
  );
};

interface ConditionalFieldsExampleProps {
  onSubmit?: (data: any) => void;
}

export const ConditionalFieldsExample: React.FC<ConditionalFieldsExampleProps> = ({ onSubmit }) => {
  const config: SearchConfig = {
    id: 'conditional-search',
    fields: [
      {
        id: 'searchType',
        name: 'searchType',
        type: 'select',
        label: '검색 유형',
        options: [
          { label: '빠른 검색', value: 'basic' },
          { label: '상세 검색', value: 'advanced' },
        ],
        defaultValue: 'basic',
      },
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '검색어',
        placeholder: '검색어를 입력하세요',
        validation: {
          required: '검색어는 필수입니다',
        },
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        options: [
          { label: '전체', value: 'all' },
          { label: '제품', value: 'product' },
          { label: '서비스', value: 'service' },
        ],
        showWhen: (values) => values.searchType === 'advanced',
      },
      {
        id: 'priceRange',
        name: 'priceRange',
        type: 'text',
        label: '가격 범위',
        placeholder: '예: 10000-50000',
        showWhen: (values) => values.searchType === 'advanced',
      },
      {
        id: 'dateRange',
        name: 'dateRange',
        type: 'text',
        label: '날짜 범위',
        placeholder: 'YYYY-MM-DD ~ YYYY-MM-DD',
        showWhen: (values) => values.searchType === 'advanced',
      },
    ],
  };

  return (
    <SearchProvider 
      config={config}
      onSubmit={async (data) => {
        console.log('검색:', data);
        onSubmit?.(data);
      }}
    >
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>🎯 조건부 필드</h2>
        <
          Field name="searchType" />
        <SearchTypeIndicator />
        <Field name="keyword" />
        <Field name="category" />
        <Field name="priceRange" />
        <Field name="dateRange" />
        <SearchButtons />
      </div>
    </SearchProvider>
  );
};