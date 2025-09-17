# withFieldProps HOC 사용 가이드

## 📖 개요

`withFieldProps`는 서로 다른 props 이름을 사용하는 필드 컴포넌트들을 표준화된 인터페이스로 통합하는 고차 컴포넌트(HOC)입니다.

### 🎯 해결하는 문제

```typescript
// 문제: 각 컴포넌트마다 다른 props 이름
<TextField value={text} onChange={setText} />
<Checkbox checked={isChecked} onCheckedChange={setChecked} />
<DatePicker selected={date} onSelect={setDate} />
<NumberInput inputValue={num} onValueChange={setNum} />
```

```typescript
// 해결: 모든 컴포넌트가 동일한 표준 props 사용
<Field name="text" />      // value, onChange 자동 매핑
<Field name="checkbox" />  // value → checked, onChange → onCheckedChange
<Field name="date" />      // value → selected, onChange → onSelect
<Field name="number" />    // value → inputValue, onChange → onValueChange
```

## 🚀 빠른 시작

### 1. 기본 사용법

```typescript
import { withFieldProps } from '@/hoc/withFieldProps';

// 체크박스 컴포넌트 (다른 props 이름 사용)
const CheckboxComponent = ({ checked, onCheckedChange, label }) => (
  <label>
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange(e.target.checked)} 
    />
    {label}
  </label>
);

// HOC로 래핑
const WrappedCheckbox = withFieldProps(CheckboxComponent, 'checkbox');

// 표준 props로 사용
function MyForm() {
  const [agree, setAgree] = useState(false);
  
  return (
    <WrappedCheckbox 
      value={agree}
      onChange={setAgree}
      meta={{ label: "이용약관에 동의합니다" }}
    />
  );
}
```

### 2. 새로운 필드 타입 추가

```typescript
import { registerFieldMapping } from '@/hoc/withFieldProps';

// 커스텀 슬라이더 컴포넌트
const SliderComponent = ({ sliderValue, onSliderChange, min, max }) => (
  <input 
    type="range" 
    value={sliderValue} 
    onChange={(e) => onSliderChange(Number(e.target.value))}
    min={min}
    max={max}
  />
);

// 새로운 매핑 등록
registerFieldMapping('slider', {
  value: 'sliderValue',
  onChange: 'onSliderChange',
  onBlur: 'onBlur'
});

// HOC로 래핑
const WrappedSlider = withFieldProps(SliderComponent, 'slider');
```

## 📋 지원되는 필드 타입

| 필드 타입 | value → | onChange → | 설명 |
|-----------|---------|------------|------|
| `text` | `value` | `onChange` | 기본 텍스트 입력 |
| `select` | `value` | `onChange` | 드롭다운 선택 |
| `multiselect` | `value` | `onValueChange` | 다중 선택 |
| `date` | `selected` | `onChange` | 날짜 선택 |
| `daterange` | `value` | `onChange` | 날짜 범위 |
| `number` | `value` | `onValueChange` | 숫자 입력 |
| `numberrange` | `value` | `onValueChange` | 숫자 범위 |
| `checkbox` | `checked` | `onCheckedChange` | 체크박스 |
| `radio` | `value` | `onValueChange` | 라디오 버튼 |
| `autocomplete` | `value` | `onInputChange` | 자동완성 |
| `file` | `files` | `onFilesChange` | 파일 업로드 |
| `tags` | `tags` | `onTagsChange` | 태그 입력 |
| `textarea` | `value` | `onChange` | 텍스트 영역 |
| `hidden` | `value` | `onChange` | 숨김 필드 |
| `custom` | `value` | `onChange` | 사용자 정의 |

## 🔄 Props 매핑 플로우

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Standard Props  │    │   withFieldProps │    │ Component Props │
│                 │    │       HOC        │    │                 │
│ value: true     ├───►│                  ├───►│ checked: true   │
│ onChange: fn    │    │   매핑 적용       │    │ onCheckedChange │
│ onBlur: fn      │    │                  │    │ onBlur: fn      │
│ error: "..."    │    │   나머지 전달     │    │ error: "..."    │
│ meta: {...}     │    │                  │    │ meta: {...}     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎨 고급 사용법

### 1. HOC 팩토리 패턴

