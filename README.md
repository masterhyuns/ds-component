# SD Search Box

완전히 추상화된 헤드리스 검색 컴포넌트 라이브러리

## 🎯 핵심 특징

- **진짜 헤드리스**: 데이터 흐름과 상태 관리만 제공, UI는 완전 자유
- **react-hook-form 완전 캡슐화**: 사용자는 우리 API만 알면 됨
- **자유로운 레이아웃**: 디자이너가 원하는 어떤 형태로도 구성 가능
- **TypeScript 완벽 지원**: 타입 안정성 보장
- **메타 정의 시스템**: 설정 기반 자동 렌더링 지원

## 📦 설치

```bash
pnpm add sd-search-box
```

## 🚀 빠른 시작

### 기본 사용법

```tsx
import { SearchProvider, Field, SearchButtons } from 'sd-search-box';

const config = {
  id: 'my-search',
  fields: [
    {
      id: 'keyword',
      name: 'keyword',
      type: 'text',
      label: '검색어',
      placeholder: '검색어를 입력하세요',
      validation: {
        required: '검색어는 필수입니다',
      },
    },
    {
      id: 'category',
      name: 'category',
      type: 'select',
      label: '카테고리',
      options: [
        { label: '전체', value: 'all' },
        { label: '제품', value: 'product' },
      ],
    },
  ],
  onSubmit: async (data) => {
    console.log('검색:', data);
  },
};

function SearchForm() {
  return (
    <SearchProvider config={config}>
      <Field name="keyword" />
      <Field name="category" />
      <SearchButtons />
    </SearchProvider>
  );
}
```

### 자유로운 레이아웃

```tsx
<SearchProvider config={config}>
  <div className="my-custom-layout">
    <div className="row">
      <Field name="name" />
      <Field name="email" />
    </div>
    
    <CustomBanner />  {/* 중간에 내 컴포넌트 삽입 */}
    
    <div className="advanced-section">
      <Field name="category" />
      <Field name="date" />
    </div>
    
    <SearchButtons />
  </div>
</SearchProvider>
```

### 커스텀 필드 컴포넌트

```tsx
// 방법 1: 컴포넌트 prop
const MyCustomInput = ({ value, onChange, error, meta }) => (
  <div>
    <label>{meta?.label}</label>
    <input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <span>{error}</span>}
  </div>
);

<Field name="email" component={MyCustomInput} />

// 방법 2: render prop
<Field name="email">
  {(field) => (
    <MyCustomInput 
      value={field.value}
      onChange={field.setValue}
      error={field.error}
    />
  )}
</Field>

// 방법 3: useField 훅 직접 사용
function CustomField({ fieldName }) {
  const field = useField(fieldName);
  
  return (
    <div>
      <input 
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </div>
  );
}
```

## 📚 API

### Components

#### `<SearchProvider>`
검색 컨텍스트를 제공하는 최상위 컴포넌트

```tsx
<SearchProvider
  config={config}
  onSubmit={(data) => console.log(data)}
  onReset={() => console.log('reset')}
  onChange={(name, value, values) => console.log(name, value)}
  onDepends={dependencyRules}  // 필드 간 의존성 설정
  initialValues={initialValues}
>
  {children}
</SearchProvider>
```

**Props:**
- `config`: 검색 폼 설정 (필수)
- `onSubmit`: 폼 제출 시 호출되는 함수
- `onReset`: 폼 초기화 시 호출되는 함수
- `onChange`: 필드 값 변경 시 호출되는 함수
- `onDepends`: 필드 간 의존성 규칙 정의
- `initialValues`: 폼 초기값

#### `<Field>`
필드를 렌더링하는 컴포넌트

```tsx
<Field 
  name="fieldName"           // 필드 이름 (필수)
  component={CustomComponent} // 커스텀 컴포넌트
  render={(field) => ...}     // render prop
/>
```

#### `<SearchButtons>`
검색 및 초기화 버튼

```tsx
<SearchButtons 
  submitText="검색"
  resetText="초기화"
  showReset={true}
  align="right"
/>
```

### Hooks

#### `useField(name: string)`
특정 필드를 제어하는 훅

```tsx
const field = useField('email');

field.value          // 현재 값
field.setValue(val)  // 값 설정
field.onChange(e)    // onChange 핸들러
field.onBlur()       // onBlur 핸들러
field.error          // 에러 메시지
field.isDirty        // 수정 여부
field.isTouched      // 터치 여부
field.meta           // 필드 메타 정보
field.reset()        // 필드 초기화
field.validate()     // 수동 검증
```

#### `useSearchForm()`
전체 폼을 제어하는 훅

```tsx
const form = useSearchForm();

form.submit()           // 폼 제출
form.reset()            // 폼 초기화
form.getValues()        // 전체 값
form.setValues(values)  // 전체 값 설정
form.getValue(name)     // 특정 값
form.setValue(name, val)// 특정 값 설정
form.validate()         // 폼 검증
form.isSubmitting       // 제출 중
form.errors             // 에러 목록
```

