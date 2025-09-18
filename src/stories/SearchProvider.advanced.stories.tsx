/**
 * SearchProvider 고급 기능 활용 예제
 * 실시간 유효성 검사, 자동완성, 다단계 폼, 저장된 검색 등
 */

import type { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useField, useFieldValue } from '../hooks';
import { SearchConfig, FieldProps } from '../types/search.types';

const meta: Meta = {
  title: 'Advanced Examples/SearchProvider',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * 실시간 유효성 검사 및 API 연동
 * 사용자 입력에 따른 즉시 피드백과 서버 검증
 */
export const RealTimeValidation = () => {
  // 사용자명 중복 검사 시뮬레이션
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    const existingUsernames = ['admin', 'user', 'test', 'demo', 'system'];
    await new Promise(resolve => setTimeout(resolve, 500)); // API 지연 시뮬레이션
    return !existingUsernames.includes(username.toLowerCase());
  };

  const config: SearchConfig = {
    id: 'realtime-validation',
    fields: [
      {
        id: 'username',
        name: 'username',
        type: 'text',
        label: '사용자명',
        placeholder: '사용자명을 입력하세요',
        validation: {
          required: '사용자명은 필수입니다',
          minLength: { value: 3, message: '최소 3자 이상이어야 합니다' },
          maxLength: { value: 20, message: '최대 20자까지 가능합니다' },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: '영문, 숫자, 언더스코어만 사용 가능합니다'
          },
          validate: async (value: string) => {
            if (value && value.length >= 3) {
              const isAvailable = await checkUsernameAvailability(value);
              return isAvailable || '이미 사용 중인 사용자명입니다';
            }
            return true;
          }
        }
      },
      {
        id: 'email',
        name: 'email',
        type: 'text',
        label: '이메일',
        placeholder: '이메일을 입력하세요',
        validation: {
          required: '이메일은 필수입니다',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다'
          }
        }
      },
      {
        id: 'password',
        name: 'password',
        type: 'text',
        label: '비밀번호',
        placeholder: '비밀번호를 입력하세요',
        validation: {
          required: '비밀번호는 필수입니다',
          minLength: { value: 8, message: '최소 8자 이상이어야 합니다' },
          validate: (value: string) => {
            if (!value) return true;
            
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            
            if (!hasUpperCase) return '대문자를 포함해야 합니다';
            if (!hasLowerCase) return '소문자를 포함해야 합니다';
            if (!hasNumbers) return '숫자를 포함해야 합니다';
            if (!hasSpecialChar) return '특수문자를 포함해야 합니다';
            
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
          required: '비밀번호 확인은 필수입니다'
        }
      }
    ]
  };

  // 실시간 비밀번호 일치 검사 컴포넌트
  const PasswordMatchIndicator = () => {
    const password = useFieldValue('password');
    const confirmPassword = useFieldValue('confirmPassword');
    const confirmField = useField('confirmPassword');
    
    useEffect(() => {
      // 실제 구현에서는 폼 라이브러리의 setError API 사용
      if (confirmPassword && password !== confirmPassword) {
        console.log('비밀번호 불일치');
      } else {
        console.log('비밀번호 일치');
      }
    }, [password, confirmPassword, confirmField]);
    
    if (!password || !confirmPassword) return null;
    
    const isMatch = password === confirmPassword;
    
    return (
      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: isMatch ? '#dcfce7' : '#fef2f2',
        border: `1px solid ${isMatch ? '#bbf7d0' : '#fecaca'}`,
        borderRadius: '4px',
        marginTop: '0.5rem'
      }}>
        <span style={{ color: isMatch ? '#166534' : '#dc2626' }}>
          {isMatch ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
        </span>
      </div>
    );
  };

  // 실시간 유효성 검사 상태 표시
  const ValidationStatus = () => {
    const username = useFieldValue('username');
    const usernameField = useField('username');
    
    return (
      <div style={{ marginBottom: '1rem' }}>
        <h4>실시간 검증 상태</h4>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px'
        }}>
          <p>• 사용자명: {usernameField.isValidating ? '검증 중...' : usernameField.error ? '❌' : username ? '✅' : '⏳'}</p>
          <p>• 필드 상태: {usernameField.isDirty ? '수정됨' : '초기상태'} / {usernameField.isTouched ? '터치됨' : '미터치'}</p>
        </div>
      </div>
    );
  };

  const handleSubmit = async (data: any) => {
    console.log('📝 실시간 검증 완료 데이터:', data);
    alert('회원가입이 완료되었습니다!');
  };

  return (
    <SearchProvider config={config} onSubmit={handleSubmit}>
      <div style={{ maxWidth: 500 }}>
        <h2>📝 실시간 유효성 검사</h2>
        
        <ValidationStatus />
        
        <Field name="username" />
        <Field name="email" />
        <Field name="password" />
        <div>
          <Field name="confirmPassword" />
          <PasswordMatchIndicator />
        </div>
        
        <SearchButtons submitText="회원가입" showReset={false} />
      </div>
    </SearchProvider>
  );
};

