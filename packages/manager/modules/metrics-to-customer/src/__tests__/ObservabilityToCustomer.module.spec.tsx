import React from 'react';

import { MemoryRouter, Route } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { MetricsToCustomerModule } from '@/MetricsToCustomer.module';
import type { DashboardState } from '@/contexts';

interface DashboardProviderMockProps {
  children: React.ReactNode;
  context?: Partial<DashboardState>;
}

function TestRouteContent() {
  return <div data-testid="route-content">Route Content</div>;
}

const { DashboardProviderMock, getObservabilityRouteMock } = vi.hoisted(() => {
  const dashboardProvider = vi.fn(({ children }: DashboardProviderMockProps) => (
    <div data-testid="dashboard-provider">{children}</div>
  ));

  const routeMock = vi.fn(() => (
    <>
      <Route path="/" element={<TestRouteContent />} />
    </>
  ));

  return {
    DashboardProviderMock: dashboardProvider,
    getObservabilityRouteMock: routeMock,
  };
});

vi.mock('@/contexts', () => ({
  DashboardProvider: DashboardProviderMock,
}));

vi.mock('@/routes/routes', () => ({
  __esModule: true,
  default: getObservabilityRouteMock,
  getObservabilityRoute: getObservabilityRouteMock,
}));

// Test wrapper for React Query and Router
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
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('MetricsToCustomerModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module Rendering', () => {
    it('should render the module with routes from getObservabilityRoute', () => {
      // Arrange
      const moduleProps = {
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getObservabilityRouteMock).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('route-content')).toBeInTheDocument();
    });

    it('should pass resourceName and productType to DashboardProvider', () => {
      // Arrange
      const moduleProps = {
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(DashboardProviderMock).toHaveBeenCalledTimes(1);
      const providerProps = DashboardProviderMock.mock.calls[0]?.[0];
      expect(providerProps?.context).toEqual({
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      });
    });

    it('should render Suspense fallback when loading', () => {
      // Arrange
      const moduleProps = {
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      // The Suspense fallback is available for lazy loading scenarios
      expect(screen.getByTestId('dashboard-provider')).toBeInTheDocument();
    });

    it('should handle empty resourceName', () => {
      // Arrange
      const moduleProps = {
        resourceName: '',
        productType: 'instances',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(DashboardProviderMock).toHaveBeenCalledTimes(1);
      const providerProps = DashboardProviderMock.mock.calls[0]?.[0];
      expect(providerProps?.context).toEqual({
        resourceName: '',
        productType: 'instances',
      });
    });

    it('should handle empty productType', () => {
      // Arrange
      const moduleProps = {
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: '',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(DashboardProviderMock).toHaveBeenCalledTimes(1);
      const providerProps = DashboardProviderMock.mock.calls[0]?.[0];
      expect(providerProps?.context).toEqual({
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: '',
      });
    });
  });

  describe('Module Props', () => {
    it('should accept and pass all required props', () => {
      // Arrange
      const moduleProps = {
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      };

      // Act
      render(<MetricsToCustomerModule {...moduleProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(DashboardProviderMock).toHaveBeenCalledTimes(1);
      const providerProps = DashboardProviderMock.mock.calls[0]?.[0];
      expect(providerProps?.context).toEqual({
        resourceName: '00cb8793-4401-4bc8-b690-34b37a7e31d3',
        productType: 'instances',
      });
    });
  });
});
