import { describe, it, expect, vi } from 'vitest';
import { getPercentValue, isCurrentPeriod } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

const testCases: {
  description: string;
  consumption: SavingsPlanFlavorConsumption;
  key: 'utilization' | 'coverage';
  expected: string;
}[] = [
  {
    description: 'should return an empty string if periods array is empty',
    consumption: { periods: [] },
    key: 'utilization',
    expected: '',
  },
  {
    description:
      'should return an empty string if no valid numeric values are found',
    consumption: {
      periods: [
        { utilization: 'N/A', coverage: 'invalid%' },
        { utilization: 'undefined', coverage: 'NaN%' },
      ],
    },
    key: 'coverage',
    expected: '',
  },
  {
    description: 'should calculate the average correctly for key "utilization"',
    consumption: {
      periods: [
        { utilization: '40%', coverage: '50%' },
        { utilization: '60%', coverage: '70%' },
      ],
    },
    key: 'utilization',
    expected: '50%',
  },
  {
    description: 'should calculate the average correctly for key "coverage"',
    consumption: {
      periods: [
        { utilization: '30%', coverage: '20%' },
        { utilization: '70%', coverage: '80%' },
      ],
    },
    key: 'coverage',
    expected: '50%',
  },
  {
    description: 'should floor the average correctly',
    consumption: {
      periods: [
        { utilization: '75%', coverage: '75%' },
        { utilization: '76%', coverage: '76%' },
      ],
    },
    key: 'utilization',
    expected: '75%',
  },
];

describe('getPercentValue', () => {
  testCases.forEach(({ description, consumption, key, expected }) => {
    it(description, () => {
      const result = getPercentValue(consumption, key);
      expect(result).toBe(expected);
    });
  });
});
describe('isCurrentPeriod', () => {
  const fixedDate = new Date('2025-01-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true when the period matches the current period (case insensitive)', () => {
    const testPeriod = 'janvier 2025';
    expect(isCurrentPeriod(testPeriod)).toBe(true);

    const testPeriodUpper = 'JANVIER 2025';
    expect(isCurrentPeriod(testPeriodUpper)).toBe(true);
  });

  it('should return false when the period does not match the current period', () => {
    const testPeriod = 'février 2025';
    expect(isCurrentPeriod(testPeriod)).toBe(false);
  });
});
