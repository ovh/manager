/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNashaServices, useNashaServiceDetails, useCreateNashaService } from './useNashaServices';
import * as ClientApi from '../commons/Client.api';

// Mock the API functions
vi.mock('../commons/Client.api', () => ({
  getNashaServices: vi.fn(),
  getNashaServiceDetails: vi.fn(),
  createNashaService: vi.fn(),
}));

// Mock notifications
vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useNashaServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch services successfully', async () => {
    const mockServices = [
      {
        serviceName: 'nasha-test-001',
        datacenter: 'GRA11',
        diskType: 'ssd' as const,
        canCreatePartition: true,
        monitored: true,
        zpoolCapacity: 100,
        zpoolSize: 25,
      },
    ];

    vi.mocked(ClientApi.getNashaServices).mockResolvedValue({
      data: mockServices,
      totalCount: 1,
      status: 'success',
    });

    const { result } = renderHook(() => useNashaServices({
      page: 1,
      pageSize: 12,
      sortBy: 'serviceName',
      sortDesc: false,
    }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toEqual(mockServices);
    expect(result.current.data?.totalCount).toBe(1);
  });

  it('should handle API error', async () => {
    vi.mocked(ClientApi.getNashaServices).mockResolvedValue({
      data: [],
      totalCount: 0,
      status: 'error',
      message: 'API Error',
    });

    const { result } = renderHook(() => useNashaServices({
      page: 1,
      pageSize: 12,
      sortBy: 'serviceName',
      sortDesc: false,
    }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toEqual([]);
    expect(result.current.data?.totalCount).toBe(0);
  });

  it('should pass parameters to API call', async () => {
    const params = {
      page: 2,
      pageSize: 10,
      sortBy: 'serviceName',
      sortDesc: true,
    };

    vi.mocked(ClientApi.getNashaServices).mockResolvedValue({
      data: [],
      totalCount: 0,
      status: 'success',
    });

    renderHook(() => useNashaServices(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(ClientApi.getNashaServices).toHaveBeenCalledWith(params);
    });
  });
});

describe('useNashaServiceDetails', () => {
  it('should fetch service details successfully', async () => {
    const mockServiceDetails = {
      serviceName: 'nasha-test-001',
      datacenter: 'GRA11',
      diskType: 'ssd' as const,
      canCreatePartition: true,
      monitored: true,
      zpoolCapacity: 100,
      zpoolSize: 25,
      partitions: [],
      snapshots: [],
      access: [],
      quotas: [],
    };

    vi.mocked(ClientApi.getNashaServiceDetails).mockResolvedValue({
      data: mockServiceDetails,
      status: 'success',
    });

    const { result } = renderHook(() => useNashaServiceDetails('nasha-test-001'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockServiceDetails);
  });

  it('should not fetch when serviceName is empty', () => {
    const { result } = renderHook(() => useNashaServiceDetails(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(ClientApi.getNashaServiceDetails).not.toHaveBeenCalled();
  });
});

describe('useCreateNashaService', () => {
  it('should create service successfully', async () => {
    const orderData = {
      datacenter: 'GRA11',
      protocol: 'NFS' as const,
      size: 100,
      customName: 'Test Service',
    };

    vi.mocked(ClientApi.createNashaService).mockResolvedValue({
      data: { orderId: '12345' },
      status: 'success',
    });

    const { result } = renderHook(() => useCreateNashaService(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(orderData);

    expect(ClientApi.createNashaService).toHaveBeenCalledWith(orderData);
  });

  it('should handle creation error', async () => {
    const orderData = {
      datacenter: 'GRA11',
      protocol: 'NFS' as const,
      size: 100,
    };

    vi.mocked(ClientApi.createNashaService).mockResolvedValue({
      data: null,
      status: 'error',
      message: 'Creation failed',
    });

    const { result } = renderHook(() => useCreateNashaService(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(orderData)).rejects.toThrow();
  });
});
