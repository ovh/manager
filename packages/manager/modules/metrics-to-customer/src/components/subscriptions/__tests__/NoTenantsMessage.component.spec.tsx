import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import NoTenantsMessage from '@/components/subscriptions/NoTenantsMessage.component';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        'no_tenants_message.title': 'No Tenants Found',
        'no_tenants_message.description': 'No tenants are available for subscription.',
        'tenants_regions.region_one': 'Region: {{region}}',
        'tenants_regions.region_other': 'Regions: {{region}}',
        'no_tenants_message.retention': 'Default retention: {{retention}}',
      };
      
      // Handle pluralization for tenants_regions.region
      if (key === 'tenants_regions.region' && params?.count !== undefined) {
        const pluralKey = params.count === 1 ? 'tenants_regions.region_one' : 'tenants_regions.region_other';
        let translation = translations[pluralKey] || key;
        if (params) {
          Object.keys(params).forEach((paramKey) => {
            if (paramKey !== 'count') {
              translation = translation.replace(`{{${paramKey}}}`, String(params[paramKey]));
            }
          });
        }
        return translation;
      }
      
      let translation = translations[key] || key;
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(`{{${paramKey}}}`, String(params[paramKey]));
        });
      }
      return translation;
    },
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
}));

// Mock duration utils
vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: (duration: string) => `formatted-${duration}`,
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

describe('NoTenantsMessage', () => {
  const defaultProps = {
    regions: ['EU'],
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
      expect(screen.getByText('No Tenants Found')).toBeInTheDocument();
    });

    it('should render the description', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('No tenants are available for subscription.')).toBeInTheDocument();
    });

    it('should render region label for single region', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('Region: EU')).toBeInTheDocument();
    });

    it('should render regions label for multiple regions', () => {
      // Arrange
      const props = {
        ...defaultProps,
        regions: ['EU', 'US'],
      };

      // Act
      render(<NoTenantsMessage {...props} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('Regions: EU, US')).toBeInTheDocument();
    });

    it('should render retention information', () => {
      // Act
      render(<NoTenantsMessage {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('Default retention: formatted-30d')).toBeInTheDocument();
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
      expect(screen.getByText('Default retention: formatted-90d')).toBeInTheDocument();
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
      expect(titleText).toHaveTextContent('No Tenants Found');
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
      expect(screen.getByText('No Tenants Found')).toBeInTheDocument();
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
      expect(screen.getByText('Default retention: formatted-7d')).toBeInTheDocument();
    });
  });
});
