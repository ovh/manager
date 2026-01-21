import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import SubscriptionManager from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.component';
import { SubscriptionManagerProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.props';

// Mock @ovh-ux/manager-react-shell-client
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({}),
  useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  PageType: {},
  useRouteSynchro: () => ({}),
}));

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
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  BUTTON_VARIANT: { ghost: 'ghost' },
  BUTTON_SIZE: { xs: 'xs' },
}));

// Mock duration utils
vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: (duration: string) => duration,
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TEXT_PRESET: { label: 'label', paragraph: 'paragraph', small: 'small' },
  Divider: ({ ...props }: any) => <hr {...props} />,
  Input: ({ ...props }: any) => <input {...props} />,
  INPUT_TYPE: { search: 'search' },
  Badge: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  BADGE_COLOR: { information: 'information' },
  Icon: ({ ...props }: any) => <span {...props} />,
  ICON_NAME: { circleInfo: 'circleInfo' },
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CARD_COLOR: { primary: 'primary', neutral: 'neutral' },
}));

// Mock SubscriptionCard
vi.mock('@/components/subscriptions/SubscriptionManager/SubscriptionCard.component', () => ({
  default: ({ title, subTitle }: any) => (
    <div data-testid="subscription-card">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-subtitle">{subTitle}</div>
    </div>
  ),
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

// Mock data inspired by dataset structure
interface MockDataItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  resourceStatus: 'READY';
  iam: {
    id: string;
    tags: Record<string, string>;
    urn: string;
  };
  currentState: {
    title: string;
    description: string;
    limits?: {
      mimir: {
        compactor_blocks_retention_period: string;
        max_global_series_per_user: number;
      };
    };
    infrastructure?: {
      id: string;
      location: string;
      entryPoint: string;
      type: string;
    };
  };
  subscriptions: unknown[];
}

const mockData: MockDataItem[] = [
  {
    id: '1',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    resourceStatus: 'READY',
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
      tags: {
        'ovh:ldp:cluster:name': 'sbg159',
        Application: 'Website',
        Compliance: 'PCI-DSS',
        Departement: 'ITOperations',
        Environment: 'Prod',
        Location: 'Europe',
        Owner: 'JohnDoe',
        Project: 'CustomerPortal',
        Region: 'EUR-East',
        Risk: 'Low',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
    },
    currentState: {
      title: 'Tenant 1',
      description: 'Tenant 1 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 300,
        },
      },
      infrastructure: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        location: 'eu-west-sbg',
        entryPoint: 'sbg1.metrics.ovh.com',
        type: 'SHARED',
      },
    },
    subscriptions: [],
  },
  {
    id: '2',
    createdAt: '2025-11-20T14:26:14.041Z',
    updatedAt: '2025-11-20T14:26:14.041Z',
    resourceStatus: 'READY',
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa32',
      tags: {
        'ovh:ldp:cluster:name': 'gra159',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078',
    },
    currentState: {
      title: 'Tenant 2',
      description: 'Tenant 2 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '90d',
          max_global_series_per_user: 50,
        },
      },
      infrastructure: {
        id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
        entryPoint: 'gra1.metrics.ovh.com',
        location: 'eu-west-gra',
        type: 'SHARED',
      },
    },
    subscriptions: [],
  },
];

describe('SubscriptionManager', () => {
  const defaultProps: SubscriptionManagerProps<MockDataItem, unknown> = {
    resourceName: 'test-resource',
    data: mockData,
    isSuccess: true,
    isFiltersReady: true,
    subscriptionUrls: {
      subscribeUrl: 'https://api.example.com/subscribe',
      unsubscribeUrl: 'https://api.example.com/unsubscribe',
    },
    onCreateSubscription: vi.fn(),
    onDeleteSubscription: vi.fn(),
    isCreatingSubscription: false,
    isDeletingSubscription: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps}>
          <div data-testid="test-child">Test Child</div>
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render search input when withSearch is true', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
            withSearch={true}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should not show data when isFiltersReady is false', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps} isFiltersReady={false}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-card')).not.toBeInTheDocument();
    });

    it('should not show data when isSuccess is false', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps} isSuccess={false}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-card')).not.toBeInTheDocument();
    });

    it('should render data items when data is available', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      const cardTitles = screen.getAllByTestId('card-title');
      expect(cardTitles[0]).toHaveTextContent('Tenant 1');
      const cardSubtitles = screen.getAllByTestId('card-subtitle');
      expect(cardSubtitles[0]).toHaveTextContent('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps} data={undefined}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-card')).not.toBeInTheDocument();
    });

    it('should handle empty data array', () => {
      // Act
      render(
        <SubscriptionManager {...defaultProps} data={[]}>
          <SubscriptionManager.List
            titleFn={(item) => item.currentState.title}
            subtitleFn={(item) => item.id}
            idFn={(item) => item.id}
          />
        </SubscriptionManager>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-card')).not.toBeInTheDocument();
    });
  });
});
