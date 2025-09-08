
import { useState } from 'react';
import { SearchProvider } from './context/SearchContext';
import { Field } from './components/Field';
import { SearchButtons } from './components/SearchButtons';
import { useFieldValue, useArrayField } from './hooks';
import { SearchConfig, FieldProps } from './types/search.types';
import './App.css';

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

function App() {
  const [activeExample, setActiveExample] = useState<'basic' | 'custom' | 'conditional' | 'array'>('basic');
  const [submitData, setSubmitData] = useState<any>(null);

  // 기본 검색 설정
  const basicConfig: SearchConfig = {
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
      setSubmitData(data);
    },
  };

  // 커스텀 레이아웃 설정
  const customConfig: SearchConfig = {
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
    onSubmit: async (data) => {
      console.log('제출:', data);
      setSubmitData(data);
    },
  };

  // 조건부 필드 설정
  const conditionalConfig: SearchConfig = {
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
    onSubmit: async (data) => {
      console.log('검색:', data);
      setSubmitData(data);
    },
  };

  // 배열 필드 설정
  const arrayConfig: SearchConfig = {
    id: 'array-fields',
    fields: Array.from({ length: 10 }, (_, i) => [
      {
        id: `products.${i}.name`,
        name: `products.${i}.name`,
        type: 'text',
        label: '제품명',
        placeholder: '제품명을 입력하세요',
      },
      {
        id: `products.${i}.price`,
        name: `products.${i}.price`,
        type: 'text',
        label: '가격',
        placeholder: '가격을 입력하세요',
      },
    ]).flat(),
    defaultValues: {
      products: [{ name: '샘플 제품', price: '10000' }],
    },
    onSubmit: async (data) => {
      console.log('제품 목록:', data);
      setSubmitData(data);
    },
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>🔍 SD Search Box - 헤드리스 검색 컴포넌트</h1>
      
      {/* 탭 메뉴 */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0'
      }}>
        {(['basic', 'custom', 'conditional', 'array'] as const).map((example) => (
          <button
            key={example}
            onClick={() => {
              setActiveExample(example);
              setSubmitData(null);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeExample === example ? '#3b82f6' : 'transparent',
              color: activeExample === example ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: activeExample === example ? '600' : '400',
              transition: 'all 0.2s',
            }}
          >
            {example === 'basic' && '기본 검색'}
            {example === 'custom' && '커스텀 레이아웃'}
            {example === 'conditional' && '조건부 필드'}
            {example === 'array' && '배열 필드'}
          </button>
        ))}
      </div>

      {/* 기본 검색 예제 */}
      {activeExample === 'basic' && (
        <SearchProvider config={basicConfig}>
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
      )}

      {/* 커스텀 레이아웃 예제 */}
      {activeExample === 'custom' && (
        <SearchProvider config={customConfig}>
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
      )}

      {/* 조건부 필드 예제 */}
      {activeExample === 'conditional' && (
        <SearchProvider config={conditionalConfig}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🎯 조건부 필드</h2>
            <Field name="searchType" />
            <SearchTypeIndicator />
            <Field name="keyword" />
            <Field name="category" />
            <Field name="priceRange" />
            <Field name="dateRange" />
            <SearchButtons />
          </div>
        </SearchProvider>
      )}

      {/* 배열 필드 예제 */}
      {activeExample === 'array' && (
        <SearchProvider config={arrayConfig}>
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
      )}

      {/* 제출 결과 표시 */}
      {submitData && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#d1fae5',
          borderRadius: '8px',
          border: '1px solid #34d399'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#065f46' }}>✅ 제출된 데이터:</h3>
          <pre style={{ 
            backgroundColor: 'white', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(submitData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;