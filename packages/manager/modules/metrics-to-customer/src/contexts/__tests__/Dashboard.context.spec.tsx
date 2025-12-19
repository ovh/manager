import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { defaultTimeRangeOptions } from '@/components/timeControls/TimeRangeOption.constants';
import {
  DashboardProvider,
  DashboardState,
  useDashboardContext,
} from '@/contexts';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';

// Test wrapper for React Query
const createWrapper = (context?: Partial<DashboardState>) => {
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
      <DashboardProvider context={context}>{children}</DashboardProvider>
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Test component to test the context
const TestComponent = () => {
  const context = useDashboardContext();
  const { state, setState } = context;

  return (
    <div>
      <span data-testid="resource-name">{state.resourceName || 'none'}</span>
      <span data-testid="product-type">{state.productType || 'none'}</span>
      <span data-testid="is-loading">{state.isLoading || 'none'}</span>
      <span data-testid="refresh-interval">{state.refreshInterval}</span>
      <span data-testid="selected-time-option">{state.selectedTimeOption.value}</span>
      <button
        data-testid="update-state"
        onClick={() =>
          setState((prev) => ({
            ...prev,
            resourceName: 'updated-resource',
            refreshInterval: 30,
          }))
        }
      >
        Update State
      </button>
    </div>
  );
};

describe('DashboardContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DashboardProvider', () => {
    it('should provide initial context values with defaults', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'test-resource',
        productType: 'test-product',
      };

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(contextConfig),
      });

      // Assert
      expect(getByTestId('resource-name')).toHaveTextContent('test-resource');
      expect(getByTestId('product-type')).toHaveTextContent('test-product');
      expect(getByTestId('is-loading')).toHaveTextContent('none');
      expect(getByTestId('refresh-interval')).toHaveTextContent('15');
      expect(getByTestId('selected-time-option')).toHaveTextContent(
        defaultTimeRangeOptions[0]?.value ?? '',
      );
    });

    it('should provide custom initial values', () => {
      // Arrange
      const customTimeOption: TimeRangeOption = {
        value: '12h',
        rangeInSeconds: 12 * 60 * 60,
      };
      const contextConfig = {
        resourceName: 'custom-resource',
        productType: 'custom-product',
        isLoading: 'loading-state',
        refreshInterval: 30,
        selectedTimeOption: customTimeOption,
        startDateTime: 1000000,
        endDateTime: 2000000,
      };

      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(contextConfig),
      });

      // Assert
      expect(getByTestId('resource-name')).toHaveTextContent('custom-resource');
      expect(getByTestId('product-type')).toHaveTextContent('custom-product');
      expect(getByTestId('is-loading')).toHaveTextContent('loading-state');
      expect(getByTestId('refresh-interval')).toHaveTextContent('30');
      expect(getByTestId('selected-time-option')).toHaveTextContent('12h');
    });

    it('should handle empty context config', () => {
      // Act
      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getByTestId('resource-name')).toHaveTextContent('none');
      expect(getByTestId('product-type')).toHaveTextContent('none');
      expect(getByTestId('refresh-interval')).toHaveTextContent('15');
    });

    it('should allow updating state through setState', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'initial-resource',
        productType: 'initial-product',
      };

      const { getByTestId } = render(<TestComponent />, {
        wrapper: createWrapper(contextConfig),
      });

      // Assert initial state
      expect(getByTestId('resource-name')).toHaveTextContent('initial-resource');
      expect(getByTestId('refresh-interval')).toHaveTextContent('15');

      // Act
      act(() => {
        getByTestId('update-state').click();
      });

      // Assert updated state
      expect(getByTestId('resource-name')).toHaveTextContent('updated-resource');
      expect(getByTestId('refresh-interval')).toHaveTextContent('30');
    });

    it('should handle partial state updates', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'test-resource',
        productType: 'test-product',
      };

      const TestPartialUpdateComponent = () => {
        const { state, setState } = useDashboardContext();
        return (
          <div>
            <span data-testid="current-refresh">{state.refreshInterval}</span>
            <button
              data-testid="partial-update"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  refreshInterval: 60,
                }))
              }
            >
              Partial Update
            </button>
          </div>
        );
      };

      const { getByTestId } = render(<TestPartialUpdateComponent />, {
        wrapper: createWrapper(contextConfig),
      });

      // Assert initial state
      expect(getByTestId('current-refresh')).toHaveTextContent('15');

      // Act
      act(() => {
        getByTestId('partial-update').click();
      });

      // Assert
      expect(getByTestId('current-refresh')).toHaveTextContent('60');
    });
  });

  describe('useDashboardContext', () => {
    it('should throw error when used outside provider', () => {
      // Arrange
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      expect(() => {
        renderHook(() => useDashboardContext());
      }).toThrow('useDashboard must be used within a DashboardProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'hook-test-resource',
        productType: 'hook-test-product',
      };

      // Act
      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(contextConfig),
      });

      // Assert
      expect(result.current).toBeDefined();
      expect(result.current.state).toBeDefined();
      expect(result.current.setState).toBeDefined();
      expect(result.current.state.resourceName).toBe('hook-test-resource');
      expect(result.current.state.productType).toBe('hook-test-product');
      expect(result.current.state.refreshInterval).toBe(15);
      expect(typeof result.current.setState).toBe('function');
    });

    it('should allow updating state through context hook', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'initial-resource',
        productType: 'initial-product',
      };

      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(contextConfig),
      });

      // Assert initial state
      expect(result.current.state.resourceName).toBe('initial-resource');

      // Act
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          resourceName: 'updated-via-hook',
        }));
      });

      // Assert
      expect(result.current.state.resourceName).toBe('updated-via-hook');
    });

    it('should preserve other state values when updating', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'preserve-resource',
        productType: 'preserve-product',
        refreshInterval: 45,
      };

      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(contextConfig),
      });

      // Assert initial state
      expect(result.current.state.resourceName).toBe('preserve-resource');
      expect(result.current.state.productType).toBe('preserve-product');
      expect(result.current.state.refreshInterval).toBe(45);

      // Act
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          resourceName: 'new-resource',
        }));
      });

      // Assert - other values should be preserved
      expect(result.current.state.resourceName).toBe('new-resource');
      expect(result.current.state.productType).toBe('preserve-product');
      expect(result.current.state.refreshInterval).toBe(45);
    });

    it('should handle multiple state updates', () => {
      // Arrange
      const contextConfig = {
        resourceName: 'multi-resource',
        productType: 'multi-product',
      };

      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(contextConfig),
      });

      // Act - First update
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          resourceName: 'first-update',
        }));
      });

      expect(result.current.state.resourceName).toBe('first-update');

      // Act - Second update
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          resourceName: 'second-update',
          refreshInterval: 60,
        }));
      });

      // Assert
      expect(result.current.state.resourceName).toBe('second-update');
      expect(result.current.state.refreshInterval).toBe(60);
    });
  });

  describe('Default Values', () => {
    it('should use default refreshInterval when not provided', () => {
      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state.refreshInterval).toBe(15);
    });

    it('should use default selectedTimeOption when not provided', () => {
      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state.selectedTimeOption).toEqual(defaultTimeRangeOptions[0]!);
    });

    it('should allow undefined values for optional fields', () => {
      const contextConfig = {
        resourceName: undefined,
        productType: undefined,
        isLoading: undefined,
        startDateTime: undefined,
        endDateTime: undefined,
      };

      const { result } = renderHook(() => useDashboardContext(), {
        wrapper: createWrapper(contextConfig),
      });

      expect(result.current.state.resourceName).toBeUndefined();
      expect(result.current.state.productType).toBeUndefined();
      expect(result.current.state.isLoading).toBeUndefined();
      expect(result.current.state.startDateTime).toBeDefined();
      expect(result.current.state.endDateTime).toBeDefined();
    });
  });
});
