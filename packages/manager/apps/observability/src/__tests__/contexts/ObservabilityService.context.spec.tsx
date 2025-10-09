import React from 'react';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { act, render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import {
  ObservabilityServiceProvider,
  useObservabilityServiceContext,
} from '../../contexts/ObservabilityService.context';
import { useObservabilityServices } from '../../data/hooks/services/useObservabilityServices';
import { ObservabilityService } from '../../types/observability.type';

// Mock the useObservabilityServices hook
vi.mock('@/data/hooks/services/useObservabilityServices', () => ({
  useObservabilityServices: vi.fn(),
}));

const mockUseObservabilityServices = vi.mocked(useObservabilityServices);

// Helper function to create complete mock return value
const createMockQueryResult = (
  overrides: Partial<UseQueryResult<ObservabilityService[], Error>> = {},
) =>
  ({
    data: undefined,
    isLoading: false,
    isSuccess: false,
    error: null,
    isError: false,
    isPending: false,
    isRefetching: false,
    refetch: vi.fn(),
    status: 'idle',
    fetchStatus: 'idle',
    isLoadingError: false,
    isRefetchError: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isStale: false,
    ...overrides,
  }) as UseQueryResult<ObservabilityService[], Error>;

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
    <QueryClientProvider client={queryClient}>
      <ObservabilityServiceProvider>{children}</ObservabilityServiceProvider>
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Test component to test the context
// eslint-disable-next-line react/no-multi-comp
const TestComponent = () => {
  const context = useObservabilityServiceContext();
  return (
    <div>
      <span data-testid="selected-service">{context.selectedService || 'none'}</span>
      <span data-testid="services-count">{context.services?.length || 0}</span>
      <span data-testid="is-loading">{context.isLoading.toString()}</span>
      <span data-testid="is-success">{context.isSuccess.toString()}</span>
      <span data-testid="error">{context.error?.message || 'none'}</span>
      <button
        data-testid="set-service"
        onClick={() => context.setSelectedService('test-service-id')}
      >
        Set Service
      </button>
    </div>
  );
};

describe('ObservabilityServiceContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ObservabilityServiceProvider', () => {
    it('should provide initial context values', () => {
      // Arrange
      const mockServices: ObservabilityService[] = [
        { id: 'service-1', currentState: { displayName: 'Service 1' } },
        { id: 'service-2', currentState: { displayName: 'Service 2' } },
      ];

      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: mockServices,
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getByTestId('selected-service')).toHaveTextContent('none');
      expect(getByTestId('services-count')).toHaveTextContent('2');
      expect(getByTestId('is-loading')).toHaveTextContent('false');
      expect(getByTestId('is-success')).toHaveTextContent('true');
      expect(getByTestId('error')).toHaveTextContent('none');
    });

    it('should handle loading state', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
          isPending: true,
          status: 'pending',
        }),
      );

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getByTestId('is-loading')).toHaveTextContent('true');
      expect(getByTestId('is-success')).toHaveTextContent('false');
      expect(getByTestId('services-count')).toHaveTextContent('0');
    });

    it('should handle error state', () => {
      // Arrange
      const mockError = new Error('Failed to fetch services');
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          error: mockError,
          isError: true,
          status: 'error',
        }),
      );

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getByTestId('error')).toHaveTextContent('Failed to fetch services');
      expect(getByTestId('is-loading')).toHaveTextContent('false');
      expect(getByTestId('is-success')).toHaveTextContent('false');
    });

    it('should update selected service when setSelectedService is called', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: [],
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Act
      act(() => {
        getByTestId('set-service').click();
      });

      // Assert
      expect(getByTestId('selected-service')).toHaveTextContent('test-service-id');
    });

    it('should handle empty services array', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: [],
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getByTestId('services-count')).toHaveTextContent('0');
      expect(getByTestId('is-success')).toHaveTextContent('true');
    });

    it('should memoize context value correctly', () => {
      // Arrange
      const mockServices: ObservabilityService[] = [
        { id: 'service-1', currentState: { displayName: 'Service 1' } },
      ];

      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: mockServices,
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      let contextValue1: unknown;
      let contextValue2: unknown;

      // eslint-disable-next-line react/no-multi-comp
      const TestMemoComponent = () => {
        const context = useObservabilityServiceContext();
        if (!contextValue1) {
          contextValue1 = context;
        } else if (!contextValue2) {
          contextValue2 = context;
        }
        return <div>Test</div>;
      };

      // Act - First render
      const { rerender } = render(<TestMemoComponent />, {
        wrapper: createWrapper(),
      });

      // Act - Second render with same data
      rerender(<TestMemoComponent />);

      // Assert - Context value should be memoized (same reference)
      expect(contextValue1).toBe(contextValue2);
    });
  });

  describe('useObservabilityServiceContext', () => {
    it('should throw error when used outside provider', () => {
      // Arrange
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      expect(() => {
        renderHook(() => useObservabilityServiceContext());
      }).toThrow(
        'useObservabilityServiceContext must be used within an ObservabilityServiceProvider',
      );

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      // Arrange
      const mockServices: ObservabilityService[] = [
        { id: 'service-1', currentState: { displayName: 'Service 1' } },
      ];

      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: mockServices,
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      // Act
      const { result } = renderHook(() => useObservabilityServiceContext(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current).toEqual({
        selectedService: undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setSelectedService: expect.any(Function),
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    });

    it('should allow updating selected service through context', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: [],
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      const { result } = renderHook(() => useObservabilityServiceContext(), {
        wrapper: createWrapper(),
      });

      // Act
      act(() => {
        result.current.setSelectedService('new-service-id');
      });

      // Assert
      expect(result.current.selectedService).toBe('new-service-id');
    });

    it('should allow clearing selected service', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: [],
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      const { result } = renderHook(() => useObservabilityServiceContext(), {
        wrapper: createWrapper(),
      });

      // Act - Set a service first
      act(() => {
        result.current.setSelectedService('some-service-id');
      });

      expect(result.current.selectedService).toBe('some-service-id');

      // Act - Clear the service
      act(() => {
        result.current.setSelectedService(undefined);
      });

      // Assert
      expect(result.current.selectedService).toBeUndefined();
    });
  });

  describe('Integration with useObservabilityServices', () => {
    it('should reflect changes in useObservabilityServices hook', () => {
      // Arrange
      const initialServices: ObservabilityService[] = [
        { id: 'service-1', currentState: { displayName: 'Service 1' } },
      ];

      const updatedServices: ObservabilityService[] = [
        { id: 'service-1', currentState: { displayName: 'Service 1' } },
        { id: 'service-2', currentState: { displayName: 'Service 2' } },
      ];

      // Start with initial services
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: initialServices,
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      const { result, rerender } = renderHook(() => useObservabilityServiceContext(), {
        wrapper: createWrapper(),
      });

      // Assert initial state
      expect(result.current.services).toEqual(initialServices);

      // Act - Update mock to return updated services
      mockUseObservabilityServices.mockReturnValue(
        createMockQueryResult({
          data: updatedServices,
          isSuccess: true,
          status: 'success',
          isFetched: true,
        }),
      );

      rerender();

      // Assert updated state
      expect(result.current.services).toEqual(updatedServices);
    });
  });
});
