import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { AxiosResponseHeaders, InternalAxiosRequestConfig } from 'axios';
import { vi } from 'vitest';

import { ApiResponse } from '@ovh-ux/manager-core-api';

import { VrackServicesWithIAM } from '../../types';
import { getVrackServicesResourceList } from '../api';
import { useVrackServicesList } from './useVrackServicesList';

vi.mock('../api', async () => {
  const actual = await vi.importActual<typeof import('../api')>('../api');
  return {
    ...actual,
    getVrackServicesResourceList: vi.fn(),
  };
});

describe('useVrackServicesList', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return data correctly when API call succeeds', async () => {
    const mockData: ApiResponse<VrackServicesWithIAM[]> = {
      data: [
        { id: 'service-1', currentTasks: [] },
        { id: 'service-2', currentTasks: [{ status: 'RUNNING' }] },
      ] as VrackServicesWithIAM[],
      status: 200,
      statusText: '',
      headers: {} as AxiosResponseHeaders,
      config: {} as InternalAxiosRequestConfig,
    };

    vi.mocked(getVrackServicesResourceList).mockResolvedValue(mockData);

    const { result } = renderHook(() => useVrackServicesList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });

    expect(getVrackServicesResourceList).toHaveBeenCalledTimes(1);
  });

  it('should return an error when API call fails', async () => {
    vi.mocked(getVrackServicesResourceList).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useVrackServicesList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });

    expect(getVrackServicesResourceList).toHaveBeenCalledTimes(1);
  });
});
