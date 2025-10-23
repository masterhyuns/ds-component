/**
 * DatePicker Storybook 스토리
 * SearchProvider 없이 독립적으로 사용 가능한 DatePicker 컴포넌트
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

/**
 * 기본 Uncontrolled 예제
 * defaultValue와 onChange만 사용
 */
export const UncontrolledBasic: Story = {
  render: () => {
    return (
      <div>
        <DatePicker
          label="시작일"
          placeholder="날짜를 선택하세요"
          defaultValue={new Date()}
          onChange={(date) => {
            console.log('선택된 날짜:', date);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Uncontrolled 모드: defaultValue 사용, 내부 state로 관리됨
        </p>
      </div>
    );
  },
};

/**
 * Controlled 예제
 * value와 onChange로 외부에서 상태 관리
 */
export const ControlledBasic: Story = {
  render: () => {
    const ControlledExample = () => {
      const [date, setDate] = useState<Date | null>(new Date());

      return (
        <div>
          <DatePicker
            label="생년월일"
            placeholder="날짜를 선택하세요"
            value={date}
            onChange={(value) => setDate(value as Date | null)}
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 날짜:</strong> {date ? date.toLocaleDateString('ko-KR') : '(없음)'}
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => setDate(new Date())} style={{ marginRight: '0.5rem' }}>
                오늘로 설정
              </button>
              <button onClick={() => setDate(null)}>
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
 * 날짜 범위 선택 - Uncontrolled
 */
export const DateRangeUncontrolled: Story = {
  render: () => {
    return (
      <div>
        <DatePicker
          label="기간"
          placeholder="시작일 ~ 종료일"
          isRange
          onChange={(dates) => {
            console.log('선택된 범위:', dates);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          날짜 범위 선택 Uncontrolled 모드
        </p>
      </div>
    );
  },
};

/**
 * 날짜 범위 선택 - Controlled
 */
export const DateRangeControlled: Story = {
  render: () => {
    const RangeExample = () => {
      const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
      const [startDate, endDate] = dates;

      return (
        <div>
          <DatePicker
            label="프로젝트 기간"
            placeholder="시작일 ~ 종료일"
            isRange
            value={dates}
            onChange={(value) => setDates(value as [Date | null, Date | null])}
            isClearable
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 기간:</strong>
            <div>시작일: {startDate ? startDate.toLocaleDateString('ko-KR') : '(없음)'}</div>
            <div>종료일: {endDate ? endDate.toLocaleDateString('ko-KR') : '(없음)'}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  const today = new Date();
                  const nextWeek = new Date();
                  nextWeek.setDate(today.getDate() + 7);
                  setDates([today, nextWeek]);
                }}
                style={{ marginRight: '0.5rem' }}
              >
                오늘 ~ 일주일 후
              </button>
              <button onClick={() => setDates([null, null])}>
                초기화
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <RangeExample />;
  },
};

/**
 * 시간 선택 포함
 */
export const WithTimeSelect: Story = {
  render: () => {
    const TimeExample = () => {
      const [dateTime, setDateTime] = useState<Date | null>(new Date());

      return (
        <div>
          <DatePicker
            label="예약 일시"
            value={dateTime}
            onChange={(value) => setDateTime(value as Date | null)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="yyyy-MM-dd"
            timeFormat="HH:mm"
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 일시:</strong> {dateTime ? dateTime.toLocaleString('ko-KR') : '(없음)'}
          </div>
        </div>
      );
    };

    return <TimeExample />;
  },
};

/**
 * 최소/최대 날짜 제한
 */
export const WithMinMaxDate: Story = {
  render: () => {
    const MinMaxExample = () => {
      const [date, setDate] = useState<Date | null>(null);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setMonth(today.getMonth() + 3); // 3개월 후까지

      return (
        <div>
          <DatePicker
            label="예약 가능 날짜"
            value={date}
            onChange={(value) => setDate(value as Date | null)}
            minDate={today}
            maxDate={maxDate}
            placeholder="오늘부터 3개월 후까지"
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>제한:</strong>
            <div>최소 날짜: {today.toLocaleDateString('ko-KR')}</div>
            <div>최대 날짜: {maxDate.toLocaleDateString('ko-KR')}</div>
          </div>
        </div>
      );
    };

    return <MinMaxExample />;
  },
};

/**
 * 특정 날짜 제외
 */
export const WithExcludeDates: Story = {
  render: () => {
    const ExcludeExample = () => {
      const [date, setDate] = useState<Date | null>(null);

      // 주말 제외
      const excludedDates: Date[] = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        if (d.getDay() === 0 || d.getDay() === 6) {
          excludedDates.push(d);
        }
      }

      return (
        <div>
          <DatePicker
            label="근무일 선택"
            value={date}
            onChange={(value) => setDate(value as Date | null)}
            excludeDates={excludedDates}
            placeholder="주말 제외"
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 날짜:</strong> {date ? date.toLocaleDateString('ko-KR') : '(없음)'}
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
              * 주말은 선택할 수 없습니다
            </div>
          </div>
        </div>
      );
    };

    return <ExcludeExample />;
  },
};

/**
 * 인라인 캘린더
 */
export const InlineCalendar: Story = {
  render: () => {
    const InlineExample = () => {
      const [date, setDate] = useState<Date | null>(new Date());

      return (
        <div>
          <DatePicker
            label="날짜 선택"
            value={date}
            onChange={(value) => setDate(value as Date | null)}
            inline
          />

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 날짜:</strong> {date ? date.toLocaleDateString('ko-KR') : '(없음)'}
          </div>
        </div>
      );
    };

    return <InlineExample />;
  },
};

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: () => {
    const ErrorExample = () => {
      const [date, setDate] = useState<Date | null>(null);
      const [error, setError] = useState('');

      const handleChange = (value: Date | null | [Date | null, Date | null]) => {
        const newDate = value as Date | null;
        setDate(newDate);
        if (!newDate) {
          setError('날짜를 선택해주세요');
        } else {
          setError('');
        }
      };

      return (
        <div>
          <DatePicker
            label="필수 날짜"
            required
            value={date}
            onChange={handleChange}
            error={error}
          />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            날짜를 선택하면 에러가 사라집니다
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
      <DatePicker
        label="종료일"
        placeholder="프로젝트 종료일"
        disabled
        defaultValue={new Date()}
      />
    );
  },
};

/**
 * 커스텀 날짜 포맷
 */
export const CustomFormat: Story = {
  render: () => {
    const FormatExample = () => {
      const [date, setDate] = useState<Date | null>(new Date());

      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DatePicker
              label="yyyy-MM-dd 형식"
              value={date}
              onChange={(value) => setDate(value as Date | null)}
              dateFormat="yyyy-MM-dd"
            />

            <DatePicker
              label="MM/dd/yyyy 형식"
              value={date}
              onChange={(value) => setDate(value as Date | null)}
              dateFormat="MM/dd/yyyy"
            />

            <DatePicker
              label="yyyy년 MM월 dd일 형식"
              value={date}
              onChange={(value) => setDate(value as Date | null)}
              dateFormat="yyyy년 MM월 dd일"
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 날짜:</strong> {date ? date.toLocaleDateString('ko-KR') : '(없음)'}
          </div>
        </div>
      );
    };

    return <FormatExample />;
  },
};

/**
 * 복합 예제
 */
export const CombinedExample: Story = {
  render: () => {
    const CombinedExampleComponent = () => {
      const [formData, setFormData] = useState({
        startDate: null as Date | null,
        endDate: null as Date | null,
        meetingDate: null as Date | null,
      });

      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DatePicker
              label="프로젝트 시작일"
              value={formData.startDate}
              onChange={(value) => setFormData({ ...formData, startDate: value as Date | null })}
            />

            <DatePicker
              label="프로젝트 종료일"
              value={formData.endDate}
              onChange={(value) => setFormData({ ...formData, endDate: value as Date | null })}
              minDate={formData.startDate || undefined}
              disabled={!formData.startDate}
              placeholder={!formData.startDate ? '시작일을 먼저 선택하세요' : '종료일 선택'}
            />

            <DatePicker
              label="회의 일시"
              value={formData.meetingDate}
              onChange={(value) => setFormData({ ...formData, meetingDate: value as Date | null })}
              showTimeSelect
              timeIntervals={30}
              dateFormat="yyyy-MM-dd"
              timeFormat="HH:mm"
            />
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>선택된 값:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <div>시작일: {formData.startDate ? formData.startDate.toLocaleDateString('ko-KR') : '(없음)'}</div>
              <div>종료일: {formData.endDate ? formData.endDate.toLocaleDateString('ko-KR') : '(없음)'}</div>
              <div>회의일시: {formData.meetingDate ? formData.meetingDate.toLocaleString('ko-KR') : '(없음)'}</div>
            </div>
          </div>
        </div>
      );
    };

    return <CombinedExampleComponent />;
  },
};
