
import { useState } from 'react';
import {
  BasicSearchExample,
  CustomLayoutExample,
  ConditionalFieldsExample,
  ArrayFieldsExample,
} from './examples';
import { TabManager } from './components/TabManager/TabManager';
import './App.css';

function App() {
  const [activeExample, setActiveExample] = useState<'basic' | 'custom' | 'conditional' | 'array' | 'tabs'>('basic');
  const [submitData, setSubmitData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    setSubmitData(data);
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
        {(['basic', 'custom', 'conditional', 'array', 'tabs'] as const).map((example) => (
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
            {example === 'tabs' && '🖥️ 탭 관리자'}
          </button>
        ))}
      </div>

      {/* 기본 검색 예제 */}
      {activeExample === 'basic' && (
        <BasicSearchExample onSubmit={handleSubmit} />
      )}

      {/* 커스텀 레이아웃 예제 */}
      {activeExample === 'custom' && (
        <CustomLayoutExample onSubmit={handleSubmit} />
      )}

      {/* 조건부 필드 예제 */}
      {activeExample === 'conditional' && (
        <ConditionalFieldsExample onSubmit={handleSubmit} />
      )}

      {/* 배열 필드 예제 */}
      {activeExample === 'array' && (
        <ArrayFieldsExample onSubmit={handleSubmit} />
      )}

      {/* 탭 관리자 예제 */}
      {activeExample === 'tabs' && (
        <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          <TabManager
            initialTabs={[
              {
                id: 'tab-1',
                title: 'JSONPlaceholder',
                url: 'https://jsonplaceholder.typicode.com',
                isActive: true,
                created: new Date()
              },
              {
                id: 'tab-2', 
                title: 'httpbin',
                url: 'https://httpbin.org',
                isActive: false,
                created: new Date()
              }
            ]}
            memoryConfig={{
              maxTabs: 10,
              memoryThreshold: 500,
              warningThreshold: 300,
              checkInterval: 5000,
              autoCleanup: true
            }}
            showDashboard={true}
            onTabCreate={(tab) => console.log('새 탭 생성:', tab)}
            onTabClose={(tabId) => console.log('탭 닫힘:', tabId)}
            onTabActivate={(tabId) => console.log('탭 활성화:', tabId)}
          />
        </div>
      )}

      {/* 제출 결과 표시 */}
      {submitData && activeExample !== 'tabs' && (
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