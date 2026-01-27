import { de, enUS, fr } from 'date-fns/locale';
import { describe, expect, it } from 'vitest';

import { formatNumberWithLocale } from '@/utils/number.utils';

describe('formatNumberWithLocale', () => {
  // French locale uses narrow no-break space (\u202f) as thousands separator
  const NARROW_NBSP = '\u202f';

  it.each([
    {
      value: 1000000,
      locale: fr,
      expected: `1${NARROW_NBSP}000${NARROW_NBSP}000`,
      description: 'French (space separator)',
    },
    {
      value: 1000000,
      locale: enUS,
      expected: '1,000,000',
      description: 'US English (comma separator)',
    },
    { value: 1000000, locale: de, expected: '1.000.000', description: 'German (dot separator)' },
    {
      value: 1234567890,
      locale: fr,
      expected: `1${NARROW_NBSP}234${NARROW_NBSP}567${NARROW_NBSP}890`,
      description: 'large number in French',
    },
    {
      value: 1234567890,
      locale: enUS,
      expected: '1,234,567,890',
      description: 'large number in US English',
    },
    { value: 0, locale: fr, expected: '0', description: 'zero' },
    { value: 42, locale: fr, expected: '42', description: 'small number (no separator needed)' },
    {
      value: 999,
      locale: enUS,
      expected: '999',
      description: 'three digits (no separator needed)',
    },

    { value: 1000, locale: enUS, expected: '1,000', description: 'four digits' },
  ])('should format $description', ({ value, locale, expected }) => {
    const result = formatNumberWithLocale(value, locale);
    expect(result).toBe(expected);
  });

  it('should support decimal numbers', () => {
    const result = formatNumberWithLocale(1234.56, enUS);
    expect(result).toBe('1,234.56');
  });

  it('should support decimal numbers with French locale', () => {
    const result = formatNumberWithLocale(1234.56, fr);
    expect(result).toBe(`1${NARROW_NBSP}234,56`);
  });

  it('should support custom Intl.NumberFormatOptions', () => {
    const result = formatNumberWithLocale(1234.5, enUS, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result).toBe('1,234.50');
  });

  it('should support currency formatting', () => {
    const result = formatNumberWithLocale(1234.56, enUS, {
      style: 'currency',
      currency: 'USD',
    });
    expect(result).toBe('$1,234.56');
  });

  it('should support percent formatting', () => {
    const result = formatNumberWithLocale(0.1234, enUS, {
      style: 'percent',
      minimumFractionDigits: 1,
    });
    expect(result).toBe('12.3%');
  });

  it('should handle negative numbers', () => {
    const result = formatNumberWithLocale(-1000000, enUS);
    expect(result).toBe('-1,000,000');
  });

  it('should return undefined when value is undefined', () => {
    const result = formatNumberWithLocale(undefined, enUS);
    expect(result).toBeUndefined();
  });
});
