import React from 'react';
import { Grid, GridItem } from '../components/Grid';

/**
 * Grid 컴포넌트 사용 예제 모음
 * 실제 개발에서 자주 사용되는 패턴들을 정리
 */

// ========================================
// 📋 기본 사용법
// ========================================

/**
 * 1. 기본 3컬럼 레이아웃
 * 가장 간단한 형태의 그리드 사용법
 */
export const BasicThreeColumn: React.FC = () => (
  <Grid columns={3} gap="md">
    <GridItem>
      <div style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        첫 번째 아이템
      </div>
    </GridItem>
    <GridItem>
      <div style={{ padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
        두 번째 아이템
      </div>
    </GridItem>
    <GridItem>
      <div style={{ padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        세 번째 아이템
      </div>
    </GridItem>
  </Grid>
);

/**
 * 2. 반응형 그리드
 * 화면 크기에 따라 컬럼 수가 변경되는 레이아웃
 */
export const ResponsiveGrid: React.FC = () => (
  <Grid 
    columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} 
    gap={{ xs: 'sm', md: 'lg' }}
  >
    {Array.from({ length: 8 }, (_, i) => (
      <GridItem key={i}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          아이템 {i + 1}
        </div>
      </GridItem>
    ))}
  </Grid>
);

/**
 * 3. 컬럼 스팬 사용하기
 * 특정 아이템이 여러 컬럼을 차지하는 레이아웃
 */
export const ColumnSpanExample: React.FC = () => (
  <Grid columns={12} gap="md">
    {/* 헤더: 전체 너비 */}
    <GridItem colSpan={12}>
      <div style={{ padding: '1rem', backgroundColor: '#1976d2', color: 'white', borderRadius: '8px' }}>
        헤더 (12컬럼)
      </div>
    </GridItem>
    
    {/* 메인 콘텐츠: 8컬럼 */}
    <GridItem colSpan={8}>
      <div style={{ padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        메인 콘텐츠 (8컬럼)
      </div>
    </GridItem>
    
    {/* 사이드바: 4컬럼 */}
    <GridItem colSpan={4}>
      <div style={{ padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
        사이드바 (4컬럼)
      </div>
    </GridItem>
    
    {/* 푸터: 전체 너비 */}
    <GridItem colSpan={12}>
      <div style={{ padding: '1rem', backgroundColor: '#757575', color: 'white', borderRadius: '8px' }}>
        푸터 (12컬럼)
      </div>
    </GridItem>
  </Grid>
);

// ========================================
// 🚀 고급 사용법
// ========================================

/**
 * 4. 자동 크기 조정 (Auto-fit)
 * 콘텐츠에 맞춰 자동으로 컬럼 수를 조정
 */
export const AutoFitExample: React.FC = () => (
  <Grid 
    autoFit 
    minColumnWidth="250px" 
    maxColumnWidth="400px"
    gap="lg"
  >
    {[
      { title: '카드 1', content: '짧은 내용' },
      { title: '카드 2', content: '조금 더 긴 내용을 가진 카드입니다.' },
      { title: '카드 3', content: '매우 긴 내용을 가진 카드로, 여러 줄의 텍스트가 포함되어 있습니다.' },
      { title: '카드 4', content: '보통 길이' },
    ].map((card, i) => (
      <GridItem key={i}>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>{card.title}</h3>
          <p style={{ margin: '0', color: '#6c757d', lineHeight: '1.5' }}>{card.content}</p>
        </div>
      </GridItem>
    ))}
  </Grid>
);

/**
 * 5. 위치 지정하기
 * 특정 위치에 아이템을 배치하는 방법
 */
export const PositioningExample: React.FC = () => (
  <Grid columns={4} gap="md" style={{ minHeight: '300px' }}>
    {/* 첫 번째 행의 2-3 컬럼에 배치 */}
    <GridItem colStart={2} colEnd={4}>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#ffcdd2', 
        borderRadius: '8px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        컬럼 2-3에 위치
      </div>
    </GridItem>
    
    {/* 두 번째 행의 첫 번째 컬럼 */}
    <GridItem colStart={1} colEnd={2} rowStart={2}>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#c8e6c9', 
        borderRadius: '8px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        2행 1열
      </div>
    </GridItem>
    
    {/* 두 번째 행의 3-4 컬럼 */}
    <GridItem colStart={3} colEnd={5} rowStart={2}>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#ffe0b2', 
        borderRadius: '8px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        2행 3-4열
      </div>
    </GridItem>
  </Grid>
);

/**
 * 6. 정렬 및 순서 조정
 * 아이템의 정렬과 순서를 조정하는 방법
 */
export const AlignmentAndOrderExample: React.FC = () => (
  <Grid columns={3} gap="md" alignItems="center" style={{ minHeight: '200px' }}>
    <GridItem order={3} alignSelf="start">
      <div style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: '#e1f5fe', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        순서: 3번째<br/>
        (상단 정렬)
      </div>
    </GridItem>
    
    <GridItem order={1} alignSelf="center">
      <div style={{ 
        padding: '2rem 1rem', 
        backgroundColor: '#f3e5f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        순서: 1번째<br/>
        (중앙 정렬)
      </div>
    </GridItem>
    
    <GridItem order={2} alignSelf="end">
      <div style={{ 
        padding: '0.5rem 1rem', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        순서: 2번째<br/>
        (하단 정렬)
      </div>
    </GridItem>
  </Grid>
);

// ========================================
// 💼 실전 활용 예제
// ========================================

/**
 * 7. 카드 기반 대시보드
 * 실제 대시보드에서 사용할 수 있는 레이아웃
 */
export const DashboardExample: React.FC = () => (
  <Grid columns={12} gap="lg" maxWidth="1200px">
    {/* 상단 통계 카드들 */}
    <GridItem colSpan={{ xs: 12, sm: 6, lg: 3 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1976d2' }}>1,234</h3>
        <p style={{ margin: '0', color: '#666' }}>총 사용자</p>
      </div>
    </GridItem>
    
    <GridItem colSpan={{ xs: 12, sm: 6, lg: 3 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#388e3c' }}>567</h3>
        <p style={{ margin: '0', color: '#666' }}>신규 가입</p>
      </div>
    </GridItem>
    
    <GridItem colSpan={{ xs: 12, sm: 6, lg: 3 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fff3e0', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#f57c00' }}>89</h3>
        <p style={{ margin: '0', color: '#666' }}>주문 수</p>
      </div>
    </GridItem>
    
    <GridItem colSpan={{ xs: 12, sm: 6, lg: 3 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fce4ec', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#c2185b' }}>₩2.3M</h3>
        <p style={{ margin: '0', color: '#666' }}>매출</p>
      </div>
    </GridItem>
    
    {/* 차트 영역 */}
    <GridItem colSpan={{ xs: 12, lg: 8 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        📊 매출 차트 영역
      </div>
    </GridItem>
    
    {/* 최근 활동 */}
    <GridItem colSpan={{ xs: 12, lg: 4 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px',
        height: '300px'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>최근 활동</h4>
        <div style={{ color: '#666', lineHeight: '2' }}>
          • 새 사용자 가입<br/>
          • 주문 처리 완료<br/>
          • 결제 승인<br/>
          • 배송 시작<br/>
          • 리뷰 등록
        </div>
      </div>
    </GridItem>
  </Grid>
);

/**
 * 8. 제품 목록 그리드
 * E-commerce 사이트의 제품 목록 레이아웃
 */
export const ProductListExample: React.FC = () => {
  const products = [
    { name: '무선 이어폰', price: '129,000원', rating: 4.8 },
    { name: '스마트 워치', price: '299,000원', rating: 4.6 },
    { name: '노트북 스탠드', price: '45,000원', rating: 4.9 },
    { name: '블루투스 스피커', price: '89,000원', rating: 4.5 },
    { name: '무선 충전기', price: '35,000원', rating: 4.7 },
    { name: '태블릿 케이스', price: '25,000원', rating: 4.4 },
  ];

  return (
    <Grid 
      columns={{ xs: 1, sm: 2, lg: 3, xl: 4 }} 
      gap="lg" 
      maxWidth="1200px"
    >
      {products.map((product, index) => (
        <GridItem key={index}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            {/* 제품 이미지 영역 */}
            <div style={{ 
              height: '150px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              📦
            </div>
            
            {/* 제품 정보 */}
            <h3 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {product.name}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: '#1976d2' 
              }}>
                {product.price}
              </span>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                ⭐ {product.rating}
              </span>
            </div>
            
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              장바구니 담기
            </button>
          </div>
        </GridItem>
      ))}
    </Grid>
  );
};

/**
 * 9. 반응형 폼 레이아웃
 * 사용자 입력 폼의 반응형 레이아웃
 */
export const ResponsiveFormExample: React.FC = () => (
  <Grid columns={12} gap="md" maxWidth="600px">
    <GridItem colSpan={12}>
      <h2 style={{ margin: '0 0 1.5rem 0', textAlign: 'center', color: '#333' }}>
        회원가입
      </h2>
    </GridItem>
    
    {/* 이름 */}
    <GridItem colSpan={12}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        이름 *
      </label>
      <input 
        type="text" 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        placeholder="이름을 입력하세요"
      />
    </GridItem>
    
    {/* 이메일과 전화번호 */}
    <GridItem colSpan={{ xs: 12, sm: 6 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        이메일 *
      </label>
      <input 
        type="email" 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        placeholder="example@email.com"
      />
    </GridItem>
    
    <GridItem colSpan={{ xs: 12, sm: 6 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        전화번호
      </label>
      <input 
        type="tel" 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        placeholder="010-1234-5678"
      />
    </GridItem>
    
    {/* 비밀번호와 확인 */}
    <GridItem colSpan={{ xs: 12, sm: 6 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        비밀번호 *
      </label>
      <input 
        type="password" 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        placeholder="비밀번호"
      />
    </GridItem>
    
    <GridItem colSpan={{ xs: 12, sm: 6 }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        비밀번호 확인 *
      </label>
      <input 
        type="password" 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        placeholder="비밀번호 확인"
      />
    </GridItem>
    
    {/* 약관 동의 */}
    <GridItem colSpan={12}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" />
        <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
      </label>
    </GridItem>
    
    {/* 버튼 */}
    <GridItem colSpan={12}>
      <Grid columns={2} gap="md">
        <GridItem>
          <button style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            취소
          </button>
        </GridItem>
        <GridItem>
          <button style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            가입하기
          </button>
        </GridItem>
      </Grid>
    </GridItem>
  </Grid>
);

/**
 * 10. 숨김/표시 기능
 * 반응형 환경에서 특정 요소를 숨기거나 표시하는 방법
 */
export const HiddenShowExample: React.FC = () => (
  <Grid columns={12} gap="md">
    <GridItem colSpan={12}>
      <h3 style={{ textAlign: 'center', color: '#333', margin: '0 0 1rem 0' }}>
        화면 크기에 따른 콘텐츠 표시/숨김
      </h3>
      <p style={{ textAlign: 'center', color: '#666', margin: '0 0 2rem 0' }}>
        브라우저 크기를 조절해보세요
      </p>
    </GridItem>
    
    {/* 항상 표시 */}
    <GridItem colSpan={{ xs: 12, md: 4 }}>
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <strong>항상 표시</strong><br/>
        모든 화면에서 보임
      </div>
    </GridItem>
    
    {/* 데스크톱에서만 표시 (모바일에서 숨김) */}
    <GridItem 
      colSpan={{ xs: 12, md: 4 }} 
      hidden={{ xs: true, md: false }}
    >
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <strong>데스크톱 전용</strong><br/>
        모바일에서는 숨김
      </div>
    </GridItem>
    
    {/* 모바일에서만 표시 (데스크톱에서 숨김) */}
    <GridItem 
      colSpan={{ xs: 12, md: 4 }} 
      hidden={{ md: true }}
    >
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fff3e0', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <strong>모바일 전용</strong><br/>
        데스크톱에서는 숨김
      </div>
    </GridItem>
  </Grid>
);

// 모든 예제를 export하는 객체
export const GridExamples = {
  BasicThreeColumn,
  ResponsiveGrid,
  ColumnSpanExample,
  AutoFitExample,
  PositioningExample,
  AlignmentAndOrderExample,
  DashboardExample,
  ProductListExample,
  ResponsiveFormExample,
  HiddenShowExample,
};