/**
 * 고급 자동완성 기능
 * API 연동, 최근 검색어, 추천 검색어 등
 */
export const AdvancedAutoComplete = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '리액트 개발자', '프론트엔드 디자이너', '백엔드 엔지니어'
  ]);
  const [popularSearches] = useState<string[]>([
    '시니어 개발자', '풀스택 개발자', 'DevOps 엔지니어', 'UI/UX 디자이너'
  ]);

  // 직업 데이터베이스 시뮬레이션
  const jobDatabase = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'React Developer', 'Vue.js Developer', 'Angular Developer',
    'Node.js Developer', 'Python Developer', 'Java Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
    'UI Designer', 'UX Designer', 'Product Designer',
    'Product Manager', 'Project Manager', 'Scrum Master'
  ];

  // 고급 자동완성 로직
  const searchJobs = async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // API 지연 시뮬레이션
    
    if (!query) {
      // 빈 검색어일 때는 최근 검색어와 인기 검색어 표시
      return [
        ...recentSearches.map(search => ({ 
          label: `🕒 ${search}`, 
          value: search, 
          category: 'recent' 
        })),
        ...popularSearches.map(search => ({ 
          label: `🔥 ${search}`, 
          value: search, 
          category: 'popular' 
        }))
      ];
    }
    
    // 검색어 매칭
    const matches = jobDatabase.filter(job => 
      job.toLowerCase().includes(query.toLowerCase())
    );
    
    return matches.map(job => ({ label: job, value: job, category: 'job' }));
  };

  // 커스텀 자동완성 컴포넌트
  const CustomAutoCompleteField: React.FC<FieldProps> = ({ 
    value, 
    onChange, 
    error, 
    meta 
  }) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const loadSuggestions = async (query: string) => {
      setIsLoading(true);
      try {
        const results = await searchJobs(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        console.error('자동완성 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleInputChange = (newValue: string) => {
      onChange(newValue);
      loadSuggestions(newValue);
    };
    
    const handleSuggestionClick = (suggestion: any) => {
      onChange(suggestion.value);
      setIsOpen(false);
      
      // 최근 검색어에 추가
      if (suggestion.category === 'job') {
        setRecentSearches(prev => {
          const updated = [suggestion.value, ...prev.filter(s => s !== suggestion.value)];
          return updated.slice(0, 5); // 최대 5개까지만 저장
        });
      }
    };
    
    return (
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {meta?.label}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => loadSuggestions(value || '')}
            placeholder={meta?.placeholder}
            style={{
              width: '100%',
              padding: '0.75rem',
              paddingRight: '2.5rem',
              border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          {isLoading && (
            <div style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}>
              ⏳
            </div>
          )}
        </div>
        
        {isOpen && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 10
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {suggestion.label}
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            {error}
          </span>
        )}
      </div>
    );
  };

  const config: SearchConfig = {
    id: 'advanced-autocomplete',
    fields: [
      {
        id: 'jobTitle',
        name: 'jobTitle',
        type: 'text',
        label: '직책',
        placeholder: '원하는 직책을 입력하세요 (자동완성 지원)',
        validation: {
          required: '직책은 필수입니다'
        }
      },
      {
        id: 'location',
        name: 'location',
        type: 'text',
        label: '근무지',
        placeholder: '근무 희망 지역'
      },
      {
        id: 'experience',
        name: 'experience',
        type: 'select',
        label: '경력',
        options: [
          { label: '경력 무관', value: '' },
          { label: '신입 (0년)', value: '0' },
          { label: '1-3년', value: '1-3' },
          { label: '4-7년', value: '4-7' },
          { label: '8년 이상', value: '8+' }
        ]
      }
    ]
  };

  const handleSearch = async (data: any) => {
    console.log('🔍 고급 자동완성 검색:', data);
    alert(`검색 조건:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 600 }}>
        <h2>🔍 고급 자동완성 기능</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="jobTitle" component={CustomAutoCompleteField} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="location" />
          <Field name="experience" />
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>💡 자동완성 기능</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li>🕒 최근 검색어 표시</li>
            <li>🔥 인기 검색어 추천</li>
            <li>⚡ 실시간 검색 결과</li>
            <li>📝 검색 기록 자동 저장</li>
          </ul>
        </div>
        
        <SearchButtons submitText="채용공고 검색" />
      </div>
    </SearchProvider>
  );
};

/**
 * 다단계 검색 폼
 * 단계별로 나누어진 복잡한 검색 프로세스
 */
export const MultiStepSearchForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const config: SearchConfig = {
    id: 'multi-step-search',
    fields: [
      // 1단계: 기본 정보
      {
        id: 'searchType',
        name: 'searchType',
        type: 'radio',
        label: '검색 유형',
        options: [
          { label: '상품 검색', value: 'product' },
          { label: '브랜드 검색', value: 'brand' },
          { label: '카테고리 탐색', value: 'category' }
        ],
        validation: { required: '검색 유형을 선택하세요' }
      },
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '검색 키워드',
        placeholder: '검색할 키워드를 입력하세요',
        validation: { required: '키워드는 필수입니다' }
      },
      
      // 2단계: 필터 조건
      {
        id: 'priceRange',
        name: 'priceRange',
        type: 'numberrange',
        label: '가격 범위',
        placeholder: '가격 범위를 입력하세요'
      },
      {
        id: 'brands',
        name: 'brands',
        type: 'multiselect',
        label: '브랜드',
        options: [
          { label: '삼성', value: 'samsung' },
          { label: 'LG', value: 'lg' },
          { label: '애플', value: 'apple' },
          { label: '소니', value: 'sony' }
        ]
      },
      {
        id: 'rating',
        name: 'rating',
        type: 'select',
        label: '평점',
        options: [
          { label: '전체', value: '' },
          { label: '4점 이상', value: '4' },
          { label: '3점 이상', value: '3' }
        ]
      },
      
      // 3단계: 고급 옵션
      {
        id: 'sortBy',
        name: 'sortBy',
        type: 'select',
        label: '정렬 기준',
        options: [
          { label: '관련도순', value: 'relevance' },
          { label: '가격 낮은순', value: 'price_asc' },
          { label: '가격 높은순', value: 'price_desc' },
          { label: '평점순', value: 'rating' },
          { label: '최신순', value: 'newest' }
        ]
      },
      {
        id: 'deliveryOptions',
        name: 'deliveryOptions',
        type: 'multiselect',
        label: '배송 옵션',
        options: [
          { label: '무료배송', value: 'free' },
          { label: '당일배송', value: 'same_day' },
          { label: '새벽배송', value: 'dawn' }
        ]
      },
      {
        id: 'inStock',
        name: 'inStock',
        type: 'checkbox',
        label: '재고 있는 상품만 보기'
      }
    ]
  };

  // 스텝별 필드 그룹
  const stepFields = {
    1: ['searchType', 'keyword'],
    2: ['priceRange', 'brands', 'rating'],
    3: ['sortBy', 'deliveryOptions', 'inStock']
  };

  // 스텝 네비게이션 컴포넌트
  const StepNavigator = () => {
    // const form = useSearchForm(); // 실제 구현에서 사용
    
    const handleNext = async () => {
      // 현재 스텝의 필드들 유효성 검사 (실제 구현에서는 form.validate 사용)
      const currentFields = stepFields[currentStep as keyof typeof stepFields];
      console.log('검증할 필드들:', currentFields);
      
      // 간단한 검증 로직 (실제로는 폼 검증 라이브러리 사용)
      const isValid = true; // 실제로는 form.validate() 결과
      
      if (isValid && currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    };
    
    const handlePrev = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 0',
        borderTop: '1px solid #e5e7eb',
        marginTop: '2rem'
      }}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
            color: currentStep === 1 ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          이전
        </button>
        
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {currentStep} / {totalSteps} 단계
        </div>
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            다음
          </button>
        ) : (
          <SearchButtons submitText="검색 실행" showReset={false} />
        )}
      </div>
    );
  };

  // 진행 상황 표시
  const ProgressIndicator = () => {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <div
              key={step}
              style={{
                width: '30%',
                height: '4px',
                backgroundColor: step <= currentStep ? '#3b82f6' : '#e5e7eb',
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
          <span>기본 정보</span>
          <span>필터 조건</span>
          <span>고급 옵션</span>
        </div>
      </div>
    );
  };

  const handleSearch = async (data: any) => {
    console.log('🎯 다단계 검색 완료:', data);
    alert(`검색이 완료되었습니다!\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 600 }}>
        <h2>🎯 다단계 검색 폼</h2>
        
        <ProgressIndicator />
        
        {currentStep === 1 && (
          <div>
            <h3>1단계: 기본 정보</h3>
            <Field name="searchType" />
            <Field name="keyword" />
          </div>
        )}
        
        {currentStep === 2 && (
          <div>
            <h3>2단계: 필터 조건</h3>
            <Field name="priceRange" />
            <Field name="brands" />
            <Field name="rating" />
          </div>
        )}
        
        {currentStep === 3 && (
          <div>
            <h3>3단계: 고급 옵션</h3>
            <Field name="sortBy" />
            <Field name="deliveryOptions" />
            <Field name="inStock" />
          </div>
        )}
        
        <StepNavigator />
      </div>
    </SearchProvider>
  );
};

