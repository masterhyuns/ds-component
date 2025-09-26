import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectField } from './MultiSelectField';
import { Option } from '../../types';

const meta: Meta<typeof MultiSelectField> = {
  title: 'Fields/MultiSelectField',
  component: MultiSelectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: '선택된 값들의 배열',
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

// 기본 브랜드 옵션
const brandOptions: Option[] = [
  { label: '삼성', value: 'samsung' },
  { label: 'LG', value: 'lg' },
  { label: '애플', value: 'apple' },
  { label: '소니', value: 'sony' },
  { label: '화웨이', value: 'huawei' },
];

// 기술 스택 옵션
const techOptions: Option[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
];

// 지역 옵션 (일부 비활성화)
const regionOptions: Option[] = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
  { label: '인천', value: 'incheon' },
  { label: '광주', value: 'gwangju' },
  { label: '대전', value: 'daejeon' },
  { label: '울산', value: 'ulsan' },
  { label: '세종', value: 'sejong', disabled: true },
  { label: '경기', value: 'gyeonggi' },
  { label: '강원', value: 'gangwon', disabled: true },
];

// 빈 배열 - 아무것도 선택되지 않음
export const Empty: Story = {
  args: {
    value: [],
    meta: {
      id: 'empty-multiselect',
      name: 'emptyMultiselect',
      type: 'multiselect',
      label: '브랜드 선택',
      options: brandOptions,
    },
    onChange: (values: any) => console.log('선택된 값들:', values),
    onBlur: () => console.log('포커스 해제'),
  },
};

// 단일 선택 상태
export const SingleSelection: Story = {
  args: {
    value: ['samsung'],
    meta: {
      id: 'single-multiselect',
      name: 'singleMultiselect',
      type: 'multiselect',
      label: '브랜드 선택',
      options: brandOptions,
    },
    onChange: (values: any) => console.log('선택된 값들:', values),
  },
};

// 다중 선택 상태
export const MultipleSelection: Story = {
  args: {
    value: ['react', 'typescript', 'nodejs'],
    meta: {
      id: 'multiple-multiselect',
      name: 'multipleMultiselect',
      type: 'multiselect',
      label: '기술 스택',
      options: techOptions,
    },
    onChange: (values: any) => console.log('선택된 기술들:', values),
  },
};

// 모든 옵션 선택됨
export const AllSelected: Story = {
  args: {
    value: brandOptions.map(option => option.value),
    meta: {
      id: 'all-selected-multiselect',
      name: 'allSelectedMultiselect',
      type: 'multiselect',
      label: '모든 브랜드 선택됨',
      options: brandOptions,
    },
    onChange: (values: any) => console.log('선택된 값들:', values),
  },
};

// 필수 필드 + 에러 상태
export const Required: Story = {
  args: {
    value: [],
    error: '최소 하나 이상 선택해주세요',
    meta: {
      id: 'required-multiselect',
      name: 'requiredMultiselect',
      type: 'multiselect',
      label: '필수 기술 스택',
      options: techOptions,
      validation: {
        required: true,
      },
    },
    onChange: (values: any) => console.log('선택된 기술들:', values),
  },
};

// 에러 상태 (다른 검증 실패)
export const WithValidationError: Story = {
  args: {
    value: ['react'],
    error: '최소 3개 이상의 기술을 선택해야 합니다',
    meta: {
      id: 'validation-error-multiselect',
      name: 'validationErrorMultiselect',
      type: 'multiselect',
      label: '기술 스택 (최소 3개)',
      options: techOptions,
    },
    onChange: (values: any) => console.log('선택된 기술들:', values),
  },
};

// 전체 비활성화
export const Disabled: Story = {
  args: {
    value: ['seoul', 'busan', 'daegu'],
    disabled: true,
    meta: {
      id: 'disabled-multiselect',
      name: 'disabledMultiselect',
      type: 'multiselect',
      label: '비활성화된 지역 선택',
      options: regionOptions,
    },
    onChange: (values: any) => console.log('선택된 지역들:', values),
  },
};

