import { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { ModalTypes } from '@/context/modals/modals.context';
import { useSuggestionForUserProfile } from '@/hooks/suggestion/useSuggestion';
import * as useModalsModule from '@/context/modals';
import * as useTimeModule from '@/hooks/time/useTime';
import * as usePreferencesModule from '@/hooks/preferences/usePreferences';
import { SUGGESTION_MODAL_DISPLAY_PREFERENCE } from '@/hooks/suggestion/suggestion.constants';

const mocks = vi.hoisted(() => ({
  accountEditionLink: 'https://fake-account-edition-link.com',
  suggestion: [],
  user: {
    ovhSubsidiary: 'FR',
    legalform: 'corporation',
    companyNationalIdentificationNumber: null,
  },
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: () => ({
      getEnvironment: () => ({
        getUser: vi.fn(() => mocks.user)
      })
    }),
  }),
}));

const mockedUseModals = vi.spyOn(useModalsModule, 'useModals').mockReturnValue({
  current: ModalTypes.suggestion,
});

const mockedUsePreferences = vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({ data: 0 } as UseQueryResult<number>);

const mockedUseTime = vi.spyOn(useTimeModule, 'useTime').mockReturnValue({ data: 10 } as UseQueryResult<number>);

vi.mock('@/api/suggestion',  () => ({
  fetchCompanyNumbersSuggestions: vi.fn(() => mocks.suggestion)
}));

describe('useSuggestion', () => {
  it('should not request any API if the use does not match display criterion', async () => {
    mocks.user.legalform = 'individual';
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);

    renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
    });
    mocks.user.legalform = 'corporation';
  });

  it('should not request any API if the current modal is not the agreements one', async () => {
    mockedUseModals.mockReturnValueOnce({
      current: ModalTypes.kyc,
    });
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);

    renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
    });
  });

  it('should request preferences API if the current modal is the suggestion one', async () => {
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);

    renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
    });
  });

  it('should be ready but not to be displayed if the modal was displayed less than a day ago', async () => {
    const { result } = renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(false);
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
    });
  });

  it('should be ready but not to be displayed if there is no suggestion', async () => {
    mockedUseTime.mockReturnValueOnce({ data: 99999999 } as UseQueryResult<number>);

    const { result } = renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(false);
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
    });
  });

  it('should be ready and to be displayed if there is suggestion', async () => {
    mockedUseTime.mockReturnValueOnce({ data: 99999999 } as UseQueryResult<number>);
    mocks.suggestion = [{ id: 9999, type: 'SIRET' }];

    const { result } = renderHook(() => useSuggestionForUserProfile(mocks.accountEditionLink), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(true);
      expect(mockedUsePreferences).toHaveBeenCalledWith(SUGGESTION_MODAL_DISPLAY_PREFERENCE,{ enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
    });
  });
});
