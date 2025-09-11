import { vi } from 'vitest';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider, useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '@ovh-ux/manager-config';
import * as MRC from '@ovh-ux/manager-react-components';
import * as Context from '@/context';
import * as useAccountUrnModule from '@/hooks/accountUrn/useAccountUrn';
import * as usePreferencesModule from '@/hooks/preferences/usePreferences';
import * as useTimeModule from '@/hooks/time/useTime';
import { useCheckModalDisplay, useCheckModalDisplaySynchronous } from './useModal';
import { ApplicationContextType } from '@/context/application.context';
import { Shell } from '@ovh-ux/shell';
import { renderHook } from '@testing-library/react';

vi.spyOn(Context, 'useApplication').mockReturnValue({
  shell: {
    getPlugin: (_: string) => ({
      getEnvironment: () => ({
        getUser: vi.fn(() => ({ kycValidated: false })),
      }),
    }),
  } as Partial<Shell>,
} as ApplicationContextType);

const useFeatureAvailabilitySpy = vi.spyOn(MRC, 'useFeatureAvailability');
const useAccountUrnSpy = vi.spyOn(useAccountUrnModule, 'useAccountUrn');
const useAuthorizationIamSpy = vi.spyOn(MRC, 'useAuthorizationIam');
const usePreferencesSpy = vi.spyOn(usePreferencesModule, 'usePreferences');
const useTimeSpy = vi.spyOn(useTimeModule, 'useTime');

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useModal', () => {
  describe('useCheckModalDisplaySynchronous', () => {
    it('should return true if no check were passed', () => {
      expect(useCheckModalDisplaySynchronous()).toEqual(true);
    });

    it('should return false if user check is not validated', () => {
      expect(useCheckModalDisplaySynchronous((user: User) => user.kycValidated)).toEqual(false);
    });

    it('should return false if excluded urls check is not validated', () => {
      const excludedUrl = 'https://fake-manager.com/manager/billing/#/autorenew/agreements';
      Object.defineProperty(window, 'location', {
        value: {
          href: excludedUrl,
        },
        writable: true,
      });
      expect(useCheckModalDisplaySynchronous(
        undefined,
        [excludedUrl],
      )).toEqual(false);
    });

    it('should return false if included urls check is not validated', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://fake-manager.com/manager/billing/#/autorenew/agreements',
        },
        writable: true,
      });
      expect(useCheckModalDisplaySynchronous(
        undefined,
        undefined,
        ['https://fake-manager.com/manager/account/#/useraccount/info'],
      )).toEqual(false);
    });

    it('should return true if all check are validated', () => {
      const excludedUrls = ['https://fake-manager.com/manager/billing/#/autorenew/agreements'];
      const includedUrl = 'https://fake-manager.com/manager/account/#/useraccount/info';
      Object.defineProperty(window, 'location', {
        value: {
          href: includedUrl,
        },
        writable: true,
      });
      ;
      expect(useCheckModalDisplaySynchronous(
        (user: User) => !user.kycValidated,
        excludedUrls,
        [includedUrl],
      )).toEqual(true);
    });

    it('should skip following tests if any previous fails', () => {
      const excludedUrls = ['https://fake-manager.com/manager/billing/#/autorenew/agreements'];
      const includedUrls = ['https://fake-manager.com/manager/account/#/useraccount/info'];
      const excludedUrlsCheckSpy = vi.spyOn(excludedUrls, 'indexOf');
      const includedUrlsCheckSpy = vi.spyOn(includedUrls, 'indexOf');
      useCheckModalDisplaySynchronous(
        (user: User) => user.kycValidated,
        excludedUrls,
        includedUrls,
      );
      expect(excludedUrlsCheckSpy).not.toHaveBeenCalled();
      expect(includedUrlsCheckSpy).not.toHaveBeenCalled();
    });
  });

  describe('useCheckModalDisplay', () => {
    beforeEach(() => {
      useFeatureAvailabilitySpy.mockClear();
      useFeatureAvailabilitySpy.mockReturnValue({
        isLoading: true,
      } as MRC.UseFeatureAvailabilityResult<{ feature: boolean }>);
      useAccountUrnSpy.mockClear();
      useAccountUrnSpy.mockReturnValue({
        isLoading: true,
      } as UseQueryResult<string>);
      useAuthorizationIamSpy.mockClear();
      useAuthorizationIamSpy.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
      } as UseQueryResult<MRC.IamCheckResponse> & { isAuthorized: boolean });
      usePreferencesSpy.mockClear();
      usePreferencesSpy.mockReturnValue({
        isLoading: true,
      } as UseQueryResult<number>);
      useTimeSpy.mockClear();
      useTimeSpy.mockReturnValue({
        isLoading: true,
      } as UseQueryResult<number>);
    });

    it('should return true without making any check if there are none passed', () => {
      const { result } = renderHook(
        () => useCheckModalDisplay(),
        {
          wrapper,
        },
      );
      expect(result.current).toEqual(true);
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith([], {
        enabled: false,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        [],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        undefined,
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
    });

    it('should not make any asynchronous check if any synchronous check failed', () => {
      const queryFn = vi.fn();
      renderHook(
        () => useCheckModalDisplay(
          (enabled: boolean) => useQuery({
            queryKey: ['query-key'],
            queryFn,
            enabled,
          }),
          undefined,
          ['feature'],
          'PREFERENCE_KEY',
          500000,
          (user: User) => user.kycValidated,
          undefined,
          undefined,
          ['iam-action'],
        ),
        {
          wrapper,
        },
      );
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith(['feature'], {
        enabled: false,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'PREFERENCE_KEY',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
    });

    it('should make asynchronous checks in sequence', () => {
      const queryExecutor = vi.fn((enabled: boolean) => 
        enabled
          ? { data: [], isFetched: true } as UseQueryResult
          : { data: undefined, isFetched: false } as UseQueryResult
      );
      const iamActions = ['iam-action'];
      const preferenceKey = 'PREFERENCE_KEY';
      const intervalInSeconds = 500000;
      const { result, rerender } = renderHook(
        () => useCheckModalDisplay(
          queryExecutor,
          undefined,
          ['feature'],
          preferenceKey,
          intervalInSeconds,
          undefined,
          undefined,
          undefined,
          iamActions,
        ),
        {
          wrapper,
        },
      );

      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith(['feature'], {
        enabled: true,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        iamActions,
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        preferenceKey,
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current).toBe(undefined);

      useFeatureAvailabilitySpy.mockReturnValue({
        data: { feature: true },
        isFetched: true,
      } as MRC.UseFeatureAvailabilityResult<{ feature: boolean }>);
  
      rerender();

      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        iamActions,
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        preferenceKey,
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current).toBe(undefined);
  
      useAccountUrnSpy.mockReturnValue({
        data: 'fake-urn',
      } as UseQueryResult<string>);
  
      rerender();

      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        iamActions,
        'fake-urn',
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        preferenceKey,
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current).toBe(undefined);
  
      useAuthorizationIamSpy.mockReturnValue({
        isAuthorized: true,
        isFetched: true,
      } as UseQueryResult<MRC.IamCheckResponse> & { isAuthorized: boolean });
  
      rerender();

      expect(usePreferencesSpy).toHaveBeenCalledWith(
        preferenceKey,
        {
          enabled: true,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current).toBe(undefined);
  
      usePreferencesSpy.mockReturnValue({
        data: 0,
      } as UseQueryResult<number>);
  
      rerender();

      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(result.current).toBe(undefined);
  
      useTimeSpy.mockReturnValue({
        data: intervalInSeconds + 1,
        isFetched: true,
      } as UseQueryResult<number>);
  
      rerender();

      expect(queryExecutor).toHaveBeenCalledWith(true);
      expect(result.current).toBe(true);
    });

    it('should return false when API call is in error', () => {
      const queryExecutor = vi.fn((enabled: boolean) => 
        enabled
          ? { data: undefined, isFetched: true, error: new Error('Test') } as UseQueryResult
          : { data: undefined, isFetched: false } as UseQueryResult
      );
      const { result } = renderHook(
        () => useCheckModalDisplay(
          queryExecutor,
          (data, error) => !error && data !== null,
        ),
        {
          wrapper,
        },
      );

      expect(queryExecutor).toHaveBeenCalledWith(true);
      expect(result.current).toBe(false);
    });
  });
});
