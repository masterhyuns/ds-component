/**
 * SearchProvider 실용적인 예제 모음
 * 실제 프로젝트에서 자주 사용되는 패턴들
 */

import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useSearchForm, useFieldValue } from '../hooks';
import { SearchConfig, FieldProps } from '../types/search.types';

const meta: Meta = {
  title: 'Headless/SearchProvider/Examples',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

/**
 * 실시간 검색 자동완성
 * 검색어 입력 시 실시간으로 API 호출하여 자동완성 제안
 */
export const AutocompleteSearch = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const config: SearchConfig = {
    id: 'autocomplete-search',
    fields: [
      {
        id: 'query',
        name: 'query',
        type: 'text',
        label: '검색',
        placeholder: '검색어를 입력하세요...',
        validation: {
          minLength: { value: 2, message: '최소 2자 이상 입력하세요' }
        }
      }
    ],
    onChange: async (data) => {
      if (data.query && data.query.length >= 2) {
        setLoading(true);
        // 실제로는 API 호출
        setTimeout(() => {
          setSuggestions([
            `${data.query} 제품`,
            `${data.query} 서비스`,
            `${data.query} 문서`,
            `${data.query} 사용자`,
          ]);
          setLoading(false);
        }, 300);
      } else {
        setSuggestions([]);
      }
    },
    onSubmit: async (data) => {
      console.log('검색 실행:', data.query);
      // 실제 검색 실행
    }
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 500, position: 'relative' }}>
        <h2>실시간 자동완성 검색</h2>
        
        <Field name="query" />
        
        {loading && (
          <div style={{ padding: '0.5rem' }}>검색 중...</div>
        )}
        
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            marginTop: '0.25rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        
        <SearchButtons submitText="검색" showReset={false} />
      </div>
    </SearchProvider>
  );
};

/**
 * 다단계 폼 (Step Form)
 * 여러 단계로 나누어진 폼
 */
export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const config: SearchConfig = {
    id: 'multi-step-form',
    fields: [
      // Step 1: 기본 정보
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '이름',
        placeholder: '홍길동',
        validation: { required: '이름은 필수입니다' }
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
            message: '올바른 이메일 형식이 아닙니다'
          }
        }
      },
      // Step 2: 추가 정보
      {
        id: 'company',
        name: 'company',
        type: 'text',
        label: '회사명',
        placeholder: '회사명 입력'
      },
      {
        id: 'position',
        name: 'position',
        type: 'select',
        label: '직급',
        options: [
          { label: '선택하세요', value: '' },
          { label: '사원', value: 'staff' },
          { label: '대리', value: 'assistant' },
          { label: '과장', value: 'manager' },
          { label: '부장', value: 'director' },
        ]
      },
      // Step 3: 동의
      {
        id: 'terms',
        name: 'terms',
        type: 'checkbox',
        label: '이용약관 동의',
        validation: {
          validate: (value) => value === true || '이용약관에 동의해주세요'
        }
      },
      {
        id: 'privacy',
        name: 'privacy',
        type: 'checkbox',
        label: '개인정보 처리방침 동의',
        validation: {
          validate: (value) => value === true || '개인정보 처리방침에 동의해주세요'
        }
      }
    ],
    onSubmit: async (data) => {
      console.log('제출 완료:', data);
      alert('가입이 완료되었습니다!');
    }
  };

  const StepForm = () => {
    const form = useSearchForm();

    const handleNext = async () => {
      // 현재 단계의 필드만 검증
      // TODO: 부분 검증 로직 구현 필요
      setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
      setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
      await form.submit();
    };

    return (
      <div style={{ maxWidth: 500 }}>
        {/* 진행 표시 */}
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: step <= currentStep ? '#3b82f6' : '#e5e7eb',
                marginRight: step < 3 ? '0.5rem' : 0,
              }}
            />
          ))}
        </div>

        {/* Step 1: 기본 정보 */}
        {currentStep === 1 && (
          <div>
            <h3>Step 1: 기본 정보</h3>
            <Field name="name" />
            <Field name="email" />
          </div>
        )}

        {/* Step 2: 추가 정보 */}
        {currentStep === 2 && (
          <div>
            <h3>Step 2: 추가 정보</h3>
            <Field name="company" />
            <Field name="position" />
          </div>
        )}

        {/* Step 3: 동의 */}
        {currentStep === 3 && (
          <div>
            <h3>Step 3: 이용약관 동의</h3>
            <Field name="terms" />
            <Field name="privacy" />
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              이전
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              제출
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <SearchProvider config={config}>
      <div>
        <h2>다단계 폼</h2>
        <StepForm />
      </div>
    </SearchProvider>
  );
};

