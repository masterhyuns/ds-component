/**
 * formRef 예제 스토리
 * SearchProvider 외부에서 폼을 제어하는 방법을 보여주는 예제들
 */

import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useFormRefValues } from '../hooks/useFormRefValues';
import type { SearchConfig, SearchFormAPI } from '../types/search.types';

const meta: Meta<typeof SearchProvider> = {
  title: 'Headless/SearchProvider/FormRef Examples',
  component: SearchProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchProvider>;

/**
 * 기본 formRef 사용 예제
 * 외부 버튼으로 폼을 제어하는 가장 기본적인 패턴
 */
export const BasicFormRef: Story = {
  render: () => {
    const BasicExample = () => {
      const formRef = useRef<SearchFormAPI>(null);
      const [log, setLog] = useState<string[]>([]);

      const addLog = (message: string) => {
        setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
      };

      const config: SearchConfig = {
        id: 'basic-formref',
        fields: [
          {
            id: 'keyword',
            name: 'keyword',
            type: 'text',
            label: '검색어',
            placeholder: '검색어를 입력하세요',
            defaultValue: 'React',
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
            defaultValue: 'all',
          },
        ],
      };

      return (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>폼 영역</h3>
            <SearchProvider
              config={config}
              formRef={formRef}
              onSubmit={(data) => {
                addLog(`제출: ${JSON.stringify(data)}`);
              }}
              onReset={() => {
                addLog('폼 초기화됨');
              }}
            >
              <Field name="keyword" />
              <Field name="category" />
              <SearchButtons />
            </SearchProvider>
          </div>

          <div style={{ flex: 1 }}>
            <h3>외부 제어 패널</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const values = formRef.current?.getValues();
                  addLog(`현재 값: ${JSON.stringify(values)}`);
                }}
              >
                현재 값 조회
              </button>

              <button
                onClick={() => {
                  formRef.current?.setValue('keyword', 'TypeScript');
                  addLog('keyword를 "TypeScript"로 변경');
                }}
              >
                키워드 변경
              </button>

              <button
                onClick={() => {
                  formRef.current?.submit();
                  addLog('외부에서 제출 트리거');
                }}
              >
                폼 제출
              </button>

              <button
                onClick={() => {
                  formRef.current?.reset();
                  addLog('외부에서 리셋 트리거');
                }}
              >
                폼 초기화
              </button>
            </div>

            <h4 style={{ marginTop: '1rem' }}>활동 로그:</h4>
            <div
              style={{
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              {log.length === 0 ? (
                <div style={{ color: '#999' }}>아직 활동이 없습니다</div>
              ) : (
                log.map((entry, index) => <div key={index}>{entry}</div>)
              )}
            </div>
          </div>
        </div>
      );
    };

    return <BasicExample />;
  },
};

/**
 * 실시간 폼 값 동기화 예제
 * onChange와 formRef를 함께 사용하여 외부 state와 동기화
 */
export const RealTimeSync: Story = {
  render: () => {
    const RealTimeSyncExample = () => {
      const formRef = useRef<SearchFormAPI>(null);
      const [formValues, setFormValues] = useState<any>({});

      const config: SearchConfig = {
        id: 'realtime-sync',
        fields: [
          {
            id: 'keyword',
            name: 'keyword',
            type: 'text',
            label: '검색어',
            placeholder: '검색어를 입력하세요',
          },
          {
            id: 'minPrice',
            name: 'minPrice',
            type: 'text',
            label: '최소 가격',
            placeholder: '0',
          },
          {
            id: 'maxPrice',
            name: 'maxPrice',
            type: 'text',
            label: '최대 가격',
            placeholder: '10000',
          },
        ],
      };

      return (
        <div>
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f8ff', borderRadius: '4px' }}>
            <h3>현재 검색 조건 (실시간 동기화)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem' }}>
              <strong>검색어:</strong>
              <span>{formValues.keyword || '(없음)'}</span>
              <strong>가격 범위:</strong>
              <span>
                {formValues.minPrice || '0'} ~ {formValues.maxPrice || '10000'}원
              </span>
            </div>
            <button
              style={{ marginTop: '1rem' }}
              onClick={() => {
                formRef.current?.setValues({
                  keyword: '노트북',
                  minPrice: '500000',
                  maxPrice: '2000000',
                });
              }}
            >
              노트북 검색 조건으로 설정
            </button>
          </div>

          <SearchProvider
            config={config}
            formRef={formRef}
            onChange={(_name, _value, allValues) => {
              // 폼 값이 변경될 때마다 외부 state 업데이트
              setFormValues(allValues);
            }}
            onReset={() => {
              setFormValues({});
            }}
            onSubmit={(data) => {
              alert(`검색 실행!\n${JSON.stringify(data, null, 2)}`);
            }}
          >
            <Field name="keyword" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field name="minPrice" />
              <Field name="maxPrice" />
            </div>
            <SearchButtons />
          </SearchProvider>
        </div>
      );
    };

    return <RealTimeSyncExample />;
  },
};

/**
 * 다중 폼 제어 예제
 * 여러 SearchProvider를 하나의 컴포넌트에서 제어
 */
export const MultipleFormsControl: Story = {
  render: () => {
    const MultipleFormsExample = () => {
      const searchFormRef = useRef<SearchFormAPI>(null);
      const filterFormRef = useRef<SearchFormAPI>(null);

      const searchConfig: SearchConfig = {
        id: 'search-form',
        fields: [
          {
            id: 'q',
            name: 'q',
            type: 'text',
            label: '검색',
            placeholder: '검색어 입력',
          },
        ],
      };

      const filterConfig: SearchConfig = {
        id: 'filter-form',
        fields: [
          {
            id: 'category',
            name: 'category',
            type: 'select',
            label: '카테고리',
            options: [
              { label: '전체', value: 'all' },
              { label: '신상품', value: 'new' },
              { label: '인기', value: 'popular' },
            ],
          },
          {
            id: 'sort',
            name: 'sort',
            type: 'select',
            label: '정렬',
            options: [
              { label: '최신순', value: 'latest' },
              { label: '가격순', value: 'price' },
              { label: '인기순', value: 'popularity' },
            ],
          },
        ],
      };

      const handleSearch = () => {
        const searchValues = searchFormRef.current?.getValues();
        const filterValues = filterFormRef.current?.getValues();

        alert(
          `통합 검색 실행:\n검색: ${JSON.stringify(searchValues)}\n필터: ${JSON.stringify(filterValues)}`
        );
      };

      const handleResetAll = () => {
        searchFormRef.current?.reset();
        filterFormRef.current?.reset();
        alert('모든 폼이 초기화되었습니다');
      };

      return (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem' }}>
            <div>
              <h3>검색 폼</h3>
              <SearchProvider config={searchConfig} formRef={searchFormRef}>
                <Field name="q" />
              </SearchProvider>
            </div>

            <div>
              <h3>필터 폼</h3>
              <SearchProvider config={filterConfig} formRef={filterFormRef}>
                <Field name="category" />
                <Field name="sort" />
              </SearchProvider>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleSearch} style={{ padding: '0.5rem 2rem' }}>
              통합 검색
            </button>
            <button onClick={handleResetAll} style={{ padding: '0.5rem 2rem' }}>
              전체 초기화
            </button>
          </div>
        </div>
      );
    };

    return <MultipleFormsExample />;
  },
};

