import { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  UseQueryResult,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import * as MRC from '@ovh-ux/manager-react-components';
import { UseFeatureAvailabilityResult } from '@ovh-ux/manager-react-components';
import * as useAccountUrnModule from '@/hooks/accountUrn/useAccountUrn';
import * as usePreferencesModule from '@/hooks/preferences/usePreferences';
import * as useTimeModule from '@/hooks/time/useTime';
import { useModalManager } from '@/context/modals/useModalManager';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseAuthorizationIamResult = UseQueryResult<any> & {
  isAuthorized: boolean;
};

const mocks = vi.hoisted(() => ({
  href: 'https://fake-manager.com/manager/dedicated/#/account',
  user: {
    kycValidated: false,
  },
  useQuery: vi.fn(() => ({
    data: true,
  })),
}));

Object.defineProperty(window, 'location', {
  value: {
    href: 'https://fake-manager.com/manager/dedicated/#/account',
  },
  writable: true,
});

const useFeatureAvailabilitySpy = vi.spyOn(MRC, 'useFeatureAvailability');
const useAccountUrnSpy = vi.spyOn(useAccountUrnModule, 'useAccountUrn');
const useAuthorizationIamSpy = vi.spyOn(MRC, 'useAuthorizationIam');
const usePreferencesSpy = vi.spyOn(usePreferencesModule, 'usePreferences');
const useTimeSpy = vi.spyOn(useTimeModule, 'useTime');
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const originalModule: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...originalModule,
    useQuery: mocks.useQuery,
  };
});

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      // eslint-disable-next-line consistent-return
      getPlugin: (plugin: string) => {
        // eslint-disable-next-line default-case
        switch (plugin) {
          case 'navigation':
            return {
              getURL: vi.fn(
                (appName, appPath) =>
                  `https://fake-manager.com/manager/${appName}/${appPath}`,
              ),
            };
          case 'environment':
            return {
              getEnvironment: () => ({
                getRegion: vi.fn(),
                getApplicationURL: vi.fn(
                  (app) => `https://ovh.com/manager/${app}`,
                ),
                getUser: vi.fn(() => mocks.user),
              }),
            };
        }
      },
    },
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useModalManager', () => {
  beforeEach(() => {
    useFeatureAvailabilitySpy.mockClear();
    useFeatureAvailabilitySpy.mockReturnValue({
      isLoading: true,
    } as UseFeatureAvailabilityResult<{ feature: boolean }>);
    useAccountUrnSpy.mockClear();
    useAccountUrnSpy.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<string>);
    useAuthorizationIamSpy.mockClear();
    useAuthorizationIamSpy.mockReturnValue({
      isAuthorized: false,
      isLoading: true,
    } as UseAuthorizationIamResult);
    usePreferencesSpy.mockClear();
    usePreferencesSpy.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<number>);
    useTimeSpy.mockClear();
    useTimeSpy.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<number>);
  });
  it('should validate all checks before authorizing the display', async () => {
    const modalConfiguration: ModalToDisplayConfiguration = {
      checks: {
        userCheck: (user) => !user.kycValidated,
        excludedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/billing',
          },
        ],
        includedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/account',
          },
        ],
        featuresAvailability: ['feature'],
        iamRights: ['iam-action'],
        intervalInSeconds: 24 * 60 * 60,
      },
      data: {
        queryParams: {
          queryKey: ['query-key'],
          queryFn: () => true,
        },
        check: (result) => !!result,
      },
      component: function ModalToDisplay() {
        return <div></div>;
      },
    };
    const { result, rerender } = renderHook(
      () => useModalManager(modalConfiguration),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith(['feature'], {
        enabled: true,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
      // TODO: try to find a way to test that useQuery has been called with enabled: false
      /* expect(mocks.useQuery).toHaveBeenCalledWith({
        queryKey: ['query-key'],
        queryFn: () => true,
        enabled: false,
      }); */
    });

    useFeatureAvailabilitySpy.mockReturnValue({
      data: { feature: true },
    } as UseFeatureAvailabilityResult<{ feature: boolean }>);

    rerender();

    await waitFor(() => {
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    useAccountUrnSpy.mockReturnValue({
      data: 'fake-urn',
    } as UseQueryResult<string>);

    rerender();

    await waitFor(() => {
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        'fake-urn',
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    useAuthorizationIamSpy.mockReturnValue({
      isAuthorized: true,
    } as UseAuthorizationIamResult);

    rerender();

    await waitFor(() => {
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: true,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    usePreferencesSpy.mockReturnValue({
      data: 0,
    } as UseQueryResult<number>);

    rerender();

    await waitFor(() => {
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    useTimeSpy.mockReturnValue({
      data: modalConfiguration.checks.intervalInSeconds + 1,
    } as UseQueryResult<number>);

    rerender();

    await waitFor(() => {
      expect(result.current.isDisplayed).toBe(true);
      expect(result.current.data).toBe(true);
    });
  });

  it('should avoid unnecessary calls when they are not configured', async () => {
    const modalConfiguration: ModalToDisplayConfiguration = {
      checks: {
        userCheck: (user) => !user.kycValidated,
        excludedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/billing',
          },
        ],
        includedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/account',
          },
        ],
        intervalInSeconds: 24 * 60 * 60,
      },
      data: {
        queryParams: {
          queryKey: ['query-key'],
          queryFn: () => true,
        },
        check: (result) => !!result,
      },
      component: function ModalToDisplay() {
        return <div></div>;
      },
    };
    const { result, rerender } = renderHook(
      () => useModalManager(modalConfiguration),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith([], {
        enabled: false,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith([], undefined);
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: true,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    usePreferencesSpy.mockReturnValue({
      data: 0,
    } as UseQueryResult<number>);

    rerender();

    await waitFor(() => {
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith([], {
        enabled: false,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith([], undefined);
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    useTimeSpy.mockReturnValue({
      data: modalConfiguration.checks.intervalInSeconds + 1,
    } as UseQueryResult<number>);

    rerender();

    await waitFor(() => {
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith([], {
        enabled: false,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith([], undefined);
      expect(result.current.isDisplayed).toBe(true);
    });
  });

  it('should avoid unnecessary calls when a check is not respoected', async () => {
    const modalConfiguration: ModalToDisplayConfiguration = {
      checks: {
        userCheck: (user) => !user.kycValidated,
        excludedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/billing',
          },
        ],
        includedUrls: [
          {
            appName: 'dedicated',
            appPath: '#/account',
          },
        ],
        featuresAvailability: ['feature'],
        iamRights: ['iam-action'],
        intervalInSeconds: 24 * 60 * 60,
      },
      data: {
        queryParams: {
          queryKey: ['query-key'],
          queryFn: () => true,
        },
        check: (result) => !!result,
      },
      component: function ModalToDisplay() {
        return <div></div>;
      },
    };
    const { result, rerender } = renderHook(
      () => useModalManager(modalConfiguration),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(useFeatureAvailabilitySpy).toHaveBeenCalledWith(['feature'], {
        enabled: true,
      });
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(undefined);
    });

    useFeatureAvailabilitySpy.mockReturnValue({
      data: { feature: false },
    } as UseFeatureAvailabilityResult<{ feature: boolean }>);

    rerender();

    await waitFor(() => {
      expect(useAccountUrnSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(useAuthorizationIamSpy).toHaveBeenCalledWith(
        ['iam-action'],
        undefined,
      );
      expect(usePreferencesSpy).toHaveBeenCalledWith(
        'LAST_MODAL_TO_DISPLAY_DISPLAY_TIME',
        {
          enabled: false,
        },
      );
      expect(useTimeSpy).toHaveBeenCalledWith({
        enabled: false,
      });
      expect(result.current.isDisplayed).toBe(false);
    });
  });
});
