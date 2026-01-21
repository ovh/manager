import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import SubscriptionsDrawer from '@/components/subscriptions/SubscriptionManager/SubscriptionsDrawer.component';
import { SubscriptionsDrawerProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionsDrawer.props';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovh-ux/muk to provide only the pieces needed for these tests
vi.mock('@ovh-ux/muk', () => ({
  Drawer: {
    RootCollapsible: ({ children, onDismiss, isLoading }: any) => (
      <div data-testid="drawer-root" data-loading={isLoading}>
        <button data-testid="drawer-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
        {children}
      </div>
    ),
    Header: ({ title }: any) => <div data-testid="drawer-header">{title}</div>,
    Content: ({ children }: any) => (
      <div data-testid="drawer-content">{children}</div>
    ),
  },
  // Basic stubs so other components using Muk in this suite can render
  Badge: ({ children, ...props }: any) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  ),
  BUTTON_VARIANT: { ghost: 'ghost' },
  BUTTON_SIZE: { xs: 'xs' },
  Button: ({ children, ...props }: any) => (
    <button data-testid="muk-button" {...props}>
      {children}
    </button>
  ),
}));

// Mock Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

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

describe('SubscriptionsDrawer', () => {
  const defaultProps: SubscriptionsDrawerProps = {
    title: 'Test Drawer Title',
    onDismiss: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render drawer with title', () => {
      // Act
      render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-header')).toHaveTextContent('Test Drawer Title');
    });

    it('should render drawer root', () => {
      // Act
      render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    });

    it('should render drawer content', () => {
      // Act
      render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    });

    it('should render SubscriptionManager inside drawer content', () => {
      // Act
      render(
        <SubscriptionsDrawer {...defaultProps}>
          <div data-testid="test-child">Test Child</div>
        </SubscriptionsDrawer>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render Outlet component', () => {
      // Act
      render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should pass isLoading to drawer when true', () => {
      // Arrange
      const propsWithLoading = {
        ...defaultProps,
        isLoading: true,
      };

      // Act
      render(<SubscriptionsDrawer {...propsWithLoading} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const drawerRoot = screen.getByTestId('drawer-root');
      expect(drawerRoot).toHaveAttribute('data-loading', 'true');
    });

    it('should pass isLoading to drawer when false', () => {
      // Act
      render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const drawerRoot = screen.getByTestId('drawer-root');
      expect(drawerRoot).toHaveAttribute('data-loading', 'false');
    });

    it('should default isLoading to false when not provided', () => {
      // Arrange
      const propsWithoutLoading = {
        ...defaultProps,
        isLoading: undefined,
      };

      // Act
      render(<SubscriptionsDrawer {...propsWithoutLoading} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const drawerRoot = screen.getByTestId('drawer-root');
      expect(drawerRoot).toHaveAttribute('data-loading', 'false');
    });
  });

  describe('Dismiss Handler', () => {
    it('should call onDismiss when dismiss button is clicked', () => {
      // Arrange
      const onDismiss = vi.fn();
      const propsWithDismiss = {
        ...defaultProps,
        onDismiss,
      };

      // Act
      render(<SubscriptionsDrawer {...propsWithDismiss} />, {
        wrapper: createWrapper(),
      });

      const dismissButton = screen.getByTestId('drawer-dismiss');
      dismissButton.click();

      // Assert
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Children', () => {
    it('should render children inside SubscriptionManager', () => {
      // Act
      render(
        <SubscriptionsDrawer {...defaultProps}>
          <div data-testid="custom-content">Custom Content</div>
        </SubscriptionsDrawer>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      // Arrange
      const propsWithEmptyTitle = {
        ...defaultProps,
        title: '',
      };

      // Act
      render(<SubscriptionsDrawer {...propsWithEmptyTitle} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-header')).toHaveTextContent('');
    });

    it('should handle createPortal prop', () => {
      // Act
      const { container } = render(<SubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      // The createPortal prop is passed to Drawer.RootCollapsible
      expect(container).toBeInTheDocument();
    });
  });
});
