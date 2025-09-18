/**
 * SearchProvider 비즈니스 상황별 활용 예제
 * 실제 업무에서 자주 사용되는 검색 시나리오들
 */

import type { Meta } from '@storybook/react';
import { useState } from 'react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { useFieldValue } from '../hooks';
import { SearchConfig } from '../types/search.types';

const meta: Meta = {
  title: 'Business Examples/SearchProvider',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * 전자상거래 상품 검색
 * 가격 범위, 브랜드, 카테고리, 평점 등 복합 검색
 */
export const EcommerceProductSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const config: SearchConfig = {
    id: 'ecommerce-search',
    fields: [
      {
        id: 'keyword',
        name: 'keyword',
        type: 'text',
        label: '상품명',
        placeholder: '검색할 상품명을 입력하세요',
        validation: {
          minLength: { value: 2, message: '최소 2자 이상 입력하세요' }
        }
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        placeholder: '카테고리 선택',
        options: [
          { label: '전체', value: '' },
          { label: '전자제품', value: 'electronics' },
          { label: '의류', value: 'clothing' },
          { label: '홈&리빙', value: 'home' },
          { label: '스포츠', value: 'sports' },
          { label: '도서', value: 'books' }
        ]
      },
      {
        id: 'brand',
        name: 'brand',
        type: 'multiselect',
        label: '브랜드',
        placeholder: '브랜드 선택 (복수 가능)',
        options: [
          { label: '삼성', value: 'samsung' },
          { label: 'LG', value: 'lg' },
          { label: '애플', value: 'apple' },
          { label: '나이키', value: 'nike' },
          { label: '아디다스', value: 'adidas' }
        ]
      },
      {
        id: 'priceRange',
        name: 'priceRange',
        type: 'numberrange',
        label: '가격 범위',
        placeholder: '가격 범위를 입력하세요',
        validation: {
          validate: (value: any) => {
            if (value?.min && value?.max && value.min > value.max) {
              return '최소 가격이 최대 가격보다 클 수 없습니다';
            }
            return true;
          }
        }
      },
      {
        id: 'rating',
        name: 'rating',
        type: 'select',
        label: '평점',
        placeholder: '평점 선택',
        options: [
          { label: '전체', value: '' },
          { label: '4점 이상', value: '4' },
          { label: '3점 이상', value: '3' },
          { label: '2점 이상', value: '2' },
          { label: '1점 이상', value: '1' }
        ]
      },
      {
        id: 'freeShipping',
        name: 'freeShipping',
        type: 'checkbox',
        label: '무료배송만 보기'
      },
      {
        id: 'inStock',
        name: 'inStock',
        type: 'checkbox',
        label: '재고 있는 상품만'
      }
    ]
  };

  const handleSearch = async (data: any) => {
    setIsLoading(true);
    console.log('🛒 전자상거래 검색 조건:', data);
    
    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: '삼성 갤럭시 스마트폰', price: 890000, rating: 4.5, brand: 'samsung' },
        { id: 2, name: 'LG 노트북', price: 1200000, rating: 4.2, brand: 'lg' },
        { id: 3, name: '애플 에어팟', price: 250000, rating: 4.8, brand: 'apple' }
      ];
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2>🛒 전자상거래 상품 검색</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="keyword" />
          <Field name="category" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="brand" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="priceRange" />
          <Field name="rating" />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Field name="freeShipping" />
          <Field name="inStock" />
        </div>
        
        <SearchButtons submitText="상품 검색" />
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            검색 중...
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>검색 결과 ({searchResults.length}개)</h3>
            {searchResults.map(product => (
              <div key={product.id} style={{ 
                padding: '1rem', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4>{product.name}</h4>
                <p>가격: {product.price.toLocaleString()}원</p>
                <p>평점: ⭐ {product.rating}</p>
                <p>브랜드: {product.brand}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SearchProvider>
  );
};

/**
 * 인사관리 시스템 직원 검색
 * 부서, 직급, 입사일, 기술스택 등으로 검색
 */
export const HREmployeeSearch = () => {
  const config: SearchConfig = {
    id: 'hr-employee-search',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '이름',
        placeholder: '직원 이름을 입력하세요'
      },
      {
        id: 'employeeId',
        name: 'employeeId',
        type: 'text',
        label: '사번',
        placeholder: '사번을 입력하세요'
      },
      {
        id: 'department',
        name: 'department',
        type: 'select',
        label: '부서',
        placeholder: '부서 선택',
        options: [
          { label: '전체', value: '' },
          { label: '개발팀', value: 'development' },
          { label: '디자인팀', value: 'design' },
          { label: '마케팅팀', value: 'marketing' },
          { label: '영업팀', value: 'sales' },
          { label: '인사팀', value: 'hr' },
          { label: '재무팀', value: 'finance' }
        ]
      },
      {
        id: 'position',
        name: 'position',
        type: 'select',
        label: '직급',
        placeholder: '직급 선택',
        options: [
          { label: '전체', value: '' },
          { label: '인턴', value: 'intern' },
          { label: '주니어', value: 'junior' },
          { label: '시니어', value: 'senior' },
          { label: '리드', value: 'lead' },
          { label: '매니저', value: 'manager' },
          { label: '디렉터', value: 'director' }
        ]
      },
      {
        id: 'hireDate',
        name: 'hireDate',
        type: 'daterange',
        label: '입사일 범위',
        placeholder: '입사일 범위를 선택하세요'
      },
      {
        id: 'skills',
        name: 'skills',
        type: 'tags',
        label: '기술 스택',
        placeholder: '기술을 입력하고 엔터를 누르세요'
      },
      {
        id: 'workType',
        name: 'workType',
        type: 'radio',
        label: '근무 형태',
        options: [
          { label: '전체', value: '' },
          { label: '정규직', value: 'fulltime' },
          { label: '계약직', value: 'contract' },
          { label: '인턴', value: 'intern' },
          { label: '프리랜서', value: 'freelancer' }
        ]
      },
      {
        id: 'isActive',
        name: 'isActive',
        type: 'checkbox',
        label: '재직 중인 직원만 보기'
      }
    ]
  };

  const handleSearch = async (data: any) => {
    console.log('👥 HR 직원 검색 조건:', data);
    alert(`검색 조건:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 700 }}>
        <h2>👥 인사관리 직원 검색</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="name" />
          <Field name="employeeId" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="department" />
          <Field name="position" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="hireDate" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="skills" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="workType" />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <Field name="isActive" />
        </div>
        
        <SearchButtons submitText="직원 검색" />
      </div>
    </SearchProvider>
  );
};

/**
 * CRM 고객 관리 검색
 * 고객 등급, 지역, 매출 규모, 계약 상태 등으로 검색
 */
export const CRMCustomerSearch = () => {
  const config: SearchConfig = {
    id: 'crm-customer-search',
    fields: [
      {
        id: 'companyName',
        name: 'companyName',
        type: 'text',
        label: '회사명',
        placeholder: '회사명을 입력하세요'
      },
      {
        id: 'customerGrade',
        name: 'customerGrade',
        type: 'select',
        label: '고객 등급',
        placeholder: '등급 선택',
        options: [
          { label: '전체', value: '' },
          { label: 'VIP', value: 'vip' },
          { label: 'Gold', value: 'gold' },
          { label: 'Silver', value: 'silver' },
          { label: 'Bronze', value: 'bronze' },
          { label: '일반', value: 'normal' }
        ]
      },
      {
        id: 'region',
        name: 'region',
        type: 'multiselect',
        label: '지역',
        placeholder: '지역 선택 (복수 가능)',
        options: [
          { label: '서울', value: 'seoul' },
          { label: '경기', value: 'gyeonggi' },
          { label: '인천', value: 'incheon' },
          { label: '부산', value: 'busan' },
          { label: '대구', value: 'daegu' },
          { label: '대전', value: 'daejeon' },
          { label: '광주', value: 'gwangju' },
          { label: '기타', value: 'other' }
        ]
      },
      {
        id: 'revenueRange',
        name: 'revenueRange',
        type: 'numberrange',
        label: '연 매출 규모 (억원)',
        placeholder: '매출 범위를 입력하세요'
      },
      {
        id: 'contractStatus',
        name: 'contractStatus',
        type: 'select',
        label: '계약 상태',
        placeholder: '계약 상태 선택',
        options: [
          { label: '전체', value: '' },
          { label: '계약 중', value: 'active' },
          { label: '계약 만료', value: 'expired' },
          { label: '협상 중', value: 'negotiating' },
          { label: '보류', value: 'pending' },
          { label: '해지', value: 'terminated' }
        ]
      },
      {
        id: 'industry',
        name: 'industry',
        type: 'select',
        label: '업종',
        placeholder: '업종 선택',
        options: [
          { label: '전체', value: '' },
          { label: 'IT/소프트웨어', value: 'it' },
          { label: '제조업', value: 'manufacturing' },
          { label: '금융', value: 'finance' },
          { label: '유통/소매', value: 'retail' },
          { label: '의료/제약', value: 'healthcare' },
          { label: '교육', value: 'education' },
          { label: '건설/부동산', value: 'construction' }
        ]
      },
      {
        id: 'lastContactDate',
        name: 'lastContactDate',
        type: 'daterange',
        label: '최근 연락일',
        placeholder: '최근 연락일 범위'
      },
      {
        id: 'hasActiveProject',
        name: 'hasActiveProject',
        type: 'checkbox',
        label: '진행 중인 프로젝트가 있는 고객만'
      }
    ]
  };

  // 검색 결과 카운터 컴포넌트
  const SearchResultCounter = () => {
    const companyName = useFieldValue('companyName');
    const customerGrade = useFieldValue('customerGrade');
    const region = useFieldValue('region');
    
    const hasFilters = companyName || customerGrade || (region && region.length > 0);
    
    if (!hasFilters) return null;
    
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '6px',
        marginBottom: '1rem'
      }}>
        <h4>검색 필터 적용 중</h4>
        {companyName && <p>• 회사명: "{companyName}"</p>}
        {customerGrade && <p>• 고객 등급: {customerGrade}</p>}
        {region && region.length > 0 && <p>• 지역: {region.join(', ')}</p>}
      </div>
    );
  };

  const handleSearch = async (data: any) => {
    console.log('🏢 CRM 고객 검색 조건:', data);
    alert(`고객 검색 조건:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 800 }}>
        <h2>🏢 CRM 고객 관리 검색</h2>
        
        <SearchResultCounter />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="companyName" />
          <Field name="customerGrade" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="region" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="revenueRange" />
          <Field name="contractStatus" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="industry" />
          <Field name="lastContactDate" />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <Field name="hasActiveProject" />
        </div>
        
        <SearchButtons submitText="고객 검색" />
      </div>
    </SearchProvider>
  );
};

