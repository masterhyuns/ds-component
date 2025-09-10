/**
 * SearchBox 컴포넌트 스토리북 예제
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from './SearchBox';

const meta: Meta<typeof SearchBox> = {
  title: 'Components/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 검색 폼
 */
export const Default: Story = {
  args: {
    config: {
      id: 'default-search',
      fields: [
        {
          id: 'keyword',
          name: 'keyword',
          type: 'text',
          label: '검색어',
          placeholder: '검색어를 입력하세요',
        },
        {
          id: 'category',
          name: 'category',
          type: 'select',
          label: '카테고리',
          placeholder: '카테고리 선택',
          options: [
            { label: '전체', value: 'all' },
            { label: '제품', value: 'product' },
            { label: '서비스', value: 'service' },
            { label: '고객', value: 'customer' },
          ],
        },
      ],
    },
    onSubmit: (data: any) => {
      console.log('검색 데이터:', data);
      alert(JSON.stringify(data, null, 2));
    },
  },
};

/**
 * 복잡한 검색 폼 (그리드 레이아웃)
 */
export const ComplexForm: Story = {
  args: {
    config: {
      id: 'complex-search',
      layout: {
        columns: 3,
        gap: '1rem',
      },
      fields: [
        {
          id: 'keyword',
          name: 'keyword',
          type: 'text',
          label: '검색어',
          placeholder: '검색어를 입력하세요',
          colSpan: 3,
          order: 1,
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
          order: 2,
        },
        {
          id: 'status',
          name: 'status',
          type: 'select',
          label: '상태',
          options: [
            { label: '전체', value: 'all' },
            { label: '활성', value: 'active' },
            { label: '비활성', value: 'inactive' },
          ],
          order: 3,
        },
        {
          id: 'priority',
          name: 'priority',
          type: 'select',
          label: '우선순위',
          options: [
            { label: '전체', value: 'all' },
            { label: '높음', value: 'high' },
            { label: '중간', value: 'medium' },
            { label: '낮음', value: 'low' },
          ],
          order: 4,
        },
      ],
    },
    onSubmit: (data: any) => {
      console.log('검색 데이터:', data);
    },
  },
};

/**
 * 조건부 필드 표시
 */
export const ConditionalFields: Story = {
  args: {
    config: {
      id: 'conditional-search',
      layout: {
        columns: 2,
      },
      fields: [
        {
          id: 'searchType',
          name: 'searchType',
          type: 'select',
          label: '검색 유형',
          options: [
            { label: '기본 검색', value: 'basic' },
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
          // searchType이 'advanced'일 때만 표시
          showWhen: (values: any) => values.searchType === 'advanced',
        },
        {
          id: 'dateRange',
          name: 'dateRange',
          type: 'text',
          label: '날짜 범위',
          placeholder: 'YYYY-MM-DD ~ YYYY-MM-DD',
          // searchType이 'advanced'일 때만 표시
          showWhen: (values: any) => values.searchType === 'advanced',
        },
      ],
    },
    onSubmit: (data: any) => {
      console.log('검색 데이터:', data);
    },
  },
};

/**
 * 헤드리스 모드 (커스텀 렌더링)
 */
export const HeadlessMode: Story = {
  args: {
    config: {
      id: 'headless-search',
      fields: [
        {
          id: 'keyword',
          name: 'keyword',
          type: 'text',
          label: '검색어',
          placeholder: '검색어를 입력하세요',
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
        },
      ],
    },
    onSubmit: (data: any) => {
      console.log('검색 데이터:', data);
    },
    render: ({ fields, submitButton, resetButton }: any) => (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '0.5rem' 
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
          커스텀 검색 폼
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          {fields}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {submitButton}
          {resetButton}
        </div>
      </div>
    ),
  },
};

/**
 * 자동 제출 (디바운스)
 */
export const AutoSubmit: Story = {
  args: {
    config: {
      id: 'auto-submit-search',
      fields: [
        {
          id: 'keyword',
          name: 'keyword',
          type: 'text',
          label: '실시간 검색',
          placeholder: '입력하면 자동으로 검색됩니다',
        },
      ],
      autoSubmit: true,
      autoSubmitDelay: 500,
      showButtons: false,
    },
    onSubmit: (data: any) => {
      console.log('자동 검색:', data);
    },
    onChange: (_name: string, _value: any, data: any) => {
      console.log('값 변경:', data);
    },
  },
};

/**
 * 유효성 검사
 */
export const WithValidation: Story = {
  args: {
    config: {
      id: 'validation-search',
      fields: [
        {
          id: 'email',
          name: 'email',
          type: 'text',
          label: '이메일',
          placeholder: 'example@email.com',
          required: true,
          validation: {
            required: '이메일은 필수입니다',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 형식이 아닙니다',
            },
          },
        },
        {
          id: 'phone',
          name: 'phone',
          type: 'text',
          label: '전화번호',
          placeholder: '010-0000-0000',
          validation: {
            pattern: {
              value: /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
              message: '전화번호 형식: 010-0000-0000',
            },
          },
        },
      ],
    },
    onSubmit: (data: any) => {
      console.log('유효한 데이터:', data);
      alert('검증 통과!');
    },
  },
};

/**
 * 날짜 검색 예제
 */
export const DateSearch: Story = {
  args: {
    config: {
      id: 'date-search',
      name: '날짜 검색',
      layout: {
        columns: 2,
        gap: '1rem',
      },
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
      submitText: '검색',
      resetText: '초기화',
    },
    onSubmit: (data: any) => {
      console.log('날짜 검색 조건:', data);
      alert('검색 조건:\n' + JSON.stringify(data, null, 2));
    },
    onReset: () => {
      console.log('검색 조건 초기화');
    },
  },
};