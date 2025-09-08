/**
 * 새로운 헤드리스 검색 컴포넌트 스토리북
 * react-hook-form 완전 추상화
 */

import type { Meta } from '@storybook/react';
import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useField, useFieldValue, useArrayField } from '../hooks';
import { SearchConfig, FieldProps } from '../types/search.types';

const meta: Meta = {
  title: 'Headless/SearchProvider',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * 기본 사용법 - 메타 정의 기반 자동 렌더링
 */
export const BasicUsage = () => {
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
    ],
    onSubmit: async (data) => {
      console.log('제출된 데이터:', data);
      alert(JSON.stringify(data, null, 2));
    },
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 600 }}>
        <h2>기본 사용법</h2>
        <Field name="keyword" />
        <Field name="category" />
        <SearchButtons />
      </div>
    </SearchProvider>
  );
};

/**
 * 자유로운 레이아웃 - 디자이너가 원하는 대로 배치
 */
export const CustomLayout = () => {
  const config: SearchConfig = {
    id: 'custom-layout',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '이름',
        placeholder: '이름 입력',
      },
      {
        id: 'email',
        name: 'email',
        type: 'text',
        label: '이메일',
        placeholder: 'example@email.com',
        validation: {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다',
          },
        },
      },
      {
        id: 'department',
        name: 'department',
        type: 'select',
        label: '부서',
        options: [
          { label: '개발팀', value: 'dev' },
          { label: '디자인팀', value: 'design' },
          { label: '마케팅팀', value: 'marketing' },
        ],
      },
    ],
    onSubmit: async (data) => {
      console.log('제출:', data);
    },
  };

  return (
    <SearchProvider config={config}>
      <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>직원 검색</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field name="name" />
          <Field name="email" />
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px',
          margin: '1rem 0' 
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            부서를 선택하면 해당 부서 직원만 검색됩니다
          </p>
        </div>
        
        <Field name="department" />
        
        <SearchButtons align="center" />
      </div>
    </SearchProvider>
  );
};

/**
 * 커스텀 필드 컴포넌트 - react-hook-form 지식 불필요
 */