/**
 * 폼 상태 모니터링 예제
 * formRef를 사용하여 폼 상태를 실시간으로 모니터링
 */
export const FormStateMonitoring: Story = {
  render: () => {
    const MonitoringExample = () => {
      const formRef = useRef<SearchFormAPI>(null);
      const [, forceUpdate] = useState({});

      // 폼 상태를 주기적으로 업데이트 (데모용)
      React.useEffect(() => {
        const interval = setInterval(() => {
          forceUpdate({});
        }, 100);
        return () => clearInterval(interval);
      }, []);

      const config: SearchConfig = {
        id: 'monitoring',
        fields: [
          {
            id: 'email',
            name: 'email',
            type: 'text',
            label: '이메일',
            placeholder: 'your@email.com',
            validation: {
              required: '이메일은 필수입니다',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '유효한 이메일을 입력하세요',
              },
            },
          },
          {
            id: 'password',
            name: 'password',
            type: 'text',
            label: '비밀번호',
            placeholder: '비밀번호 입력',
            validation: {
              required: '비밀번호는 필수입니다',
              minLength: {
                value: 8,
                message: '최소 8자 이상 입력하세요',
              },
            },
          },
        ],
      };

      const formState = formRef.current;

      return (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>폼</h3>
            <SearchProvider
              config={config}
              formRef={formRef}
              onSubmit={(data) => {
                alert(`제출 성공:\n${JSON.stringify(data, null, 2)}`);
              }}
            >
              <Field name="email" />
              <Field name="password" />
              <SearchButtons />
            </SearchProvider>
          </div>

          <div style={{ flex: 1 }}>
            <h3>폼 상태 모니터</h3>
            <div
              style={{
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            >
              <div>
                <strong>isSubmitting:</strong>{' '}
                <span style={{ color: formState?.isSubmitting ? 'green' : 'red' }}>
                  {String(formState?.isSubmitting ?? false)}
                </span>
              </div>
              <div>
                <strong>isDirty:</strong>{' '}
                <span style={{ color: formState?.isDirty ? 'green' : 'red' }}>
                  {String(formState?.isDirty ?? false)}
                </span>
              </div>
              <div>
                <strong>isValid:</strong>{' '}
                <span style={{ color: formState?.isValid ? 'green' : 'red' }}>
                  {String(formState?.isValid ?? false)}
                </span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <strong>Errors:</strong>
                <pre style={{ margin: '0.5rem 0', fontSize: '12px' }}>
                  {JSON.stringify(formState?.errors ?? {}, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Values:</strong>
                <pre style={{ margin: '0.5rem 0', fontSize: '12px' }}>
                  {JSON.stringify(formState?.getValues() ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <MonitoringExample />;
  },
};

/**
 * useFormRefValues 훅 사용 예제
 * formRef만으로 외부에서 실시간 폼 값 렌더링
 */
export const UseFormRefValuesExample: Story = {
  render: () => {
    const FormRefValuesDemo = () => {
      const formRef = useRef<SearchFormAPI>(null);

      // 🎉 useFormRefValues 훅으로 실시간 폼 값 받기!
      const formValues = useFormRefValues(formRef);

      const config: SearchConfig = {
        id: 'formref-values',
        fields: [
          {
            id: 'keyword',
            name: 'keyword',
            type: 'text',
            label: '검색어',
            placeholder: '검색어를 입력하세요',
            defaultValue: 'React',
          },
          {
            id: 'category',
            name: 'category',
            type: 'select',
            label: '카테고리',
            options: [
              { label: '전체', value: 'all' },
              { label: '프론트엔드', value: 'frontend' },
              { label: '백엔드', value: 'backend' },
            ],
            defaultValue: 'all',
          },
          {
            id: 'minPrice',
            name: 'minPrice',
            type: 'text',
            label: '최소 가격',
            placeholder: '0',
          },
          {
            id: 'maxPrice',
            name: 'maxPrice',
            type: 'text',
            label: '최대 가격',
            placeholder: '10000',
          },
        ],
      };

      return (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3>폼</h3>
            <SearchProvider
              config={config}
              formRef={formRef}
              onSubmit={(data) => {
                alert(`검색 실행:\n${JSON.stringify(data, null, 2)}`);
              }}
            >
              <Field name="keyword" />
              <Field name="category" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field name="minPrice" />
                <Field name="maxPrice" />
              </div>
              <SearchButtons />
            </SearchProvider>
          </div>

          <div style={{ flex: 1 }}>
            <h3>실시간 폼 값 (useFormRefValues)</h3>
            <div
              style={{
                background: '#f0f8ff',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid #4a90e2',
              }}
            >
              <h4 style={{ marginTop: 0, color: '#4a90e2' }}>현재 검색 조건</h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <strong>검색어:</strong>{' '}
                  <span style={{ color: '#333' }}>{formValues.keyword || '(없음)'}</span>
                </div>
                <div>
                  <strong>카테고리:</strong>{' '}
                  <span style={{ color: '#333' }}>{formValues.category || '(없음)'}</span>
                </div>
                <div>
                  <strong>가격 범위:</strong>{' '}
                  <span style={{ color: '#333' }}>
                    {formValues.minPrice || '0'} ~ {formValues.maxPrice || '10000'}원
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                <h4 style={{ fontSize: '14px', color: '#666' }}>빠른 설정</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      formRef.current?.setValues({
                        keyword: '타입스크립트',
                        category: 'frontend',
                        minPrice: '30000',
                        maxPrice: '50000',
                      });
                    }}
                    style={{ padding: '0.5rem' }}
                  >
                    타입스크립트 강의 검색
                  </button>
                  <button
                    onClick={() => {
                      formRef.current?.setValues({
                        keyword: 'Node.js',
                        category: 'backend',
                        minPrice: '20000',
                        maxPrice: '40000',
                      });
                    }}
                    style={{ padding: '0.5rem' }}
                  >
                    Node.js 강의 검색
                  </button>
                  <button
                    onClick={() => {
                      formRef.current?.reset();
                    }}
                    style={{ padding: '0.5rem', background: '#f5f5f5' }}
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '13px', color: '#666' }}>
              <strong>💡 포인트:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                <li>onChange 없이도 실시간 값 받기 가능</li>
                <li>초기값부터 자동으로 표시됨</li>
                <li>타입 안전성 보장</li>
              </ul>
            </div>
          </div>
        </div>
      );
    };

    return <FormRefValuesDemo />;
  },
};
