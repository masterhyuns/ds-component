/**
 * 날짜 기반 검색 예제
 * date와 daterange 필드 타입 사용 시연
 */

import React, { useState } from 'react';
import { SearchBox } from '../components/SearchBox';
import { SearchConfig } from '../types';

// 예제용 더미 데이터
const mockData = [
  { id: 1, title: '프로젝트 A', createdAt: '2024-01-15', startDate: '2024-02-01', endDate: '2024-03-15' },
  { id: 2, title: '프로젝트 B', createdAt: '2024-02-20', startDate: '2024-03-01', endDate: '2024-04-30' },
  { id: 3, title: '프로젝트 C', createdAt: '2024-03-10', startDate: '2024-04-01', endDate: '2024-06-30' },
  { id: 4, title: '프로젝트 D', createdAt: '2024-04-05', startDate: '2024-05-01', endDate: '2024-07-31' },
  { id: 5, title: '프로젝트 E', createdAt: '2024-05-12', startDate: '2024-06-01', endDate: '2024-08-31' },
];

export const DateSearchExample: React.FC = () => {
  const [results, setResults] = useState(mockData);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 설정
  const searchConfig: SearchConfig = {
    id: 'date-search',
    name: '날짜 검색',
    fields: [
      {
        id: 'createdDate',
        name: 'createdDate',
        type: 'date',
        label: '생성일',
        placeholder: '생성일을 선택하세요',
      },
      {
        id: 'projectPeriod',
        name: 'projectPeriod',
        type: 'daterange',
        label: '프로젝트 기간',
        placeholder: '시작일 ~ 종료일',
        defaultValue: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      },
      {
        id: 'status',
        name: 'status',
        type: 'select',
        label: '상태',
        options: [
          { label: '전체', value: 'all' },
          { label: '진행중', value: 'active' },
          { label: '완료', value: 'completed' },
          { label: '대기중', value: 'pending' },
        ],
        defaultValue: 'all'
      },
      {
        id: 'includeArchived',
        name: 'includeArchived',
        type: 'checkbox',
        label: '보관된 항목 포함',
        defaultValue: false
      }
    ],
    layout: {
      columns: 2,
      gap: '1rem',
    },
    onSubmit: async (data) => {
      console.log('검색 조건:', data);
      setIsSearching(true);

      // 검색 시뮬레이션
      setTimeout(() => {
        let filtered = [...mockData];

        // 생성일 필터링
        if (data.createdDate) {
          filtered = filtered.filter(item => 
            item.createdAt === data.createdDate
          );
        }

        // 프로젝트 기간 필터링
        if (data.projectPeriod) {
          const { start, end } = data.projectPeriod;
          if (start) {
            filtered = filtered.filter(item => 
              item.startDate >= start
            );
          }
          if (end) {
            filtered = filtered.filter(item => 
              item.endDate <= end
            );
          }
        }

        setResults(filtered);
        setIsSearching(false);
      }, 500);
    },
    onReset: () => {
      setResults(mockData);
      console.log('검색 조건 초기화');
    },
    submitText: '검색',
    resetText: '초기화',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>날짜 기반 검색 예제</h1>
      
      {/* 검색 폼 */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <SearchBox config={searchConfig} />
      </div>

      {/* 검색 결과 */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>
          검색 결과 ({results.length}건)
          {isSearching && <span style={{ marginLeft: '1rem', color: '#6b7280' }}>검색 중...</span>}
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {results.map(item => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                background: 'white',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <div>생성일: {item.createdAt}</div>
                <div>기간: {item.startDate} ~ {item.endDate}</div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !isSearching && (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '0.375rem'
            }}>
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 사용법 설명 */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        background: '#f0f9ff',
        borderRadius: '0.5rem',
        border: '1px solid #bfdbfe'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>📅 날짜 필드 사용법</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#3730a3' }}>
          <li><strong>date 타입:</strong> 단일 날짜 선택 (DatePicker 사용)</li>
          <li><strong>daterange 타입:</strong> 시작일과 종료일 선택 (두 개의 DatePicker)</li>
          <li><strong>값 형식:</strong> 
            <ul>
              <li>date: 'YYYY-MM-DD' 문자열</li>
              <li>daterange: {`{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`} 객체</li>
            </ul>
          </li>
          <li><strong>특징:</strong> 
            <ul>
              <li>연도/월 드롭다운 지원</li>
              <li>Clear 버튼으로 선택 취소 가능</li>
              <li>시작일/종료일 자동 유효성 검증</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};