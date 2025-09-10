import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { SearchConfig, FieldProps } from '../types/search.types';

// 커스텀 이메일 입력 컴포넌트
const CustomEmailInput: React.FC<FieldProps> = ({ value, onChange, error, meta }) => {
  const isValid = value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {meta?.label}
        {meta?.validation?.required && <span style={{ color: '#ef4444' }}> *</span>}
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

interface CustomLayoutExampleProps {
  onSubmit?: (data: any) => void;
}

export const CustomLayoutExample: React.FC<CustomLayoutExampleProps> = ({ onSubmit }) => {
  const config: SearchConfig = {
    id: 'custom-layout',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '이름',
        placeholder: '이름을 입력하세요',
        validation: {
          required: '이름은 필수입니다',
        },
      },
      {
        id: 'email',
        name: 'email',
        type: 'text',
        label: '이메일',
        placeholder: 'example@email.com',
        validation: {
          required: '이메일은 필수입니다',
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
          { label: '선택하세요', value: '' },
          { label: '개발팀', value: 'dev' },
          { label: '디자인팀', value: 'design' },
          { label: '마케팅팀', value: 'marketing' },
          { label: '영업팀', value: 'sales' },
        ],
      },
    ],
  };

  return (
    <SearchProvider 
      config={config}
      onSubmit={async (data) => {
        console.log('제출:', data);
        onSubmit?.(data);
      }}
    >
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '2rem', 
        borderRadius: '8px' 
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>👥 직원 검색 (커스텀 레이아웃)</h2>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field name="name" />
            <Field name="email" component={CustomEmailInput} />
          </div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          💡 팁: 이메일 입력 시 유효한 이메일이면 체크 표시가 나타납니다
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '6px'
        }}>
          <Field name="department" />
          <SearchButtons align="center" />
        </div>
      </div>
    </SearchProvider>
  );
};