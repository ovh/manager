import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getGrafanaReleases } from '@/data/api/grafana.api';
import { useGrafanaReleases } from '@/data/hooks/grafana/useGrafanaReleases.hook';
import { GrafanaReleasesResponse } from '@/types/managedDashboards.type';

vi.mock('@/data/api/grafana.api', () => ({
  getGrafanaReleases: vi.fn(),
}));

const mockGetGrafanaReleases = vi.mocked(getGrafanaReleases);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

const mockReleasesResponse: GrafanaReleasesResponse = {
  releases: [
    {
      id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
      status: 'DEPRECATED',
      version: '11.1.0rc1',
      upgradableTo: [
        {
          id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
          status: 'SUPPORTED',
          version: '12.2.1',
        },
      ],
    },
    {
      id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
      status: 'SUPPORTED',
      version: '11.1.0',
      upgradableTo: [
        {
          id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
          status: 'SUPPORTED',
          version: '12.2.1',
        },
      ],
    },
    {
      id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
      status: 'SUPPORTED',
      version: '12.2.1',
      downgradableTo: [
        {
          id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
          status: 'SUPPORTED',
          version: '11.1.0',
        },
      ],
    },
  ],
};

describe('useGrafanaReleases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getGrafanaReleases with correct parameters', async () => {
    const resourceName = 'test-service-123';
    const infrastructureId = 'infra-456';
    mockGetGrafanaReleases.mockResolvedValue(mockReleasesResponse);

    renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetGrafanaReleases).toHaveBeenCalledWith({
        resourceName,
        infrastructureId,
        signal: expect.any(AbortSignal) as AbortSignal,
      });
    });
  });

  it('should return loading state initially', () => {
    const resourceName = 'test-service';
    const infrastructureId = 'infra-123';
    mockGetGrafanaReleases.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should return success state when getGrafanaReleases resolves', async () => {
    const resourceName = 'success-service';
    const infrastructureId = 'infra-success';
    mockGetGrafanaReleases.mockResolvedValue(mockReleasesResponse);

    const { result } = renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockReleasesResponse);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return error state when getGrafanaReleases rejects', async () => {
    const resourceName = 'error-service';
    const infrastructureId = 'infra-error';
    const mockError = new Error('Failed to fetch releases');
    mockGetGrafanaReleases.mockRejectedValue(mockError);

    const { result } = renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });

  it.each([
    { resourceName: '', infrastructureId: 'infra-123', description: 'empty resourceName' },
    { resourceName: 'service-123', infrastructureId: '', description: 'empty infrastructureId' },
    { resourceName: '', infrastructureId: '', description: 'both empty' },
  ])('should not fetch when $description', ({ resourceName, infrastructureId }) => {
    mockGetGrafanaReleases.mockResolvedValue(mockReleasesResponse);

    const { result } = renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetGrafanaReleases).not.toHaveBeenCalled();
  });

  it('should return empty releases array when API returns empty result', async () => {
    const resourceName = 'empty-service';
    const infrastructureId = 'infra-empty';
    const emptyResponse: GrafanaReleasesResponse = { releases: [] };
    mockGetGrafanaReleases.mockResolvedValue(emptyResponse);

    const { result } = renderHook(() => useGrafanaReleases(resourceName, infrastructureId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(emptyResponse);
      expect(result.current.data?.releases).toHaveLength(0);
    });
  });
});
