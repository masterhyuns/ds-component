/**
 * ReactSelectField Storybook 스토리
 * react-select 기반 선택 필드의 다양한 사용 예제
 */

import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchProvider } from '../../context/SearchContext';
import { Field } from '../Field';
import { SearchButtons } from '../SearchButtons';
import { useFormRefValues } from '../../hooks/useFormRefValues';
import type { SearchConfig, SearchFormAPI } from '../../types/search.types';

const meta: Meta<typeof SearchProvider> = {
  title: 'Components/Fields/ReactSelectField',
  component: SearchProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchProvider>;

/**
 * Single Select 기본 예제
 * 단일 선택, 검색 가능
 */
export const SingleSelect: Story = {
  render: () => {
    const SingleSelectExample = () => {
      const formRef = useRef<SearchFormAPI>(null);
      const formValues = useFormRefValues(formRef);

      const config: SearchConfig = {
        id: 'single-select',
        fields: [
          {
            id: 'category',
            name: 'category',
            type: 'react-select',
            label: '카테고리',
            placeholder: '카테고리를 선택하세요',
            options: [
              { label: '전체', value: 'all' },
              { label: '프론트엔드', value: 'frontend' },
              { label: '백엔드', value: 'backend' },
              { label: 'DevOps', value: 'devops' },
              { label: '디자인', value: 'design' },
            ],
            isSearchable: true,
            isClearable: true,
          },
        ],
      };

      return (
        <div>
          <SearchProvider config={config} formRef={formRef}>
            <Field name="category" />
            <SearchButtons />
          </SearchProvider>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 값:</strong> {formValues.category || '(없음)'}
          </div>
        </div>
      );
    };

    return <SingleSelectExample />;
  },
};

/**
 * Multiple Select 예제
 * 여러 항목 선택 가능
 */
export const MultipleSelect: Story = {
  render: () => {
    const MultipleSelectExample = () => {
      const formRef = useRef<SearchFormAPI>(null);
      const formValues = useFormRefValues(formRef);

      const config: SearchConfig = {
        id: 'multiple-select',
        fields: [
          {
            id: 'skills',
            name: 'skills',
            type: 'react-select',
            label: '기술 스택',
            placeholder: '기술을 선택하세요 (다중 선택 가능)',
            options: [
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
              { label: 'TypeScript', value: 'typescript' },
              { label: 'JavaScript', value: 'javascript' },
              { label: 'Node.js', value: 'nodejs' },
              { label: 'Python', value: 'python' },
              { label: 'Java', value: 'java' },
              { label: 'Go', value: 'go' },
              { label: 'Rust', value: 'rust' },
            ],
            isMulti: true,
            isSearchable: true,
            isClearable: true,
          },
        ],
      };

      return (
        <div>
          <SearchProvider config={config} formRef={formRef}>
            <Field name="skills" />
            <SearchButtons />
          </SearchProvider>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 기술:</strong>{' '}
            {Array.isArray(formValues.skills) && formValues.skills.length > 0
              ? formValues.skills.join(', ')
              : '(없음)'}
          </div>
        </div>
      );
    };

    return <MultipleSelectExample />;
  },
};

/**
 * 검색 비활성화 예제
 */
export const NonSearchable: Story = {
  render: () => {
    const config: SearchConfig = {
      id: 'non-searchable',
      fields: [
        {
          id: 'status',
          name: 'status',
          type: 'react-select',
          label: '상태',
          placeholder: '상태를 선택하세요',
          options: [
            { label: '활성', value: 'active' },
            { label: '비활성', value: 'inactive' },
            { label: '대기', value: 'pending' },
          ],
          isSearchable: false,
          isClearable: false,
        },
      ],
    };

    return (
      <SearchProvider config={config}>
        <Field name="status" />
        <SearchButtons />
      </SearchProvider>
    );
  },
};

/**
 * 대량 옵션 예제
 * 검색 기능이 유용한 케이스
 */
export const LargeOptionList: Story = {
  render: () => {
    const formRef = useRef<SearchFormAPI>(null);
    const formValues = useFormRefValues(formRef);

    // 대량 옵션 생성
    const countries = [
      '대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일', '캐나다', '호주', '뉴질랜드',
      '싱가포르', '홍콩', '대만', '인도', '브라질', '멕시코', '아르헨티나', '칠레', '콜롬비아',
      '스페인', '이탈리아', '네덜란드', '벨기에', '스위스', '스웨덴', '노르웨이', '덴마크',
      '핀란드', '오스트리아', '포르투갈', '그리스', '폴란드', '체코', '헝가리', '러시아',
      '터키', '이스라엘', '사우디아라비아', '아랍에미리트', '이집트', '남아프리카공화국',
      '케냐', '나이지리아', '태국', '베트남', '말레이시아', '인도네시아', '필리핀',
    ];

    const config: SearchConfig = {
      id: 'large-list',
      fields: [
        {
          id: 'country',
          name: 'country',
          type: 'react-select',
          label: '국가',
          placeholder: '국가를 검색하세요',
          options: countries.map((country) => ({
            label: country,
            value: country.toLowerCase().replace(/\s+/g, '-'),
          })),
          isSearchable: true,
          isClearable: true,
        },
      ],
    };

    return (
      <div>
        <SearchProvider config={config} formRef={formRef}>
          <Field name="country" />
          <SearchButtons />
        </SearchProvider>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>선택된 국가:</strong> {formValues.country || '(없음)'}
        </div>
      </div>
    );
  },
};

/**
 * 에러 상태 예제
 */
export const WithValidation: Story = {
  render: () => {
    const config: SearchConfig = {
      id: 'with-validation',
      fields: [
        {
          id: 'priority',
          name: 'priority',
          type: 'react-select',
          label: '우선순위',
          placeholder: '우선순위를 선택하세요',
          options: [
            { label: '낮음', value: 'low' },
            { label: '보통', value: 'medium' },
            { label: '높음', value: 'high' },
            { label: '긴급', value: 'urgent' },
          ],
          validation: {
            required: '우선순위는 필수입니다',
          },
        },
      ],
    };

    return (
      <SearchProvider
        config={config}
        onSubmit={(data) => {
          alert(`제출된 데이터:\n${JSON.stringify(data, null, 2)}`);
        }}
      >
        <Field name="priority" />
        <SearchButtons />
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
          값을 선택하지 않고 검색 버튼을 누르면 에러가 표시됩니다.
        </p>
      </SearchProvider>
    );
  },
};

/**
 * Disabled 상태 예제
 */
export const DisabledState: Story = {
  render: () => {
    const config: SearchConfig = {
      id: 'disabled',
      fields: [
        {
          id: 'department',
          name: 'department',
          type: 'react-select',
          label: '부서',
          placeholder: '부서를 선택하세요',
          options: [
            { label: '개발팀', value: 'dev' },
            { label: '디자인팀', value: 'design' },
            { label: '기획팀', value: 'planning' },
          ],
          disabled: true,
          defaultValue: 'dev',
        },
      ],
    };

    return (
      <SearchProvider config={config}>
        <Field name="department" />
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
          필드가 비활성화되어 있습니다.
        </p>
      </SearchProvider>
    );
  },
};

/**
 * 복합 예제
 * Single + Multiple 조합
 */
export const CombinedExample: Story = {
  render: () => {
    const formRef = useRef<SearchFormAPI>(null);
    const formValues = useFormRefValues(formRef);

    const config: SearchConfig = {
      id: 'combined',
      fields: [
        {
          id: 'position',
          name: 'position',
          type: 'react-select',
          label: '직급',
          placeholder: '직급을 선택하세요',
          options: [
            { label: '인턴', value: 'intern' },
            { label: '주니어', value: 'junior' },
            { label: '시니어', value: 'senior' },
            { label: '리드', value: 'lead' },
          ],
          isSearchable: true,
        },
        {
          id: 'skills',
          name: 'skills',
          type: 'react-select',
          label: '기술 스택',
          placeholder: '기술을 선택하세요',
          options: [
            { label: 'React', value: 'react' },
            { label: 'Vue', value: 'vue' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Node.js', value: 'nodejs' },
          ],
          isMulti: true,
          isSearchable: true,
        },
      ],
    };

    return (
      <div>
        <SearchProvider
          config={config}
          formRef={formRef}
          onSubmit={(data) => {
            alert(`제출된 데이터:\n${JSON.stringify(data, null, 2)}`);
          }}
        >
          <Field name="position" />
          <Field name="skills" />
          <SearchButtons />
        </SearchProvider>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <div>
            <strong>직급:</strong> {formValues.position || '(없음)'}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <strong>기술:</strong>{' '}
            {Array.isArray(formValues.skills) && formValues.skills.length > 0
              ? formValues.skills.join(', ')
              : '(없음)'}
          </div>
        </div>
      </div>
    );
  },
};
