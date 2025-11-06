import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useParams, useNavigate } from 'react-router-dom';

import type { Nasha, ServiceInfo } from '@/types/Dashboard.type';

import { useDashboardData } from '../useDashboardData';
import { useNasha } from '../useNasha';
import { usePartitionAllocatedSize } from '../usePartitionAllocatedSize';
import { useServiceInfo } from '../useServiceInfo';
import { useDashboardFeatureAvailability } from '../useFeatureAvailability';

// Mock all dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../useNasha');
vi.mock('../usePartitionAllocatedSize');
vi.mock('../useServiceInfo');
vi.mock('../useFeatureAvailability');
vi.mock('@/utils/dashboard/navigation.utils', () => ({
  goToEditName: vi.fn(),
  goToPartitionsCreate: vi.fn(),
  getDashboardUrl: vi.fn(),
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

describe('useDashboardData', () => {
  const mockServiceName = 'nasha-test-1';
  const mockNavigate = vi.fn();

  const mockNasha: Nasha = {
    serviceName: mockServiceName,
    customName: 'My Nasha',
    datacenter: 'rbx',
    localeDatacenter: 'Roubaix',
    diskType: 'hdd',
    diskSize: '1000 GB',
    zpoolSize: 1000,
    monitored: true,
    use: {
      size: { value: 1000, unit: 'GB', name: 'Taille' },
      used: { value: 500, unit: 'GB', name: 'Stockage' },
      usedbysnapshots: { value: 100, unit: 'GB', name: 'Snapshots' },
    },
  };

  const mockServiceInfo: ServiceInfo = {
    serviceType: 'DEDICATED_NASHA',
    engagedUpTo: '2024-12-31',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.mocked(useParams).mockReturnValue({ serviceName: mockServiceName });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should return data when all hooks succeed', async () => {
    vi.mocked(useNasha).mockReturnValue({
      data: mockNasha,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 450,
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: mockServiceInfo,
      isLoading: false,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: true,
      isNashaLegacyServicesPeriod: true,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data?.nasha).toEqual(mockNasha);
    expect(result.current.data?.serviceInfo).toEqual(mockServiceInfo);
    expect(result.current.data?.partitionAllocatedSize).toBe(450);
    expect(result.current.data?.canCreatePartitions).toBe(true); // 450 <= 1000 - 10
    expect(result.current.data?.isNashaEolServiceBannerAvailable).toBe(true); // legacy service + period
    expect(result.current.data?.nashaApiUrl).toBe(`/dedicated/nasha/${mockServiceName}`);
  });

  it('should return undefined data when nasha is not loaded', () => {
    vi.mocked(useNasha).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: mockServiceInfo,
      isLoading: false,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: false,
      isNashaLegacyServicesPeriod: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('should return undefined data when serviceInfo is not loaded', () => {
    vi.mocked(useNasha).mockReturnValue({
      data: mockNasha,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: false,
      isNashaLegacyServicesPeriod: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('should calculate canCreatePartitions correctly', async () => {
    vi.mocked(useNasha).mockReturnValue({
      data: mockNasha,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 995, // Close to limit (1000 - 10 = 990)
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: mockServiceInfo,
      isLoading: false,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: false,
      isNashaLegacyServicesPeriod: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // 995 > 990, so cannot create partitions
    expect(result.current.data?.canCreatePartitions).toBe(false);
  });

  it('should handle navigation functions', () => {
    vi.mocked(useNasha).mockReturnValue({
      data: mockNasha,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: mockServiceInfo,
      isLoading: false,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: false,
      isNashaLegacyServicesPeriod: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    expect(result.current.navigation.goToEditName).toBeDefined();
    expect(result.current.navigation.goToPartitionsCreate).toBeDefined();
    expect(result.current.navigation.reload).toBeDefined();

    // Test navigation functions can be called
    result.current.navigation.goToEditName();
    result.current.navigation.goToPartitionsCreate();
  });

  it('should handle error state', () => {
    const mockError = new Error('API Error');

    vi.mocked(useNasha).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    vi.mocked(usePartitionAllocatedSize).mockReturnValue({
      data: 0,
      isLoading: false,
    } as any);

    vi.mocked(useServiceInfo).mockReturnValue({
      data: mockServiceInfo,
      isLoading: false,
    } as any);

    vi.mocked(useDashboardFeatureAvailability).mockReturnValue({
      isCommitmentAvailable: false,
      isNashaLegacyServicesPeriod: false,
      isLoading: false,
    } as any);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });
});

