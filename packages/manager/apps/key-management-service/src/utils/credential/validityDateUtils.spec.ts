import { describe, it, expect } from 'vitest';
import {
  getDaysFromDate,
  addDaysToDate,
  getDateFromDays,
} from './validityDateUtils';

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
    const referenceDate = new Date(2024, 1, 28);
    const leapDay = new Date(2024, 1, 29);

    const diffInDays = Math.floor(
      (leapDay.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    expect(diffInDays).toBe(1);
  });
});

describe('addDaysToDate', () => {
  it('should return the correct date when adding days', () => {
    const today = new Date();
    const result = addDaysToDate(5);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + 5);

    expect(result.getUTCDate()).toBe(expectedDate.getUTCDate());
    expect(result.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(result.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
  });

  it('should handle leap years correctly', () => {
    const result = addDaysToDate(365);
    const expectedDate = new Date();
    expectedDate.setFullYear(expectedDate.getFullYear() + 1);
    expect(result.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
  });
});

describe('getDateFromDays', () => {
  it('should return the correct date when adding positive days', () => {
    const today = new Date();
    const daysToAdd = 10;
    const futureDate = getDateFromDays(daysToAdd);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + daysToAdd);

    expect(futureDate.getUTCDate()).toBe(expectedDate.getUTCDate());
    expect(futureDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(futureDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
  });

  it('should return the correct date when adding negative days', () => {
    const today = new Date();
    const daysToSubtract = -10;
    const pastDate = getDateFromDays(daysToSubtract);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + daysToSubtract);

    expect(pastDate.getUTCDate()).toBe(expectedDate.getUTCDate());
    expect(pastDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(pastDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
  });

  it("should return today's date when adding 0 days", () => {
    const today = new Date();
    const result = getDateFromDays(0);

    expect(result.getUTCDate()).toBe(today.getUTCDate());
    expect(result.getUTCMonth()).toBe(today.getUTCMonth());
    expect(result.getUTCFullYear()).toBe(today.getUTCFullYear());
  });

  it('should correctly handle large numbers of days', () => {
    const today = new Date();
    const daysToAdd = 3650; // 10 years
    const futureDate = getDateFromDays(daysToAdd);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + daysToAdd);

    expect(futureDate.getUTCDate()).toBe(expectedDate.getUTCDate());
    expect(futureDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(futureDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
  });
});
