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
<SearchProvider config={config}>
  {children}
</SearchProvider>
```

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
  onSubmit?: (data) => void;     // 제출 핸들러
  onReset?: () => void;          // 리셋 핸들러
  onChange?: (data) => void;     // 변경 핸들러
  autoSubmit?: boolean;          // 자동 제출
  autoSubmitDelay?: number;      // 자동 제출 지연(ms)
  defaultValues?: object;        // 기본값
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