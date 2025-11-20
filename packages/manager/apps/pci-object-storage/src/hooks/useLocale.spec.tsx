import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLocale, Locale } from './useLocale';

// Mock shell and i18n
const getLocaleMock = vi.fn().mockResolvedValue(Locale.de_DE);
const onLocaleChangeMock = vi.fn();
const shellMock = {
  i18n: {
    getLocale: getLocaleMock,
    onLocaleChange: onLocaleChangeMock,
  },
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useShell: () => shellMock,
}));

describe('useLocale', () => {
  it('should fetch and set initial locale', async () => {
    const { result } = renderHook(() => useLocale());
    expect(getLocaleMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current).toBe(Locale.de_DE);
    });
  });

  it('should update locale on locale change event', async () => {
    let localeChangeHandler:
      | ((payload: { locale: string }) => void)
      | undefined;
    onLocaleChangeMock.mockImplementation((handler) => {
      localeChangeHandler = handler;
    });

    const { result } = renderHook(() => useLocale());

    act(() => {
      localeChangeHandler?.({ locale: Locale.it_IT });
    });

    expect(result.current).toBe(Locale.it_IT);
  });
});
