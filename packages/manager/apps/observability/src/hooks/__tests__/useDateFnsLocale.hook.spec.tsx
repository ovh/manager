import { renderHook } from '@testing-library/react';
import { de, enGB, es, fr, frCA, it as itLocale, pl, pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn(),
    i18n: {
      language: 'en_GB',
    },
  })),
}));

const mockUseTranslation = vi.mocked(useTranslation);

describe('useDateFnsLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    { languageCode: 'fr_FR', expectedLocale: fr, localeName: 'French' },
    { languageCode: 'fr_CA', expectedLocale: frCA, localeName: 'French Canadian' },
    { languageCode: 'en_GB', expectedLocale: enGB, localeName: 'English GB' },
    { languageCode: 'de_DE', expectedLocale: de, localeName: 'German' },
    { languageCode: 'es_ES', expectedLocale: es, localeName: 'Spanish' },
    { languageCode: 'it_IT', expectedLocale: itLocale, localeName: 'Italian' },
    { languageCode: 'pl_PL', expectedLocale: pl, localeName: 'Polish' },
    { languageCode: 'pt_PT', expectedLocale: pt, localeName: 'Portuguese' },
  ])(
    'should return $localeName locale for $languageCode language',
    ({ languageCode, expectedLocale }) => {
      mockUseTranslation.mockReturnValue({
        t: vi.fn(),
        i18n: { language: languageCode },
        ready: true,
      } as unknown as ReturnType<typeof useTranslation>);

      const { result } = renderHook(() => useDateFnsLocale());

      expect(result.current).toBe(expectedLocale);
    },
  );

  it.each([
    { language: 'ja_JP', description: 'unsupported language' },
    { language: '', description: 'empty language' },
    { language: undefined, description: 'undefined language' },
    { language: 'fr_fr', description: 'lowercase language code' },
  ])('should return English GB locale as fallback for $description', ({ language }) => {
    mockUseTranslation.mockReturnValue({
      t: vi.fn(),
      i18n: { language },
      ready: true,
    } as unknown as ReturnType<typeof useTranslation>);

    const { result } = renderHook(() => useDateFnsLocale());

    expect(result.current).toBe(enGB);
  });

  it('should return a valid date-fns Locale object', () => {
    mockUseTranslation.mockReturnValue({
      t: vi.fn(),
      i18n: { language: 'fr_FR' },
      ready: true,
    } as unknown as ReturnType<typeof useTranslation>);

    const { result } = renderHook(() => useDateFnsLocale());

    // Verify it's a proper date-fns Locale object by checking required properties
    expect(result.current).toBeDefined();
    expect(result.current.code).toBeDefined();
    expect(typeof result.current.code).toBe('string');
  });
});