const CustomEmailInput: React.FC<FieldProps> = ({ 
  value, 
  onChange, 
  error, 
  meta 
}) => {
  const isValid = value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {meta?.label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={meta?.placeholder}
          style={{
            width: '100%',
            padding: '0.5rem',
            paddingRight: '2rem',
            border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '4px',
          }}
        />
        {isValid && (
          <span style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#10b981',
          }}>
            ✓
          </span>
        )}
      </div>
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export const CustomComponents = () => {
  const config: SearchConfig = {
    id: 'custom-components',
    fields: [
      {
        id: 'email',
        name: 'email',
        type: 'text',
        label: '이메일 주소',
        placeholder: 'your@email.com',
        validation: {
          required: '이메일은 필수입니다',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다',
          },
        },
      },
      {
        id: 'password',
        name: 'password',
        type: 'text',
        label: '비밀번호',
        validation: {
          required: '비밀번호는 필수입니다',
          minLength: { value: 8, message: '최소 8자 이상이어야 합니다' },
        },
      },
    ],
    onSubmit: async (data) => {
      console.log('로그인:', data);
    },
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 400 }}>
        <h2>커스텀 컴포넌트 예제</h2>
        
        {/* 커스텀 컴포넌트 사용 */}
        <Field name="email" component={CustomEmailInput} />
        
        {/* render prop 패턴 */}
        <Field name="password">
          {(field) => (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                {field.meta?.label}
              </label>
              <input
                type="password"
                value={field.value || ''}
                onChange={(e) => field.setValue(e.target.value)}
                onBlur={field.onBlur}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: `1px solid ${field.error ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '4px',
                }}
              />
              {field.error && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                  {field.error}
                </span>
              )}
            </div>
          )}
        </Field>
        
        <SearchButtons submitText="로그인" showReset={false} />
      </div>
    </SearchProvider>
  );
};

/**
 * useField 훅 직접 사용 - 완전한 제어
 */
const CustomFieldWithHook = ({ fieldName }: { fieldName: string }) => {
  const field = useField(fieldName);
  
  return (
    <div style={{ 
      padding: '1rem', 
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <h4>useField 훅 사용</h4>
      <p>필드: {fieldName}</p>
      <p>값: {field.value || '(비어있음)'}</p>
      <p>더티: {field.isDirty ? '예' : '아니오'}</p>
      <p>터치: {field.isTouched ? '예' : '아니오'}</p>
      
      <input
        value={field.value || ''}
        onChange={(e) => field.setValue(e.target.value)}
        onBlur={field.onBlur}
        placeholder={field.meta?.placeholder}
        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
      />
      
      {field.error && (
        <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>
          에러: {field.error}
        </p>
      )}
    </div>
  );
};

export const DirectHookUsage = () => {
  const config: SearchConfig = {
    id: 'hook-usage',
    fields: [
      {
        id: 'field1',
        name: 'field1',
        type: 'text',
        placeholder: '필드 1',
        validation: {
          required: '필수 필드입니다',
        },
      },
      {
        id: 'field2',
        name: 'field2',
        type: 'text',
        placeholder: '필드 2',
      },
    ],
    onSubmit: async (data) => {
      console.log('제출:', data);
    },
  };

  return (
    <SearchProvider config={config}>
      <div>
        <h2>useField 훅 직접 사용</h2>
        <CustomFieldWithHook fieldName="field1" />
        <CustomFieldWithHook fieldName="field2" />
        <SearchButtons />
      </div>
    </SearchProvider>
  );
};

/**
 * 배열 필드 관리 - useArrayField 훅
 */
const ProductList = () => {
  const products = useArrayField('products');
  
  return (
    <div>
      <h3>제품 목록</h3>
      {products.items.map((item, index) => (
        <div key={item.id} style={{ 
          padding: '1rem', 
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          marginBottom: '0.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem' }}>
            <Field name={`products.${index}.name`} />
            <Field name={`products.${index}.price`} />
            <button
              onClick={() => products.remove(index)}
              style={{
                padding: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={() => products.add({ name: '', price: 0 })}
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
        제품 추가
      </button>
    </div>
  );
};

export const ArrayFields = () => {
  const config: SearchConfig = {
    id: 'array-fields',
    fields: [
      { id: 'products.0.name', name: 'products.0.name', type: 'text', label: '제품명' },
      { id: 'products.0.price', name: 'products.0.price', type: 'text', label: '가격' },
    ],
    defaultValues: {
      products: [{ name: '제품 1', price: 10000 }],
    },
    onSubmit: async (data) => {
      console.log('제품 목록:', data);
    },
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 600 }}>
        <h2>배열 필드 예제</h2>
        <ProductList />
        <SearchButtons submitText="저장" />
      </div>
    </SearchProvider>
  );
};

/**
 * 조건부 필드 - 다른 필드 값에 따라 표시/숨김
 */
export const ConditionalFields = () => {
  const config: SearchConfig = {
    id: 'conditional',
    fields: [
      {
        id: 'type',
        name: 'type',
        type: 'select',
        label: '검색 유형',
        options: [
          { label: '기본', value: 'basic' },
          { label: '상세', value: 'advanced' },
        ],
        defaultValue: 'basic',
      },
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '검색어',
        placeholder: '검색어 입력',
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
        showWhen: (values) => values.type === 'advanced',
      },
      {
        id: 'dateRange',
        name: 'dateRange',
        type: 'text',
        label: '날짜 범위',
        placeholder: 'YYYY-MM-DD ~ YYYY-MM-DD',
        showWhen: (values) => values.type === 'advanced',
      },
    ],
    onSubmit: async (data) => {
      console.log('검색:', data);
    },
  };

  // 타입 값 감시 컴포넌트
  const TypeIndicator = () => {
    const type = useFieldValue('type');
    return (
      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: type === 'advanced' ? '#fef3c7' : '#dbeafe',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        현재 모드: {type === 'advanced' ? '상세 검색' : '기본 검색'}
      </div>
    );
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 500 }}>
        <h2>조건부 필드</h2>
        <Field name="type" />
        <TypeIndicator />
        <Field name="keyword" />
        <Field name="category" />
        <Field name="dateRange" />
        <SearchButtons />
      </div>
    </SearchProvider>
  );
};