```typescript
import { createFieldWrapper } from '@/hoc/withFieldProps';

// 체크박스 타입 전용 래퍼 생성
const wrapAsCheckbox = createFieldWrapper('checkbox');

// 여러 체크박스 컴포넌트 래핑
const StandardCheckbox = wrapAsCheckbox(BasicCheckbox);
const PremiumCheckbox = wrapAsCheckbox(AdvancedCheckbox);
const CustomCheckbox = wrapAsCheckbox(MyCustomCheckbox);
```

### 2. 배치 래핑

```typescript
import { wrapMultipleComponents } from '@/hoc/withFieldProps';

const wrappedComponents = wrapMultipleComponents([
  { component: TextInput, fieldType: 'text', name: 'TextInput' },
  { component: Checkbox, fieldType: 'checkbox', name: 'Checkbox' },
  { component: DatePicker, fieldType: 'date', name: 'DatePicker' },
  { component: NumberInput, fieldType: 'number', name: 'NumberInput' }
]);

// 사용
const { TextInput, Checkbox, DatePicker, NumberInput } = wrappedComponents;
```

### 3. 디버깅 모드

```typescript
import { enableFieldPropsDebug } from '@/hoc/withFieldProps';

// 개발 환경에서 디버깅 모드 활성화
if (process.env.NODE_ENV === 'development') {
  enableFieldPropsDebug(true);
}

// 이제 모든 props 매핑 과정이 콘솔에 출력됩니다
```

## 🛠️ 실제 사용 예제

### SearchBox 컴포넌트에서 활용

```typescript
// src/components/Field.tsx
import { withFieldProps } from '@/hoc/withFieldProps';
import { TextField } from './fields/TextField';
import { CheckboxField } from './fields/CheckboxField';
import { DateField } from './fields/DateField';

const defaultFieldComponents = {
  text: withFieldProps(TextField, 'text'),
  checkbox: withFieldProps(CheckboxField, 'checkbox'),
  date: withFieldProps(DateField, 'date'),
  // ... 30개 이상의 필드 타입
};

export const Field = ({ name, type }) => {
  const FieldComponent = defaultFieldComponents[type];
  return <FieldComponent {...standardProps} />;
};
```

### 커스텀 필드 생성

```typescript
// 1. 컴포넌트 생성
const ColorPickerComponent = ({ colorValue, onColorChange, palette }) => (
  <div>
    {palette.map(color => (
      <button 
        key={color}
        style={{ backgroundColor: color }}
        onClick={() => onColorChange(color)}
        className={colorValue === color ? 'selected' : ''}
      />
    ))}
  </div>
);

// 2. 매핑 등록
registerFieldMapping('colorpicker', {
  value: 'colorValue',
  onChange: 'onColorChange',
  onBlur: 'onBlur'
});

// 3. HOC 적용
const ColorPicker = withFieldProps(ColorPickerComponent, 'colorpicker');

// 4. SearchBox에서 사용
const config = {
  fields: [
    {
      id: 'theme',
      name: 'theme',
      type: 'colorpicker', // 새로운 타입 사용
      label: '테마 색상',
      palette: ['#ff0000', '#00ff00', '#0000ff']
    }
  ]
};
```

## 🔍 디버깅 가이드

### 1. 매핑 확인

```typescript
import { getFieldMapping, validateMapping } from '@/hoc/withFieldProps';

// 특정 필드 타입의 매핑 확인
const checkboxMapping = getFieldMapping('checkbox');
console.log(checkboxMapping);
// { value: 'checked', onChange: 'onCheckedChange', onBlur: 'onBlur' }

// 매핑 유효성 검사
const validation = validateMapping(checkboxMapping);
if (!validation.isValid) {
  console.error('Invalid mapping:', validation.errors);
}
```

### 2. 전체 매핑 조회

```typescript
import { getAllFieldMappings } from '@/hoc/withFieldProps';

// 모든 등록된 매핑 확인
const allMappings = getAllFieldMappings();
console.table(allMappings);
```

### 3. 런타임 디버깅

```javascript
// 브라우저 콘솔에서 사용
__WITH_FIELD_PROPS__.enableDebug(true);  // 디버깅 활성화
__WITH_FIELD_PROPS__.getAllMappings();   // 모든 매핑 조회
__WITH_FIELD_PROPS__.isReady();          // 모듈 준비 상태 확인
```