/**
 * 저장된 검색 조건 관리
 * 검색 조건 저장, 불러오기, 공유 기능
 */
export const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState([
    {
      id: '1',
      name: '시니어 개발자 검색',
      conditions: {
        position: 'senior',
        skills: ['React', 'TypeScript'],
        experience: '5+'
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: '원격근무 디자이너',
      conditions: {
        position: 'designer',
        workType: 'remote',
        location: 'anywhere'
      },
      createdAt: '2024-01-10'
    }
  ]);

  const config: SearchConfig = {
    id: 'saved-searches',
    fields: [
      {
        id: 'position',
        name: 'position',
        type: 'select',
        label: '직급',
        options: [
          { label: '전체', value: '' },
          { label: '주니어', value: 'junior' },
          { label: '시니어', value: 'senior' },
          { label: '리드', value: 'lead' }
        ]
      },
      {
        id: 'skills',
        name: 'skills',
        type: 'tags',
        label: '기술 스택',
        placeholder: '기술을 입력하세요'
      },
      {
        id: 'experience',
        name: 'experience',
        type: 'select',
        label: '경력',
        options: [
          { label: '전체', value: '' },
          { label: '1-3년', value: '1-3' },
          { label: '3-5년', value: '3-5' },
          { label: '5년 이상', value: '5+' }
        ]
      },
      {
        id: 'workType',
        name: 'workType',
        type: 'radio',
        label: '근무 형태',
        options: [
          { label: '전체', value: '' },
          { label: '정규직', value: 'fulltime' },
          { label: '계약직', value: 'contract' },
          { label: '원격근무', value: 'remote' }
        ]
      }
    ]
  };

  // 검색 조건 저장
  const SaveSearchModal = ({ currentValues }: { currentValues: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchName, setSearchName] = useState('');
    
    const handleSave = () => {
      if (!searchName.trim()) {
        alert('검색 조건 이름을 입력하세요');
        return;
      }
      
      const newSearch = {
        id: Date.now().toString(),
        name: searchName,
        conditions: currentValues,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setSavedSearches(prev => [newSearch, ...prev]);
      setSearchName('');
      setIsOpen(false);
      alert('검색 조건이 저장되었습니다!');
    };
    
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '0.5rem'
          }}
        >
          검색 조건 저장
        </button>
        
        {isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3>검색 조건 저장</h3>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="검색 조건 이름을 입력하세요"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // 저장된 검색 목록
  const SavedSearchList = ({ onLoad }: { onLoad: (conditions: any) => void }) => {
    const handleDelete = (id: string) => {
      setSavedSearches(prev => prev.filter(search => search.id !== id));
    };
    
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3>💾 저장된 검색 조건</h3>
        {savedSearches.length === 0 ? (
          <p style={{ color: '#6b7280' }}>저장된 검색 조건이 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {savedSearches.map(search => (
              <div
                key={search.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{search.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    저장일: {search.createdAt}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onLoad(search.conditions)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    불러오기
                  </button>
                  <button
                    onClick={() => handleDelete(search.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSearch = async (data: any) => {
    console.log('💾 저장된 검색 실행:', data);
    alert(`검색 실행:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 700 }}>
        <h2>💾 저장된 검색 조건 관리</h2>
        
        <SavedSearchList onLoad={(conditions) => {
          // 폼에 저장된 조건 로드 (실제 구현에서는 useSearchForm 훅 사용)
          console.log('검색 조건 로드:', conditions);
          alert(`검색 조건을 불러왔습니다:\n${JSON.stringify(conditions, null, 2)}`);
        }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="position" />
          <Field name="experience" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="skills" />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <Field name="workType" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchButtons submitText="검색 실행" />
          <SaveSearchModal currentValues={{
            position: 'senior',
            skills: ['React', 'TypeScript'],
            experience: '5+'
          }} />
        </div>
      </div>
    </SearchProvider>
  );
};