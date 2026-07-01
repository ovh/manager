import { describe, it, expect } from 'vitest';
import {
  fromISO8601,
  toISO8601,
  isValidISO8601,
  convertDuration,
} from './iso8601DurationHelper';

describe('iso8601DurationHelper', () => {
  describe('fromISO8601', () => {
    it('parses days', () => {
      expect(fromISO8601('P8D')).toEqual({ value: 8, unit: 'D' });
    });

    it('parses months', () => {
      expect(fromISO8601('P6M')).toEqual({ value: 6, unit: 'M' });
    });

    it('parses years', () => {
      expect(fromISO8601('P1Y')).toEqual({ value: 1, unit: 'Y' });
    });

    // Regression: a 7-day retention is serialized as the ISO 8601 week form
    // 'P1W' and previously fell back to the default '1 year' value.
    it('normalizes weeks to days', () => {
      expect(fromISO8601('P1W')).toEqual({ value: 7, unit: 'D' });
      expect(fromISO8601('P3W')).toEqual({ value: 21, unit: 'D' });
    });

    it('returns the default value when period is missing', () => {
      expect(fromISO8601()).toEqual({ value: 1, unit: 'Y' });
    });

    it('returns the default value when period is invalid', () => {
      expect(fromISO8601('invalid')).toEqual({ value: 1, unit: 'Y' });
    });

    it('honors a custom default value', () => {
      expect(fromISO8601(undefined, { value: 30, unit: 'D' })).toEqual({
        value: 30,
        unit: 'D',
      });
    });
  });

  describe('toISO8601', () => {
    it('serializes a duration', () => {
      expect(toISO8601(7, 'D')).toBe('P7D');
      expect(toISO8601(1, 'Y')).toBe('P1Y');
    });

    it('throws for non-positive or non-integer values', () => {
      expect(() => toISO8601(0, 'D')).toThrow();
      expect(() => toISO8601(-1, 'Y')).toThrow();
      expect(() => toISO8601(1.5, 'M')).toThrow();
    });
  });

  describe('isValidISO8601', () => {
    it('accepts days, weeks, months and years', () => {
      expect(isValidISO8601('P7D')).toBe(true);
      expect(isValidISO8601('P1W')).toBe(true);
      expect(isValidISO8601('P6M')).toBe(true);
      expect(isValidISO8601('P1Y')).toBe(true);
    });

    it('rejects invalid input', () => {
      expect(isValidISO8601('invalid')).toBe(false);
      expect(isValidISO8601('P1H')).toBe(false);
    });
  });

  describe('convertDuration', () => {
    it('converts years to days', () => {
      expect(convertDuration({ value: 1, unit: 'Y' }, 'D')).toEqual({
        value: 365,
        unit: 'D',
      });
    });

    it('converts days to months', () => {
      expect(convertDuration({ value: 30, unit: 'D' }, 'M')).toEqual({
        value: 1,
        unit: 'M',
      });
    });

    it('returns the same duration when units match', () => {
      expect(convertDuration({ value: 7, unit: 'D' }, 'D')).toEqual({
        value: 7,
        unit: 'D',
      });
    });
  });
});
