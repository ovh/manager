import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useTranslation } from 'react-i18next';

import { getJSON } from '@/data/api/Client.api';
import { SERVICE_TYPE } from '@/pages/dashboard/Dashboard.constants';
import type { ServiceInfoRaw } from '@/types/Dashboard.type';

import { useServiceInfo } from '../useServiceInfo';

// Mock dependencies
vi.mock('@/data/api/Client.api', () => ({
  getJSON: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useServiceInfo', () => {
  const mockServiceName = 'nasha-test-1';
  const mockServiceInfoRaw: ServiceInfoRaw = {
    engagedUpTo: '2024-12-31',
    serviceId: 12345,
    status: 'active',
  };

  const mockServiceInfo = {
    ...mockServiceInfoRaw,
    serviceType: SERVICE_TYPE,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.mocked(useTranslation).mockReturnValue({
      t: (key: string) => key,
    } as ReturnType<typeof useTranslation>);
  });

  it('should fetch service info successfully', async () => {
    vi.mocked(getJSON).mockResolvedValue(mockServiceInfoRaw);

    const { result } = renderHook(() => useServiceInfo(mockServiceName), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getJSON).toHaveBeenCalledWith(
      'v6',
      `/dedicated/nasha/${mockServiceName}/serviceInfos`,
    );
    expect(result.current.data).toEqual(mockServiceInfo);
  });

  it('should not fetch when serviceName is empty', () => {
    const { result } = renderHook(() => useServiceInfo(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(getJSON).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('API Error');
    vi.mocked(getJSON).mockRejectedValue(mockError);

    const { result } = renderHook(() => useServiceInfo(mockServiceName), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

