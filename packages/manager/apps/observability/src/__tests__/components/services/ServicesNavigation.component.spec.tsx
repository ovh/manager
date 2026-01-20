import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ServicesNavigation from '@/components/services/navigation/ServicesNavigation.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';
import { ObservabilityService } from '@/types/observability.type';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/components/services/dropdown/ServicesDropDown.component', () => ({
  default: ({ onChange }: { onChange: () => void }) => (
    <button type="button" data-testid="services-dropdown" onClick={onChange}>
      ServicesDropDown
    </button>
  ),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  RedirectionGuard: ({
    children,
    condition,
    isLoading,
    route,
  }: {
    children: React.ReactNode;
    condition: boolean;
    isLoading: boolean;
    route: string;
  }) => (
    <div
      data-testid="redirection-guard"
      data-condition={condition}
      data-is-loading={isLoading}
      data-route={route}
    >
      {children}
    </div>
  ),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

// Mock services data
const mockServices: ObservabilityService[] = [
  {
    id: 'service-1',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service One' },
    resourceStatus: 'READY',
  },
  {
    id: 'service-2',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service Two' },
    resourceStatus: 'READY',
  },
];

describe('ServicesNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RedirectionGuard Configuration', () => {
    it('should render RedirectionGuard with correct props when services are available', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        services: mockServices,
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: true,
        error: null,
      });

      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const guard = screen.getByTestId('redirection-guard');
      expect(guard).toHaveAttribute('data-condition', 'false');
      expect(guard).toHaveAttribute('data-is-loading', 'false');
      expect(guard).toHaveAttribute('data-route', urls.onboarding);
    });

    it('should set condition to true when services is undefined', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        services: undefined,
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: false,
        error: null,
      });

      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const guard = screen.getByTestId('redirection-guard');
      expect(guard).toHaveAttribute('data-condition', 'true');
    });

    it('should set condition to true when services array is empty', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        services: [],
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: true,
        error: null,
      });

      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const guard = screen.getByTestId('redirection-guard');
      expect(guard).toHaveAttribute('data-condition', 'true');
    });

    it('should pass isLoading state to RedirectionGuard', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        services: undefined,
        isLoading: true,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: false,
        error: null,
      });

      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const guard = screen.getByTestId('redirection-guard');
      expect(guard).toHaveAttribute('data-is-loading', 'true');
    });
  });

  describe('Layout Structure', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        services: mockServices,
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: true,
        error: null,
      });
    });

    it('should render ServicesDropDown component', () => {
      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('services-dropdown')).toBeInTheDocument();
    });

    it('should render Outlet for child routes', () => {
      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render button when provided', () => {
      // Arrange
      const TestButton = () => <button data-testid="test-button">Test Button</button>;

      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} button={<TestButton />} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('should not render button container when button is not provided', () => {
      // Act
      const { container } = render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(container.querySelector('.whitespace-nowrap')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        services: mockServices,
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: true,
        error: null,
      });
    });

    it('should navigate to rootUrl when service dropdown changes', () => {
      // Act
      render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      const dropdown = screen.getByTestId('services-dropdown');
      fireEvent.click(dropdown);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(urls.tenants);
    });

    it('should use the provided rootUrl for navigation', () => {
      // Arrange
      const customRootUrl = '/custom/root/url';

      // Act
      render(<ServicesNavigation rootUrl={customRootUrl} />, {
        wrapper: createWrapper(),
      });

      const dropdown = screen.getByTestId('services-dropdown');
      fireEvent.click(dropdown);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(customRootUrl);
    });
  });

  describe('CSS Classes', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        services: mockServices,
        isLoading: false,
        selectedService: undefined,
        setSelectedService: vi.fn(),
        isSuccess: true,
        error: null,
      });
    });

    it('should apply correct CSS classes to the container', () => {
      // Act
      const { container } = render(<ServicesNavigation rootUrl={urls.tenants} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const flexContainer = container.querySelector('.mb-6.flex.items-center.justify-end');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should apply whitespace-nowrap class to button container', () => {
      // Arrange
      const TestButton = () => <button>Test Button</button>;

      // Act
      const { container } = render(
        <ServicesNavigation rootUrl={urls.tenants} button={<TestButton />} />,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      const buttonContainer = container.querySelector('.whitespace-nowrap');
      expect(buttonContainer).toBeInTheDocument();
    });
  });
});
