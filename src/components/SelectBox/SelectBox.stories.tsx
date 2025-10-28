/**
 * SelectBox Storybook 스토리
 * SearchProvider 없이 독립적으로 사용 가능한 SelectBox 컴포넌트
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectBox } from './SelectBox';

const meta: Meta<typeof SelectBox> = {
  title: 'Components/SelectBox',
  component: SelectBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

/**
 * 기본 Uncontrolled 예제
 * defaultValue와 onChange만 사용
 */
export const UncontrolledBasic: Story = {
  render: () => {
    const UncontrolledExample = () => {
      return (
        <div>
          <SelectBox
            label="카테고리"
            placeholder="카테고리를 선택하세요"
            options={[
              { label: '전체', value: 'all' },
              { label: '프론트엔드', value: 'frontend' },
              { label: '백엔드', value: 'backend' },
              { label: 'DevOps', value: 'devops' },
            ]}
            defaultValue="all"
            onChange={(value) => {
              console.log('선택된 값:', value);
            }}
          />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Uncontrolled 모드: defaultValue 사용, 내부 state로 관리됨
          </p>
        </div>
      );
    };

    return <UncontrolledExample />;
  },
};

/**
 * Controlled 예제
 * value와 onChange로 외부에서 상태 관리
 */
export const ControlledBasic: Story = {
  render: () => {
    const ControlledExample = () => {
      const [value, setValue] = useState('frontend');

      return (
        <div>
          <SelectBox
            label="카테고리"
            placeholder="카테고리를 선택하세요"
            value={value}
            onChange={setValue}
            options={[
              { label: '전체', value: 'all' },
              { label: '프론트엔드', value: 'frontend' },
              { label: '백엔드', value: 'backend' },
              { label: 'DevOps', value: 'devops' },
            ]}
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 값:</strong> {value || '(없음)'}
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => setValue('backend')} style={{ marginRight: '0.5rem' }}>
                백엔드로 변경
              </button>
              <button onClick={() => setValue('')}>
                초기화
              </button>
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Controlled 모드: value prop으로 외부에서 상태 관리
          </p>
        </div>
      );
    };

    return <ControlledExample />;
  },
};

/**
 * Multiple Select - Uncontrolled
 */
export const MultipleUncontrolled: Story = {
  render: () => {
    const MultipleExample = () => {
      return (
        <div>
          <SelectBox
            label="기술 스택"
            placeholder="기술을 선택하세요 (다중 선택 가능)"
            isMulti
            options={[
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
              { label: 'TypeScript', value: 'typescript' },
              { label: 'JavaScript', value: 'javascript' },
            ]}
            defaultValue={['react', 'typescript']}
            onChange={(values) => {
              console.log('선택된 값들:', values);
            }}
          />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            다중 선택 Uncontrolled 모드
          </p>
        </div>
      );
    };

    return <MultipleExample />;
  },
};

/**
 * Multiple Select - Controlled
 */
