import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getGrafanas } from '@/data/api/grafana.api';
import { useGrafanas } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

// Mock the grafana API
vi.mock('@/data/api/grafana.api', () => ({
  getGrafanas: vi.fn(),
}));

const mockGetGrafanas = vi.mocked(getGrafanas);

// Test wrapper for React Query
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

describe('useGrafanas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getGrafanas with correct resourceName parameter', async () => {
    // Arrange
    const resourceName = 'test-service-123';
    const mockGrafanas: Grafana[] = [
      {
        id: '1',
        createdAt: '2025-07-22T09:58:20.619Z',
        updatedAt: '2025-07-22T09:58:20.619Z',
        currentState: {
          title: 'Grafana 1',
          description: 'Grafana description test 1',
          endpoint: 'https://grafana-1.metrics.ovh.com',
          datasource: {
            fullySynced: false,
          },
          version: {
            value: '1.3.45',
            deprecated: false,
          },
          infrastructure: {
            certificationLevel: 'STANDARD',
            entryPoint: 'gra1.metrics.ovh.com',
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            location: 'eu-west-gra',
            type: 'SHARED',
          },
        },
        resourceStatus: 'READY',
        iam: {
          id: '4691a219-7eea-4385-b64b-80f7220cf19c',
          tags: {},
          urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019b0cfb-5990-7a17-8d58-18936bfd1ddc',
        },
      },
      {
        id: '2',
        createdAt: '2025-07-25T09:58:20.619Z',
        updatedAt: '2025-07-25T09:58:20.619Z',
        currentState: {
          title: 'Grafana 2',
          description: 'Grafana description test 2',
          endpoint: 'https://grafana-2.metrics.ovh.com',
          datasource: {
            fullySynced: true,
          },
          version: {
            value: '1.0.1',
            deprecated: true,
          },
          infrastructure: {
            certificationLevel: 'STANDARD',
            entryPoint: 'gra1.metrics.ovh.com',
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            location: 'eu-west-gra',
            type: 'SHARED',
          },
        },
        resourceStatus: 'READY',
        iam: {
          id: '155c54c1-7efd-49e3-9358-b1a2860a56cc',
          tags: {},
          urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019ad9a2-7438-735e-bb05-e397e1d9be7e',
        },
      },
    ];
    mockGetGrafanas.mockResolvedValue(mockGrafanas);

    // Act
    renderHook(() => useGrafanas(resourceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(mockGetGrafanas).toHaveBeenCalledWith({
        resourceName,
        signal: expect.any(AbortSignal) as AbortSignal,
      });
    });
  });

  it('should return loading state initially', () => {
    // Arrange
    const resourceName = 'test-service';
    mockGetGrafanas.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to test loading state
        }),
    );

    // Act
    const { result } = renderHook(() => useGrafanas(resourceName), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should return success state when getGrafanas resolves', async () => {
    // Arrange
    const resourceName = 'success-service';
    const mockGrafanas: Grafana[] = [
      {
        id: 'grafana-1',
        createdAt: '2025-07-22T09:58:20.619Z',
        updatedAt: '2025-07-22T09:58:20.619Z',
        currentState: {
          title: 'Test Grafana 1',
          description: 'Grafana description test 1',
          endpoint: 'https://grafana-1.metrics.ovh.com',
          datasource: {
            fullySynced: false,
          },
          version: {
            value: '1.3.45',
            deprecated: false,
          },
          infrastructure: {
            certificationLevel: 'STANDARD',
            entryPoint: 'gra1.metrics.ovh.com',
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            location: 'eu-west-gra',
            type: 'SHARED',
          },
        },
        resourceStatus: 'READY',
        iam: {
          id: '4691a219-7eea-4385-b64b-80f7220cf19c',
          tags: {},
          urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019b0cfb-5990-7a17-8d58-18936bfd1ddc',
        },
      },
      {
        id: 'grafana-2',
        createdAt: '2025-07-25T09:58:20.619Z',
        updatedAt: '2025-07-25T09:58:20.619Z',
        currentState: {
          title: 'Test Grafana 2',
          description: 'Grafana description test 2',
          endpoint: 'https://grafana-2.metrics.ovh.com',
          datasource: {
            fullySynced: true,
          },
          version: {
            value: '1.0.1',
            deprecated: true,
          },
          infrastructure: {
            certificationLevel: 'STANDARD',
            entryPoint: 'gra1.metrics.ovh.com',
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            location: 'eu-west-gra',
            type: 'SHARED',
          },
        },
        resourceStatus: 'READY',
        iam: {
          id: '155c54c1-7efd-49e3-9358-b1a2860a56cc',
          tags: {},
          urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019ad9a2-7438-735e-bb05-e397e1d9be7e',
        },
      },
    ];
    mockGetGrafanas.mockResolvedValue(mockGrafanas);

    // Act
    const { result } = renderHook(() => useGrafanas(resourceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockGrafanas);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return error state when getGrafanas rejects', async () => {
    // Arrange
    const resourceName = 'error-service';
    const mockError = new Error('Failed to fetch grafanas');
    mockGetGrafanas.mockRejectedValue(mockError);

    // Act
    const { result } = renderHook(() => useGrafanas(resourceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should return empty array when getGrafanas resolves with empty result', async () => {
    // Arrange
    const resourceName = 'empty-service';
    mockGetGrafanas.mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useGrafanas(resourceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([]);
    });
  });
});
