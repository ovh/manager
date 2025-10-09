import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getTenants } from '../../../../data/api/tenant';
import { useTenants } from '../../../../data/hooks/tenants/useTenants';
import { Tenant } from '../../../../types/observability.type';

// Mock the tenant
vi.mock('@/data/api/tenant', () => ({
  getTenants: vi.fn(),
}));

const mockGetTenants = vi.mocked(getTenants);

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

describe('useTenants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getTenants with correct serviceName parameter', async () => {
    // Arrange
    const serviceName = 'test-service-123';
    const mockTenants: Tenant[] = [
      { id: '1', currentState: { title: 'Tenant 1' } },
      { id: '2', currentState: { title: 'Tenant 2' } },
    ];
    mockGetTenants.mockResolvedValue(mockTenants);

    // Act
    renderHook(() => useTenants(serviceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenCalledWith({
        serviceName,
        signal: expect.any(AbortSignal) as AbortSignal,
      });
    });
  });

  it('should return loading state initially', () => {
    // Arrange
    const serviceName = 'test-service';
    mockGetTenants.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to test loading state
        }),
    );

    // Act
    const { result } = renderHook(() => useTenants(serviceName), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should return success state when getTenants resolves', async () => {
    // Arrange
    const serviceName = 'success-service';
    const mockTenants: Tenant[] = [
      { id: 'tenant-1', currentState: { title: 'Test Tenant 1' } },
      { id: 'tenant-2', currentState: { title: 'Test Tenant 2' } },
    ];
    mockGetTenants.mockResolvedValue(mockTenants);

    // Act
    const { result } = renderHook(() => useTenants(serviceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockTenants);
      expect(result.current.error).toBe(null);
    });
  });

  it('should return error state when getTenants rejects', async () => {
    // Arrange
    const serviceName = 'error-service';
    const mockError = new Error('Failed to fetch tenants');
    mockGetTenants.mockRejectedValue(mockError);

    // Act
    const { result } = renderHook(() => useTenants(serviceName), {
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

  it('should return empty array when getTenants resolves with empty result', async () => {
    // Arrange
    const serviceName = 'empty-service';
    mockGetTenants.mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useTenants(serviceName), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([]);
    });
  });
});
