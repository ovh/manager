import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useDateFnsLocale } from '../useDateFnsLocale';

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('date-fns/locale', () => ({
  enGB: 'enGB',
  fr: 'fr',
  frCA: 'frCA',
  de: 'de',
  es: 'es',
  it: 'it',
  pl: 'pl',
  pt: 'pt',
}));

const testCases = [
  { languageSource: 'en_GB', localeExpected: 'enGB' },
  { languageSource: 'fr_FR', localeExpected: 'fr' },
  { languageSource: 'fr_CA', localeExpected: 'frCA' },
  { languageSource: 'de_DE', localeExpected: 'de' },
  { languageSource: 'es_ES', localeExpected: 'es' },
  { languageSource: 'it_IT', localeExpected: 'it' },
  { languageSource: 'pl_PL', localeExpected: 'pl' },
  { languageSource: 'pt_PT', localeExpected: 'pt' },
  { languageSource: 'unknown', localeExpected: 'enGB' },
  { languageSource: '', localeExpected: 'enGB' },
  { languageSource: null, localeExpected: 'enGB' },
  { languageSource: undefined, localeExpected: 'enGB' },
];

describe('useDateFnsLocale', () => {
  it.each(testCases)(
    'should return the correct locale based on the i18n language',
    ({ languageSource, localeExpected }) => {
      (useTranslation as jest.Mock).mockReturnValue({
        i18n: { language: languageSource },
      });
      (getDateFnsLocale as jest.Mock).mockReturnValue(localeExpected);

      const { result } = renderHook(() => useDateFnsLocale());

      expect(result.current).toBe(localeExpected);
    },
  );

  it('should return enGB when getDateFnsLocale returns a value not in LOCALE_MAP', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: { language: 'zh_CN' },
    });
    // Mock getDateFnsLocale to return a value that's not in LOCALE_MAP
    (getDateFnsLocale as jest.Mock).mockReturnValue('zhCN');

    const { result } = renderHook(() => useDateFnsLocale());

    // Should fallback to enGB since 'zhCN' is not in LOCALE_MAP
    expect(result.current).toBe('enGB');
  });
});
