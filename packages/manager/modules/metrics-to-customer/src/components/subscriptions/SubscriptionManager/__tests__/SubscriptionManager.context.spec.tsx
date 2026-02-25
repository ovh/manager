import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  SubscriptionManagerProvider,
  useSubscriptionManagerContext,
} from '@/contexts/SubscriptionManager.context';

// Test component that uses the context
function TestComponent() {
  const context = useSubscriptionManagerContext();
  return (
    <div>
      <div data-testid="resourceName">{context.resourceName}</div>
      <div data-testid="searchQuery">{context.searchQuery}</div>
      <button
        data-testid="set-search-query"
        onClick={() => context.setSearchQuery('test query')}
      >
        Set Search Query
      </button>
    </div>
  );
}

describe('SubscriptionManagerContext', () => {
  describe('SubscriptionManagerProvider', () => {
    it('should provide default context values', () => {
      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByTestId('resourceName')).toHaveTextContent('');
      expect(screen.getByTestId('searchQuery')).toHaveTextContent('');
    });

    it('should allow setting search query', async () => {
      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      const setSearchButton = screen.getByTestId('set-search-query');
      fireEvent.click(setSearchButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('searchQuery')).toHaveTextContent('test query');
      });
    });


    it('should provide setTitleSubtitleFns function', () => {
      // Arrange
      function TestWithTitleSubtitle() {
        const context = useSubscriptionManagerContext();
        const [titleSet, setTitleSet] = React.useState(false);

        React.useEffect(() => {
          if (context.setTitleSubtitleFns) {
            context.setTitleSubtitleFns(
              (item: any) => item.title,
              (item: any) => item.subtitle,
            );
            setTitleSet(true);
          }
        }, [context.setTitleSubtitleFns]);

        return <div data-testid="title-set">{String(titleSet)}</div>;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestWithTitleSubtitle />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByTestId('title-set')).toHaveTextContent('true');
    });
  });

  describe('useSubscriptionManagerContext', () => {
    it('should throw error when used outside provider', () => {
      // Arrange
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      function ComponentOutsideProvider() {
        try {
          useSubscriptionManagerContext();
          return <div>No Error</div>;
        } catch (error: any) {
          return <div data-testid="error">{error.message}</div>;
        }
      }

      // Act
      render(<ComponentOutsideProvider />);

      // Assert
      expect(screen.getByTestId('error')).toHaveTextContent(
        'SubscriptionManager sub-components must be used within SubscriptionManager',
      );

      consoleError.mockRestore();
    });

    it('should provide context with all required properties', () => {
      // Arrange
      function TestAllProperties() {
        const context = useSubscriptionManagerContext();
        return (
          <div>
            <div data-testid="has-resourceName">{String('resourceName' in context)}</div>
            <div data-testid="has-filterValues">{String('filterValues' in context)}</div>
            <div data-testid="has-isFiltersReady">{String('isFiltersReady' in context)}</div>
            <div data-testid="has-searchQuery">{String('searchQuery' in context)}</div>
            <div data-testid="has-setSearchQuery">{String('setSearchQuery' in context)}</div>
            <div data-testid="has-filteredData">{String('filteredData' in context)}</div>
            <div data-testid="has-hasFilteredData">{String('hasFilteredData' in context)}</div>
            <div data-testid="has-shouldShowData">{String('shouldShowData' in context)}</div>
            <div data-testid="has-subscriptionUrls">{String('subscriptionUrls' in context)}</div>
            <div data-testid="has-onCreateSubscription">{String('onCreateSubscription' in context)}</div>
            <div data-testid="has-onDeleteSubscription">{String('onDeleteSubscription' in context)}</div>
            <div data-testid="has-handleFilterChange">{String('handleFilterChange' in context)}</div>
          </div>
        );
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestAllProperties />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByTestId('has-resourceName')).toHaveTextContent('true');
      expect(screen.getByTestId('has-filterValues')).toHaveTextContent('true');
      expect(screen.getByTestId('has-isFiltersReady')).toHaveTextContent('true');
      expect(screen.getByTestId('has-searchQuery')).toHaveTextContent('true');
      expect(screen.getByTestId('has-setSearchQuery')).toHaveTextContent('true');
      expect(screen.getByTestId('has-filteredData')).toHaveTextContent('true');
      expect(screen.getByTestId('has-hasFilteredData')).toHaveTextContent('true');
      expect(screen.getByTestId('has-shouldShowData')).toHaveTextContent('true');
      expect(screen.getByTestId('has-subscriptionUrls')).toHaveTextContent('true');
      expect(screen.getByTestId('has-onCreateSubscription')).toHaveTextContent('true');
      expect(screen.getByTestId('has-onDeleteSubscription')).toHaveTextContent('true');
      expect(screen.getByTestId('has-handleFilterChange')).toHaveTextContent('true');
    });
  });

  describe('Search Query State', () => {
    it('should initialize with empty search query', () => {
      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByTestId('searchQuery')).toHaveTextContent('');
    });

    it('should update search query when setSearchQuery is called', async () => {
      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      const setSearchButton = screen.getByTestId('set-search-query');
      fireEvent.click(setSearchButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('searchQuery')).toHaveTextContent('test query');
      });
    });
  });

  describe('Title/Subtitle Functions', () => {
    it('should allow setting title and subtitle functions', () => {
      // Arrange
      const titleFn = (item: any) => item.title;
      const subtitleFn = (item: any) => item.subtitle;

      function TestTitleSubtitle() {
        const context = useSubscriptionManagerContext();
        const [called, setCalled] = React.useState(false);

        React.useEffect(() => {
          if (context.setTitleSubtitleFns) {
            context.setTitleSubtitleFns(titleFn, subtitleFn);
            setCalled(true);
          }
        }, [context.setTitleSubtitleFns]);

        return <div data-testid="called">{String(called)}</div>;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestTitleSubtitle />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByTestId('called')).toHaveTextContent('true');
    });
  });
});