/**
 * 실시간 유효성 검사 피드백
 * 입력하는 동안 실시간으로 검증 상태를 표시
 */
const PasswordStrengthField: React.FC<FieldProps> = ({ value, onChange, error, meta }) => {
  const getStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(value || '');
  const strengthText = ['매우 약함', '약함', '보통', '강함', '매우 강함'][strength];
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][strength];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {meta?.label}
      </label>
      <input
        type="password"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={meta?.placeholder}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '4px',
        }}
      />
      
      {value && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: level < strength ? strengthColor : '#e5e7eb',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.875rem', color: strengthColor }}>
            비밀번호 강도: {strengthText}
          </span>
        </div>
      )}
      
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export const RealTimeValidation = () => {
  const config: SearchConfig = {
    id: 'realtime-validation',
    fields: [
      {
        id: 'username',
        name: 'username',
        type: 'text',
        label: '사용자명',
        placeholder: '영문, 숫자, _만 사용 (3-20자)',
        validation: {
          required: '사용자명은 필수입니다',
          minLength: { value: 3, message: '최소 3자 이상' },
          maxLength: { value: 20, message: '최대 20자까지' },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: '영문, 숫자, 언더스코어(_)만 사용 가능'
          },
          validate: async (value) => {
            // 실제로는 API 호출로 중복 체크
            if (value === 'admin' || value === 'test') {
              return '이미 사용 중인 사용자명입니다';
            }
            return true;
          }
        }
      },
      {
        id: 'password',
        name: 'password',
        type: 'text',
        label: '비밀번호',
        placeholder: '8자 이상, 대소문자, 숫자, 특수문자 포함',
        validation: {
          required: '비밀번호는 필수입니다',
          minLength: { value: 8, message: '최소 8자 이상' },
          validate: (value) => {
            const checks = [
              { test: /[a-z]/, message: '소문자 포함 필요' },
              { test: /[A-Z]/, message: '대문자 포함 필요' },
              { test: /[0-9]/, message: '숫자 포함 필요' },
              { test: /[^a-zA-Z0-9]/, message: '특수문자 포함 필요' },
            ];
            
            for (const check of checks) {
              if (!check.test.test(value)) {
                return check.message;
              }
            }
            return true;
          }
        }
      },
      {
        id: 'confirmPassword',
        name: 'confirmPassword',
        type: 'text',
        label: '비밀번호 확인',
        placeholder: '비밀번호를 다시 입력하세요',
        validation: {
          required: '비밀번호 확인은 필수입니다',
          validate: (value, values) => {
            if (value !== values?.password) {
              return '비밀번호가 일치하지 않습니다';
            }
            return true;
          }
        }
      }
    ],
    onSubmit: async (data) => {
      console.log('가입 완료:', data);
    }
  };

  // 실시간 상태 표시 컴포넌트
  const ValidationStatus = () => {
    const form = useSearchForm();
    const username = useFieldValue('username');
    const password = useFieldValue('password');

    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        marginBottom: '1rem',
      }}>
        <h4 style={{ marginTop: 0 }}>실시간 검증 상태</h4>
        <ul style={{ marginBottom: 0 }}>
          <li>사용자명 입력: {username ? '✅' : '⏳'}</li>
          <li>비밀번호 강도: {password ? '✅' : '⏳'}</li>
          <li>폼 유효성: {form.isValid ? '✅' : '❌'}</li>
          <li>제출 가능: {form.isValid && !form.isSubmitting ? '✅' : '❌'}</li>
        </ul>
      </div>
    );
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 500 }}>
        <h2>실시간 유효성 검사</h2>
        
        <ValidationStatus />
        
        <Field name="username" />
        <Field name="password" component={PasswordStrengthField} />
        <Field name="confirmPassword" />
        
        <SearchButtons submitText="가입하기" />
      </div>
    </SearchProvider>
  );
};

/**
 * 동적 필터 검색
 * 사용자가 필터를 추가/제거할 수 있는 고급 검색
 */