#### `useFieldValue(name: string)`
특정 필드 값만 구독

```tsx
const value = useFieldValue('category');
```

#### `useArrayField(name: string)`
배열 필드 관리

```tsx
const items = useArrayField('products');

items.items              // 배열 아이템
items.add(value)         // 아이템 추가
items.remove(index)      // 아이템 제거
items.move(from, to)     // 아이템 이동
items.insert(index, val) // 아이템 삽입
items.clear()            // 전체 초기화
```

#### `useFieldMeta(name: string)`
필드 메타 정보 접근

```tsx
const meta = useFieldMeta('email');
```

## 🎨 필드 타입

- `text` - 텍스트 입력
- `select` - 드롭다운 선택
- `multiselect` - 다중 선택 (구현 예정)
- `date` - 날짜 선택 (구현 예정)
- `daterange` - 날짜 범위 (구현 예정)
- `number` - 숫자 입력 (구현 예정)
- `checkbox` - 체크박스 (구현 예정)
- `radio` - 라디오 버튼 (구현 예정)
- `autocomplete` - 자동완성 (구현 예정)
- `custom` - 사용자 정의

## 🔧 설정 (Config)

```typescript
interface SearchConfig {
  id: string;                    // 폼 ID
  name?: string;                  // 폼 이름
  fields: FieldMeta[];           // 필드 정의
  autoSubmit?: boolean;          // 자동 제출
  autoSubmitDelay?: number;      // 자동 제출 지연(ms)
  defaultValues?: object;        // 기본값
}

interface SearchProviderProps {
  config: SearchConfig;                              // 폼 설정
  onSubmit?: (data) => void;                        // 제출 핸들러
  onReset?: () => void;                             // 리셋 핸들러
  onChange?: (name, value, values) => void;         // 변경 핸들러
  onDepends?: Record<string, FieldDependencyHandler>; // 필드 의존성 규칙
  initialValues?: object;                           // 초기값
}

interface FieldDependencyHandler {
  dependencies: string[];                           // 의존하는 필드 이름 배열
  handler: (values, controller) => void;            // 의존성 변경 시 실행
}

interface FieldMeta {
  id: string;                    // 필드 ID
  name: string;                  // 필드 이름
  type: SearchFieldType;         // 필드 타입
  label?: string;                // 라벨
  placeholder?: string;          // 플레이스홀더
  defaultValue?: any;            // 기본값
  disabled?: boolean;            // 비활성화
  readonly?: boolean;            // 읽기전용
  validation?: ValidationRules;  // 유효성 검사
  options?: Option[];            // 선택 옵션
  showWhen?: (values) => boolean;// 조건부 표시
  // ...기타 설정
}
```

## 📖 고급 사용법

### 필드 간 의존성 관리 (onDepends) ✨

필드 간 의존성을 선언적으로 관리할 수 있습니다. Config는 순수하게 유지하고, 비즈니스 로직은 `onDepends`로 분리합니다.

#### 기본 예제: 국가/도시 선택

```tsx
import { SearchProvider, Field } from 'sd-search-box';
import type { FieldDependencyHandler, FieldValues, FieldController } from 'sd-search-box';

// 1. Config는 순수하게 유지 (JSON 직렬화 가능)
const config = {
  id: 'location-search',
  fields: [
    {
      name: 'country',
      type: 'select',
      label: '국가',
      options: [
        { label: '한국', value: 'korea' },
        { label: '미국', value: 'usa' },
      ],
    },
    {
      name: 'city',
      type: 'select',
      label: '도시',
      disabled: true,  // 초기에는 비활성화
      options: [],     // 초기에는 빈 배열
    },
  ],
};

// 2. 비즈니스 로직은 onDepends로 분리
const dependencies: Record<string, FieldDependencyHandler> = {
  city: {
    dependencies: ['country'],  // country 필드에 의존
    handler: (values: FieldValues, controller: FieldController) => {
      const { country } = values;

      if (!country) {
        // 국가가 선택되지 않으면 도시 비활성화
        controller.setFieldDisabled('city', true);
        controller.setFieldOptions('city', []);
        controller.setValue('city', '');
      } else {
        // 국가가 선택되면 해당 도시 목록 설정
        controller.setFieldDisabled('city', false);
        controller.setFieldOptions('city', getCitiesByCountry(country));
      }
    },
  },
};

// 3. Provider에 전달
function SearchForm() {
  return (
    <SearchProvider config={config} onDepends={dependencies}>
      <Field name="country" />
      <Field name="city" />
    </SearchProvider>
  );
}
```

#### FieldController API

onDepends handler에서 사용할 수 있는 필드 제어 API:

