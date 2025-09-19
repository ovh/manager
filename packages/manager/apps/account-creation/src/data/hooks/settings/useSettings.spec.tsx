import { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as API from '@ovh-ux/manager-core-api';
import {
  useCountrySettings,
  useCurrencySettings,
  useLanguageSettings,
} from './useSettings';
import * as GetSettingsAPI from '@/data/api/settings';
import {
  MockedASSettings,
  MockedFRSettings,
  MockedGBSettings,
} from '@/data/mocks/settings.mock';

vi.mock('@ovh-ux/manager-core-api');
const getSettingsApiSpy = vi.spyOn(GetSettingsAPI, 'getSettings');

const mockedApiResult = [MockedGBSettings, MockedFRSettings, MockedASSettings];

const mockedGetSettingsApiResult = new Map([
  ['GB', MockedGBSettings.billingCountries],
  ['FR', MockedFRSettings.billingCountries],
]);

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useSettings', () => {
  describe('useCountrySettings', () => {
    it('should give a list of unique countries ordered by label', async () => {
      getSettingsApiSpy.mockImplementationOnce(() =>
        Promise.resolve(mockedGetSettingsApiResult),
      );
      const { result } = renderHook(() => useCountrySettings(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([
          { code: 'FR', label: 'country_FR' },
          { code: 'GB', label: 'country_GB' },
        ]);
      });
    });
    it('should give a list of unique countries containing billing information ordered by label', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useCountrySettings(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([
          { code: 'FR', label: 'country_FR' },
          { code: 'GB', label: 'country_GB' },
        ]);
      });
    });
  });

  describe('useCurrencySettings', () => {
    it('should give a list of unique currencies available for the given country', async () => {
      getSettingsApiSpy.mockImplementationOnce(() =>
        Promise.resolve(mockedGetSettingsApiResult),
      );
      const { result } = renderHook(() => useCurrencySettings('FR'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([
          {
            code: 'EUR',
            symbol: '€',
          },
        ]);
      });
    });
    it('should give an empty list of currencies if no country is given', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useCurrencySettings(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([]);
      });
    });
    it('should give an empty list of currencies without crashing if the requested country is not available', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useCurrencySettings('AS'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([]);
      });
    });
  });

  describe('useLanguageSettings', () => {
    it('should give a list of unique languages available for the given country', async () => {
      getSettingsApiSpy.mockImplementationOnce(() =>
        Promise.resolve(mockedGetSettingsApiResult),
      );
      const { result } = renderHook(() => useLanguageSettings('FR', 'EUR'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual(['fr-FR', 'en-IE']);
      });
    });
    it('should give an empty list of languages if no country is given', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useLanguageSettings(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([]);
      });
    });
    it('should give an empty list of languages if no currency is given', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useLanguageSettings('FR'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([]);
      });
    });
    it('should give an empty list of languages without crashing if the requested country is not available', async () => {
      vi.mocked(API.v2.get).mockImplementationOnce(() =>
        Promise.resolve({ data: mockedApiResult }),
      );
      const { result } = renderHook(() => useLanguageSettings('AS', 'EUR'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toStrictEqual([]);
      });
    });
  });
});