export const DynamicFilterSearch = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>(['keyword']);

  const availableFilters = [
    { id: 'keyword', label: '키워드', type: 'text' },
    { id: 'category', label: '카테고리', type: 'select' },
    { id: 'priceRange', label: '가격대', type: 'text' },
    { id: 'dateRange', label: '기간', type: 'text' },
    { id: 'status', label: '상태', type: 'select' },
  ];

  const config: SearchConfig = {
    id: 'dynamic-filter',
    fields: [
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '키워드',
        placeholder: '검색어 입력',
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        options: [
          { label: '전체', value: '' },
          { label: '전자제품', value: 'electronics' },
          { label: '의류', value: 'clothing' },
          { label: '식품', value: 'food' },
        ],
      },
      {
        id: 'priceRange',
        name: 'priceRange',
        type: 'text',
        label: '가격대',
        placeholder: '예: 10000-50000',
      },
      {
        id: 'dateRange',
        name: 'dateRange',
        type: 'text',
        label: '기간',
        placeholder: 'YYYY-MM-DD ~ YYYY-MM-DD',
      },
      {
        id: 'status',
        name: 'status',
        type: 'select',
        label: '상태',
        options: [
          { label: '전체', value: '' },
          { label: '판매중', value: 'active' },
          { label: '품절', value: 'soldout' },
          { label: '판매종료', value: 'discontinued' },
        ],
      },
    ],
    onSubmit: async (data) => {
      // 활성화된 필터만 포함
      const filteredData = Object.entries(data)
        .filter(([key]) => activeFilters.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      console.log('검색 필터:', filteredData);
    },
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <SearchProvider config={config}>
      <div style={{ maxWidth: 600 }}>
        <h2>동적 필터 검색</h2>
        
        {/* 필터 선택 */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          <h4 style={{ marginTop: 0 }}>필터 추가/제거</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: activeFilters.includes(filter.id) ? '#3b82f6' : 'white',
                  color: activeFilters.includes(filter.id) ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {filter.label}
                {activeFilters.includes(filter.id) && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* 활성 필터 표시 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeFilters.map(filterId => (
            <div key={filterId} style={{ position: 'relative' }}>
              <Field name={filterId} />
              <button
                onClick={() => toggleFilter(filterId)}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                제거
              </button>
            </div>
          ))}
        </div>

        {activeFilters.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            필터를 추가하여 검색을 시작하세요
          </p>
        )}

        <SearchButtons submitText="검색" showReset={activeFilters.length > 0} />
      </div>
    </SearchProvider>
  );
};

/**
 * 폼 데이터 영속성 (LocalStorage)
 * 페이지 새로고침 시에도 입력값 유지
 */
export const PersistentForm = () => {
  // localStorage에서 초기값 불러오기
  const savedValues = JSON.parse(
    localStorage.getItem('persistent-form') || '{}'
  );

  const config: SearchConfig = {
    id: 'persistent-form',
    fields: [
      {
        id: 'title',
        name: 'title',
        type: 'text',
        label: '제목',
        placeholder: '제목을 입력하세요',
        validation: { required: '제목은 필수입니다' }
      },
      {
        id: 'content',
        name: 'content',
        type: 'text',
        label: '내용',
        placeholder: '내용을 입력하세요',
        validation: { required: '내용은 필수입니다' }
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        options: [
          { label: '일반', value: 'general' },
          { label: '공지', value: 'notice' },
          { label: '이벤트', value: 'event' },
        ]
      }
    ],
    onChange: (data) => {
      // 값이 변경될 때마다 localStorage에 저장
      localStorage.setItem('persistent-form', JSON.stringify(data));
    },
    onSubmit: async (data) => {
      console.log('제출:', data);
      // 제출 후 localStorage 클리어
      localStorage.removeItem('persistent-form');
      alert('제출되었습니다!');
    },
    onReset: () => {
      // 리셋 시 localStorage도 클리어
      localStorage.removeItem('persistent-form');
    }
  };

  return (
    <SearchProvider config={config} initialValues={savedValues}>
      <div style={{ maxWidth: 500 }}>
        <h2>자동 저장 폼</h2>
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#dbeafe',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          💡 입력한 내용은 자동으로 저장되며, 페이지를 새로고침해도 유지됩니다.
        </div>
        
        <Field name="title" />
        <Field name="content" />
        <Field name="category" />
        
        <SearchButtons submitText="발행" resetText="초기화" />
      </div>
    </SearchProvider>
  );
};