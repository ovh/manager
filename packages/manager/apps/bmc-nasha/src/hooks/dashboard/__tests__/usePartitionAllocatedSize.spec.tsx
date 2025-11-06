import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { fetchListing } from '@/data/api/Client.api';
import type { PartitionRaw } from '@/types/Dashboard.type';

import { usePartitionAllocatedSize } from '../usePartitionAllocatedSize';

// Mock dependencies
vi.mock('@/data/api/Client.api', () => ({
  fetchListing: vi.fn(),
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

describe('usePartitionAllocatedSize', () => {
  const mockServiceName = 'nasha-test-1';
  const mockPartitions: PartitionRaw[] = [
    { size: 100, partitionName: 'partition1' },
    { size: 200, partitionName: 'partition2' },
    { size: 150, partitionName: 'partition3' },
  ];

  const expectedTotalSize = 450; // 100 + 200 + 150

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should calculate total allocated size correctly', async () => {
    vi.mocked(fetchListing).mockResolvedValue({
      data: mockPartitions,
    } as any);

    const { result } = renderHook(() => usePartitionAllocatedSize(mockServiceName), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchListing).toHaveBeenCalledWith(
      `/dedicated/nasha/${mockServiceName}/partition`,
    );
    expect(result.current.data).toBe(expectedTotalSize);
  });

  it('should return 0 when no partitions exist', async () => {
    vi.mocked(fetchListing).mockResolvedValue({
      data: [],
    } as any);

    const { result } = renderHook(() => usePartitionAllocatedSize(mockServiceName), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(0);
  });

  it('should not fetch when serviceName is empty', () => {
    const { result } = renderHook(() => usePartitionAllocatedSize(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(fetchListing).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('API Error');
    vi.mocked(fetchListing).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePartitionAllocatedSize(mockServiceName), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});

