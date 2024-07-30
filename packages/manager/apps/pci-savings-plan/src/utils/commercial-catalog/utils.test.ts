import { describe, it, expect } from 'vitest';

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
    it.each([
      ['P1M', 1],
      ['P3M', 3],
      ['P6M', 6],
      ['P12M', 12],
      ['P1Y', 12],
      ['P2Y', 24],
    ])(
      'should convert ISO 8601 duration %s to %d months',
      (input, expected) => {
        expect(convertToDuration(input)).toBe(expected);
      },
    );
  });
});
