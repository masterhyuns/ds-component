/**
 * CustomCalendarHeader 컴포넌트
 * react-datepicker의 커스텀 캘린더 헤더
 * < 월 Select, 년 Select >
 */

import React from 'react';
import { CustomHeaderProps } from './types';
import styles from './DatePicker.module.scss';

/**
 * react-datepicker를 위한 커스텀 헤더 컴포넌트
 * - 년도/월 선택 드롭다운
 * - 이전/다음 달 네비게이션 버튼
 */
export const CustomCalendarHeader: React.FC<CustomHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  // 년도 범위: 현재 년도 기준 -100년 ~ +10년
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  return (
    <div className={styles.customHeader}>
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={styles.navButton}
        aria-label="이전 달"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 10L2 6L6 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.selectWrapper}>
        <select
          value={date.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          className={styles.yearSelect}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <select
          value={date.getMonth()}
          onChange={(e) => changeMonth(Number(e.target.value))}
          className={styles.monthSelect}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={styles.navButton}
        aria-label="다음 달"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 2L6 6L2 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
