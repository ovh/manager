import { describe, it, expect } from 'vitest';
import {
  fromISO8601,
  isValidISO8601,
  toISO8601,
} from './iso8601DurationHelper';

describe('iso8601DurationHelper', () => {
  describe('fromISO8601', () => {
    it.each([
      ['P1Y', { value: 1, unit: 'Y' }],
      ['P10Y', { value: 10, unit: 'Y' }],
      ['P30D', { value: 30, unit: 'D' }],
      ['P2W', { value: 14, unit: 'D' }],
      ['P6M', { value: 180, unit: 'D' }],
      ['P1Y2D', { value: 367, unit: 'D' }],
      ['P1W3D', { value: 10, unit: 'D' }],
    ])('parses %s', (period, expected) => {
      expect(fromISO8601(period)).toEqual(expected);
    });

    it.each([undefined, '', 'P', 'P0D', 'PT1H', '2W', 'invalid'])(
      'returns the default value for %s',
      (period) => {
        expect(fromISO8601(period)).toEqual({ value: 1, unit: 'Y' });
        expect(fromISO8601(period, { value: 7, unit: 'D' })).toEqual({
          value: 7,
          unit: 'D',
        });
      },
    );
  });

  describe('toISO8601', () => {
    it('formats a duration', () => {
      expect(toISO8601(1, 'Y')).toBe('P1Y');
      expect(toISO8601(30, 'D')).toBe('P30D');
    });

    it('throws for a non positive integer', () => {
      expect(() => toISO8601(0, 'D')).toThrow();
      expect(() => toISO8601(1.5, 'D')).toThrow();
    });
  });

  describe('isValidISO8601', () => {
    it.each(['P1Y', 'P30D', 'P2W', 'P1Y6M'])('accepts %s', (period) => {
      expect(isValidISO8601(period)).toBe(true);
    });

    it.each(['P', 'PT1H', '2W', 'invalid'])('rejects %s', (period) => {
      expect(isValidISO8601(period)).toBe(false);
    });
  });
});
