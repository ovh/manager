import { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as MRC from '@ovh-ux/manager-react-components';
import { ApiError } from "@ovh-ux/manager-core-api";
import { ModalTypes } from '@/context/modals/modals.context';
import { useAgreementsUpdate } from '@/hooks/agreements/useAgreements';
import * as useModalsModule from '@/context/modals';
import * as useTimeModule from '@/hooks/time/useTime';
import * as usePreferencesModule from '@/hooks/preferences/usePreferences';
import * as useAccountUrnModule from '@/hooks/accountUrn/useAccountUrn';

const mocks = vi.hoisted(() => ({
  agreements: [],
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockedUseModals = vi.spyOn(useModalsModule, 'useModals').mockReturnValue({
  current: ModalTypes.agreements,
});

const mockedUseFeatureAvailability = vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
  data: {
    'billing:agreementsUpdateModal': true,
  }
} as UseQueryResult<Record<string, boolean>, ApiError>);

const mockedUsePreferences = vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({ data: 0 } as UseQueryResult<number>);

const mockedUseTime = vi.spyOn(useTimeModule, 'useTime').mockReturnValue({ data: 10 } as UseQueryResult<number>);

const mockedUseAccountUrn = vi.spyOn(useAccountUrnModule, 'useAccountUrn').mockReturnValue({
  data: 'fake-account-urn',
} as UseQueryResult<string>);

const mockedUseAuthorizationIam = vi.spyOn(MRC, 'useAuthorizationIam').mockReturnValue({ isAuthorized: true, data: [] } as (UseQueryResult<MRC.IamCheckResponse> & { isAuthorized: boolean | undefined }));

vi.mock('@/api/agreements',  () => ({
  default: vi.fn(() => mocks.agreements)
}));

describe('AgreementsUpdateModal', () => {
  it('should not request any API if the current modal is not the agreements one', async () => {
    mockedUseModals.mockReturnValueOnce({
      current: ModalTypes.kyc,
    });
    mockedUseFeatureAvailability.mockReturnValueOnce({ data: undefined } as UseQueryResult<Record<string, boolean>, ApiError>);
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseAccountUrn.mockReturnValueOnce({ data: undefined } as UseQueryResult<string>);

    renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: false });
      expect(mockedUsePreferences).toHaveBeenCalledWith('TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE',{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], undefined);
    });
  });

  it('should request feature availability API if the current modal is the agreements one', async () => {
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseAccountUrn.mockReturnValueOnce({ data: undefined } as UseQueryResult<string>);

    renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: true });
      expect(mockedUsePreferences).toHaveBeenCalledWith('TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE',{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], undefined);
    });
  });

  it('should be ready but not to be displayed if feature is not available', async () => {
    mockedUseFeatureAvailability.mockReturnValueOnce({
      data: {
        'billing:agreementsUpdateModal': false,
      }
    } as UseQueryResult<Record<string, boolean>, ApiError>);
    mockedUsePreferences.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseTime.mockReturnValueOnce({ data: undefined } as UseQueryResult<number>);
    mockedUseAccountUrn.mockReturnValueOnce({ data: undefined } as UseQueryResult<string>);

    const { result } = renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(false);
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: true });
      expect(mockedUsePreferences).toHaveBeenCalledWith('TIME_TO_DISPLAY_AGREEMENTS_MODAL_UPDATE',{ enabled: false });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], undefined);
    });
  });

  it('should be ready but not to be displayed if the modal was displayed less than a day ago', async () => {
    const { result } = renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(false);
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: false });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], undefined);
    });
  });

  it('should be ready but not to be displayed if there is no agreements to validate', async () => {
    mockedUseTime.mockReturnValueOnce({ data: 99999999 } as UseQueryResult<number>);

    const { result } = renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(false);
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: true });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], 'fake-account-urn');
    });
  });

  it('should be ready and to be displayed if there is agreements to validate', async () => {
    mockedUseTime.mockReturnValueOnce({ data: 99999999 } as UseQueryResult<number>);
    mocks.agreements = [{ agreed: false, id: 9999, contractId: 9999 }];

    const { result } = renderHook(() => useAgreementsUpdate('https://fake-contracts-link.com'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toEqual(true);
      expect(result.current.shouldBeDisplayed).toEqual(true);
      expect(mockedUseFeatureAvailability).toHaveBeenCalledWith(['billing:agreementsUpdateModal'], { enabled: true });
      expect(mockedUseTime).toHaveBeenCalledWith({ enabled: true });
      expect(mockedUseAccountUrn).toHaveBeenCalledWith({ enabled: true });
      expect(mockedUseAuthorizationIam).toHaveBeenCalledWith(['account:apiovh:me/agreements/accept'], 'fake-account-urn');
    });
  });
});
