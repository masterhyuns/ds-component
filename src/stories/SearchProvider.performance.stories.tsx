/**
 * SearchProvider 성능 최적화 예제
 * 대용량 데이터, 가상화, 지연 로딩, 메모이제이션 등
 */

import type { Meta } from '@storybook/react';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
// import { useSearchForm } from '../hooks'; // 실제 구현에서 사용
import { SearchConfig, FieldProps } from '../types/search.types';

const meta: Meta = {
  title: 'Performance Examples/SearchProvider',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * 대용량 데이터셋 처리
 * 수만 개의 옵션을 가진 선택 필드 최적화
 */
export const LargeDatasetHandling = () => {
  // 대용량 데이터 생성 (실제로는 API에서 가져올 데이터)
  const generateLargeDataset = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      label: `옵션 ${i + 1} - ${Math.random().toString(36).substr(2, 9)}`,
      value: `option_${i + 1}`,
      category: ['기술', '디자인', '마케팅', '영업', '운영'][i % 5]
    }));
  };

  const [largeOptions] = useState(() => generateLargeDataset(10000));
  const [isLoading, setIsLoading] = useState(false);

  // 가상화된 선택 컴포넌트
  const VirtualizedSelect: React.FC<FieldProps> = ({ 
    value, 
    onChange, 
    error, 
    meta 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const [visibleOptions, setVisibleOptions] = useState(largeOptions.slice(0, 50));
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    
    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS = 10;
    const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

    // 검색어로 필터링 (디바운스 적용)
    const debouncedFilter = useCallback(
      debounce((searchValue: string) => {
        const filtered = largeOptions.filter(option =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        );
        setVisibleOptions(filtered.slice(0, 100)); // 최대 100개만 표시
      }, 300),
      [largeOptions]
    );

    useEffect(() => {
      debouncedFilter(localSearch);
    }, [localSearch, debouncedFilter]);

    // 가상 스크롤링 구현
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    };

    // 현재 보이는 아이템들 계산
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(startIndex + VISIBLE_ITEMS + 2, visibleOptions.length);
    const visibleItems = visibleOptions.slice(startIndex, endIndex);

    return (
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {meta?.label} ({largeOptions.length.toLocaleString()}개 옵션)
        </label>
        
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '0.75rem',
            border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: 'white'
          }}
        >
          {value ? largeOptions.find(opt => opt.value === value)?.label : meta?.placeholder}
        </div>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 10
          }}>
            {/* 검색 입력 */}
            <div style={{ padding: '0.5rem' }}>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="검색..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* 가상화된 목록 */}
            <div
              ref={containerRef}
              style={{
                height: `${CONTAINER_HEIGHT}px`,
                overflowY: 'auto'
              }}
              onScroll={handleScroll}
            >
              <div style={{ height: `${visibleOptions.length * ITEM_HEIGHT}px`, position: 'relative' }}>
                {visibleItems.map((option, index) => {
                  const actualIndex = startIndex + index;
                  return (
                    <div
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: `${actualIndex * ITEM_HEIGHT}px`,
                        left: 0,
                        right: 0,
                        height: `${ITEM_HEIGHT}px`,
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: value === option.value ? '#eff6ff' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (value !== option.value) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (value !== option.value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                      <span style={{ 
                        marginLeft: 'auto', 
                        fontSize: '0.75rem', 
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {option.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ 
              padding: '0.5rem', 
              borderTop: '1px solid #e5e7eb',
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              {visibleOptions.length.toLocaleString()}개 중 {Math.min(endIndex, visibleOptions.length)}개 표시
            </div>
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
    id: 'large-dataset',
    fields: [
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '대용량 카테고리 선택',
        placeholder: '카테고리를 선택하세요',
        options: largeOptions.slice(0, 5) // 기본 몇 개만 표시
      },
      {
        id: 'priority',
        name: 'priority',
        type: 'select',
        label: '우선순위',
        options: [
          { label: '높음', value: 'high' },
          { label: '보통', value: 'medium' },
          { label: '낮음', value: 'low' }
        ]
      }
    ]
  };

  const handleSearch = async (data: any) => {
    setIsLoading(true);
    console.log('📊 대용량 데이터 검색:', data);
    
    // 검색 지연 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      alert(`검색 완료:\n${JSON.stringify(data, null, 2)}`);
    }, 2000);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 600 }}>
        <h2>📊 대용량 데이터셋 처리</h2>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>⚡ 성능 최적화 기법</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li>가상 스크롤링 (Virtual Scrolling)</li>
            <li>검색어 디바운싱 (300ms)</li>
            <li>청크 단위 데이터 로딩</li>
            <li>메모이제이션 적용</li>
          </ul>
        </div>
        
        <Field name="category" component={VirtualizedSelect} />
        <Field name="priority" />
        
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <div>검색 중...</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              대용량 데이터를 처리하고 있습니다
            </div>
          </div>
        )}
        
        <SearchButtons submitText="대용량 데이터 검색" />
      </div>
    </SearchProvider>
  );
};

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * 지연 로딩 구현
 * 필요한 시점에만 데이터를 로드하는 최적화
 */
