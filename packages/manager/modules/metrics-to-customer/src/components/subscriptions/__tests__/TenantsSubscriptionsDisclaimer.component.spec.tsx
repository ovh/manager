import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsSubscriptionsDisclaimer from '@/components/subscriptions/TenantsSubscriptionsDisclaimer.component';

// Mock @ovh-ux/manager-react-shell-client
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({}),
  useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  PageType: {},
  useRouteSynchro: () => ({}),
}));

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

describe('TenantsSubscriptionsDisclaimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    const mockText = 'Disclaimer text';

    it('should render the disclaimer message with provided text', () => {
      // Act
      render(<TenantsSubscriptionsDisclaimer text={mockText} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText(mockText)).toBeInTheDocument();
    });

    it('should render with information badge color', () => {
      // Act
      const { container } = render(<TenantsSubscriptionsDisclaimer text={mockText} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const badge = container.querySelector('[class*="Badge"]');
      expect(badge).not.toBeNull();
    });

    it('should render with info icon', () => {
      // Act
      const { container } = render(<TenantsSubscriptionsDisclaimer text={mockText} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const icon = container.querySelector('[class*="Icon"]');
      expect(icon).not.toBeNull();
    });

    it('should have correct styling classes', () => {
      // Act
      const { container } = render(<TenantsSubscriptionsDisclaimer text={mockText} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const badge = container.querySelector('[class*="Badge"]');
      expect(badge).not.toBeNull();
      if (badge) {
        expect(badge).toHaveClass('p-4');
        expect(badge).toHaveClass('flex');
        expect(badge).toHaveClass('justify-start');
        expect(badge).toHaveClass('items-start');
        expect(badge).toHaveClass('gap-4');
      }
    });

    it('should render text with paragraph preset', () => {
      // Act
      const { container } = render(<TenantsSubscriptionsDisclaimer text={mockText} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const text = container.querySelector('[class*="Text"]');
      expect(text).not.toBeNull();
    });
  });

  describe('Component Structure', () => {
    it('should be a functional component', () => {
      // Assert
      expect(typeof TenantsSubscriptionsDisclaimer).toBe('function');
    });
  });
});
