import type { Meta, StoryObj } from '@storybook/react';
import { SelectField } from './SelectField';
import { Option } from '../../types';

const meta: Meta<typeof SelectField> = {
  title: 'Fields/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '선택된 값',
    },
    error: {
      control: 'text',
      description: '에러 메시지',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션 데이터
const basicOptions: Option[] = [
  { label: '옵션 1', value: 'option1' },
  { label: '옵션 2', value: 'option2' },
  { label: '옵션 3', value: 'option3' },
];

// 카테고리 옵션 데이터
const categoryOptions: Option[] = [
  { label: '개발', value: 'development' },
  { label: '디자인', value: 'design' },
  { label: '마케팅', value: 'marketing' },
  { label: '영업', value: 'sales' },
  { label: '인사', value: 'hr' },
];

// 우선순위 옵션 데이터 (일부 비활성화)
const priorityOptions: Option[] = [
  { label: '긴급', value: 'urgent' },
  { label: '높음', value: 'high' },
  { label: '보통', value: 'medium' },
  { label: '낮음', value: 'low' },
  { label: '사용 불가', value: 'disabled', disabled: true },
];

// 기본 스토리
export const Default: Story = {
  args: {
    value: '',
    meta: {
      id: 'basic-select',
      name: 'basicSelect',
      type: 'select',
      label: '기본 선택',
      placeholder: '옵션을 선택하세요',
      options: basicOptions,
    },
    onChange: (value: any) => console.log('선택됨:', value),
    onBlur: () => console.log('포커스 해제'),
  },
};

// 선택된 값이 있는 스토리
export const WithValue: Story = {
  args: {
    value: 'option2',
    meta: {
      id: 'selected-select',
      name: 'selectedSelect',
      type: 'select',
      label: '선택된 상태',
      options: basicOptions,
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 필수 필드 스토리
export const Required: Story = {
  args: {
    value: '',
    meta: {
      id: 'required-select',
      name: 'requiredSelect',
      type: 'select',
      label: '필수 선택 필드',
      placeholder: '반드시 선택하세요',
      options: categoryOptions,
      validation: {
        required: true,
      },
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 에러 상태 스토리
export const WithError: Story = {
  args: {
    value: '',
    error: '옵션을 선택해주세요',
    meta: {
      id: 'error-select',
      name: 'errorSelect',
      type: 'select',
      label: '에러 상태',
      options: categoryOptions,
      validation: {
        required: true,
      },
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 비활성화 스토리
export const Disabled: Story = {
  args: {
    value: 'development',
    disabled: true,
    meta: {
      id: 'disabled-select',
      name: 'disabledSelect',
      type: 'select',
      label: '비활성화된 선택',
      options: categoryOptions,
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 일부 옵션 비활성화 스토리
export const WithDisabledOptions: Story = {
  args: {
    value: 'medium',
    meta: {
      id: 'priority-select',
      name: 'prioritySelect',
      type: 'select',
      label: '우선순위 선택',
      placeholder: '우선순위를 선택하세요',
      options: priorityOptions,
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 많은 옵션이 있는 스토리
export const ManyOptions: Story = {
  args: {
    value: '',
    meta: {
      id: 'country-select',
      name: 'countrySelect',
      type: 'select',
      label: '국가 선택',
      placeholder: '국가를 선택하세요',
      options: [
        { label: '대한민국', value: 'KR' },
        { label: '미국', value: 'US' },
        { label: '일본', value: 'JP' },
        { label: '중국', value: 'CN' },
        { label: '독일', value: 'DE' },
        { label: '프랑스', value: 'FR' },
        { label: '영국', value: 'GB' },
        { label: '이탈리아', value: 'IT' },
        { label: '스페인', value: 'ES' },
        { label: '캐나다', value: 'CA' },
        { label: '호주', value: 'AU' },
        { label: '브라질', value: 'BR' },
        { label: '인도', value: 'IN' },
        { label: '러시아', value: 'RU' },
        { label: '멕시코', value: 'MX' },
      ],
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 숫자 값 옵션 스토리
export const NumericValues: Story = {
  args: {
    value: 5,
    meta: {
      id: 'rating-select',
      name: 'ratingSelect',
      type: 'select',
      label: '평점 선택',
      placeholder: '평점을 선택하세요',
      options: [
        { label: '⭐ 1점', value: 1 },
        { label: '⭐⭐ 2점', value: 2 },
        { label: '⭐⭐⭐ 3점', value: 3 },
        { label: '⭐⭐⭐⭐ 4점', value: 4 },
        { label: '⭐⭐⭐⭐⭐ 5점', value: 5 },
      ],
    },
    onChange: (value: any) => console.log('선택됨:', value),
  },
};

// 복잡한 객체 값 스토리
export const ObjectValues: Story = {
  args: {
    value: JSON.stringify({ id: 'user1', name: '김철수' }),
    meta: {
      id: 'user-select',
      name: 'userSelect',
      type: 'select',
      label: '사용자 선택',
      placeholder: '담당자를 선택하세요',
      options: [
        { 
          label: '김철수 (개발팀)', 
          value: JSON.stringify({ id: 'user1', name: '김철수', department: 'dev' })
        },
        { 
          label: '이영희 (디자인팀)', 
          value: JSON.stringify({ id: 'user2', name: '이영희', department: 'design' })
        },
        { 
          label: '박민수 (마케팅팀)', 
          value: JSON.stringify({ id: 'user3', name: '박민수', department: 'marketing' })
        },
      ],
    },
    onChange: (value: any) => {
      try {
        const userData = JSON.parse(value);
        console.log('선택된 사용자:', userData);
      } catch {
        console.log('선택됨:', value);
      }
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    value: '',
    meta: {
      id: 'playground-select',
      name: 'playgroundSelect',
      type: 'select',
      label: '플레이그라운드',
      placeholder: '원하는 옵션을 선택해보세요',
      options: [
        { label: '첫 번째 선택지', value: 'first' },
        { label: '두 번째 선택지', value: 'second' },
        { label: '세 번째 선택지', value: 'third' },
        { label: '비활성화된 선택지', value: 'disabled', disabled: true },
      ],
      validation: {
        required: false,
      },
    },
    onChange: (value: any) => console.log('선택됨:', value),
    onBlur: () => console.log('포커스 해제'),
  },
};