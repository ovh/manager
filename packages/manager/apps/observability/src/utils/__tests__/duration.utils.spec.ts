import { enGB, es, fr } from 'date-fns/locale';
import { vi } from 'vitest';

import { formatDuration } from '@/utils/duration.utils';

describe('formatDuration', () => {
  it('should format P1M duration in English', () => {
    const result = formatDuration('P1M', enGB);
    expect(result).toBe('1 month');
  });

  it('should format P3M duration in English', () => {
    const result = formatDuration('P3M', enGB);
    expect(result).toBe('3 months');
  });

  it('should format P6M duration in English', () => {
    const result = formatDuration('P6M', enGB);
    expect(result).toBe('6 months');
  });

  it('should format P1M duration in French', () => {
    const result = formatDuration('P1M', fr);
    expect(result).toBe('1 mois');
  });

  it('should format P3M duration in French', () => {
    const result = formatDuration('P3M', fr);
    expect(result).toBe('3 mois');
  });

  it('should format P1M duration in Spanish', () => {
    const result = formatDuration('P1M', es);
    expect(result).toBe('1 mes');
  });

  it('should format P3M duration in Spanish', () => {
    const result = formatDuration('P3M', es);
    expect(result).toBe('3 meses');
  });

  it('should format P1Y duration in English', () => {
    const result = formatDuration('P1Y', enGB);
    expect(result).toBe('1 year');
  });

  it('should format P2Y duration in English', () => {
    const result = formatDuration('P2Y', enGB);
    expect(result).toBe('2 years');
  });

  it('should handle invalid duration strings gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatDuration('INVALID', enGB);
    expect(result).toBe('INVALID');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should format complex duration P1Y3M in English', () => {
    const result = formatDuration('P1Y3M', enGB);
    expect(result).toContain('year');
    expect(result).toContain('month');
  });
});
