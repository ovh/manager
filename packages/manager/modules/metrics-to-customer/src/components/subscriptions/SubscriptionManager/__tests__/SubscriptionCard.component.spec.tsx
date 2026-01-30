import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import SubscriptionCard from '@/components/subscriptions/SubscriptionManager/SubscriptionCard.component';
import { SubscriptionCardProps } from '@/components/subscriptions/SubscriptionManager/SubscriptionCard.props';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Card: ({ children, className, color, ...props }: any) => (
    <div data-testid="card" className={className} data-color={color} {...props}>
      {children}
    </div>
  ),
  CARD_COLOR: { primary: 'primary', neutral: 'neutral' },
  Text: ({ children, className, preset, ...props }: any) => (
    <div data-testid={`text-${preset}`} className={className} {...props}>
      {children}
    </div>
  ),
  TEXT_PRESET: { label: 'label', small: 'small' },
}));

// Mock SubscriptionToggle
const mockOnCreate = vi.fn();
const mockOnDelete = vi.fn();

vi.mock('@/components/cta/SubscriptionToggle.component', () => ({
  default: ({ itemId, subscription, onCreate, onDelete, isCreating, isDeleting }: any) => (
    <div data-testid={`subscription-toggle-${itemId}`}>
      {subscription ? (
        <button
          data-testid={`toggle-delete-${itemId}`}
          onClick={() => onDelete?.({ subscription, itemId, resourceName: 'test-resource' })}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Unsubscribe'}
        </button>
      ) : (
        <button
          data-testid={`toggle-create-${itemId}`}
          onClick={() => onCreate?.({ subscribeUrl: 'https://api.example.com/subscribe', itemId, resourceName: 'test-resource' })}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Subscribe'}
        </button>
      )}
    </div>
  ),
}));

describe('SubscriptionCard', () => {
  const defaultProps: SubscriptionCardProps = {
    title: 'Test Title',
    subTitle: 'Test Subtitle',
    resourceName: 'test-resource',
    subscriptionUrls: {
      subscribeUrl: 'https://api.example.com/subscribe',
      unsubscribeUrl: 'https://api.example.com/unsubscribe',
    },
    itemId: 'test-item-1',
    onCreate: mockOnCreate,
    onDelete: mockOnDelete,
    isCreating: false,
    isDeleting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render card with title and subtitle', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render SubscriptionToggle component', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('subscription-toggle-test-item-1')).toBeInTheDocument();
    });

    it('should render with neutral color when subscription is undefined', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-color', 'neutral');
    });

    it('should render with primary color when subscription exists', () => {
      // Arrange
      const propsWithSubscription = {
        ...defaultProps,
        subscription: { id: 'sub-1' },
      };

      // Act
      render(<SubscriptionCard {...propsWithSubscription} />);

      // Assert
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-color', 'primary');
    });

    it('should apply highlighted styles when subscription exists', () => {
      // Arrange
      const propsWithSubscription = {
        ...defaultProps,
        subscription: { id: 'sub-1' },
      };

      // Act
      render(<SubscriptionCard {...propsWithSubscription} />);

      // Assert
      const card = screen.getByTestId('card');
      expect(card.className).toContain('bg-[var(--ods-color-primary-050)]');
      expect(card.className).toContain('border-2');
    });

    it('should apply non-highlighted styles when subscription is undefined', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      const card = screen.getByTestId('card');
      expect(card.className).toContain('border-1');
      expect(card.className).not.toContain('bg-[var(--ods-color-primary-050)]');
    });
  });

  describe('Subscription Toggle Integration', () => {
    it('should pass correct props to SubscriptionToggle when no subscription', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('toggle-create-test-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('toggle-delete-test-item-1')).not.toBeInTheDocument();
    });

    it('should pass correct props to SubscriptionToggle when subscription exists', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionCard {...propsWithSubscription} />);

      // Assert
      expect(screen.getByTestId('toggle-delete-test-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('toggle-create-test-item-1')).not.toBeInTheDocument();
    });

    it('should pass isCreating prop to SubscriptionToggle', () => {
      // Arrange
      const propsWithCreating = {
        ...defaultProps,
        isCreating: true,
      };

      // Act
      render(<SubscriptionCard {...propsWithCreating} />);

      // Assert
      const createButton = screen.getByTestId('toggle-create-test-item-1');
      expect(createButton).toBeDisabled();
      expect(createButton).toHaveTextContent('Creating...');
    });

    it('should pass isDeleting prop to SubscriptionToggle', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithDeleting = {
        ...defaultProps,
        subscription,
        isDeleting: true,
      };

      // Act
      render(<SubscriptionCard {...propsWithDeleting} />);

      // Assert
      const deleteButton = screen.getByTestId('toggle-delete-test-item-1');
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveTextContent('Deleting...');
    });
  });

  describe('Event Handling', () => {
    it('should call onCreate when create button is clicked', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      const createButton = screen.getByTestId('toggle-create-test-item-1');
      fireEvent.click(createButton);

      // Assert
      expect(mockOnCreate).toHaveBeenCalledWith({
        subscribeUrl: 'https://api.example.com/subscribe',
        itemId: 'test-item-1',
        resourceName: 'test-resource',
      });
    });

    it('should call onDelete when delete button is clicked', () => {
      // Arrange
      const subscription = { id: 'sub-1' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionCard {...propsWithSubscription} />);

      const deleteButton = screen.getByTestId('toggle-delete-test-item-1');
      fireEvent.click(deleteButton);

      // Assert
      expect(mockOnDelete).toHaveBeenCalledWith({
        subscription,
        itemId: 'test-item-1',
        resourceName: 'test-resource',
      });
    });
  });

  describe('Text Presets', () => {
    it('should use label preset for title', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      const titleText = screen.getByTestId('text-label');
      expect(titleText).toHaveTextContent('Test Title');
    });

    it('should use small preset for subtitle', () => {
      // Act
      render(<SubscriptionCard {...defaultProps} />);

      // Assert
      const subtitleText = screen.getByTestId('text-small');
      expect(subtitleText).toHaveTextContent('Test Subtitle');
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
      render(<SubscriptionCard {...propsWithEmptyTitle} />);

      // Assert
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should handle empty subtitle', () => {
      // Arrange
      const propsWithEmptySubtitle = {
        ...defaultProps,
        subTitle: '',
      };

      // Act
      render(<SubscriptionCard {...propsWithEmptySubtitle} />);

      // Assert
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should handle generic subscription type', () => {
      // Arrange
      const subscription = { id: 'sub-1', name: 'Test Subscription' };
      const propsWithSubscription = {
        ...defaultProps,
        subscription,
      };

      // Act
      render(<SubscriptionCard {...propsWithSubscription} />);

      // Assert
      expect(screen.getByTestId('card')).toHaveAttribute('data-color', 'primary');
    });
  });
});

