import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import { UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { FEATURES } from '@/utils/features.constant';
import { TVMwareVSphere } from '@/types/vsphere';
import LogsPage from './Logs.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const module = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...module,
    useParams: () => ({ serviceName: 'pcc-xxx' }),
  };
});

vi.mock('@/data/hooks/useVmwareVsphere', () => ({
  useVmwareVsphere: (serviceName: string) =>
    ({
      data: { data: { serviceName, iam: { urn: `urn:${serviceName}` } } },
    } as UseQueryResult<ApiResponse<TVMwareVSphere>>),
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
  },
};

describe('Logs page tests suite', () => {
  beforeEach(() => vi.stubGlobal('location', { href: 'https://fakehost' }));

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  const renderLogsPage = () =>
    render(
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <LogsPage />
      </ShellContext.Provider>,
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
