import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { createTenants } from '@/data/api/tenants.api';
import { CreateTenantsPayload } from '@/data/api/tenants.props';
import { useCreateTenants } from '@/data/hooks/tenants/useCreateTenants.hook';
import { getTenantsQueryKey } from '@/data/hooks/tenants/useTenants.hook';
import { Tenant } from '@/types/tenants.type';

// Mock the tenant adapter
vi.mock('@/data/api/tenants.api', () => ({
  createTenants: vi.fn(),
}));

const mockCreateTenants = vi.mocked(createTenants);

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return { TestWrapper, queryClient };
};

describe('useCreateTenants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload: CreateTenantsPayload = {
    resourceName: 'test-service-123',
    targetSpec: {
      title: 'Test Tenant',
      description: 'Test tenant description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 1000,
        },
      },
      infrastructure: {
        id: 'infra-1',
      },
    },
  };

  const mockTenant: Tenant = {
    id: 'tenant-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'Test Tenant',
      description: 'Test tenant description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 1000,
        },
      },
    },
  };

  it('should call createTenant with correct payload', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(mockCreateTenants).toHaveBeenCalledWith(mockPayload);
    });
  });

  it('should return success state when createTenant resolves', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockTenant);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return error state when createTenant rejects', async () => {
    // Arrange
    const mockError = new Error('Failed to create tenant');
    mockCreateTenants.mockRejectedValue(mockError);
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should invalidate tenants query on success', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const { TestWrapper, queryClient } = createWrapper();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: getTenantsQueryKey(mockPayload.resourceName),
      });
    });
  });

  it('should call custom onSuccess callback when provided', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const mockOnSuccess = vi.fn();
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(
      () =>
        useCreateTenants({
          onSuccess: mockOnSuccess,
        }),
      {
        wrapper: TestWrapper,
      },
    );

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockTenant, mockPayload, undefined);
    });
  });

  it('should call custom onError callback when provided', async () => {
    // Arrange
    const mockError = new Error('Custom error');
    mockCreateTenants.mockRejectedValue(mockError);
    const mockOnError = vi.fn();
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(
      () =>
        useCreateTenants({
          onError: mockOnError,
        }),
      {
        wrapper: TestWrapper,
      },
    );

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(mockError, mockPayload, undefined);
    });
  });

  it('should return loading state during mutation', async () => {
    // Arrange
    let resolvePromise: (value: Tenant) => void;
    const pendingPromise = new Promise<Tenant>((resolve) => {
      resolvePromise = resolve;
    });
    mockCreateTenants.mockReturnValue(pendingPromise);
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    // Clean up - resolve the promise to avoid hanging
    resolvePromise!(mockTenant);
  });

  it('should handle mutation with custom mutation options', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();
    const mockOnMutate = vi.fn().mockReturnValue(undefined);
    const mockOnSettled = vi.fn();
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(
      () =>
        useCreateTenants({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onMutate: mockOnMutate,
          onSettled: mockOnSettled,
        }),
      {
        wrapper: TestWrapper,
      },
    );

    result.current.mutate(mockPayload);

    // Assert
    await waitFor(() => {
      expect(mockOnMutate).toHaveBeenCalledWith(mockPayload);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockTenant, mockPayload, undefined);
      expect(mockOnSettled).toHaveBeenCalledWith(mockTenant, null, mockPayload, undefined);
    });

    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should reset mutation state correctly', async () => {
    // Arrange
    mockCreateTenants.mockResolvedValue(mockTenant);
    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.reset();

    // Assert
    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should handle multiple consecutive mutations', async () => {
    // Arrange
    const secondPayload = { ...mockPayload, resourceName: 'second-service' };
    const secondTenant = { ...mockTenant, id: 'tenant-456' };

    mockCreateTenants.mockResolvedValueOnce(mockTenant).mockResolvedValueOnce(secondTenant);

    const { TestWrapper } = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateTenants(), {
      wrapper: TestWrapper,
    });

    // First mutation
    result.current.mutate(mockPayload);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockTenant);
    });

    // Second mutation
    result.current.mutate(secondPayload);
    await waitFor(() => {
      expect(result.current.data).toEqual(secondTenant);
    });

    // Assert
    expect(mockCreateTenants).toHaveBeenCalledTimes(2);
    expect(mockCreateTenants).toHaveBeenNthCalledWith(1, mockPayload);
    expect(mockCreateTenants).toHaveBeenNthCalledWith(2, secondPayload);
  });
});