// 일부 옵션만 비활성화
export const WithDisabledOptions: Story = {
  args: {
    value: ['seoul', 'busan'],
    meta: {
      id: 'disabled-options-multiselect',
      name: 'disabledOptionsMultiselect',
      type: 'multiselect',
      label: '지역 선택 (일부 제한)',
      options: regionOptions,
    },
    onChange: (values: any) => console.log('선택된 지역들:', values),
  },
};

// 많은 옵션이 있는 경우
export const LargeOptionList: Story = {
  args: {
    value: ['KR', 'US', 'JP'],
    meta: {
      id: 'large-list-multiselect',
      name: 'largeListMultiselect',
      type: 'multiselect',
      label: '국가 선택',
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
        { label: '네덜란드', value: 'NL' },
        { label: '스웨덴', value: 'SE' },
        { label: '노르웨이', value: 'NO' },
        { label: '덴마크', value: 'DK' },
        { label: '핀란드', value: 'FI' },
      ],
    },
    onChange: (values: any) => console.log('선택된 국가들:', values),
  },
};

// 숫자 값을 가진 옵션들
export const NumericValues: Story = {
  args: {
    value: [1, 3, 5],
    meta: {
      id: 'numeric-multiselect',
      name: 'numericMultiselect',
      type: 'multiselect',
      label: '평점 선택 (복수 가능)',
      options: [
        { label: '⭐ 1점', value: 1 },
        { label: '⭐⭐ 2점', value: 2 },
        { label: '⭐⭐⭐ 3점', value: 3 },
        { label: '⭐⭐⭐⭐ 4점', value: 4 },
        { label: '⭐⭐⭐⭐⭐ 5점', value: 5 },
      ],
    },
    onChange: (values: any) => console.log('선택된 평점들:', values),
  },
};

// 복잡한 객체 값
export const ObjectValues: Story = {
  args: {
    value: [
      JSON.stringify({ id: 'user1', name: '김철수', department: 'dev' }),
      JSON.stringify({ id: 'user3', name: '박민수', department: 'marketing' })
    ],
    meta: {
      id: 'object-multiselect',
      name: 'objectMultiselect',
      type: 'multiselect',
      label: '담당자 선택 (복수 가능)',
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
        { 
          label: '최지영 (영업팀)', 
          value: JSON.stringify({ id: 'user4', name: '최지영', department: 'sales' })
        },
      ],
    },
    onChange: (values: any) => {
      console.log('선택된 담당자들:', values.map((v: any) => {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      }));
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    value: ['option1'],
    meta: {
      id: 'playground-multiselect',
      name: 'playgroundMultiselect',
      type: 'multiselect',
      label: '플레이그라운드',
      options: [
        { label: '첫 번째 선택지', value: 'option1' },
        { label: '두 번째 선택지', value: 'option2' },
        { label: '세 번째 선택지', value: 'option3' },
        { label: '네 번째 선택지', value: 'option4' },
        { label: '비활성화된 선택지', value: 'disabled', disabled: true },
        { label: '다섯 번째 선택지', value: 'option5' },
      ],
    },
    onChange: (values: any) => {
      console.log('선택된 값들:', values);
      console.log('선택된 개수:', values.length);
    },
    onBlur: () => console.log('포커스 해제'),
  },
};

// 실제 사용 사례 - 필터 시나리오
export const FilterScenario: Story = {
  args: {
    value: [],
    meta: {
      id: 'filter-multiselect',
      name: 'filterMultiselect',
      type: 'multiselect',
      label: '상품 필터',
      options: [
        { label: '무료배송', value: 'free_shipping' },
        { label: '당일배송', value: 'same_day' },
        { label: '할인상품', value: 'on_sale' },
        { label: '신상품', value: 'new_arrival' },
        { label: '베스트셀러', value: 'bestseller' },
        { label: '리뷰 많은 상품', value: 'many_reviews' },
        { label: '평점 높은 상품', value: 'high_rating' },
      ],
    },
    onChange: (values: any) => {
      console.log('적용된 필터들:', values);
      // 실제 사용에서는 여기서 상품 목록을 필터링
    },
  },
};