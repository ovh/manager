import { describe, it, expect } from 'vitest';
import {
  ValidityPeriodErrors,
  validateValidityDate,
} from './validateValidityDate';

describe('validateValidityDate', () => {
  it('should return undefined for a validity within the valid range', () => {
    const validValidity = 30;
    expect(validateValidityDate(validValidity)).toBeUndefined();
  });

  it('should return minPeriod error if validity is less than 1', () => {
    const invalidValidityLow = 0;
    expect(validateValidityDate(invalidValidityLow)).toBe(
      ValidityPeriodErrors.minPeriod,
    );
  });

  it('should return maxPeriod error if validity exceeds 365', () => {
    const invalidValidityHigh = 366;
    expect(validateValidityDate(invalidValidityHigh)).toBe(
      ValidityPeriodErrors.maxPeriod,
    );
  });

  it('should return undefined for a validity of exactly 1 day', () => {
    const minValidity = 1;
    expect(validateValidityDate(minValidity)).toBeUndefined();
  });

  it('should return undefined for a validity of exactly 365 days', () => {
    const maxValidity = 365;
    expect(validateValidityDate(maxValidity)).toBeUndefined();
  });

  it('should return minPeriod error for a negative validity', () => {
    const negativeValidity = -10;
    expect(validateValidityDate(negativeValidity)).toBe(
      ValidityPeriodErrors.minPeriod,
    );
  });

  it('should return maxPeriod error for a very large validity number', () => {
    const largeValidity = 1000;
    expect(validateValidityDate(largeValidity)).toBe(
      ValidityPeriodErrors.maxPeriod,
    );
  });
});
