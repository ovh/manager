import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getObservabilityServices } from '@/data/api/observability.api';
import {
  getObservabilityServicesQueryKey,
  useObservabilityServices,
} from '@/data/hooks/services/useObservabilityServices.hook';
import { ObservabilityService } from '@/types/observability.type';

// Mock the observability API
vi.mock('@/data/api/observability.api', () => ({
  getObservabilityServices: vi.fn(),
}));

const mockGetObservabilityServices = vi.mocked(getObservabilityServices);

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

describe('useObservabilityServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct query key', () => {
    // Act
    const queryKey = getObservabilityServicesQueryKey();

    // Assert
    expect(queryKey).toEqual(['observabilityServices']);
  });

  it('should call getObservabilityServices with signal', async () => {
    // Arrange
    const mockServices: ObservabilityService[] = [
      {
        id: '1',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: 'Service 1' },
      },
      {
        id: '2',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: 'Service 2' },
      },
    ];
    mockGetObservabilityServices.mockResolvedValue(mockServices);

    // Act
    renderHook(() => useObservabilityServices(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(mockGetObservabilityServices).toHaveBeenCalledWith(
        expect.any(AbortSignal) as AbortSignal,
      );
    });
  });

  it('should return loading state initially', () => {
    // Arrange
    mockGetObservabilityServices.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to test loading state
        }),
    );

    // Act
    const { result } = renderHook(() => useObservabilityServices(), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should return success state when getObservabilityServices resolves', async () => {
    // Arrange
    const mockServices: ObservabilityService[] = [
      {
        id: 'service-1',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: 'Test Service 1' },
      },
      {
        id: 'service-2',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: 'Test Service 2' },
      },
    ];
    mockGetObservabilityServices.mockResolvedValue(mockServices);

    // Act
    const { result } = renderHook(() => useObservabilityServices(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockServices);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return error state when getObservabilityServices rejects', async () => {
    // Arrange
    const mockError = new Error('Failed to fetch observability services');
    mockGetObservabilityServices.mockRejectedValue(mockError);

    // Act
    const { result } = renderHook(() => useObservabilityServices(), {
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

  it('should return empty array when getObservabilityServices resolves with empty result', async () => {
    // Arrange
    mockGetObservabilityServices.mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useObservabilityServices(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([]);
    });
  });
});
