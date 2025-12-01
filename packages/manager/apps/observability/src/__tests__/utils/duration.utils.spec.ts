import { enGB, es, fr } from 'date-fns/locale';
import { describe, expect, it, vi } from 'vitest';

import {
  formatDuration,
  formatObservabilityDuration,
  parseObservabilityDuration,
  parseObservabilityDurationValue,
} from '@/utils/duration.utils';

const zeroDuration = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
  microseconds: 0,
  nanoseconds: 0,
};

describe('formatDuration', () => {
  it.each([
    { duration: 'P1M', locale: enGB, expected: '1 month', description: 'English' },
    { duration: 'P3M', locale: enGB, expected: '3 months', description: 'English' },
    { duration: 'P6M', locale: enGB, expected: '6 months', description: 'English' },
    { duration: 'P1Y', locale: enGB, expected: '1 year', description: 'English' },
    { duration: 'P2Y', locale: enGB, expected: '2 years', description: 'English' },
    { duration: 'P1Y3M', locale: enGB, expected: '1 year 3 months', description: 'English' },
    { duration: 'P1M', locale: fr, expected: '1 mois', description: 'French' },
    { duration: 'P3M', locale: fr, expected: '3 mois', description: 'French' },
    { duration: 'P1M', locale: es, expected: '1 mes', description: 'Spanish' },
    { duration: 'P3M', locale: es, expected: '3 meses', description: 'Spanish' },
  ])(
    'should format $duration duration in $description as "$expected"',
    ({ duration, locale, expected }) => {
      const result = formatDuration(duration, locale);
      expect(result).toBe(expected);
    },
  );

  it('should handle invalid duration strings gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatDuration('INVALID', enGB);
    expect(result).toBe('INVALID');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('parseObservabilityDuration', () => {
  it.each([
    { input: '7d', expected: { ...zeroDuration, days: 7 }, description: 'days' },
    { input: '24h', expected: { ...zeroDuration, hours: 24 }, description: 'hours' },
    { input: '168h', expected: { ...zeroDuration, hours: 168 }, description: '168 hours' },
    { input: '30m', expected: { ...zeroDuration, minutes: 30 }, description: 'minutes' },
    { input: '45s', expected: { ...zeroDuration, seconds: 45 }, description: 'seconds' },
    {
      input: '500ms',
      expected: { ...zeroDuration, milliseconds: 500 },
      description: 'milliseconds',
    },
    {
      input: '100us',
      expected: { ...zeroDuration, microseconds: 100 },
      description: 'microseconds (us)',
    },
    {
      input: '100µs',
      expected: { ...zeroDuration, microseconds: 100 },
      description: 'microseconds (µs)',
    },
    { input: '50ns', expected: { ...zeroDuration, nanoseconds: 50 }, description: 'nanoseconds' },
    {
      input: '1h30m',
      expected: { ...zeroDuration, hours: 1, minutes: 30 },
      description: 'hours and minutes',
    },
    {
      input: '2h45m30s',
      expected: { ...zeroDuration, hours: 2, minutes: 45, seconds: 30 },
      description: 'hours, minutes and seconds',
    },
  ])('should parse $description correctly from "$input"', ({ input, expected }) => {
    const result = parseObservabilityDuration(input);
    expect(result).toEqual(expected);
  });

  it.each([
    { input: '0', description: 'zero' },
    { input: '0s', description: '0s' },
    { input: '', description: 'empty string' },
  ])('should return zero duration for $description', ({ input }) => {
    const result = parseObservabilityDuration(input);
    expect(result).toEqual(zeroDuration);
  });
});

describe('parseObservabilityDurationValue', () => {
  it.each([
    { input: '7d', expected: { value: 7, unit: 'd' }, description: 'days' },
    { input: '168h', expected: { value: 7, unit: 'd' }, description: '168h converts to 7 days' },
    { input: '24h', expected: { value: 1, unit: 'd' }, description: '24h converts to 1 day' },
    {
      input: '12h',
      expected: { value: 12, unit: 'h' },
      description: 'hours (not divisible by 24)',
    },
    { input: '30m', expected: { value: 30, unit: 'm' }, description: 'minutes' },
    { input: '45s', expected: { value: 45, unit: 's' }, description: 'seconds' },
    { input: '500ms', expected: { value: 500, unit: 'ms' }, description: 'milliseconds' },
    { input: '100us', expected: { value: 100, unit: 'us' }, description: 'microseconds' },
    { input: '50ns', expected: { value: 50, unit: 'ns' }, description: 'nanoseconds' },
    { input: '0', expected: { value: 0, unit: 's' }, description: 'zero duration' },
    { input: '1d12h', expected: { value: 1, unit: 'd' }, description: 'mixed (days prioritized)' },
    {
      input: '24h30m',
      expected: { value: 24, unit: 'h' },
      description: 'hours with minutes (no conversion)',
    },
  ])('should parse $description from "$input"', ({ input, expected }) => {
    const result = parseObservabilityDurationValue(input);
    expect(result).toEqual(expected);
  });
});

describe('formatObservabilityDuration', () => {
  it.each([
    { input: '7d', locale: enGB, expected: '7 days', description: 'days in English' },
    { input: '1d', locale: enGB, expected: '1 day', description: '1 day in English' },
    { input: '400d', locale: enGB, expected: '400 days', description: '400 days in English' },
    { input: '7d', locale: fr, expected: '7 jours', description: 'days in French' },
    { input: '7d', locale: es, expected: '7 días', description: 'days in Spanish' },
    { input: '12h', locale: enGB, expected: '12 hours', description: 'hours in English' },
    {
      input: '1h30m',
      locale: enGB,
      expected: '1 hour 30 minutes',
      description: 'hours and minutes',
    },
    { input: '168h', locale: enGB, expected: '7 days', description: '168h converts to 7 days' },
    { input: '24h', locale: enGB, expected: '1 day', description: '24h converts to 1 day' },
    { input: '25h', locale: enGB, expected: '1 day 1 hour', description: '25h as 1 day 1 hour' },
    {
      input: '2h45m30s',
      locale: enGB,
      expected: '2 hours 45 minutes 30 seconds',
      description: 'complex duration',
    },
  ])('should format $description', ({ input, locale, expected }) => {
    const result = formatObservabilityDuration(input, locale);
    expect(result).toBe(expected);
  });

  it('should handle empty string gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatObservabilityDuration('', enGB);
    expect(result).toBe('');
    consoleSpy.mockRestore();
  });
});
