import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { SearchConfig } from '../types/search.types';

interface BasicSearchExampleProps {
  onSubmit?: (data: any) => void;
}

export const BasicSearchExample: React.FC<BasicSearchExampleProps> = ({ onSubmit }) => {
  const config: SearchConfig = {
    id: 'basic-search',
    fields: [
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '검색어',
        placeholder: '검색어를 입력하세요',
        validation: {
          required: '검색어는 필수입니다',
          minLength: { value: 2, message: '최소 2자 이상 입력하세요' },
        },
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        placeholder: '선택하세요',
        options: [
          { label: '전체', value: '' },
          { label: '제품', value: 'product' },
          { label: '서비스', value: 'service' },
          { label: '고객', value: 'customer' },
        ],
      },
      {
        id: 'status',
        name: 'status',
        type: 'select',
        label: '상태',
        options: [
          { label: '전체', value: '' },
          { label: '활성', value: 'active' },
          { label: '비활성', value: 'inactive' },
        ],
      },
    ],
    onSubmit: async (data) => {
      console.log('제출된 데이터:', data);
      onSubmit?.(data);
    },
  };

  return (
    <SearchProvider config={config}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📋 기본 검색 폼</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Field name="keyword" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field name="category" />
            <Field name="status" />
          </div>
        </div>
        <SearchButtons />
      </div>
    </SearchProvider>
  );
};