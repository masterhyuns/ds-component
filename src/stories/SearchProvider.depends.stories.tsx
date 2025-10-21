/**
 * SearchProvider onDepends 예제
 * 필드 간 의존성을 선언적으로 처리하는 방법
 */

import type { Meta } from '@storybook/react';
import { SearchProvider } from '../context/SearchContext';
import { Field } from '../components/Field';
import { SearchButtons } from '../components/SearchButtons';
import { SearchConfig, FieldDependencyHandler, Option, FieldValues, FieldController } from '../types';

const meta: Meta = {
  title: 'Examples/onDepends',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * 헬퍼 함수: 국가별 도시 목록
 * 실제 프로젝트에서는 API 호출이나 상수 파일에서 가져올 수 있음
 */
const getCitiesByCountry = (country: string): Option[] => {
  const cityMap: Record<string, Option[]> = {
    korea: [
      { label: '서울', value: 'seoul' },
      { label: '부산', value: 'busan' },
      { label: '인천', value: 'incheon' },
      { label: '대구', value: 'daegu' },
      { label: '대전', value: 'daejeon' },
    ],
    usa: [
      { label: 'New York', value: 'ny' },
      { label: 'Los Angeles', value: 'la' },
      { label: 'Chicago', value: 'chicago' },
      { label: 'Houston', value: 'houston' },
      { label: 'Phoenix', value: 'phoenix' },
    ],
    japan: [
      { label: '도쿄', value: 'tokyo' },
      { label: '오사카', value: 'osaka' },
      { label: '교토', value: 'kyoto' },
      { label: '후쿠오카', value: 'fukuoka' },
      { label: '삿포로', value: 'sapporo' },
    ],
  };

  return cityMap[country] || [];
};

/**
 * 예제 1: 국가/도시 선택 (기본 의존성)
 * 국가를 선택하면 해당 국가의 도시 목록이 자동으로 업데이트됨
 */
export const CountryCityExample = () => {
  // Config는 순수하게 유지 (비즈니스 로직 없음)
  const config: SearchConfig = {
    id: 'country-city-search',
    fields: [
      {
        id: 'country',
        name: 'country',
        type: 'select',
        label: '국가',
        placeholder: '국가를 선택하세요',
        options: [
          { label: '한국', value: 'korea' },
          { label: '미국', value: 'usa' },
          { label: '일본', value: 'japan' },
        ],
      },
      {
        id: 'city',
        name: 'city',
        type: 'select',
        label: '도시',
        placeholder: '먼저 국가를 선택하세요',
        disabled: true, // 초기에는 비활성화
        options: [], // 초기에는 빈 배열
      },
    ],
  };

  // 비즈니스 로직은 onDepends로 분리
  const dependencyRules: Record<string, FieldDependencyHandler> = {
    // city 필드는 country 필드에 의존
    city: {
      dependencies: ['country'],
      handler: (values: FieldValues, controller: FieldController) => {
        const { country } = values;

        if (!country) {
          // 국가가 선택되지 않았으면 도시 비활성화
          controller.setFieldDisabled('city', true);
          controller.setFieldOptions('city', []);
          controller.setValue('city', ''); // 도시 값도 초기화
          controller.setFieldPlaceholder('city', '먼저 국가를 선택하세요');
        } else {
          // 국가가 선택되었으면 해당 국가의 도시 목록 설정
          const cities = getCitiesByCountry(country);
          controller.setFieldDisabled('city', false);
          controller.setFieldOptions('city', cities);
          controller.setFieldPlaceholder('city', '도시를 선택하세요');

          // 현재 선택된 도시가 새 목록에 없으면 초기화
          const currentCity = controller.getValue('city');
          const cityExists = cities.some((city) => city.value === currentCity);
          if (!cityExists) {
            controller.setValue('city', '');
          }
        }
      },
    },
  };

  const handleSearch = (data: any) => {
    console.log('🔍 검색 조건:', data);
    alert(`검색 조건:\n국가: ${data.country}\n도시: ${data.city}`);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>🌏 국가/도시 선택 예제</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        국가를 선택하면 도시 옵션이 자동으로 업데이트됩니다.
      </p>

      <SearchProvider config={config} onSubmit={handleSearch} onDepends={dependencyRules}>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="country" />
          <Field name="city" />
        </div>
        <SearchButtons submitText="검색" />
      </SearchProvider>
    </div>
  );
};

/**
 * 예제 2: 고객 등급별 할인율 (복합 의존성)
 * customerGrade와 totalAmount에 따라 discount 필드의 상태가 변경됨
 */
export const DiscountExample = () => {
  const config: SearchConfig = {
    id: 'discount-search',
    fields: [
      {
        id: 'customerGrade',
        name: 'customerGrade',
        type: 'select',
        label: '고객 등급',
        placeholder: '고객 등급 선택',
        options: [
          { label: 'VIP', value: 'vip' },
          { label: 'Gold', value: 'gold' },
          { label: 'Silver', value: 'silver' },
          { label: '일반', value: 'normal' },
        ],
      },
      {
        id: 'totalAmount',
        name: 'totalAmount',
        type: 'number',
        label: '총 구매 금액',
        placeholder: '금액을 입력하세요',
      },
      {
        id: 'discount',
        name: 'discount',
        type: 'number',
        label: '할인율 (%)',
        placeholder: '할인 불가',
        disabled: true, // 초기에는 비활성화
      },
    ],
  };

  const dependencyRules: Record<string, FieldDependencyHandler> = {
    // discount는 customerGrade와 totalAmount 두 필드에 의존
    discount: {
      dependencies: ['customerGrade', 'totalAmount'],
      handler: (values: FieldValues, controller: FieldController) => {
        const { customerGrade, totalAmount } = values;

        // 할인율 규칙 정의
        const discountRates: Record<string, number> = {
          vip: 30,
          gold: 20,
          silver: 10,
          normal: 5,
        };

        // 최소 구매 금액 정의
        const minAmount = 100000;

        // VIP이고 최소 금액 이상이면 할인 가능
        if (customerGrade && totalAmount >= minAmount) {
          const maxDiscount = discountRates[customerGrade] || 0;

          controller.setFieldDisabled('discount', false);
          controller.setFieldPlaceholder(
            'discount',
            `최대 ${maxDiscount}% 할인 가능`
          );
          controller.updateFieldMeta('discount', {
            validation: {
              max: {
                value: maxDiscount,
                message: `${maxDiscount}%를 초과할 수 없습니다`,
              },
              min: {
                value: 0,
                message: '0% 이상이어야 합니다',
              },
            },
          });
        } else {
          // 조건 불충족 시 할인 불가
          controller.setFieldDisabled('discount', true);
          controller.setValue('discount', 0);

          if (!customerGrade) {
            controller.setFieldPlaceholder('discount', '먼저 고객 등급을 선택하세요');
          } else if (totalAmount < minAmount) {
            controller.setFieldPlaceholder(
              'discount',
              `${minAmount.toLocaleString()}원 이상 구매 시 할인 가능`
            );
          }
        }
      },
    },
  };

  const handleSearch = (data: any) => {
    console.log('💰 검색 조건:', data);
    alert(
      `검색 조건:\n고객 등급: ${data.customerGrade}\n구매 금액: ${data.totalAmount}원\n할인율: ${data.discount}%`
    );
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>💰 고객 등급별 할인율 예제</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        고객 등급과 구매 금액에 따라 할인율 필드가 활성화됩니다.
        <br />
        (10만원 이상 구매 시 할인 가능)
      </p>

      <SearchProvider config={config} onSubmit={handleSearch} onDepends={dependencyRules}>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="customerGrade" />
          <Field name="totalAmount" />
          <Field name="discount" />
        </div>
        <SearchButtons submitText="검색" />
      </SearchProvider>
    </div>
  );
};

/**
 * 예제 3: 검색 타입별 필터 (조건부 표시)
 * 검색 타입에 따라 다른 필터 옵션이 표시됨
 */
export const SearchTypeExample = () => {
  const config: SearchConfig = {
    id: 'search-type',
    fields: [
      {
        id: 'searchType',
        name: 'searchType',
        type: 'radio',
        label: '검색 타입',
        options: [
          { label: '상품 검색', value: 'product' },
          { label: '사용자 검색', value: 'user' },
          { label: '주문 검색', value: 'order' },
        ],
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: '카테고리',
        placeholder: '카테고리 선택',
        options: [],
        disabled: true,
      },
      {
        id: 'dateRange',
        name: 'dateRange',
        type: 'daterange',
        label: '기간',
        placeholder: '기간 선택',
        disabled: true,
      },
    ],
  };

  const dependencyRules: Record<string, FieldDependencyHandler> = {
    // category는 searchType에 의존
    category: {
      dependencies: ['searchType'],
      handler: (values: FieldValues, controller: FieldController) => {
        const { searchType } = values;

        if (searchType === 'product') {
          controller.setFieldDisabled('category', false);
          controller.setFieldLabel('category', '상품 카테고리');
          controller.setFieldOptions('category', [
            { label: '전자제품', value: 'electronics' },
            { label: '의류', value: 'clothing' },
            { label: '식품', value: 'food' },
          ]);
        } else if (searchType === 'user') {
          controller.setFieldDisabled('category', false);
          controller.setFieldLabel('category', '사용자 등급');
          controller.setFieldOptions('category', [
            { label: 'VIP', value: 'vip' },
            { label: 'Gold', value: 'gold' },
            { label: '일반', value: 'normal' },
          ]);
        } else if (searchType === 'order') {
          controller.setFieldDisabled('category', false);
          controller.setFieldLabel('category', '주문 상태');
          controller.setFieldOptions('category', [
            { label: '결제 완료', value: 'paid' },
            { label: '배송 중', value: 'shipping' },
            { label: '배송 완료', value: 'delivered' },
          ]);
        } else {
          controller.setFieldDisabled('category', true);
          controller.setFieldOptions('category', []);
        }

        controller.setValue('category', '');
      },
    },

    // dateRange는 searchType에 의존
    dateRange: {
      dependencies: ['searchType'],
      handler: (values: FieldValues, controller: FieldController) => {
        const { searchType } = values;

        if (searchType === 'order') {
          controller.setFieldDisabled('dateRange', false);
          controller.setFieldLabel('dateRange', '주문 기간');
          controller.setFieldPlaceholder('dateRange', '주문 기간을 선택하세요');
        } else if (searchType === 'user') {
          controller.setFieldDisabled('dateRange', false);
          controller.setFieldLabel('dateRange', '가입 기간');
          controller.setFieldPlaceholder('dateRange', '가입 기간을 선택하세요');
        } else {
          controller.setFieldDisabled('dateRange', true);
          controller.setValue('dateRange', null);
        }
      },
    },
  };

  const handleSearch = (data: any) => {
    console.log('🔎 검색 조건:', data);
    alert(`검색 타입: ${data.searchType}\n카테고리: ${data.category}`);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>🔎 검색 타입별 필터 예제</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        검색 타입에 따라 다른 필터 옵션과 레이블이 표시됩니다.
      </p>

      <SearchProvider config={config} onSubmit={handleSearch} onDepends={dependencyRules}>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="searchType" />
          <Field name="category" />
          <Field name="dateRange" />
        </div>
        <SearchButtons submitText="검색" />
      </SearchProvider>
    </div>
  );
};

/**
 * 예제 4: 의존성 규칙을 별도 파일로 분리 (권장 패턴)
 * 복잡한 프로젝트에서는 의존성 규칙을 별도 파일로 관리하는 것이 좋음
 */
export const SeparatedDependenciesExample = () => {
  // 실제 프로젝트에서는 이렇게 별도 파일로 관리:
  // utils/searchDependencies.ts
  const productSearchDependencies: Record<string, FieldDependencyHandler> = {
    city: {
      dependencies: ['country'],
      handler: (values: FieldValues, controller: FieldController) => {
        const { country } = values;
        if (!country) {
          controller.setFieldDisabled('city', true);
          controller.setFieldOptions('city', []);
        } else {
          controller.setFieldDisabled('city', false);
          controller.setFieldOptions('city', getCitiesByCountry(country));
        }
      },
    },
  };
  const config: SearchConfig = {
    id: 'separated-deps',
    fields: [
      {
        id: 'country',
        name: 'country',
        type: 'select',
        label: '국가',
        options: [
          { label: '한국', value: 'korea' },
          { label: '미국', value: 'usa' },
        ],
      },
      {
        id: 'city',
        name: 'city',
        type: 'select',
        label: '도시',
        disabled: true,
        options: [],
      },
    ],
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>📁 의존성 규칙 분리 예제</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        복잡한 프로젝트에서는 의존성 규칙을 별도 파일로 관리하세요.
      </p>

      <SearchProvider
        config={config}
        onSubmit={(data) => console.log(data)}
        onDepends={productSearchDependencies}
      >
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <Field name="country" />
          <Field name="city" />
        </div>
        <SearchButtons />
      </SearchProvider>
    </div>
  );
};
