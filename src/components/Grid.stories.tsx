import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid, GridItem } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Grid 레이아웃 시스템

**Grid 컴포넌트**는 CSS Grid 기반의 2차원 레이아웃 시스템으로, 복잡한 레이아웃을 쉽게 구성할 수 있습니다.

## ✨ 주요 기능

- **🔧 유연한 컬럼 시스템**: 기본 12컬럼 시스템, 자유로운 컬럼 수 설정
- **📱 반응형 디자인**: 브레이크포인트별 다른 설정 (xs, sm, md, lg, xl, xxl)
- **⚡ 자동 크기 조정**: auto-fit 모드로 콘텐츠에 맞춘 자동 레이아웃
- **🎯 정밀한 간격 관리**: 5단계 간격 시스템 (xs, sm, md, lg, xl)
- **📐 고급 배치**: 위치 지정, 정렬, 숨김 기능

## 📋 기본 사용법

\`\`\`tsx
import { Grid, GridItem } from 'your-package';

// 기본 3컬럼 레이아웃
<Grid columns={3} gap="md">
  <GridItem><div>콘텐츠 1</div></GridItem>
  <GridItem><div>콘텐츠 2</div></GridItem>
  <GridItem><div>콘텐츠 3</div></GridItem>
</Grid>

// 반응형 레이아웃
<Grid 
  columns={{ xs: 1, sm: 2, lg: 4 }} 
  gap={{ xs: 'sm', lg: 'lg' }}
>
  <GridItem colSpan={{ xs: 1, sm: 2, lg: 1 }}>
    <div>반응형 콘텐츠</div>
  </GridItem>
</Grid>

// 자동 크기 조정
<Grid autoFit minColumnWidth="250px" gap="lg">
  <GridItem><div>자동 조정 1</div></GridItem>
  <GridItem><div>자동 조정 2</div></GridItem>
</Grid>
\`\`\`

## 🎨 반응형 브레이크포인트

- **xs**: 0px 이상 (모바일)
- **sm**: 576px 이상 (태블릿 세로)
- **md**: 768px 이상 (태블릿 가로)
- **lg**: 992px 이상 (데스크톱)
- **xl**: 1200px 이상 (큰 데스크톱)
- **xxl**: 1400px 이상 (매우 큰 화면)

## 📏 간격 시스템

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem) - 기본값
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
        `,
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 24, step: 1 },
      description: '총 컬럼 수',
    },
    gap: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '간격 크기',
    },
    alignItems: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'stretch', 'baseline'],
      description: '수직 정렬',
    },
    justifyContent: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'],
      description: '수평 정렬',
    },
    equalHeight: {
      control: { type: 'boolean' },
      description: '동일한 높이 모드',
    },
    autoFit: {
      control: { type: 'boolean' },
      description: '자동 크기 조정',
    },
    maxWidth: {
      control: { type: 'text' },
      description: '최대 너비',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', background: '#f5f5f5', minHeight: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Grid>;

// 스토리용 박스 컴포넌트
const ExampleBox: React.FC<{ 
  children: React.ReactNode; 
  color?: string; 
  height?: string;
  className?: string;
}> = ({ 
  children, 
  color = '#e3f2fd', 
  height = '80px',
  className = ''
}) => (
  <div
    className={className}
    style={{
      backgroundColor: color,
      border: '2px solid #1976d2',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#1976d2',
      minHeight: height,
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

// 기본 그리드
export const Default: Story = {
  args: {
    columns: 12,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={4}>
        <ExampleBox>4 컬럼</ExampleBox>
      </GridItem>
      <GridItem colSpan={4}>
        <ExampleBox>4 컬럼</ExampleBox>
      </GridItem>
      <GridItem colSpan={4}>
        <ExampleBox>4 컬럼</ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 반응형 그리드
export const Responsive: Story = {
  args: {
    columns: { xs: 1, sm: 2, md: 3, lg: 4 },
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <GridItem key={i}>
          <ExampleBox>아이템 {i + 1}</ExampleBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// 복잡한 레이아웃
export const ComplexLayout: Story = {
  args: {
    columns: 12,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={12}>
        <ExampleBox color="#ffecb3">헤더 (12 컬럼)</ExampleBox>
      </GridItem>
      <GridItem colSpan={3}>
        <ExampleBox color="#f3e5f5" height="200px">
          사이드바<br/>(3 컬럼)
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={6}>
        <ExampleBox color="#e8f5e8" height="200px">
          메인 콘텐츠<br/>(6 컬럼)
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={3}>
        <ExampleBox color="#fff3e0" height="200px">
          위젯<br/>(3 컬럼)
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={12}>
        <ExampleBox color="#fce4ec">푸터 (12 컬럼)</ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 자동 크기 조정
export const AutoFit: Story = {
  args: {
    autoFit: true,
    minColumnWidth: '200px',
    gap: 'lg',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <GridItem key={i}>
          <ExampleBox>
            자동 조정<br/>아이템 {i + 1}
          </ExampleBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// 다양한 간격
export const DifferentGaps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3>XS 간격</h3>
        <Grid columns={4} gap="xs">
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i}>
              <ExampleBox>XS</ExampleBox>
            </GridItem>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3>SM 간격</h3>
        <Grid columns={4} gap="sm">
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i}>
              <ExampleBox>SM</ExampleBox>
            </GridItem>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3>MD 간격</h3>
        <Grid columns={4} gap="md">
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i}>
              <ExampleBox>MD</ExampleBox>
            </GridItem>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3>LG 간격</h3>
        <Grid columns={4} gap="lg">
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i}>
              <ExampleBox>LG</ExampleBox>
            </GridItem>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3>XL 간격</h3>
        <Grid columns={4} gap="xl">
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i}>
              <ExampleBox>XL</ExampleBox>
            </GridItem>
          ))}
        </Grid>
      </div>
    </div>
  ),
};

// 정렬 예제
export const Alignment: Story = {
  args: {
    columns: 3,
    gap: 'md',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  render: (args) => (
    <div style={{ minHeight: '300px' }}>
      <Grid {...args}>
        <GridItem>
          <ExampleBox height="60px">짧은 박스</ExampleBox>
        </GridItem>
        <GridItem>
          <ExampleBox height="120px">
            긴 박스<br/>두 줄 텍스트
          </ExampleBox>
        </GridItem>
        <GridItem>
          <ExampleBox height="80px">보통 박스</ExampleBox>
        </GridItem>
      </Grid>
    </div>
  ),
};

// 동일한 높이
export const EqualHeight: Story = {
  args: {
    columns: 3,
    gap: 'md',
    equalHeight: true,
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <ExampleBox>
          짧은 콘텐츠
        </ExampleBox>
      </GridItem>
      <GridItem>
        <ExampleBox>
          긴 콘텐츠<br/>
          여러 줄의 텍스트가<br/>
          포함된 박스
        </ExampleBox>
      </GridItem>
      <GridItem>
        <ExampleBox>
          보통 길이의<br/>
          콘텐츠
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 위치 지정
export const Positioning: Story = {
  args: {
    columns: 4,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colStart={1} colEnd={3}>
        <ExampleBox color="#ffcdd2">
          컬럼 1-3 (colStart=1, colEnd=3)
        </ExampleBox>
      </GridItem>
      <GridItem colStart={3} colEnd={5}>
        <ExampleBox color="#c8e6c9">
          컬럼 3-5 (colStart=3, colEnd=5)
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={2}>
        <ExampleBox color="#ffe0b2">
          2 컬럼 span
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={2}>
        <ExampleBox color="#d1c4e9">
          2 컬럼 span
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 숨김 기능
export const HiddenItems: Story = {
  args: {
    columns: 4,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <ExampleBox>항상 보임</ExampleBox>
      </GridItem>
      <GridItem hidden={{ xs: true, md: false }}>
        <ExampleBox color="#ffcdd2">
          모바일에서 숨김<br/>
          (MD 이상에서 보임)
        </ExampleBox>
      </GridItem>
      <GridItem>
        <ExampleBox>항상 보임</ExampleBox>
      </GridItem>
      <GridItem hidden={{ md: true }}>
        <ExampleBox color="#c8e6c9">
          데스크톱에서 숨김<br/>
          (MD 미만에서만 보임)
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 반응형 컬럼 스팬
export const ResponsiveColSpan: Story = {
  args: {
    columns: 12,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <ExampleBox>
          반응형 컬럼<br/>
          XS:12 SM:6 MD:4 LG:3
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
        <ExampleBox>
          반응형 컬럼<br/>
          XS:12 SM:6 MD:8 LG:9
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 중첩 그리드
export const NestedGrid: Story = {
  args: {
    columns: 2,
    gap: 'lg',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <ExampleBox color="#e1f5fe" height="auto">
          <div style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#01579b' }}>중첩된 그리드 1</h4>
            <Grid columns={2} gap="sm">
              <GridItem>
                <ExampleBox color="#ffffff" height="60px">1-1</ExampleBox>
              </GridItem>
              <GridItem>
                <ExampleBox color="#ffffff" height="60px">1-2</ExampleBox>
              </GridItem>
            </Grid>
          </div>
        </ExampleBox>
      </GridItem>
      
      <GridItem>
        <ExampleBox color="#f3e5f5" height="auto">
          <div style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#4a148c' }}>중첩된 그리드 2</h4>
            <Grid columns={3} gap="xs">
              <GridItem>
                <ExampleBox color="#ffffff" height="50px">2-1</ExampleBox>
              </GridItem>
              <GridItem>
                <ExampleBox color="#ffffff" height="50px">2-2</ExampleBox>
              </GridItem>
              <GridItem>
                <ExampleBox color="#ffffff" height="50px">2-3</ExampleBox>
              </GridItem>
            </Grid>
          </div>
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// ========================================
// 🚀 실전 사용 예제들
// ========================================

// 대시보드 레이아웃
export const DashboardLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 대시보드 레이아웃 예제

실제 대시보드에서 사용할 수 있는 레이아웃입니다.
- 헤더: 전체 너비
- 사이드바: 고정 너비
- 메인 영역: 2x2 위젯 그리드
- 푸터: 전체 너비
        `
      }
    }
  },
  render: () => (
    <Grid columns={12} gap="md" maxWidth="1200px">
      {/* 헤더 */}
      <GridItem colSpan={12}>
        <ExampleBox color="#1976d2" height="60px">
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            📊 대시보드 헤더
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 사이드바 */}
      <GridItem colSpan={{ xs: 12, md: 3 }}>
        <ExampleBox color="#f5f5f5" height="400px">
          <div style={{ textAlign: 'left', padding: '1rem' }}>
            <strong>📋 네비게이션</strong><br/><br/>
            • 홈<br/>
            • 분석<br/>
            • 리포트<br/>
            • 설정<br/>
          </div>
        </ExampleBox>
      </GridItem>
      
      {/* 메인 콘텐츠 영역 */}
      <GridItem colSpan={{ xs: 12, md: 9 }}>
        <Grid columns={2} gap="md">
          <GridItem>
            <ExampleBox color="#e8f5e8" height="190px">
              📈 매출 차트
            </ExampleBox>
          </GridItem>
          <GridItem>
            <ExampleBox color="#fff3e0" height="190px">
              👥 사용자 통계
            </ExampleBox>
          </GridItem>
          <GridItem>
            <ExampleBox color="#f3e5f5" height="190px">
              📦 주문 현황
            </ExampleBox>
          </GridItem>
          <GridItem>
            <ExampleBox color="#e1f5fe" height="190px">
              💰 수익 분석
            </ExampleBox>
          </GridItem>
        </Grid>
      </GridItem>
      
      {/* 푸터 */}
      <GridItem colSpan={12}>
        <ExampleBox color="#757575" height="50px">
          <span style={{ color: 'white' }}>
            © 2024 회사명. All rights reserved.
          </span>
        </ExampleBox>
      </GridItem>
    </Grid>
  ),
};

// 제품 카드 그리드
export const ProductGrid: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 제품 카드 그리드 예제

E-commerce 사이트의 제품 목록 레이아웃입니다.
- 반응형: 모바일(1열) → 태블릿(2열) → 데스크톱(4열)
- 자동 크기 조정으로 화면에 맞춰 최적화
        `
      }
    }
  },
  render: () => (
    <Grid 
      columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} 
      gap={{ xs: 'sm', md: 'md', lg: 'lg' }}
      maxWidth="1200px"
    >
      {[
        { name: '스마트폰', price: '1,200,000원', color: '#e3f2fd' },
        { name: '노트북', price: '2,500,000원', color: '#f3e5f5' },
        { name: '태블릿', price: '800,000원', color: '#e8f5e8' },
        { name: '헤드폰', price: '300,000원', color: '#fff3e0' },
        { name: '스마트워치', price: '450,000원', color: '#fce4ec' },
        { name: '키보드', price: '150,000원', color: '#f1f8e9' },
        { name: '마우스', price: '80,000원', color: '#fff8e1' },
        { name: '모니터', price: '650,000원', color: '#e8eaf6' },
      ].map((product, index) => (
        <GridItem key={index}>
          <ExampleBox color={product.color} height="200px">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {index === 0 ? '📱' : index === 1 ? '💻' : index === 2 ? '📱' : 
                 index === 3 ? '🎧' : index === 4 ? '⌚' : index === 5 ? '⌨️' : 
                 index === 6 ? '🖱️' : '🖥️'}
              </div>
              <strong>{product.name}</strong><br/>
              <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                {product.price}
              </span>
            </div>
          </ExampleBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// 블로그 레이아웃
export const BlogLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 블로그 레이아웃 예제

전형적인 블로그 레이아웃입니다.
- 메인 콘텐츠: 8/12 컬럼
- 사이드바: 4/12 컬럼
- 반응형: 모바일에서는 세로로 배치
        `
      }
    }
  },
  render: () => (
    <Grid columns={12} gap="lg" maxWidth="1200px">
      {/* 헤더 */}
      <GridItem colSpan={12}>
        <ExampleBox color="#4a148c" height="80px">
          <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            📝 내 블로그
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 메인 콘텐츠 */}
      <GridItem colSpan={{ xs: 12, lg: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 글 목록 */}
          {[
            { title: 'React Grid 시스템 활용하기', date: '2024.01.15' },
            { title: '반응형 웹 디자인 완벽 가이드', date: '2024.01.10' },
            { title: 'CSS Grid vs Flexbox 비교 분석', date: '2024.01.05' }
          ].map((post, index) => (
            <ExampleBox key={index} color="#f8f9fa" height="120px">
              <div style={{ textAlign: 'left', padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
                  {post.title}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                  {post.date} • 5분 읽기
                </p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#333' }}>
                  블로그 포스트의 미리보기 텍스트가 여기에 표시됩니다...
                </p>
              </div>
            </ExampleBox>
          ))}
        </div>
      </GridItem>
      
      {/* 사이드바 */}
      <GridItem colSpan={{ xs: 12, lg: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 프로필 */}
          <ExampleBox color="#e1f5fe" height="150px">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍💻</div>
              <strong>개발자 김코딩</strong><br/>
              <small style={{ color: '#666' }}>
                Frontend Developer<br/>
                React & TypeScript
              </small>
            </div>
          </ExampleBox>
          
          {/* 카테고리 */}
          <ExampleBox color="#f3e5f5" height="120px">
            <div style={{ textAlign: 'left', padding: '1rem' }}>
              <strong>📂 카테고리</strong><br/><br/>
              • React (12)<br/>
              • CSS (8)<br/>
              • TypeScript (6)<br/>
              • DevOps (4)
            </div>
          </ExampleBox>
          
          {/* 최근 댓글 */}
          <ExampleBox color="#e8f5e8" height="100px">
            <div style={{ textAlign: 'left', padding: '1rem' }}>
              <strong>💬 최근 댓글</strong><br/><br/>
              <small style={{ color: '#666' }}>
                "정말 도움이 되었습니다!"<br/>
                - 홍길동, 2시간 전
              </small>
            </div>
          </ExampleBox>
        </div>
      </GridItem>
    </Grid>
  ),
};

// 폼 레이아웃
export const FormLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 폼 레이아웃 예제

사용자 정보 입력 폼의 레이아웃입니다.
- 반응형 필드 배치
- 전체 너비 필드와 절반 너비 필드 혼합
- 버튼 영역 분리
        `
      }
    }
  },
  render: () => (
    <Grid columns={12} gap="md" maxWidth="800px">
      {/* 폼 헤더 */}
      <GridItem colSpan={12}>
        <ExampleBox color="#1976d2" height="60px">
          <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
            👤 사용자 정보 입력
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 기본 정보 */}
      <GridItem colSpan={12}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Grid columns={12} gap="sm">
            {/* 이름 (전체 너비) */}
            <GridItem colSpan={12}>
              <ExampleBox color="#ffffff" height="50px">
                📝 이름 (필수)
              </ExampleBox>
            </GridItem>
            
            {/* 성별, 생년월일 (반반) */}
            <GridItem colSpan={{ xs: 12, sm: 6 }}>
              <ExampleBox color="#ffffff" height="50px">
                👤 성별
              </ExampleBox>
            </GridItem>
            <GridItem colSpan={{ xs: 12, sm: 6 }}>
              <ExampleBox color="#ffffff" height="50px">
                📅 생년월일
              </ExampleBox>
            </GridItem>
            
            {/* 이메일, 전화번호 (반반) */}
            <GridItem colSpan={{ xs: 12, sm: 6 }}>
              <ExampleBox color="#ffffff" height="50px">
                📧 이메일
              </ExampleBox>
            </GridItem>
            <GridItem colSpan={{ xs: 12, sm: 6 }}>
              <ExampleBox color="#ffffff" height="50px">
                📞 전화번호
              </ExampleBox>
            </GridItem>
          </Grid>
        </div>
      </GridItem>
      
      {/* 주소 정보 */}
      <GridItem colSpan={12}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Grid columns={12} gap="sm">
            {/* 우편번호, 검색 버튼 */}
            <GridItem colSpan={{ xs: 8, sm: 9 }}>
              <ExampleBox color="#ffffff" height="50px">
                📮 우편번호
              </ExampleBox>
            </GridItem>
            <GridItem colSpan={{ xs: 4, sm: 3 }}>
              <ExampleBox color="#e3f2fd" height="50px">
                🔍 검색
              </ExampleBox>
            </GridItem>
            
            {/* 주소 (전체 너비) */}
            <GridItem colSpan={12}>
              <ExampleBox color="#ffffff" height="50px">
                🏠 주소
              </ExampleBox>
            </GridItem>
            <GridItem colSpan={12}>
              <ExampleBox color="#ffffff" height="50px">
                🏠 상세주소
              </ExampleBox>
            </GridItem>
          </Grid>
        </div>
      </GridItem>
      
      {/* 버튼 영역 */}
      <GridItem colSpan={12}>
        <Grid columns={2} gap="md">
          <GridItem>
            <ExampleBox color="#f5f5f5" height="50px">
              ❌ 취소
            </ExampleBox>
          </GridItem>
          <GridItem>
            <ExampleBox color="#4caf50" height="50px">
              <span style={{ color: 'white', fontWeight: 'bold' }}>
                ✅ 저장
              </span>
            </ExampleBox>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  ),
};

// 카드 피드 레이아웃
export const CardFeedLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 카드 피드 레이아웃 예제

소셜 미디어나 뉴스 피드 형태의 레이아웃입니다.
- Pinterest 스타일의 카드 레이아웃
- 자동 크기 조정으로 다양한 높이의 카드 배치
        `
      }
    }
  },
  render: () => (
    <Grid 
      autoFit 
      minColumnWidth="280px" 
      gap="md" 
      maxWidth="1200px"
    >
      {[
        { title: '맛있는 파스타 레시피', content: '집에서 쉽게 만들 수 있는 파스타', height: '200px', emoji: '🍝' },
        { title: '여행 추천지', content: '이번 주말에 갈 만한 곳들을 소개합니다. 서울 근교의 숨은 명소들...', height: '250px', emoji: '🗺️' },
        { title: '독서 후기', content: '최근에 읽은 책', height: '180px', emoji: '📚' },
        { title: '운동 루틴', content: '홈트레이닝 30분 코스를 소개합니다. 별도의 장비 없이도 할 수 있어요...', height: '220px', emoji: '💪' },
        { title: '개발 팁', content: 'React 성능 최적화', height: '260px', emoji: '⚡' },
        { title: '요리 후기', content: '오늘 만든 요리', height: '190px', emoji: '👨‍🍳' },
        { title: '영화 리뷰', content: '최근 본 영화의 감상평을 남겨봅니다. 스포일러는 없으니 안심하세요...', height: '240px', emoji: '🎬' },
        { title: '음악 추천', content: '이번 주의 플레이리스트', height: '200px', emoji: '🎵' },
      ].map((item, index) => (
        <GridItem key={index}>
          <ExampleBox 
            color={`hsl(${index * 45}, 60%, 95%)`}
            height={item.height}
          >
            <div style={{ textAlign: 'left', padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {item.emoji}
              </div>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                {item.title}
              </strong>
              <p style={{ margin: '0', color: '#666', fontSize: '0.9rem', flex: 1 }}>
                {item.content}
              </p>
              <small style={{ color: '#999', marginTop: '0.5rem' }}>
                {index + 1}시간 전
              </small>
            </div>
          </ExampleBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// 갤러리 레이아웃
export const GalleryLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 갤러리 레이아웃 예제

이미지 갤러리나 포트폴리오 사이트에서 사용할 수 있는 레이아웃입니다.
- 다양한 크기의 이미지 배치
- 반응형으로 모바일에서는 단순한 그리드로 변경
        `
      }
    }
  },
  render: () => (
    <Grid columns={12} gap="sm" maxWidth="1200px">
      {/* 큰 이미지 */}
      <GridItem colSpan={{ xs: 12, md: 6 }} rowSpan={2}>
        <ExampleBox color="#1976d2" height="300px">
          <span style={{ color: 'white', fontSize: '1.5rem' }}>
            🖼️ 메인 이미지<br/>
            <small>(6x2 크기)</small>
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 중간 이미지들 */}
      <GridItem colSpan={{ xs: 12, sm: 6, md: 3 }}>
        <ExampleBox color="#388e3c" height="145px">
          <span style={{ color: 'white' }}>
            🌿 이미지 2<br/>
            <small>(3x1)</small>
          </span>
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={{ xs: 12, sm: 6, md: 3 }}>
        <ExampleBox color="#f57c00" height="145px">
          <span style={{ color: 'white' }}>
            🌅 이미지 3<br/>
            <small>(3x1)</small>
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 작은 이미지들 */}
      <GridItem colSpan={{ xs: 6, md: 3 }}>
        <ExampleBox color="#7b1fa2" height="145px">
          <span style={{ color: 'white' }}>
            🌸 이미지 4<br/>
            <small>(3x1)</small>
          </span>
        </ExampleBox>
      </GridItem>
      <GridItem colSpan={{ xs: 6, md: 3 }}>
        <ExampleBox color="#c2185b" height="145px">
          <span style={{ color: 'white' }}>
            🌺 이미지 5<br/>
            <small>(3x1)</small>
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 가로 긴 이미지 */}
      <GridItem colSpan={{ xs: 12, md: 8 }}>
        <ExampleBox color="#5d4037" height="120px">
          <span style={{ color: 'white' }}>
            🏔️ 파노라마 이미지 (8x1)
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 세로 긴 이미지 */}
      <GridItem colSpan={{ xs: 12, md: 4 }} rowSpan={2}>
        <ExampleBox color="#455a64" height="250px">
          <span style={{ color: 'white' }}>
            🏢 세로 이미지<br/>
            <small>(4x2)</small>
          </span>
        </ExampleBox>
      </GridItem>
      
      {/* 더 많은 작은 이미지들 */}
      {[
        { color: '#e91e63', emoji: '🎨' },
        { color: '#9c27b0', emoji: '🎭' },
        { color: '#673ab7', emoji: '🎪' },
        { color: '#3f51b5', emoji: '🎯' },
      ].map((item, index) => (
        <GridItem key={index} colSpan={{ xs: 6, sm: 3, md: 2 }}>
          <ExampleBox color={item.color} height="120px">
            <span style={{ color: 'white' }}>
              {item.emoji}<br/>
              <small>이미지 {index + 6}</small>
            </span>
          </ExampleBox>
        </GridItem>
      ))}
    </Grid>
  ),
};