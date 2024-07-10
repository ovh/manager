import { describe, it, vi } from 'vitest';
import {
  fr,
  de,
  enGB,
  es,
  frCA,
  it as localeIt,
  pl,
  pt,
} from 'date-fns/locale';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale';
import { Locale } from '@/hooks/useLocale';

// Mock the API functions
vi.mock('@ovh-ux/manager-react-shell-client', () => {
  type CallbackType = (localePros: { locale: string }) => void;
  let localeChangeCallback: CallbackType | null = null;
  const onLocaleChange = (callback: CallbackType) => {
    localeChangeCallback = callback;
  };
  return {
    useShell: vi.fn(() => ({
      i18n: {
        getLocale: vi.fn(),
        onLocaleChange,
        setLocale: vi.fn((newLocale: string) => {
          if (localeChangeCallback) {
            localeChangeCallback({ locale: newLocale });
          }
        }),
      },
    })),
  };
});

describe('useDateFnsLocale', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should return dateFns fr locale when current locale is FR', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.en_GB);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.fr_FR);
    });
    await waitFor(() => {
      expect(result.current).toBe(fr);
    });
  });
  it('should return dateFns de locale when current locale is de_DE', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.de_DE);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.de_DE);
    });
    await waitFor(() => {
      expect(result.current).toBe(de);
    });
  });
  it('should return dateFns enGB locale when current locale is en_GB', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.en_GB);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.en_GB);
    });
    await waitFor(() => {
      expect(result.current).toBe(enGB);
    });
  });
  it('should return dateFns es locale when current locale is es_ES', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.es_ES);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.es_ES);
    });
    await waitFor(() => {
      expect(result.current).toBe(es);
    });
  });
  it('should return dateFns ca locale when current locale is fr_CA', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.fr_CA);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.fr_CA);
    });
    await waitFor(() => {
      expect(result.current).toBe(frCA);
    });
  });
  it('should return dateFns it locale when current locale is it_IT', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.it_IT);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.it_IT);
    });
    await waitFor(() => {
      expect(result.current).toBe(localeIt);
    });
  });
  it('should return dateFns pl locale when current locale is pl_PL', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.pl_PL);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.pl_PL);
    });
    await waitFor(() => {
      expect(result.current).toBe(pl);
    });
  });
  it('should return dateFns pt locale when current locale is pt_PT', async () => {
    const shell = useShell();
    vi.mocked(shell.i18n.getLocale).mockResolvedValue(Locale.pt_PT);
    const { result } = renderHook(() => useDateFnsLocale());
    act(() => {
      shell.i18n.setLocale(Locale.pt_PT);
    });
    await waitFor(() => {
      expect(result.current).toBe(pt);
    });
  });
});
