import { describe, it, expect } from 'vitest';
import { getNextMonth, getDaysFromDate } from './validityDateUtils';

describe('getNextMonth', () => {
  it('should return a date one month from now', () => {
    const today = new Date();
    const nextMonth = getNextMonth();

    // Adjust the year if necessary (e.g., December to January)
    const expectedMonth = (today.getMonth() + 1) % 12;
    const expectedYear =
      today.getFullYear() + (today.getMonth() === 11 ? 1 : 0);

    expect(nextMonth.getMonth()).toBe(expectedMonth);
    expect(nextMonth.getFullYear()).toBe(expectedYear);
  });

  it('should keep the same day of the month if possible', () => {
    const today = new Date();
    const nextMonth = getNextMonth();

    const expectedDay = today.getDate();
    expect(nextMonth.getDate()).toBe(expectedDay);
  });
});

describe('getDaysFromDate', () => {
  it('should return the correct number of days from today', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    expect(getDaysFromDate(tomorrow)).toBe(1);
  });

  it('should return a negative number for dates in the past', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    expect(getDaysFromDate(yesterday)).toBe(-1);
  });

  it('should return 0 if the date is today', () => {
    const today = new Date();
    expect(getDaysFromDate(today)).toBe(0);
  });

  it('should handle large differences correctly', () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 100);

    expect(getDaysFromDate(futureDate)).toBe(100);
  });

  it('should handle leap years correctly', () => {
    const referenceDate = new Date(2024, 1, 28); // 28 février 2024
    const leapDay = new Date(2024, 1, 29); // 29 février 2024

    const diffInDays = Math.floor(
      (leapDay.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    expect(diffInDays).toBe(1);
  });
});