```typescript
controller.setValue(fieldName, value)              // 필드 값 설정
controller.setFieldDisabled(fieldName, disabled)   // 비활성화 상태 설정
controller.setFieldReadonly(fieldName, readonly)   // 읽기 전용 설정
controller.setFieldOptions(fieldName, options)     // 옵션 목록 설정
controller.setFieldPlaceholder(fieldName, text)    // placeholder 설정
controller.setFieldLabel(fieldName, text)          // label 설정
controller.updateFieldMeta(fieldName, meta)        // 메타 정보 일괄 업데이트
controller.getValue(fieldName)                     // 현재 필드 값 가져오기
controller.getValues()                             // 전체 폼 값 가져오기
```

#### 복합 의존성 예제

여러 필드에 의존하는 경우:

```tsx
const dependencies = {
  discount: {
    dependencies: ['customerGrade', 'totalAmount'],  // 두 필드에 의존
    handler: (values: FieldValues, controller: FieldController) => {
      const { customerGrade, totalAmount } = values;

      // VIP이고 10만원 이상이면 할인 가능
      if (customerGrade === 'vip' && totalAmount >= 100000) {
        controller.setFieldDisabled('discount', false);
        controller.setFieldPlaceholder('discount', '최대 30% 할인 가능');
        controller.updateFieldMeta('discount', {
          validation: {
            max: { value: 30, message: '30%를 초과할 수 없습니다' }
          }
        });
      } else {
        controller.setFieldDisabled('discount', true);
        controller.setValue('discount', 0);
      }
    },
  },
};
```

#### 의존성 규칙 분리 (권장 패턴)

복잡한 프로젝트에서는 의존성 규칙을 별도 파일로 관리:

```tsx
// utils/searchDependencies.ts
export const productSearchDependencies: Record<string, FieldDependencyHandler> = {
  city: {
    dependencies: ['country'],
    handler: (values: FieldValues, controller: FieldController) => {
      // 로직...
    },
  },
  discount: {
    dependencies: ['customerGrade', 'totalAmount'],
    handler: (values: FieldValues, controller: FieldController) => {
      // 로직...
    },
  },
};

// components/ProductSearch.tsx
import { productSearchDependencies } from '@/utils/searchDependencies';

function ProductSearch() {
  return (
    <SearchProvider
      config={config}
      onDepends={productSearchDependencies}
    >
      {/* ... */}
    </SearchProvider>
  );
}
```

### 조건부 필드

```tsx
const config = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: '기본', value: 'basic' },
        { label: '상세', value: 'advanced' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      // type이 'advanced'일 때만 표시
      showWhen: (values) => values.type === 'advanced',
    },
  ],
};
```

### 배열 필드

```tsx
function ProductList() {
  const products = useArrayField('products');
  
  return (
    <>
      {products.items.map((item, index) => (
        <div key={item.id}>
          <Field name={`products.${index}.name`} />
          <Field name={`products.${index}.price`} />
          <button onClick={() => products.remove(index)}>
            삭제
          </button>
        </div>
      ))}
      <button onClick={() => products.add()}>추가</button>
    </>
  );
}
```

## 🚧 개발 현황

### ✅ 완료된 기능
- SearchProvider (react-hook-form 캡슐화)
- Field 컴포넌트
- useField, useSearchForm, useFieldValue, useArrayField, useFieldMeta 훅
- TextField, SelectField 기본 컴포넌트
- SearchButtons 유틸리티 컴포넌트
- 조건부 렌더링
- 배열 필드 지원
- **필드 간 의존성 관리 (onDepends)** ✨
- TypeScript 완벽 지원

### 🔄 진행 중
- 추가 필드 타입 구현
- 테스트 코드 작성
- 문서화 보완

### 📋 예정
- MultiSelectField
- DateField, DateRangeField
- NumberField, NumberRangeField
- CheckboxField, RadioField
- AutocompleteField
- 파일 업로드
- 국제화(i18n) 지원
- 테마 시스템
- 접근성(a11y) 개선

## 🛠️ 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 스토리북 실행
pnpm storybook

# 타입 체크
pnpm lint

# 빌드
pnpm build
```

## 📄 라이센스

MIT

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

---

## 요구사항 체크리스트

- ✅ 타입스크립트를 준수하는 리액트 검색 컴포넌트 개발
- ✅ 스토리북으로 사용법 및 예제 제공
- ✅ 여러 어플리케이션에서 사용할 수 있는 헤드리스 구조
- ✅ 다양한 검색 컴포넌트 지원 (진행 중)
- ✅ react-hook-form으로 상태 관리 (완전 추상화)
- ✅ 메타 정의로 사용자별 검색 컴포넌트 설정 가능
- ✅ 공통 컴포넌트에서 제공하지 않는 컴포넌트도 사용 가능 (커스텀 컴포넌트 지원)