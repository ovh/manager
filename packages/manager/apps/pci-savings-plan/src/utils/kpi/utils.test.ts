import { describe, it, expect } from 'vitest';
import {
  calculateAverageUsage,
  getUsagePercent,
  formatUsagePercent,
} from './utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

const calculateAverageUsageTestCases: {
  description: string;
  input: SavingsPlanFlavorConsumption;
  expected: number | null;
}[] = [
  {
    description: 'should return null when periods array is empty',
    input: { periods: [] },
    expected: null,
  },
  {
    description:
      'should correctly calculate the average utilization across multiple periods',
    input: {
      periods: [
        { utilization: '40%' },
        { utilization: '60%' },
        { utilization: '80%' },
      ],
    },
    expected: 60,
  },
  {
    description: 'should handle a single period correctly',
    input: { periods: [{ utilization: '75%' }] },
    expected: 75,
  },
  {
    description: 'should ignore invalid values and calculate correctly',
    input: { periods: [{ utilization: '50%' }, { utilization: 'N/A' }] },
    expected: 50,
  },
  {
    description: 'should return null when all values are invalid',
    input: { periods: [{ utilization: 'N/A' }, { utilization: 'invalid' }] },
    expected: null,
  },
];

describe('calculateAverageUsage', () => {
  calculateAverageUsageTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = calculateAverageUsage(input);
      expect(result).toBe(expected);
    });
  });
});

const getUsagePercentTestCases: {
  description: string;
  input: SavingsPlanFlavorConsumption;
  expected: number | null;
}[] = [
  {
    description:
      'should return null when consumption has no periods (undefined)',
    input: { periods: undefined as any },
    expected: null,
  },
  {
    description:
      'should return null when consumption has an empty periods array',
    input: { periods: [] },
    expected: null,
  },
  {
    description:
      'should return the calculated average usage when periods exist',
    input: {
      periods: [
        { utilization: '40%' },
        { utilization: '60%' },
        { utilization: '80%' },
      ],
    },
    expected: 60,
  },
];

describe('getUsagePercent', () => {
  getUsagePercentTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = getUsagePercent(input);
      expect(result).toBe(expected);
    });
  });
});

const formatUsagePercentTestCases: {
  description: string;
  input: { usagePercent: number | null; message: string };
  expected: string;
}[] = [
  {
    description: 'should format a valid integer usage percent correctly',
    input: { usagePercent: 75, message: 'No data available' },
    expected: '75%',
  },
  {
    description: 'should floor a decimal usage percent correctly',
    input: { usagePercent: 75.9, message: 'No data available' },
    expected: '75%',
  },
  {
    description: 'should return the message when usagePercent is null',
    input: { usagePercent: null, message: 'No data available' },
    expected: 'No data available',
  },
  {
    description:
      'should return the message when usagePercent is 0 (falsy value)',
    input: { usagePercent: 0, message: 'No data available' },
    expected: 'No data available',
  },
];

describe('formatUsagePercent', () => {
  formatUsagePercentTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const result = formatUsagePercent(input.usagePercent, input.message);
      expect(result).toBe(expected);
    });
  });
});
