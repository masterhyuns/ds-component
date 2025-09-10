import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useArrayField } from '../hooks';
import { SearchConfig } from '../types/search.types';

// 배열 필드 예제 컴포넌트
const ProductList = () => {
  const products = useArrayField('products');
  
  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>제품 목록</h3>
      {products.items.map((item, index) => (
        <div key={item.id} style={{ 
          padding: '1rem', 
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <Field name={`products.${index}.name`} />
            <Field name={`products.${index}.price`} />
            <button
              onClick={() => products.remove(index)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                height: 'fit-content'
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={() => products.add({ name: '', price: '' })}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        + 제품 추가
      </button>
    </div>
  );
};

interface ArrayFieldsExampleProps {
  onSubmit?: (data: any) => void;
}

export const ArrayFieldsExample: React.FC<ArrayFieldsExampleProps> = ({ onSubmit }) => {
  const config: SearchConfig = {
    id: 'array-fields',
    fields: Array.from({ length: 10 }, (_, i) => [
      {
        id: `products.${i}.name`,
        name: `products.${i}.name`,
        type: 'text' as const,
        label: '제품명',
        placeholder: '제품명을 입력하세요',
      },
      {
        id: `products.${i}.price`,
        name: `products.${i}.price`,
        type: 'text' as const,
        label: '가격',
        placeholder: '가격을 입력하세요',
      },
    ]).flat(),
    defaultValues: {
      products: [{ name: '샘플 제품', price: '10000' }],
    },
  };

  return (
    <SearchProvider 
      config={config}
      onSubmit={async (data) => {
        console.log('제품 목록:', data);
        onSubmit?.(data);
      }}
    >
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📦 동적 배열 필드</h2>
        <ProductList />
        <SearchButtons submitText="제품 목록 저장" />
      </div>
    </SearchProvider>
  );
};