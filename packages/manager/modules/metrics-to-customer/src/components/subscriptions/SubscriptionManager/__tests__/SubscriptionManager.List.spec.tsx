import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { SubscriptionManagerList } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.List';
import { SubscriptionManagerProvider, useSubscriptionManagerContext } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.context';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock SubscriptionCard
vi.mock('@/components/subscriptions/SubscriptionManager/SubscriptionCard.component', () => ({
  default: ({ title, subTitle, itemId, subscription, onCreate, onDelete, resourceName, subscriptionUrls }: any) => (
    <div data-testid={`subscription-card-${itemId}`}>
      <div data-testid={`card-title-${itemId}`}>{title}</div>
      <div data-testid={`card-subtitle-${itemId}`}>{subTitle}</div>
      {subscription && <div data-testid={`card-subscription-${itemId}`}>Subscribed</div>}
      <button
        data-testid={`card-create-${itemId}`}
        onClick={() => onCreate?.({ subscribeUrl: subscriptionUrls?.subscribeUrl, itemId, resourceName })}
      >
        Create
      </button>
      <button
        data-testid={`card-delete-${itemId}`}
        onClick={() => onDelete?.({ subscription, itemId, resourceName })}
      >
        Delete
      </button>
    </div>
  ),
}));

// Mock SubscriptionManagerSearch
vi.mock('@/components/subscriptions/SubscriptionManager/SubscriptionManager.Search', () => ({
  SubscriptionManagerSearch: () => <div data-testid="subscription-manager-search">Search Input</div>,
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

// Mock data
interface MockDataItem {
  id: string;
  currentState: {
    title: string;
    description: string;
  };
  subscriptions: unknown[];
}

const mockData: MockDataItem[] = [
  {
    id: '1',
    currentState: {
      title: 'Tenant 1',
      description: 'Tenant 1 description',
    },
    subscriptions: [],
  },
  {
    id: '2',
    currentState: {
      title: 'Tenant 2',
      description: 'Tenant 2 description',
    },
    subscriptions: [],
  },
  {
    id: '3',
    currentState: {
      title: 'Alpha Tenant',
      description: 'Alpha description',
    },
    subscriptions: [],
  },
];

const mockContextValue = {
  resourceName: 'test-resource',
  filterValues: { serviceId: 'service-1' },
  isFiltersReady: true,
  searchQuery: '',
  setSearchQuery: vi.fn(),
  data: mockData,
  isSuccess: true,
  filteredData: mockData,
  hasActiveFilters: true,
  hasApiData: true,
  hasFilteredData: true,
  shouldShowData: true,
  subscriptionUrls: {
    subscribeUrl: 'https://api.example.com/subscribe',
    unsubscribeUrl: 'https://api.example.com/unsubscribe',
  },
  onCreateSubscription: vi.fn(),
  onDeleteSubscription: vi.fn(),
  isCreatingSubscription: false,
  isDeletingSubscription: false,
  handleFilterChange: vi.fn(),
  setTitleSubtitleFns: vi.fn(),
};

describe('SubscriptionManagerList', () => {
  const defaultProps = {
    title: (item: MockDataItem) => item.currentState.title,
    subtitle: (item: MockDataItem) => item.id,
    id: (item: MockDataItem) => item.id,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render list items when data is available and ready', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-card-2')).toBeInTheDocument();
      expect(screen.getByText('Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Tenant 2')).toBeInTheDocument();
    });

    it('should not render when isFiltersReady is false', () => {
      // Act
      const { container } = render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={false}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(container.querySelector('[data-testid^="subscription-card"]')).not.toBeInTheDocument();
    });

    it('should not render when data is empty', () => {
      // Act
      const { container } = render(
        <SubscriptionManagerProvider
          data={[]}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(container.querySelector('[data-testid^="subscription-card"]')).not.toBeInTheDocument();
    });

    it('should render subscription status when subscription exists', () => {
      // Arrange
      const dataWithSubscription = [
        {
          ...mockData[0]!,
          subscription: { id: 'sub-1' },
        },
      ];

      // Act
      render(
        <SubscriptionManagerProvider
          data={dataWithSubscription as any}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
            subscriptionFn={(item: any) => item.subscription}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('card-subscription-1')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter items by search query', async () => {
      // Arrange
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        React.useEffect(() => {
          setSearchQuery('Alpha');
        }, [setSearchQuery]);
        return null;
      }

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <TestComponent />
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Alpha Tenant')).toBeInTheDocument();
        expect(screen.queryByText('Tenant 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Tenant 2')).not.toBeInTheDocument();
      });
    });

    it('should show all items when search query is empty', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByText('Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Tenant 2')).toBeInTheDocument();
      expect(screen.getByText('Alpha Tenant')).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      // Arrange
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        React.useEffect(() => {
          setSearchQuery('NonExistent');
        }, [setSearchQuery]);
        return null;
      }

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <TestComponent />
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('tenants_drawer.no_results_found')).toBeInTheDocument();
      });
    });

    it('should filter by subtitle as well', async () => {
      // Arrange
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        React.useEffect(() => {
          setSearchQuery('1');
        }, [setSearchQuery]);
        return null;
      }

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <TestComponent />
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Tenant 1')).toBeInTheDocument();
        expect(screen.queryByText('Tenant 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Item Keys', () => {
    it('should use id function as key', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-card-2')).toBeInTheDocument();
    });
  });

  describe('Subscription Actions', () => {
    it('should call onCreateSubscription when create button is clicked', () => {
      // Arrange
      const onCreateSubscription = vi.fn();

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
          subscriptionUrls={{
            subscribeUrl: 'https://api.example.com/subscribe',
            unsubscribeUrl: 'https://api.example.com/unsubscribe',
          }}
          onCreateSubscription={onCreateSubscription}
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      const createButton = screen.getByTestId('card-create-1');
      createButton.click();

      // Assert
      expect(onCreateSubscription).toHaveBeenCalledWith({
        subscribeUrl: 'https://api.example.com/subscribe',
        itemId: '1',
        resourceName: 'test-resource',
      });
    });

    it('should call onDeleteSubscription when delete button is clicked', () => {
      // Arrange
      const onDeleteSubscription = vi.fn();
      const subscription = { id: 'sub-1' };
      const dataWithSubscription = [
        {
          ...mockData[0]!,
          subscription,
        },
      ];

      // Act
      render(
        <SubscriptionManagerProvider
          data={dataWithSubscription as any}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
          onDeleteSubscription={onDeleteSubscription}
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
            subscriptionFn={(item: any) => item.subscription}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      const deleteButton = screen.getByTestId('card-delete-1');
      deleteButton.click();

      // Assert
      expect(onDeleteSubscription).toHaveBeenCalledWith({
        subscription,
        itemId: '1',
        resourceName: 'test-resource',
      });
    });

    it('should pass isCreatingSubscription and isDeletingSubscription to cards', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
          isCreatingSubscription={true}
          isDeletingSubscription={false}
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert - Cards should be rendered (the actual loading state is handled by SubscriptionCard)
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
    });
  });

  describe('withSearch Prop', () => {
    it('should render search component when withSearch is true', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
            withSearch={true}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.getByTestId('subscription-manager-search')).toBeInTheDocument();
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
    });

    it('should not render search component when withSearch is false', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
            withSearch={false}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-manager-search')).not.toBeInTheDocument();
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
    });

    it('should not render search component when withSearch is not provided (defaults to false)', () => {
      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(screen.queryByTestId('subscription-manager-search')).not.toBeInTheDocument();
      expect(screen.getByTestId('subscription-card-1')).toBeInTheDocument();
    });

    it('should render search component above list items when withSearch is true', () => {
      // Act
      const { container } = render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
            withSearch={true}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      const searchComponent = screen.getByTestId('subscription-manager-search');
      const listContainer = container.querySelector('.flex.flex-col.gap-4');
      
      expect(searchComponent).toBeInTheDocument();
      expect(listContainer).toBeInTheDocument();
      // Search should be rendered before the list items
      expect(listContainer?.contains(searchComponent)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', () => {
      // Act
      const { container } = render(
        <SubscriptionManagerProvider
          data={undefined}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      expect(container.querySelector('[data-testid^="subscription-card"]')).not.toBeInTheDocument();
    });

    it('should handle empty search query with whitespace', async () => {
      // Arrange
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        React.useEffect(() => {
          setSearchQuery('   ');
        }, [setSearchQuery]);
        return null;
      }

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <TestComponent />
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert - Should show all items (whitespace is trimmed)
      await waitFor(() => {
        expect(screen.getByText('Tenant 1')).toBeInTheDocument();
        expect(screen.getByText('Tenant 2')).toBeInTheDocument();
      });
    });

    it('should handle case-insensitive search', async () => {
      // Arrange
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        React.useEffect(() => {
          setSearchQuery('alpha');
        }, [setSearchQuery]);
        return null;
      }

      // Act
      render(
        <SubscriptionManagerProvider
          data={mockData}
          isSuccess={true}
          isFiltersReady={true}
          resourceName="test-resource"
        >
          <TestComponent />
          <SubscriptionManagerList
            titleFn={defaultProps.title}
            subtitleFn={defaultProps.subtitle}
            idFn={defaultProps.id}
          />
        </SubscriptionManagerProvider>,
        {
          wrapper: createWrapper(),
        },
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Alpha Tenant')).toBeInTheDocument();
      });
    });
  });
});