/**
 * 콘텐츠 관리 시스템 검색
 * 작성자, 태그, 발행 상태, 콘텐츠 타입 등으로 검색
 */
export const ContentManagementSearch = () => {
  const config: SearchConfig = {
    id: 'cms-search',
    fields: [
      {
        id: 'title',
        name: 'title',
        type: 'text',
        label: '제목',
        placeholder: '콘텐츠 제목을 입력하세요'
      },
      {
        id: 'author',
        name: 'author',
        type: 'autocomplete',
        label: '작성자',
        placeholder: '작성자 이름을 입력하세요',
        // 실제 구현에서는 API로 작성자 목록을 가져올 수 있음
        loadOptions: async (query: string) => {
          const authors = ['김개발', '이디자인', '박마케팅', '최콘텐츠', '정에디터'];
          return authors
            .filter(author => author.includes(query))
            .map(author => ({ label: author, value: author }));
        }
      },
      {
        id: 'contentType',
        name: 'contentType',
        type: 'select',
        label: '콘텐츠 타입',
        placeholder: '타입 선택',
        options: [
          { label: '전체', value: '' },
          { label: '블로그 포스트', value: 'blog' },
          { label: '뉴스', value: 'news' },
          { label: '제품 소개', value: 'product' },
          { label: '이벤트', value: 'event' },
          { label: '공지사항', value: 'notice' }
        ]
      },
      {
        id: 'publishStatus',
        name: 'publishStatus',
        type: 'radio',
        label: '발행 상태',
        options: [
          { label: '전체', value: '' },
          { label: '발행됨', value: 'published' },
          { label: '초안', value: 'draft' },
          { label: '검토 중', value: 'review' },
          { label: '예약됨', value: 'scheduled' }
        ]
      },
      {
        id: 'tags',
        name: 'tags',
        type: 'tags',
        label: '태그',
        placeholder: '태그를 입력하고 엔터를 누르세요'
      },
      {
        id: 'publishDate',
        name: 'publishDate',
        type: 'daterange',
        label: '발행일',
        placeholder: '발행일 범위를 선택하세요'
      },
      {
        id: 'category',
        name: 'category',
        type: 'multiselect',
        label: '카테고리',
        placeholder: '카테고리 선택 (복수 가능)',
        options: [
          { label: '기술', value: 'tech' },
          { label: '디자인', value: 'design' },
          { label: '마케팅', value: 'marketing' },
          { label: '비즈니스', value: 'business' },
          { label: '라이프스타일', value: 'lifestyle' },
          { label: '튜토리얼', value: 'tutorial' }
        ]
      },
      {
        id: 'featured',
        name: 'featured',
        type: 'checkbox',
        label: '추천 콘텐츠만 보기'
      },
      {
        id: 'hasComments',
        name: 'hasComments',
        type: 'checkbox',
        label: '댓글이 있는 콘텐츠만'
      }
    ]
  };

  const handleSearch = async (data: any) => {
    console.log('📝 콘텐츠 관리 검색 조건:', data);
    alert(`콘텐츠 검색 조건:\n${JSON.stringify(data, null, 2)}`);
  };

  // 검색 필터 요약 컴포넌트
  const SearchSummary = () => {
    const title = useFieldValue('title');
    const author = useFieldValue('author');
    const contentType = useFieldValue('contentType');
    const publishStatus = useFieldValue('publishStatus');
    const tags = useFieldValue('tags');
    
    const filters = [
      title && `제목: "${title}"`,
      author && `작성자: ${author}`,
      contentType && `타입: ${contentType}`,
      publishStatus && `상태: ${publishStatus}`,
      tags && tags.length > 0 && `태그: ${tags.join(', ')}`
    ].filter(Boolean);
    
    if (filters.length === 0) return null;
    
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#eff6ff', 
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        marginBottom: '1rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>적용된 검색 필터</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          {filters.map((filter, index) => (
            <li key={index} style={{ color: '#374151' }}>{filter}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <SearchProvider config={config} onSubmit={handleSearch}>
      <div style={{ maxWidth: 800 }}>
        <h2>📝 콘텐츠 관리 시스템 검색</h2>
        
        <SearchSummary />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="title" />
          <Field name="author" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="contentType" />
          <Field name="publishDate" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="publishStatus" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="tags" />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Field name="category" />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Field name="featured" />
          <Field name="hasComments" />
        </div>
        
        <SearchButtons submitText="콘텐츠 검색" />
      </div>
    </SearchProvider>
  );
};