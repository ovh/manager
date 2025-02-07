import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { TSAPInstallation } from '@/types/installation.type';
import { VMwareService } from '@/types/vmwareService.type';
import { getSAPInstallations } from '@/data/api/vmwareServices';
import useInstallationHistory from './useInstallationHistory';

vi.mock('@/hooks/vmwareServices/useVMwareServices');
vi.mock('@/data/api/vmwareServices');

describe('useInstallationHistory hook tests suite', () => {
  vi.mocked(useVMwareServices).mockReturnValue({
    data: [
      { serviceName: 'pcc1', displayName: 'name 1' },
      { serviceName: 'pcc2', displayName: 'name 2' },
    ] as VMwareService[],
  } as UseQueryResult<VMwareService[]>);

  vi.mocked(getSAPInstallations).mockResolvedValueOnce({
    data: [
      {
        serviceName: 'pcc1',
        sapHanaSid: 'sid-1',
      },
      {
        serviceName: 'pcc1',
        sapHanaSid: 'sid-2',
      },
    ],
  } as ApiResponse<TSAPInstallation[]>);
  vi.mocked(getSAPInstallations).mockResolvedValueOnce({
    data: [
      {
        serviceName: 'pcc2',
        sapHanaSid: 'sid-3',
      },
      {
        serviceName: 'pcc2',
        sapHanaSid: 'sid-4',
      },
    ],
  } as ApiResponse<TSAPInstallation[]>);

  it('should render all passed installations in flat array', async () => {
    const { result } = renderHook(() => useInstallationHistory(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    });

    expect(vi.mocked(getSAPInstallations)).toHaveBeenCalledWith('pcc1');
    expect(vi.mocked(getSAPInstallations)).toHaveBeenCalledWith('pcc2');

    await waitFor(() => {
      expect(result.current.data).toEqual([
        {
          serviceName: 'pcc1',
          sapHanaSid: 'sid-1',
        },
        {
          serviceName: 'pcc1',
          sapHanaSid: 'sid-2',
        },
        {
          serviceName: 'pcc2',
          sapHanaSid: 'sid-3',
        },
        {
          serviceName: 'pcc2',
          sapHanaSid: 'sid-4',
        },
      ]);
    });
  });
});
