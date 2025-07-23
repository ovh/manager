import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import environment from '@ovh-ux/shell/dist/types/plugin/environment';
import { FEATURES } from '@/utils/features.constant';
import { TVMwareVSphere } from '@/types/vsphere';
import LogsPage from './Logs.page';
import { SecurityOption } from '@/types/compatibilityMatrix';
import { Datacenter } from '@/types/datacenter';
import { DedicatedCloudTask } from '@/types/datacloud';

vi.mock('react-router-dom', async (importOriginal) => {
  const module = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...module,
    useParams: () => ({ serviceName: 'pcc-xxx' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/data/hooks/useVmwareVsphere', () => ({
  useVmwareVsphere: (serviceName: string) =>
    ({
      data: { data: { serviceName, iam: { urn: `urn:${serviceName}` } } },
    } as UseQueryResult<ApiResponse<TVMwareVSphere>>),
}));
vi.mock('@/data/hooks/useVmwareVsphereDatacenter', () => ({
  useVmwareVsphereDatacenter: () =>
    ({
      data: { data: { commercialName: 'PREMIER' } },
    } as UseQueryResult<ApiResponse<Datacenter>>),
}));

vi.mock('@/data/hooks/useVmwareVsphereCompatibilityMatrix', () => ({
  useVmwareVsphereCompatibilityMatrix: () =>
    ({
      data: { data: [{ name: 'logForwarder', state: 'delivered' }] },
    } as UseQueryResult<ApiResponse<SecurityOption[]>>),
}));

vi.mock('@/data/hooks/getDedicatedCloudServiceTask', () => ({
  getDedicatedCloudServiceTask: () =>
    ({
      data: { data: { taskId: 12345, state: 'delivered' } },
    } as UseQueryResult<ApiResponse<DedicatedCloudTask>>),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return { ...module, useFeatureAvailability: vi.fn() };
});

vi.mock('@ovh-ux/logs-to-customer', () => ({
  LogsToCustomerModule: vi.fn(),
}));

const shellContext = {
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('https://www.ovh.com/dedicated/'),
    },
    environment: {
      getEnvironment: () => {
        return {
          getUser: () => {
            return { isTrusted: false };
          },
        };
      },
    },
  },
};

describe('Logs page tests suite', () => {
  const queryClient = new QueryClient();
  beforeEach(() => vi.stubGlobal('location', { href: 'https://fakehost' }));

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  const renderLogsPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <LogsPage />
        </ShellContext.Provider>
      </QueryClientProvider>,
    );

  it('should display logs if logs feature is enabled', async () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.LOGS]: true },
    } as UseFeatureAvailabilityResult);

    renderLogsPage();

    await waitFor(() => {
      expect(LogsToCustomerModule).toHaveBeenCalledWith(
        {
          logApiVersion: 'v6',
          logApiUrls: {
            logKind: `/dedicatedCloud/pcc-xxx/log/kind`,
            logSubscription: `/dedicatedCloud/pcc-xxx/log/subscription`,
            logUrl: `/dedicatedCloud/pcc-xxx/log/url`,
          },
          logIamActions: {
            postSubscription: [
              'pccVMware:apiovh:log/subscription/create',
              'ldp:apiovh:output/graylog/stream/forwardTo',
            ],
            deleteSubscription: ['pccVMware:apiovh:log/subscription/delete'],
          },
          resourceURN: 'urn:pcc-xxx',
        },
        {},
      );
      expect(window.location.href).toBe('https://fakehost');
      expect(shellContext.shell.navigation.getURL).not.toHaveBeenCalled();
    });
  });

  it('should redirect to dashboard if logs feature is disabled', async () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.LOGS]: false },
    } as UseFeatureAvailabilityResult);

    renderLogsPage();

    await waitFor(() => {
      expect(LogsToCustomerModule).not.toHaveBeenCalled();
      expect(shellContext.shell.navigation.getURL).toHaveBeenCalledWith(
        'dedicated',
        '#/dedicated_cloud/pcc-xxx',
        {},
      );

      expect(window.location.href).toBe('https://www.ovh.com/dedicated/');
    });
  });
});
