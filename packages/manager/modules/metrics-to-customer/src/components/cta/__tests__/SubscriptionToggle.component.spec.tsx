import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import SubscriptionToggle from '@/components/cta/SubscriptionToggle.component';
import { SubscriptionToggleProps } from '@/components/cta/SubscriptionToggle.props';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovh-ux/muk
vi.mock('@ovh-ux/muk', () => ({
  Button: ({ children, onClick, loading, disabled, id, ...props }: any) => (
    <button
      data-testid={id}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
  BUTTON_VARIANT: { ghost: 'ghost' },
  BUTTON_SIZE: { xs: 'xs' },
}));

describe('SubscriptionToggle', () => {
  const mockOnCreate = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps: SubscriptionToggleProps = {
    itemId: 'test-item-1',
    resourceName: 'test-resource',
    subscriptionUrls: {
      subscribeUrl: 'https://api.example.com/subscribe',
      unsubscribeUrl: 'https://api.example.com/unsubscribe',
    },
    onCreate: mockOnCreate,
    onDelete: mockOnDelete,
    isCreating: false,
    isDeleting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render subscribe button when subscription is undefined', () => {
      // Act
      render(<SubscriptionToggle {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('create-subscription-cta')).toBeInTheDocument();
      expect(screen.getByText('metrics-to-customer/subscriptions:subscription.subscribe-cta')).toBeInTheDocument();
    });

    it('should render unsubscribe button when subscription exists', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionToggle {...propsWithSubscription} />);

      // Assert
      expect(screen.getByTestId('delete-subscription-cta')).toBeInTheDocument();
      expect(screen.getByText('metrics-to-customer/subscriptions:subscription.unsubscribe-cta')).toBeInTheDocument();
    });

    it('should have correct button id for create action', () => {
      // Act
      render(<SubscriptionToggle {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('create-subscription-cta')).toBeInTheDocument();
    });

    it('should have correct button id for delete action', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionToggle {...propsWithSubscription} />);

      // Assert
      expect(screen.getByTestId('delete-subscription-cta')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when isCreating is true', () => {
      // Arrange
      const propsWithCreating = {
        ...defaultProps,
        isCreating: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithCreating} />);

      // Assert
      const button = screen.getByTestId('create-subscription-cta');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
    });

    it('should show loading state when isDeleting is true', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithDeleting = {
        ...defaultProps,
        subscription,
        isDeleting: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithDeleting} />);

      // Assert
      const button = screen.getByTestId('delete-subscription-cta');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
    });

    it('should disable button when isCreating is true', () => {
      // Arrange
      const propsWithCreating = {
        ...defaultProps,
        isCreating: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithCreating} />);

      // Assert
      expect(screen.getByTestId('create-subscription-cta')).toBeDisabled();
    });

    it('should disable button when isDeleting is true', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithDeleting = {
        ...defaultProps,
        subscription,
        isDeleting: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithDeleting} />);

      // Assert
      expect(screen.getByTestId('delete-subscription-cta')).toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('should call onCreate when subscribe button is clicked', () => {
      // Act
      render(<SubscriptionToggle {...defaultProps} />);

      const button = screen.getByTestId('create-subscription-cta');
      fireEvent.click(button);

      // Assert
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
      expect(mockOnCreate).toHaveBeenCalledWith({
        subscribeUrl: 'https://api.example.com/subscribe',
        itemId: 'test-item-1',
        resourceName: 'test-resource',
      });
    });

    it('should call onDelete when unsubscribe button is clicked', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionToggle {...propsWithSubscription} />);

      const button = screen.getByTestId('delete-subscription-cta');
      fireEvent.click(button);

      // Assert
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith({
        subscription,
        itemId: 'test-item-1',
        resourceName: 'test-resource',
      });
    });

    it('should not call onCreate when button is disabled', () => {
      // Arrange
      const propsWithCreating = {
        ...defaultProps,
        isCreating: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithCreating} />);

      const button = screen.getByTestId('create-subscription-cta');
      fireEvent.click(button);

      // Assert
      expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it('should not call onDelete when button is disabled', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithDeleting = {
        ...defaultProps,
        subscription,
        isDeleting: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithDeleting} />);

      const button = screen.getByTestId('delete-subscription-cta');
      fireEvent.click(button);

      // Assert
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Default Values', () => {
    it('should default isCreating to false when not provided', () => {
      // Arrange
      const propsWithoutCreating = {
        itemId: 'test-item-1',
        resourceName: 'test-resource',
        subscriptionUrls: {
          subscribeUrl: 'https://api.example.com/subscribe',
          unsubscribeUrl: 'https://api.example.com/unsubscribe',
        },
        onCreate: mockOnCreate,
        onDelete: mockOnDelete,
      };

      // Act
      render(<SubscriptionToggle {...propsWithoutCreating} />);

      // Assert
      const button = screen.getByTestId('create-subscription-cta');
      expect(button).not.toBeDisabled();
    });

    it('should default isDeleting to false when not provided', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithoutDeleting = {
        itemId: 'test-item-1',
        resourceName: 'test-resource',
        subscriptionUrls: {
          subscribeUrl: 'https://api.example.com/subscribe',
          unsubscribeUrl: 'https://api.example.com/unsubscribe',
        },
        subscription,
        onCreate: mockOnCreate,
        onDelete: mockOnDelete,
      };

      // Act
      render(<SubscriptionToggle {...propsWithoutDeleting} />);

      // Assert
      const button = screen.getByTestId('delete-subscription-cta');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Subscription State Logic', () => {
    it('should determine hasSubscription correctly when subscription is undefined', () => {
      // Act
      render(<SubscriptionToggle {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('create-subscription-cta')).toBeInTheDocument();
    });

    it('should determine hasSubscription correctly when subscription exists', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionToggle {...propsWithSubscription} />);

      // Assert
      expect(screen.getByTestId('delete-subscription-cta')).toBeInTheDocument();
    });

    it('should use isDeleting for loading when subscription exists', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithDeleting = {
        ...defaultProps,
        subscription,
        isDeleting: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithDeleting} />);

      // Assert
      const button = screen.getByTestId('delete-subscription-cta');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
    });

    it('should use isCreating for loading when subscription does not exist', () => {
      // Arrange
      const propsWithCreating = {
        ...defaultProps,
        isCreating: true,
      };

      // Act
      render(<SubscriptionToggle {...propsWithCreating} />);

      // Assert
      const button = screen.getByTestId('create-subscription-cta');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
    });
  });

  describe('Edge Cases', () => {
    it('should handle subscription with complex structure', () => {
      // Arrange
      const complexSubscription = {
        id: 'sub-1',
        name: 'Test Subscription',
        metadata: { key: 'value' },
      };
      const propsWithComplexSubscription = {
        ...defaultProps,
        subscription: complexSubscription,
      };

      // Act
      render(<SubscriptionToggle {...propsWithComplexSubscription} />);

      // Assert
      expect(screen.getByTestId('delete-subscription-cta')).toBeInTheDocument();
    });

    it('should handle empty subscriptionUrls', () => {
      // Arrange
      const propsWithEmptyUrls = {
        ...defaultProps,
        subscriptionUrls: {
          subscribeUrl: '',
          unsubscribeUrl: '',
        },
      };

      // Act
      render(<SubscriptionToggle {...propsWithEmptyUrls} />);

      // Assert
      const button = screen.getByTestId('create-subscription-cta');
      fireEvent.click(button);

      // Assert - onCreate should still be called with empty string
      expect(mockOnCreate).toHaveBeenCalledWith({
        subscribeUrl: '',
        itemId: 'test-item-1',
        resourceName: 'test-resource',
      });
    });
  });
});

