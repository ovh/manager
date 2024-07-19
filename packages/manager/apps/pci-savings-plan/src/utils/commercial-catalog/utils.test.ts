import { vi, describe, it, expect } from 'vitest';

import {
  convertToPrice,
  convertHourlyPriceToMonthly,
  convertToDuration,
} from './utils';

describe('Utils', () => {
  describe('convertToPrice', () => {
    it('should convert price from cents to dollars', () => {
      expect(convertToPrice(100000000)).toBe(1);
      expect(convertToPrice(500000000)).toBe(5);
    });
  });

  describe('convertHourlyPriceToMonthly', () => {
    it('should convert hourly price to monthly price', () => {
      expect(convertHourlyPriceToMonthly(1)).toBe(720);
      expect(convertHourlyPriceToMonthly(0.5)).toBe(360);
    });
  });

  describe('convertToDuration', () => {
    it('should convert ISO 8601 duration to months', () => {
      expect(convertToDuration('P12M')).toBe('12');
      expect(convertToDuration('P6M')).toBe('6');
    });
  });
});
