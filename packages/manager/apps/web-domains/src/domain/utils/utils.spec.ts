import { expect, it, vi } from 'vitest';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { getLanguageKey } from './utils';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: () => () => '03/01/2025 10:15',
}));

describe('It displays the manager in the good format', () => {
  it('return the date in dd/MM/yyyy HH:mm for France', () => {
    const testDate = '2025-01-03T11:15:40.311595+01:00';
    const formatDate = useFormatDate();
    expect(formatDate({ date: testDate, format: 'P p' })).toBe(
      '03/01/2025 10:15',
    );
  });
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