## ⚠️ 주의사항 및 제한사항

### 1. 성능 고려사항

```typescript
// ✅ 좋은 예: 컴포넌트 외부에서 래핑
const WrappedComponent = withFieldProps(MyComponent, 'text');

function MyForm() {
  return <WrappedComponent value={value} onChange={onChange} />;
}

// ❌ 나쁜 예: 렌더링마다 새로 래핑
function MyForm() {
  const WrappedComponent = withFieldProps(MyComponent, 'text'); // 매번 새로 생성
  return <WrappedComponent value={value} onChange={onChange} />;
}
```

### 2. 타입 안전성

```typescript
// ✅ 타입이 안전한 사용
interface MyComponentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ checked, onCheckedChange }) => {
  // ...
};

const WrappedComponent = withFieldProps(MyComponent, 'checkbox');

// ❌ 타입 불일치 - 런타임 오류 가능
const WrappedComponent = withFieldProps(MyComponent, 'text'); // text는 value/onChange 사용
```

### 3. 매핑 충돌

```typescript
// ⚠️ 주의: 기존 매핑 덮어쓰기
registerFieldMapping('text', {
  value: 'inputValue',  // 기존 'value' 덮어쓰기
  onChange: 'onInputChange'
});

// 기존 text 필드들이 영향받을 수 있음
```

## 🎯 베스트 프랙티스

### 1. 명명 규칙

```typescript
// ✅ 일관된 매핑 네이밍
{
  value: 'selectedValue',      // 값 속성은 *Value로 끝나기
  onChange: 'onValueChange',   // 변경 핸들러는 onChange*로 시작
  onBlur: 'onBlur'            // 블러는 일관되게 onBlur
}
```

### 2. 타입 정의

```typescript
// ✅ 컴포넌트별 Props 인터페이스 정의
interface SliderProps {
  sliderValue: number;
  onSliderChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
}

const SliderComponent: React.FC<SliderProps> = (props) => {
  // 구현
};
```

### 3. 문서화

```typescript
// ✅ 매핑 이유와 사용법 문서화
registerFieldMapping('customSlider', {
  value: 'sliderValue',        // react-slider 라이브러리의 value prop
  onChange: 'onSliderChange',  // react-slider의 onChange 핸들러
  onBlur: 'onBlur',           // 표준 onBlur 이벤트
  // 추가 props
  min: 'minValue',
  max: 'maxValue',
  step: 'stepSize'
});
```

## 🔧 트러블슈팅

### 문제 1: Props가 전달되지 않음

```typescript
// 증상: 컴포넌트에 props가 undefined로 전달됨
// 원인: 매핑 설정 오류

// 해결: 매핑 확인
const mapping = getFieldMapping('myCustomType');
console.log('Mapping:', mapping); // undefined인지 확인

// 매핑이 없다면 등록
if (!mapping) {
  registerFieldMapping('myCustomType', {
    value: 'customValue',
    onChange: 'onCustomChange',
    onBlur: 'onBlur'
  });
}
```

### 문제 2: 타입 오류

```typescript
// 증상: TypeScript 컴파일 오류
// 원인: 컴포넌트 props 타입과 매핑 불일치

// 해결: Props 인터페이스 확인
interface ComponentProps {
  customValue: string;        // 매핑의 value와 일치해야 함
  onCustomChange: (v: string) => void; // 매핑의 onChange와 일치해야 함
}
```

### 문제 3: 성능 문제

```typescript
// 증상: 컴포넌트가 과도하게 리렌더링됨
// 원인: 매번 새로운 HOC 생성

// 해결: 컴포넌트 외부로 이동
const WrappedComponent = withFieldProps(MyComponent, 'text'); // 한번만 생성

// 또는 useMemo 사용
const WrappedComponent = useMemo(
  () => withFieldProps(MyComponent, 'text'),
  []
);
```

## 📚 추가 자료

- [React HOC 패턴 가이드](https://reactjs.org/docs/higher-order-components.html)
- [TypeScript 고급 타입](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [성능 최적화 가이드](https://react.dev/learn/render-and-commit)

---

**문의사항이나 개선 제안이 있으시면 이슈를 등록해 주세요!** 🚀