import { enGB, es, fr } from 'date-fns/locale';
import { describe, expect, it, vi } from 'vitest';

import { formatDuration } from '@/utils/duration.utils';

describe('formatDuration', () => {
  it.each([
    { duration: 'P1M', locale: enGB, expected: '1 month', description: 'English' },
    { duration: 'P3M', locale: enGB, expected: '3 months', description: 'English' },
    { duration: 'P6M', locale: enGB, expected: '6 months', description: 'English' },
    { duration: 'P1Y', locale: enGB, expected: '1 year', description: 'English' },
    { duration: 'P2Y', locale: enGB, expected: '2 years', description: 'English' },
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

  it('should format complex duration P1Y3M in English', () => {
    const result = formatDuration('P1Y3M', enGB);
    expect(result).toBe('1 year 3 months');
  });
});
