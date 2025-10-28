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
 * 위치 조절 테스트 (화면 끝에 배치)
 * DatePicker가 브라우저 우측 끝, 좌측 끝, 상단, 하단에 있어도 달력이 잘 보이는지 테스트
 */
export const PositionTest: Story = {
  render: () => {
    const PositionTestComponent = () => {
      const [date1, setDate1] = useState<Date | null>(null);
      const [date2, setDate2] = useState<Date | null>(null);
      const [date3, setDate3] = useState<Date | null>(null);
      const [date4, setDate4] = useState<Date | null>(null);

      return (
        <div style={{ position: 'relative', minHeight: '600px', border: '2px dashed #ccc', padding: 0 }}>
          <h3 style={{ margin: '1rem', marginBottom: '0.5rem' }}>DatePicker 위치 조절 테스트</h3>
          <p style={{ margin: '0 1rem 1rem 1rem', fontSize: '0.875rem', color: '#666' }}>
            💡 각 위치에서 달력을 열어보세요. 공간이 부족하면 자동으로 위치가 조정됩니다.
          </p>

          {/* 좌측 상단 */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '120px' }}>
            <DatePicker
              label="좌측 상단"
              value={date1}
              onChange={(value) => setDate1(value as Date | null)}
              placeholder="좌측 상단"
            />
          </div>

          {/* 우측 상단 */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '120px' }}>
            <DatePicker
              label="우측 상단"
              value={date2}
              onChange={(value) => setDate2(value as Date | null)}
              placeholder="우측 상단"
            />
          </div>

          {/* 좌측 하단 */}
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '120px' }}>
            <DatePicker
              label="좌측 하단"
              value={date3}
              onChange={(value) => setDate3(value as Date | null)}
              placeholder="좌측 하단"
            />
          </div>

          {/* 우측 하단 */}
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '120px' }}>
            <DatePicker
              label="우측 하단"
              value={date4}
              onChange={(value) => setDate4(value as Date | null)}
              placeholder="우측 하단"
            />
          </div>

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#999' }}>
              네 모서리에 DatePicker가 배치되어 있습니다
            </p>
          </div>
        </div>
      );
    };

    return <PositionTestComponent />;
  },
};

/**
 * 세로 배치 테스트 (z-index 및 헤더 overlap 테스트)
 * DatePicker 2개를 세로로 배치했을 때 달력/아이콘이 헤더와 겹치는지 확인
 */
export const VerticalStackTest: Story = {
  render: () => {
    const VerticalStackTestComponent = () => {
      const [date1, setDate1] = useState<Date | null>(null);
      const [date2, setDate2] = useState<Date | null>(null);
      const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

      return (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>DatePicker 세로 배치 테스트</h3>
          <p style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#666' }}>
            💡 위쪽 DatePicker를 열었을 때 달력이 아래 DatePicker의 헤더/아이콘과 겹치지 않는지 확인하세요.
          </p>

          {/* 헤더 있는 영역 */}
          <div style={{ background: '#f8f9fa', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>📋 폼 헤더 영역</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
              이 헤더 위로 달력이 올라오는지 확인
            </p>
          </div>

          {/* DatePicker 세로 배치 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <DatePicker
              label="첫 번째 날짜"
              value={date1}
              onChange={(value) => setDate1(value as Date | null)}
              placeholder="첫 번째 날짜 선택"
              isClearable
            />

            <DatePicker
              label="두 번째 날짜"
              value={date2}
              onChange={(value) => setDate2(value as Date | null)}
              placeholder="두 번째 날짜 선택"
              isClearable
            />

            <DatePicker
              label="날짜 범위"
              isRange
              value={range}
              onChange={(value) => setRange(value as [Date | null, Date | null])}
              placeholder="시작일 ~ 종료일"
              isClearable
            />
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>테스트 항목:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
              <li>첫 번째 DatePicker를 열었을 때 달력이 두 번째 DatePicker 위에 표시되는가?</li>
              <li>달력이 헤더 영역 위에 표시되는가?</li>
              <li>달력 아이콘과 X 버튼이 다른 요소와 겹치지 않는가?</li>
              <li>z-index가 적절하게 설정되어 있는가?</li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
            <strong>⚠️ 확인 포인트:</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              커스텀 헤더의 배경이 투명하거나 z-index가 낮으면 아래 요소가 비칠 수 있습니다.
            </p>
          </div>
        </div>
      );
    };

    return <VerticalStackTestComponent />;
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
