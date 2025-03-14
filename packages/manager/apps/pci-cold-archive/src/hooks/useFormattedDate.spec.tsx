import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormattedDate } from './useFormattedDate'; // adjust the import path if needed

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: vi.fn(),
}));

describe('useFormattedDate', () => {
  const mockUseTranslation = useTranslation as jest.Mock;
  const mockGetDateFnsLocale = getDateFnsLocale as jest.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(mockUseTranslation).mockReturnValue({
      i18n: { language: 'en' },
    });

    mockGetDateFnsLocale.mockImplementation((language) => language);
  });

  it('should return an empty string when date is null', () => {
    const { result } = renderHook(() => useFormattedDate(null));
    expect(result.current).toBe('');
  });

  it('should format the date using the default format and user locale', () => {
    const testDate = '2023-01-15T12:30:45';
    vi.mocked(mockUseTranslation).mockReturnValue({
      i18n: { language: 'en' },
    });
    vi.mocked(mockGetDateFnsLocale).mockReturnValue('enUS');

    const expected = 'Jan 15, 2023, 12:30:45 PM';

    const { result } = renderHook(() => useFormattedDate(testDate));

    expect(result.current).toBe(expected);
    expect(mockGetDateFnsLocale).toHaveBeenCalledWith('en');
  });

  it('should use French locale when user locale is not available', () => {
    const testDate = '2023-01-15T12:30:45';
    vi.mocked(mockUseTranslation).mockReturnValue({
      i18n: { language: 'invalid-locale' },
    });
    vi.mocked(mockGetDateFnsLocale).mockReturnValue('invalid-locale');

    const expected = '15 janv. 2023, 12:30:45';

    const { result } = renderHook(() => useFormattedDate(testDate));
    expect(result.current).toBe(expected);
  });

  it('should use custom format string when provided', () => {
    const testDate = '2023-01-15T12:30:45';
    const customFormat = 'yyyy-MM-dd';
    vi.mocked(mockUseTranslation).mockReturnValue({
      i18n: { language: 'en' },
    });
    vi.mocked(mockGetDateFnsLocale).mockReturnValue('enUS');

    const expected = '2023-01-15';

    const { result } = renderHook(() =>
      useFormattedDate(testDate, customFormat),
    );

    expect(result.current).toBe(expected);
  });
});
