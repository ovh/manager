import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import NoTenantsMessage from '@/components/subscriptions/NoTenantsMessage.component';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovh-ux/muk
vi.mock('@ovh-ux/muk', () => ({
  useDateFnsLocale: () => ({
    code: 'en',
    formatDistance: () => '',
    formatRelative: () => '',
    localize: {} as any,
    formatLong: {} as any,
    match: {} as any,
    options: {} as any,
  }),
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Text: ({ children, preset, ...props }: any) => (
    <div data-preset={preset} {...props}>
      {children}
    </div>
  ),
  TEXT_PRESET: { label: 'label', paragraph: 'paragraph', small: 'small' },
  Link: ({ children, href, className, target, ...props }: any) => (
    <a href={href} className={className} target={target} {...props}>
      {children}
    </a>
  ),
  Icon: ({ name, ...props }: any) => (
    <span data-icon-name={name} {...props}>
      icon
    </span>
  ),
  ICON_NAME: { externalLink: 'externalLink' },
}));

// Mock duration utils
vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: (duration: string) => `formatted-${duration}`,
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
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('NoTenantsMessage', () => {
  const defaultProps = {
    regions: [{ code: 'eu-west-gra', label: 'Gravelines' }],
    defaultRetention: '30d',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with correct test id', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('no-tenants-message')).toBeInTheDocument();
    });

    it('should render the title', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('no_tenants_message.title')).toBeInTheDocument();
    });

    it('should render the description', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('no_tenants_message.description')).toBeInTheDocument();
    });

    it('should render region label for single region', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText(/tenants_regions\.region.*Gravelines/)).toBeInTheDocument();
    });

    it('should render regions label for multiple regions', () => {
      // Arrange
      const props = {
        ...defaultProps,
        regions: [
          { code: 'eu-west-gra', label: 'Gravelines' },
          { code: 'eu-west-sbg', label: 'Strasbourg' },
        ],
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText(/tenants_regions\.region.*Gravelines.*Strasbourg/)).toBeInTheDocument();
    });

    it('should render retention information', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('no_tenants_message.retention')).toBeInTheDocument();
    });

    it('should not render region label when regions array is empty', () => {
      // Arrange
      const props = {
        ...defaultProps,
        regions: [],
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.queryByText(/Region:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Regions:/)).not.toBeInTheDocument();
    });

    it('should format retention using formatObservabilityDuration', () => {
      // Arrange
      const props = {
        ...defaultProps,
        defaultRetention: '90d',
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('no_tenants_message.retention')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render title with label preset', () => {
      // Act
      const { container } = render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const titleText = container.querySelector('[data-preset="label"]');
      expect(titleText).toBeInTheDocument();
      expect(titleText).toHaveTextContent('no_tenants_message.title');
    });

    it('should render description and other texts with paragraph preset', () => {
      // Act
      const { container } = render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const paragraphTexts = container.querySelectorAll('[data-preset="paragraph"]');
      expect(paragraphTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty regions array', () => {
      // Arrange
      const props = {
        ...defaultProps,
        regions: [],
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('no-tenants-message')).toBeInTheDocument();
      expect(screen.getByText('no_tenants_message.title')).toBeInTheDocument();
    });

    it('should handle different retention formats', () => {
      // Arrange
      const props = {
        ...defaultProps,
        defaultRetention: '7d',
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('no_tenants_message.retention')).toBeInTheDocument();
    });
  });
});