export const MultipleControlled: Story = {
  render: () => {
    const MultipleControlledExample = () => {
      const [skills, setSkills] = useState<string[]>(['react', 'typescript']);

      return (
        <div>
          <SelectBox
            label="기술 스택"
            placeholder="기술을 선택하세요"
            isMulti
            value={skills}
            onChange={setSkills}
            options={[
              { label: 'React', value: 'react' },
              { label: 'Vue', value: 'vue' },
              { label: 'Angular', value: 'angular' },
              { label: 'TypeScript', value: 'typescript' },
              { label: 'JavaScript', value: 'javascript' },
              { label: 'Node.js', value: 'nodejs' },
            ]}
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 기술:</strong>{' '}
            {skills.length > 0 ? skills.join(', ') : '(없음)'}
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={() => setSkills(['react', 'vue', 'typescript'])}
                style={{ marginRight: '0.5rem' }}
              >
                프론트엔드 스택으로 변경
              </button>
              <button onClick={() => setSkills([])}>
                모두 제거
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <MultipleControlledExample />;
  },
};

/**
 * Multiple Select - 전체 선택/해제 기능
 */
export const MultipleWithSelectAll: Story = {
  render: () => {
    const SelectAllExample = () => {
      const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

      return (
        <div>
          <SelectBox
            label="프로그래밍 언어"
            placeholder="언어를 선택하세요"
            isMulti
            showSelectAll  // 전체 선택/해제 버튼 활성화
            value={selectedLanguages}
            onChange={setSelectedLanguages}
            options={[
              { label: 'JavaScript', value: 'js' },
              { label: 'TypeScript', value: 'ts' },
              { label: 'Python', value: 'python' },
              { label: 'Java', value: 'java' },
              { label: 'C++', value: 'cpp' },
              { label: 'Go', value: 'go' },
              { label: 'Rust', value: 'rust' },
              { label: 'Swift', value: 'swift' },
              { label: 'Kotlin', value: 'kotlin' },
              { label: 'Ruby', value: 'ruby' },
            ]}
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 언어 ({selectedLanguages.length}개):</strong>{' '}
            {selectedLanguages.length > 0 ? selectedLanguages.join(', ') : '(없음)'}
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            💡 드롭다운을 열면 상단에 "전체 선택" / "전체 해제" 버튼이 표시됩니다
          </p>
        </div>
      );
    };

    return <SelectAllExample />;
  },
};

/**
 * Multiple Select - 가로 스크롤 (overflow hidden)
 */
export const MultipleWithOverflow: Story = {
  render: () => {
    const OverflowExample = () => {
      const [selectedItems, setSelectedItems] = useState<string[]>([
        'item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8'
      ]);

      return (
        <div>
          <div style={{ maxWidth: '400px' }}>
            <SelectBox
              label="많은 항목 선택"
              placeholder="항목을 선택하세요"
              isMulti
              showSelectAll
              value={selectedItems}
              onChange={setSelectedItems}
              options={Array.from({ length: 20 }, (_, i) => ({
                label: `항목 ${i + 1}`,
                value: `item${i + 1}`,
              }))}
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 항목 ({selectedItems.length}개):</strong>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {selectedItems.join(', ')}
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            💡 선택된 항목이 많을 때 가로로 늘어나며, 너비를 초과하면 숨겨집니다 (overflow: hidden)
          </p>
        </div>
      );
    };

    return <OverflowExample />;
  },
};

/**
 * 검색 기능 (대량 옵션)
 */
export const WithSearch: Story = {
  render: () => {
    const SearchExample = () => {
      const [country, setCountry] = useState('');

      const countries = [
        '대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일', '캐나다', '호주', '뉴질랜드',
        '싱가포르', '홍콩', '대만', '인도', '브라질', '멕시코', '아르헨티나', '스페인', '이탈리아',
        '네덜란드', '벨기에', '스위스', '스웨덴', '노르웨이', '덴마크', '핀란드',
      ];

      return (
        <div>
          <SelectBox
            label="국가"
            placeholder="국가를 검색하세요"
            value={country}
            onChange={setCountry}
            options={countries.map((c) => ({
              label: c,
              value: c.toLowerCase().replace(/\s+/g, '-'),
            }))}
            isSearchable
            isClearable
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 국가:</strong> {country || '(없음)'}
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            검색 기능 활성화: 대량 옵션에서 유용
          </p>
        </div>
      );
    };

    return <SearchExample />;
  },
};

/**
 * 검색 비활성화
 */
export const NonSearchable: Story = {
  render: () => {
    return (
      <SelectBox
        label="상태"
        placeholder="상태를 선택하세요"
        options={[
          { label: '활성', value: 'active' },
          { label: '비활성', value: 'inactive' },
          { label: '대기', value: 'pending' },
        ]}
        isSearchable={false}
        isClearable={false}
        defaultValue="active"
      />
    );
  },
};

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: () => {
    const ErrorExample = () => {
      const [priority, setPriority] = useState('');
      const [error, setError] = useState('');

      const handleChange = (value: any) => {
        setPriority(value);
        if (!value) {
          setError('우선순위를 선택해주세요');
        } else {
          setError('');
        }
      };

      return (
        <div>
          <SelectBox
            label="우선순위"
            placeholder="우선순위를 선택하세요"
            required
            value={priority}
            onChange={handleChange}
            error={error}
            options={[
              { label: '낮음', value: 'low' },
              { label: '보통', value: 'medium' },
              { label: '높음', value: 'high' },
              { label: '긴급', value: 'urgent' },
            ]}
          />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            값을 선택하면 에러가 사라집니다
          </p>
        </div>
      );
    };

    return <ErrorExample />;
  },
};

/**
 * Disabled 상태
 */
export const DisabledState: Story = {
  render: () => {
    return (
      <SelectBox
        label="부서"
        placeholder="부서를 선택하세요"
        disabled
        defaultValue="dev"
        options={[
          { label: '개발팀', value: 'dev' },
          { label: '디자인팀', value: 'design' },
          { label: '기획팀', value: 'planning' },
        ]}
      />
    );
  },
};

/**
 * 복합 예제
 * 여러 SelectBox를 함께 사용
 */
export const CombinedExample: Story = {
  render: () => {
    const CombinedExampleComponent = () => {
      const [formData, setFormData] = useState({
        category: 'frontend',
        skills: ['react', 'typescript'],
        level: 'senior',
      });

      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SelectBox
              label="카테고리"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { label: '프론트엔드', value: 'frontend' },
                { label: '백엔드', value: 'backend' },
                { label: '풀스택', value: 'fullstack' },
              ]}
            />

            <SelectBox
              label="기술 스택"
              isMulti
              value={formData.skills}
              onChange={(value) => setFormData({ ...formData, skills: value })}
              options={[
                { label: 'React', value: 'react' },
                { label: 'Vue', value: 'vue' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'JavaScript', value: 'javascript' },
              ]}
            />

            <SelectBox
              label="경력 수준"
              value={formData.level}
              onChange={(value) => setFormData({ ...formData, level: value })}
              options={[
                { label: '주니어', value: 'junior' },
                { label: '미들', value: 'middle' },
                { label: '시니어', value: 'senior' },
              ]}
            />
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 값:</strong>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      );
    };

    return <CombinedExampleComponent />;
  },
};
