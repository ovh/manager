import { expect, it } from 'vitest';
import {
  formatDatagridDate,
  removeQuotes,
  getLanguageKey,
} from '@/utils/utils';

describe('It displays the manager in the good format', () => {
  it('return the date in dd/MM/yyyy HH:mm for France', () => {
    const testDate = '2025-01-03T11:15:40.311595+01:00';
    expect(formatDatagridDate(testDate, 'fr_FR')).toBe('03/01/2025 10:15');
  });
});

test('remove string if the text contain " at the start and at the end', () => {
  expect(removeQuotes('"test"')).toBe('test');
});

describe('getLanguageKey', () => {
  it('should return a known language code in uppercase', () => {
    expect(getLanguageKey('fr')).toBe('FR');
    expect(getLanguageKey('en')).toBe('EN');
  });

  it('should handle dash and underscore variants correctly', () => {
    expect(getLanguageKey('fr-FR')).toBe('FR');
    expect(getLanguageKey('en_GB')).toBe('EN');
  });

  it('should return DEFAULT for unsupported languages', () => {
    expect(getLanguageKey('jp')).toBe('DEFAULT');
    expect(getLanguageKey('ru-RU')).toBe('DEFAULT');
  });

  it('should be case-insensitive', () => {
    expect(getLanguageKey('Fr')).toBe('FR');
    expect(getLanguageKey('eN_gB')).toBe('EN');
  });

  it('should return DEFAULT for empty or invalid input', () => {
    expect(getLanguageKey('')).toBe('DEFAULT');
    expect(getLanguageKey('123')).toBe('DEFAULT');
    expect(getLanguageKey('---')).toBe('DEFAULT');
  });
});
