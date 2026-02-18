import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { SubscriptionManagerSearch } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Search';
import { SubscriptionManagerProvider } from '@/contexts/SubscriptionManager.context';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Input: ({ value, onChange, placeholder, type, ...props }: any) => (
    <input
      data-testid="search-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
  INPUT_TYPE: { search: 'search' },
}));

describe('SubscriptionManagerSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert - Search component should always render
      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });
      expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
    });

  });

  describe('Search Query Management', () => {
    it('should display current search query from context', async () => {
      // Arrange
      const { useSubscriptionManagerContext } = await import('@/contexts/SubscriptionManager.context');
      
      function TestComponent() {
        const { setSearchQuery } = useSubscriptionManagerContext();
        
        React.useEffect(() => {
          setSearchQuery('test query');
        }, [setSearchQuery]);

        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      await waitFor(() => {
        const input = screen.getByTestId('search-input') as HTMLInputElement;
        expect(input.value).toBe('test query');
      });
    });

    it('should update search query when input changes', async () => {
      // Arrange
      const { useSubscriptionManagerContext } = await import('@/contexts/SubscriptionManager.context');
      
      function TestComponent() {
        const { searchQuery } = useSubscriptionManagerContext();

        return (
          <div>
            <div data-testid="current-query">{searchQuery}</div>
            <SubscriptionManagerSearch />
          </div>
        );
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'new search' } });

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('current-query')).toHaveTextContent('new search');
      });
    });

    it('should handle empty search query', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: '' } });

      // Assert
      const inputElement = input as HTMLInputElement;
      expect(inputElement.value).toBe('');
    });
  });

  describe('Input Properties', () => {
    it('should have correct input type', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      await waitFor(() => {
        const input = screen.getByTestId('search-input') as HTMLInputElement;
        expect(input.type).toBe('search');
      });
    });

    it('should have correct placeholder', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
      });
    });
  });

  describe('Compound Pattern', () => {
    it('should work as SubscriptionManager.Search', async () => {
      // Arrange
      const { Search } = await import('@/components/subscriptions/SubscriptionManager/SubscriptionManager.Search');

      function TestComponent() {
        return <Search />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      // Assert
      const inputElement = input as HTMLInputElement;
      expect(inputElement.value).toBe('abc');
    });

    it('should handle special characters in search query', async () => {
      // Arrange
      function TestComponent() {
        return <SubscriptionManagerSearch />;
      }

      // Act
      render(
        <SubscriptionManagerProvider>
          <TestComponent />
        </SubscriptionManagerProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'test@#$%^&*()' } });

      // Assert
      const inputElement = input as HTMLInputElement;
      expect(inputElement.value).toBe('test@#$%^&*()');
    });
  });
});

