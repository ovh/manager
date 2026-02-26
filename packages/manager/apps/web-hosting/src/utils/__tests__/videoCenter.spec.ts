import { describe, expect, it } from 'vitest';

import { computeThresholdsFromMax } from '../videoCenter';

describe('computeThresholdsFromMax', () => {
  it('should return correct thresholds for positive values', () => {
    const result = computeThresholdsFromMax(100);
    expect(result).toEqual({
      optimum: 70,
      low: 71,
      high: 90,
    });
  });

  it('should return null for zero', () => {
    const result = computeThresholdsFromMax(0);
    expect(result).toBeNull();
  });

  it('should return null for negative values', () => {
    const result = computeThresholdsFromMax(-10);
    expect(result).toBeNull();
  });

  it('should round threshold values correctly', () => {
    const result = computeThresholdsFromMax(33);
    // 33 * 0.7 = 23.1 -> 23
    // 33 * 0.71 = 23.43 -> 23
    // 33 * 0.9 = 29.7 -> 30
    expect(result).toEqual({
      optimum: 23.099999999999998,
      low: 23.43,
      high: 29.7,
    });
  });

  it('should handle very small numbers', () => {
    const result = computeThresholdsFromMax(1);
    expect(result).toEqual({
      optimum: 0.7,
      low: 0.71,
      high: 0.9,
    });
  });

  it('should handle very large numbers', () => {
    const result = computeThresholdsFromMax(1000000);
    expect(result).toEqual({
      optimum: 700000,
      low: 710000,
      high: 900000,
    });
  });

  it('should handle decimal results correctly', () => {
    const result = computeThresholdsFromMax(143);
    // 143 * 0.7 = 100.1 -> 100
    // 143 * 0.71 = 101.53 -> 102
    // 143 * 0.9 = 128.7 -> 129
    expect(result).toEqual({
      optimum: 100.1,
      low: 101.53,
      high: 128.70000000000002,
    });
  });
});
