import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

/**
 * ## Button 컴포넌트
 * 
 * 사용자 상호작용을 위한 기본 UI 컴포넌트입니다.
 * 다양한 크기, 스타일, 상태를 지원합니다.
 * 
 * ### 주요 특징
 * - Primary/Secondary 스타일 지원
 * - 3가지 크기 옵션 (Small, Medium, Large)
 * - 커스텀 배경색 지원
 * - 접근성 고려된 설계
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button/Enhanced',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Button 컴포넌트는 사용자의 액션을 트리거하는 핵심 UI 요소입니다.
일관된 디자인 시스템을 유지하면서 다양한 상황에서 사용할 수 있습니다.

### 사용 가이드라인
- Primary 버튼은 페이지당 하나만 사용
- Secondary 버튼은 보조 액션에 사용
- 텍스트는 명확하고 액션 지향적으로 작성
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    primary: {
      control: 'boolean',
      description: '페이지의 주요 액션인지 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" },
      },
    },
    backgroundColor: {
      control: 'color',
      description: '커스텀 배경색 (선택사항)',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: '버튼에 표시될 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리들
export const Primary: Story = {
  args: {
    primary: true,
    label: '주요 액션',
  },
  parameters: {
    docs: {
      description: {
        story: '페이지의 주요 액션에 사용되는 Primary 버튼입니다. 강조된 스타일로 사용자의 주목을 끕니다.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: '보조 액션',
  },
  parameters: {
    docs: {
      description: {
        story: '보조 액션에 사용되는 Secondary 버튼입니다. Primary 버튼과 함께 사용할 때 시각적 계층을 만듭니다.',
      },
    },
  },
};

// 크기 변형들
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small" label="Small" onClick={fn()} />
      <Button size="medium" label="Medium" onClick={fn()} />
      <Button size="large" label="Large" onClick={fn()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 버튼들입니다. 컨텍스트에 따라 적절한 크기를 선택하세요.',
      },
    },
  },
};

// 스타일 변형들
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button primary label="Primary" onClick={fn()} />
        <Button label="Secondary" onClick={fn()} />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button primary size="small" label="Small Primary" onClick={fn()} />
        <Button size="small" label="Small Secondary" onClick={fn()} />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button primary size="large" label="Large Primary" onClick={fn()} />
        <Button size="large" label="Large Secondary" onClick={fn()} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 스타일과 크기 조합을 한번에 볼 수 있습니다. 디자인 시스템의 일관성을 확인하세요.',
      },
    },
  },
};

// 커스텀 색상
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button label="Success" backgroundColor="#28a745" onClick={fn()} />
      <Button label="Warning" backgroundColor="#ffc107" onClick={fn()} />
      <Button label="Danger" backgroundColor="#dc3545" onClick={fn()} />
      <Button label="Info" backgroundColor="#17a2b8" onClick={fn()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '특별한 상황에서 사용할 수 있는 커스텀 색상 버튼들입니다. 브랜드 가이드라인에 따라 사용하세요.',
      },
    },
  },
};

// 실제 사용 사례들
export const UseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 폼 버튼들 */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>폼 액션</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button primary label="저장" onClick={fn()} />
          <Button label="취소" onClick={fn()} />
        </div>
      </div>
      
      {/* 네비게이션 버튼들 */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>네비게이션</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button label="이전" size="small" onClick={fn()} />
          <Button primary label="다음" size="small" onClick={fn()} />
        </div>
      </div>
      
      {/* CTA 버튼들 */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Call to Action</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button primary size="large" label="지금 시작하기" onClick={fn()} />
          <Button size="large" label="더 알아보기" onClick={fn()} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 애플리케이션에서 자주 사용되는 버튼 조합들입니다. 상황별 적절한 조합을 참고하세요.',
      },
    },
  },
};

// 개별 속성 데모
export const SmallButton: Story = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};

export const MediumButton: Story = {
  args: {
    size: 'medium',
    label: 'Medium Button',
  },
};

export const LargeButton: Story = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

export const CustomBackground: Story = {
  args: {
    backgroundColor: '#6366f1',
    label: 'Custom Color',
  },
  parameters: {
    docs: {
      description: {
        story: 'backgroundColor 속성을 사용하여 커스텀 색상을 적용할 수 있습니다.',
      },
    },
  },
};