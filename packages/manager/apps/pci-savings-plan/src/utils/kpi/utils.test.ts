import { describe, it, expect } from 'vitest';
import { getPercentValue } from '@/utils/kpi/utils';
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
