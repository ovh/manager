import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getPercentValue, isCurrentPeriod } from './utils';

describe('getPercentValue', () => {
  const testCases = [
    {
      description: 'returns 0 for an empty array',
      input: [] as string[],
      expected: 0,
    },
    {
      description: 'returns 0 when no valid values are provided',
      input: ['abc', 'xyz'],
      expected: 0,
    },
    {
      description: 'calculates the average correctly for valid percentages',
      input: ['10%', '20%'],
      expected: 15,
    },
    {
      description: 'ignores invalid values and floors the average',
      input: ['12.5%', '7.8%', 'invalid'],
      expected: 10,
    },
    {
      description: 'works with values without the "%" symbol',
      input: ['50', '100'],
      expected: 75,
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(getPercentValue(input)).toBe(expected);
    });
  });
});

describe('isCurrentPeriod', () => {
  const fixedDate = new Date(2025, 1, 11, 12, 0, 0);

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const testCases = [
    {
      description: 'returns true for a date in the current month and year',
      date: new Date('2025-02-01T00:00:00Z'),
      expected: true,
    },
    {
      description: 'returns false for an invalid date',
      date: new Date('invalid date'),
      expected: false,
    },
  ];

  testCases.forEach(({ description, date, expected }) => {
    it(description, () => {
      expect(isCurrentPeriod(date)).toBe(expected);
    });
  });
});