export const LazyLoadingFields = () => {
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(['basic']));
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  // 섹션별 필드 데이터
  const fieldSections = {
    basic: {
      name: '기본 정보',
      fields: [
        {
          id: 'name',
          name: 'name',
          type: 'text',
          label: '이름',
          placeholder: '이름을 입력하세요'
        },
        {
          id: 'email',
          name: 'email',
          type: 'text',
          label: '이메일',
          placeholder: '이메일을 입력하세요'
        }
      ]
    },
    preferences: {
      name: '선호 설정',
      fields: [
        {
          id: 'language',
          name: 'language',
          type: 'select',
          label: '언어',
          options: [] // 지연 로딩으로 채워질 예정
        },
        {
          id: 'timezone',
          name: 'timezone',
          type: 'select',
          label: '시간대',
          options: [] // 지연 로딩으로 채워질 예정
        }
      ]
    },
    advanced: {
      name: '고급 설정',
      fields: [
        {
          id: 'apiKeys',
          name: 'apiKeys',
          type: 'tags',
          label: 'API 키',
          placeholder: 'API 키를 입력하세요'
        },
        {
          id: 'webhooks',
          name: 'webhooks',
          type: 'text',
          label: '웹훅 URL',
          placeholder: '웹훅 URL을 입력하세요'
        }
      ]
    }
  };

  // 지연 로딩 함수
  const loadSection = async (sectionKey: string) => {
    if (loadedSections.has(sectionKey)) return;

    setIsLoading(prev => ({ ...prev, [sectionKey]: true }));

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 동적으로 옵션 데이터 로드
    if (sectionKey === 'preferences') {
      (fieldSections.preferences.fields[0] as any).options = [
        { label: '한국어', value: 'ko' },
        { label: 'English', value: 'en' },
        { label: '日本語', value: 'ja' }
      ];
      (fieldSections.preferences.fields[1] as any).options = [
        { label: 'UTC+9 (서울)', value: 'Asia/Seoul' },
        { label: 'UTC+0 (런던)', value: 'Europe/London' },
        { label: 'UTC-5 (뉴욕)', value: 'America/New_York' }
      ];
    }

    setLoadedSections(prev => new Set([...prev, sectionKey]));
    setIsLoading(prev => ({ ...prev, [sectionKey]: false }));
  };

  // 동적 필드 설정 생성
  const config: SearchConfig = useMemo(() => {
    const allFields: any[] = [];
    
    Object.entries(fieldSections).forEach(([key, section]) => {
      if (loadedSections.has(key)) {
        allFields.push(...section.fields);
      }
    });

    return {
      id: 'lazy-loading',
      fields: allFields
    };
  }, [loadedSections]);

  // 섹션 로더 컴포넌트
  const SectionLoader = ({ sectionKey, section }: { sectionKey: string, section: any }) => {
    const isLoaded = loadedSections.has(sectionKey);
    const loading = isLoading[sectionKey];

    if (isLoaded) {
      return (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: '#16a34a',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✅ {section.name}
          </h3>
          {section.fields.map((field: any) => (
            <Field key={field.id} name={field.name} />
          ))}
        </div>
      );
    }

    return (
      <div style={{ 
        marginBottom: '2rem',
        padding: '1.5rem',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>
          {section.name}
        </h3>
        
        {loading ? (
          <div>
            <div style={{ marginBottom: '0.5rem' }}>🔄 로딩 중...</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {section.name} 데이터를 가져오고 있습니다
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => loadSection(sectionKey)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            📦 {section.name} 로드하기
          </button>
        )}
      </div>
    );
  };

  const handleSearch = async (data: any) => {
    console.log('⚡ 지연 로딩 검색:', data);
    alert(`검색 데이터:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 600 }}>
        <h2>⚡ 지연 로딩 구현</h2>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>💡 지연 로딩 이점</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li>초기 로딩 시간 단축</li>
            <li>필요한 데이터만 네트워크 전송</li>
            <li>메모리 사용량 최적화</li>
            <li>사용자 경험 개선</li>
          </ul>
        </div>

        {Object.entries(fieldSections).map(([key, section]) => (
          <SectionLoader key={key} sectionKey={key} section={section} />
        ))}
        
        <div style={{ 
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <h4>로딩 상태</h4>
          <p>로드된 섹션: {Array.from(loadedSections).join(', ')}</p>
          <p>총 필드 수: {config.fields.length}개</p>
        </div>
        
        <SearchButtons submitText="검색 실행" />
      </div>
    </SearchProvider>
  );
};

/**
 * 메모이제이션 최적화
 * React.memo, useMemo, useCallback을 활용한 성능 최적화
 */
export const MemoizationOptimization = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [expensiveData, setExpensiveData] = useState<any[]>([]);

  // 비용이 많이 드는 계산 함수
  const expensiveCalculation = (items: any[]) => {
    console.log('🔄 비용이 많이 드는 계산 실행됨');
    // 복잡한 계산 시뮬레이션
    return items.reduce((acc, _item, index) => {
      return acc + Math.pow(index, 2) * Math.random();
    }, 0);
  };

  // 메모이제이션된 계산
  const memoizedResult = useMemo(() => {
    return expensiveCalculation(expensiveData);
  }, [expensiveData]);

  // 메모이제이션된 콜백
  const handleExpensiveAction = useCallback((data: any) => {
    console.log('💰 메모이제이션된 액션 실행:', data);
    setRenderCount(prev => prev + 1);
  }, []);

  // 메모이제이션된 컴포넌트
  const MemoizedComponent = React.memo(({ 
    data, 
    onAction 
  }: { 
    data: any; 
    onAction: (data: any) => void;
  }) => {
    console.log('🎨 MemoizedComponent 렌더링됨');
    
    return (
      <div style={{ 
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginBottom: '1rem',
        backgroundColor: '#f9fafb'
      }}>
        <h4>메모이제이션된 컴포넌트</h4>
        <p>데이터 개수: {data?.length || 0}</p>
        <p>계산 결과: {memoizedResult.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => onAction(data)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          메모이제이션된 액션 실행
        </button>
      </div>
    );
  });

  const config: SearchConfig = {
    id: 'memoization',
    fields: [
      {
        id: 'search',
        name: 'search',
        type: 'text',
        label: '검색어',
        placeholder: '검색어를 입력하세요'
      },
      {
        id: 'filters',
        name: 'filters',
        type: 'multiselect',
        label: '필터',
        options: Array.from({ length: 100 }, (_, i) => ({
          label: `필터 ${i + 1}`,
          value: `filter_${i + 1}`
        }))
      },
      {
        id: 'sortBy',
        name: 'sortBy',
        type: 'select',
        label: '정렬',
        options: [
          { label: '관련도', value: 'relevance' },
          { label: '최신순', value: 'newest' },
          { label: '오래된순', value: 'oldest' },
          { label: '이름순', value: 'name' }
        ]
      }
    ]
  };

  // 성능 모니터링 컴포넌트
  const PerformanceMonitor = React.memo(() => {
    const [performanceMetrics, setPerformanceMetrics] = useState({
      renderTime: 0,
      memoryUsage: 0
    });

    useEffect(() => {
      const startTime = performance.now();
      
      // 렌더링 시간 측정
      setTimeout(() => {
        const endTime = performance.now();
        setPerformanceMetrics(prev => ({
          ...prev,
          renderTime: endTime - startTime
        }));
      }, 0);

      // 메모리 사용량 (실제 브라우저에서만 작동)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB 단위
        }));
      }
    });

    return (
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#ecfdf5',
        border: '1px solid #10b981',
        borderRadius: '6px',
        marginBottom: '1rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>📊 성능 모니터링</h4>
        <div style={{ fontSize: '0.875rem' }}>
          <p>렌더링 횟수: {renderCount}</p>
          <p>렌더링 시간: {performanceMetrics.renderTime.toFixed(2)}ms</p>
          {performanceMetrics.memoryUsage > 0 && (
            <p>메모리 사용량: {performanceMetrics.memoryUsage.toFixed(2)}MB</p>
          )}
        </div>
      </div>
    );
  });

  const handleSearch = useCallback(async (data: any) => {
    console.log('🚀 메모이제이션 검색:', data);
    
    // 가상의 대용량 데이터 생성
    const newData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random()
    }));
    
    setExpensiveData(newData);
    setRenderCount(prev => prev + 1);
    
    alert(`검색 완료! ${newData.length}개 항목 생성됨`);
  }, []);

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 600 }}>
        <h2>🚀 메모이제이션 최적화</h2>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>⚡ 적용된 최적화 기법</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li>React.memo로 컴포넌트 메모이제이션</li>
            <li>useMemo로 비용이 많이 드는 계산 캐싱</li>
            <li>useCallback으로 함수 메모이제이션</li>
            <li>성능 메트릭 실시간 모니터링</li>
          </ul>
        </div>

        <PerformanceMonitor />
        
        <MemoizedComponent 
          data={expensiveData} 
          onAction={handleExpensiveAction}
        />
        
        <Field name="search" />
        <Field name="filters" />
        <Field name="sortBy" />
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <SearchButtons submitText="검색 실행" />
          <button
            type="button"
            onClick={() => setRenderCount(prev => prev + 1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            강제 리렌더링
          </button>
        </div>
      </div>
    </SearchProvider>
  );
};

/**
 * 실시간 성능 모니터링
 * 검색 성능과 렌더링 성능을 실시간으로 추적
 */
export const RealTimePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    searchTime: 0,
    renderTime: 0,
    fieldCount: 0,
    lastSearchData: null as any,
    searchHistory: [] as any[]
  });

  const config: SearchConfig = {
    id: 'performance-monitoring',
    fields: [
      {
        id: 'query',
        name: 'query',
        type: 'text',
        label: '검색어',
        placeholder: '성능 테스트용 검색어'
      },
      {
        id: 'complexity',
        name: 'complexity',
        type: 'select',
        label: '복잡도',
        options: [
          { label: '단순 (빠름)', value: 'simple' },
          { label: '보통 (중간)', value: 'medium' },
          { label: '복잡 (느림)', value: 'complex' }
        ]
      },
      {
        id: 'dataSize',
        name: 'dataSize',
        type: 'select',
        label: '데이터 크기',
        options: [
          { label: '소형 (100개)', value: 'small' },
          { label: '중형 (1,000개)', value: 'medium' },
          { label: '대형 (10,000개)', value: 'large' }
        ]
      }
    ]
  };

  const simulateSearch = async (data: any) => {
    const startTime = performance.now();
    
    // 복잡도에 따른 지연 시뮬레이션
    const delays = {
      simple: 100,
      medium: 500,
      complex: 2000
    };
    
    const delay = delays[data.complexity as keyof typeof delays] || 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const endTime = performance.now();
    const searchTime = endTime - startTime;
    
    // 가상의 결과 생성
    const dataSizes = {
      small: 100,
      medium: 1000,
      large: 10000
    };
    
    const resultCount = dataSizes[data.dataSize as keyof typeof dataSizes] || 100;
    
    const searchResult = {
      query: data.query,
      complexity: data.complexity,
      dataSize: data.dataSize,
      resultCount,
      searchTime,
      timestamp: new Date().toISOString()
    };
    
    setMetrics(prev => ({
      ...prev,
      searchTime,
      lastSearchData: searchResult,
      searchHistory: [searchResult, ...prev.searchHistory.slice(0, 9)] // 최근 10개만 유지
    }));
    
    return searchResult;
  };

  const handleSearch = async (data: any) => {
    console.log('📈 성능 모니터링 검색:', data);
    const result = await simulateSearch(data);
    alert(`검색 완료!\n시간: ${result.searchTime.toFixed(2)}ms\n결과: ${result.resultCount.toLocaleString()}개`);
  };

  // 실시간 성능 차트 컴포넌트 (간단한 막대 그래프)
  const PerformanceChart = () => {
    const maxTime = Math.max(...metrics.searchHistory.map(h => h.searchTime), 1);
    
    return (
      <div style={{ marginBottom: '1rem' }}>
        <h4>📊 검색 성능 히스토리</h4>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          gap: '2px', 
          height: '100px',
          padding: '0.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '6px'
        }}>
          {metrics.searchHistory.slice(0, 10).reverse().map((record, index) => {
            const height = (record.searchTime / maxTime) * 80;
            const color = record.searchTime < 500 ? '#10b981' : 
                         record.searchTime < 1000 ? '#f59e0b' : '#ef4444';
            
            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: `${height}px`,
                  backgroundColor: color,
                  borderRadius: '2px 2px 0 0',
                  position: 'relative'
                }}
                title={`${record.searchTime.toFixed(2)}ms - ${record.query || '빈 검색어'}`}
              />
            );
          })}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6b7280',
          marginTop: '0.25rem'
        }}>
          <span>과거</span>
          <span>최근</span>
        </div>
      </div>
    );
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 700 }}>
        <h2>📈 실시간 성능 모니터링</h2>
        
        {/* 실시간 메트릭 대시보드 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {metrics.searchTime.toFixed(0)}ms
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              마지막 검색 시간
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {metrics.searchHistory.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              총 검색 횟수
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {metrics.searchHistory.length > 0 ? 
                (metrics.searchHistory.reduce((sum, h) => sum + h.searchTime, 0) / metrics.searchHistory.length).toFixed(0) : 
                0
              }ms
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              평균 검색 시간
            </div>
          </div>
        </div>
        
        <PerformanceChart />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="query" />
          <Field name="complexity" />
          <Field name="dataSize" />
        </div>
        
        {/* 성능 상태 표시 */}
        {metrics.lastSearchData && (
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <h4>마지막 검색 결과</h4>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <p>• 검색어: "{metrics.lastSearchData.query || '(빈 검색어)'}"</p>
              <p>• 복잡도: {metrics.lastSearchData.complexity}</p>
              <p>• 데이터 크기: {metrics.lastSearchData.dataSize}</p>
              <p>• 결과 수: {metrics.lastSearchData.resultCount.toLocaleString()}개</p>
              <p>• 검색 시간: {metrics.lastSearchData.searchTime.toFixed(2)}ms</p>
            </div>
          </div>
        )}
        
        <SearchButtons submitText="성능 테스트 실행" />
      </div>
    </SearchProvider>
  );
};