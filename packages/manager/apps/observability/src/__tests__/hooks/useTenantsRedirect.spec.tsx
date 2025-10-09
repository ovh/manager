import React from 'react';

import { useNavigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useObservabilityServiceContext } from '../../contexts/ObservabilityService.context';
import { useTenants } from '../../data/hooks/tenants/useTenants';
import { useTenantsRedirect } from '../../hooks/useTenantsRedirect';
import { urls } from '../../routes/Routes.constants';
import { ObservabilityService, Tenant } from '../../types/observability.type';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/data/hooks/tenants/useTenants', () => ({
  useTenants: vi.fn(),
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseTenants = vi.mocked(useTenants);
const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseNavigate = vi.mocked(useNavigate);

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

// Helper to create mock query results
const createMockQueryResult = (
  overrides: Partial<UseQueryResult<Tenant[], Error>> = {},
): UseQueryResult<Tenant[], Error> =>
  ({
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    status: 'pending' as const,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle' as const,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
    ...overrides,
  }) as UseQueryResult<Tenant[], Error>;

describe('useTenantsRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  const mockService: ObservabilityService = {
    id: 'service-1',
    currentState: { displayName: 'Test Service' },
  };

  const mockTenant: Tenant = {
    id: 'tenant-1',
    currentState: { title: 'Test Tenant' },
  };

  describe('when services are loading', () => {
    it('should not redirect while services are loading', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: false,
        services: undefined,
        setSelectedService: vi.fn(),
        isLoading: true,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: true,
          isSuccess: false,
          isPending: true,
          status: 'pending',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
    });
  });

  describe('when no services exist', () => {
    it('should redirect to onboarding when no services exist', async () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.onboarding, {
          replace: true,
        });
      });

      expect(result.current.hasNoServices).toBe(true);
    });

    it('should redirect to onboarding when services is undefined', async () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: undefined,
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.onboarding, {
          replace: true,
        });
      });
    });
  });

  describe('when services exist but no tenants', () => {
    it('should redirect to tenants onboarding when no tenants exist', async () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: true,
        services: [mockService],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: [],
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.tenantsOnboarding, {
          replace: true,
        });
      });

      expect(result.current.hasNoServices).toBe(false);
      expect(result.current.hasNoTenants).toBe(true);
    });

    it('should redirect to tenants onboarding when tenants is undefined', async () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: true,
        services: [mockService],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.tenantsOnboarding, {
          replace: true,
        });
      });
    });
  });

  describe('when services and tenants exist', () => {
    it('should redirect to tenants listing when both services and tenants exist', async () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: true,
        services: [mockService],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: [mockTenant],
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.tenants, {
          replace: true,
        });
      });

      expect(result.current.hasNoServices).toBe(false);
      expect(result.current.hasNoTenants).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle when tenants query is not successful but services are', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: true,
        services: [mockService],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isSuccess: false,
          isPending: false,
          error: new Error('Failed to fetch'),
          isError: true,
          status: 'error',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.hasNoTenants).toBe(false);
      expect(result.current.hasNoServices).toBe(false);
    });

    it('should handle when services query is not successful but tenants are', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: 'service-1',
        isSuccess: false,
        services: undefined,
        setSelectedService: vi.fn(),
        isLoading: false,
        error: new Error('Failed to fetch services'),
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: [mockTenant],
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      const { result } = renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.hasNoTenants).toBe(false);
      expect(result.current.hasNoServices).toBe(false);
    });

    it('should call useTenants with selectedService', () => {
      // Arrange
      const selectedService = 'test-service-123';
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService,
        isSuccess: true,
        services: [mockService],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: [mockTenant],
          isLoading: false,
          isSuccess: true,
          isPending: false,
          status: 'success',
        }),
      );

      // Act
      renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockUseTenants).toHaveBeenCalledWith(selectedService);
    });

    it('should call useTenants with empty string when selectedService is undefined', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      mockUseTenants.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isSuccess: false,
          isPending: false,
          status: undefined,
        }),
      );

      // Act
      renderHook(() => useTenantsRedirect(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockUseTenants).toHaveBeenCalledWith('');
    });
  });
});
