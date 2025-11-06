import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useTranslation } from 'react-i18next';

import { aapi } from '@ovh-ux/manager-core-api';

import { prepareNasha } from '@/utils/dashboard/prepareNasha.utils';
import type { NashaRaw } from '@/types/Dashboard.type';

import { useNasha } from '../useNasha';

// Mock dependencies
vi.mock('@ovh-ux/manager-core-api', () => ({
  aapi: {
    get: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@/utils/dashboard/prepareNasha.utils', () => ({
  prepareNasha: vi.fn(),
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

describe('useNasha', () => {
  const mockServiceName = 'nasha-test-1';
  const mockNashaRaw: NashaRaw = {
    customName: 'My Nasha',
    datacenter: 'rbx',
    diskType: 'ssd',
    ip: '1.2.3.4',
    serviceName: mockServiceName,
    zpoolSize: 1000,
    use: {
      size: { value: 1000, unit: 'GB' },
      used: { value: 500, unit: 'GB' },
      usedbysnapshots: { value: 100, unit: 'GB' },
    },
    monitored: true,
  };

  const mockNasha = {
    ...mockNashaRaw,
    localeDatacenter: 'Roubaix',
    diskSize: '1000 GB',
    use: {
      size: { value: 1000, unit: 'GB', name: 'Taille' },
      used: { value: 500, unit: 'GB', name: 'Stockage' },
      usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.mocked(useTranslation).mockReturnValue({
      t: (key: string) => key,
    } as ReturnType<typeof useTranslation>);

    vi.mocked(prepareNasha).mockReturnValue(mockNasha as any);
  });

  it('should fetch nasha data successfully', async () => {
    vi.mocked(aapi.get).mockResolvedValue({
      data: mockNashaRaw,
    } as any);

    const { result } = renderHook(() => useNasha(mockServiceName), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(aapi.get).toHaveBeenCalledWith(`/dedicated/nasha/${mockServiceName}`);
    expect(prepareNasha).toHaveBeenCalledWith(mockNashaRaw, expect.any(Function));
    expect(result.current.data).toEqual(mockNasha);
  });

  it('should not fetch when serviceName is empty', () => {
    const { result } = renderHook(() => useNasha(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(aapi.get).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('API Error');
    vi.mocked(aapi.get).mockRejectedValue(mockError);

    const { result } = renderHook(() => useNasha(mockServiceName), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

