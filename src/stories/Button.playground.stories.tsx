import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

/**
 * ## Button Playground
 * 
 * 이 스토리는 Controls 패널을 통해 모든 속성을 실시간으로 테스트할 수 있는 플레이그라운드입니다.
 * 우측 Controls 탭에서 각 속성을 조정하며 버튼의 변화를 확인하세요.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button/Playground',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 🎮 Interactive Playground

이 플레이그라운드에서는 모든 Button 속성을 실시간으로 조정하며 테스트할 수 있습니다.

#### 📝 속성 가이드

**primary** - 주요 액션 버튼 여부
- \`true\`: 강조된 스타일, 페이지당 하나만 사용 권장
- \`false\`: 보조 액션 스타일, 여러 개 사용 가능

**size** - 버튼 크기
- \`small\`: 좁은 공간이나 보조 액션용 (32px 높이)
- \`medium\`: 기본 크기, 대부분 상황에 적합 (40px 높이)  
- \`large\`: CTA나 중요한 액션용 (48px 높이)

**backgroundColor** - 커스텀 배경색
- 브랜드 색상이나 특별한 상태 표현시 사용
- 접근성을 위해 충분한 대비 확보 필요

**label** - 버튼 텍스트
- 명확하고 간결하게 작성
- 액션을 나타내는 동사 사용 권장
- 최대 2-3단어 권장

**onClick** - 클릭 이벤트
- 필수 이벤트 핸들러
- Actions 패널에서 호출 확인 가능
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    primary: {
      control: 'boolean',
      description: '페이지의 주요 액션인지 여부를 설정합니다.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기를 설정합니다. 컨텍스트에 맞는 크기를 선택하세요.',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" },
        category: 'Appearance',
      },
    },
    backgroundColor: {
      control: 'color',
      description: '커스텀 배경색을 설정합니다. 브랜드 색상이나 특별한 상태 표현시 사용하세요.',
      table: {
        type: { summary: 'string' },
        category: 'Styling',
      },
    },
    label: {
      control: 'text',
      description: '버튼에 표시될 텍스트입니다. 명확하고 액션 지향적으로 작성하세요.',
      table: {
        type: { summary: 'string' },
        category: 'Content',
      },
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭시 실행될 함수입니다. Actions 패널에서 호출을 확인할 수 있습니다.',
      table: {
        type: { summary: '() => void' },
        category: 'Events',
      },
    },
  },
  args: {
    primary: false,
    size: 'medium',
    label: 'Button',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ### 🎯 기본 플레이그라운드
 * 
 * 우측 Controls 패널에서 모든 속성을 조정해보세요:
 * - **primary**: 체크박스로 Primary/Secondary 전환
 * - **size**: 라디오 버튼으로 크기 선택
 * - **backgroundColor**: 컬러 피커로 배경색 변경
 * - **label**: 텍스트 입력으로 버튼 텍스트 변경
 * - **onClick**: Actions 패널에서 클릭 이벤트 확인
 */
export const Playground: Story = {};

/**
 * ### 📊 속성별 예제 비교
 * 
 * 각 속성의 효과를 비교해볼 수 있는 예제들입니다.
 */
export const PropertyComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px' }}>
      
      {/* Primary vs Secondary */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Primary vs Secondary
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Button primary label="Primary" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              주요 액션 강조
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button label="Secondary" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              보조 액션
            </p>
          </div>
        </div>
      </div>

      {/* Size Variations */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Size Variations
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          <div style={{ textAlign: 'center' }}>
            <Button size="small" label="Small" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              32px 높이
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button size="medium" label="Medium" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              40px 높이 (기본)
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button size="large" label="Large" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              48px 높이
            </p>
          </div>
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Custom Background Colors
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <Button label="Success" backgroundColor="#10b981" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              #10b981
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button label="Warning" backgroundColor="#f59e0b" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              #f59e0b
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button label="Danger" backgroundColor="#ef4444" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              #ef4444
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button label="Purple" backgroundColor="#8b5cf6" onClick={fn()} />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              #8b5cf6
            </p>
          </div>
        </div>
      </div>

      {/* Label Variations */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          Label Examples
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button label="저장" onClick={fn()} />
          <Button label="취소" onClick={fn()} />
          <Button label="확인" onClick={fn()} />
          <Button label="삭제" onClick={fn()} />
          <Button label="수정" onClick={fn()} />
          <Button label="다운로드" onClick={fn()} />
          <Button label="업로드" onClick={fn()} />
          <Button label="새로 만들기" onClick={fn()} />
        </div>
        <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
          💡 <strong>팁:</strong> 동사 위주의 명확한 액션을 나타내는 텍스트를 사용하세요. 
          사용자가 버튼을 클릭했을 때 어떤 일이 일어날지 예측할 수 있어야 합니다.
        </p>
      </div>

    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '각 속성의 효과를 시각적으로 비교해볼 수 있습니다. 실제 프로젝트에서 사용할 조합을 찾아보세요.',
      },
    },
  },
};

/**
 * ### ⚡ 성능 테스트
 * 
 * 여러 버튼이 동시에 렌더링될 때의 성능을 확인해보세요.
 */
export const PerformanceTest: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
        100개 버튼 렌더링 테스트
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
        gap: '8px',
        maxHeight: '400px',
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        padding: '16px',
        borderRadius: '8px'
      }}>
        {Array.from({ length: 100 }, (_, i) => (
          <Button
            key={i}
            primary={i % 3 === 0}
            size={['small', 'medium', 'large'][i % 3] as 'small' | 'medium' | 'large'}
            label={`Button ${i + 1}`}
            onClick={fn()}
          />
        ))}
      </div>
      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
        💡 개발자 도구의 Performance 탭으로 렌더링 성능을 측정해보세요.
      </p>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '대량의 버튼이 렌더링될 때의 성능을 테스트할 수 있습니다.',
      },
    },
  },
};