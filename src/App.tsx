
import { useState } from 'react';
import {
  BasicSearchExample,
  CustomLayoutExample,
  ConditionalFieldsExample,
  ArrayFieldsExample,
} from './examples';
import './App.css';

function App() {
  const [activeExample, setActiveExample] = useState<'basic' | 'custom' | 'conditional' | 'array'>('basic');
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