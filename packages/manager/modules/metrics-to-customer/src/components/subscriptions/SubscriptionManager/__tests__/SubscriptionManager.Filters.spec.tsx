import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { SubscriptionManagerFilters } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.Filters';
import { SubscriptionManagerProvider } from '@/components/subscriptions/SubscriptionManager/SubscriptionManager.context';

describe('SubscriptionManagerFilters', () => {
  const mockFilterValues = { serviceId: 'service-1', region: 'EU' };
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children with filterValues and onFilterChange from props', () => {
      // Arrange
      const renderFilters = vi.fn(({ filterValues, onFilterChange }) => (
        <div data-testid="filters">
          <div data-testid="service-id">{filterValues.serviceId as string}</div>
          <button
            data-testid="change-filter"
            onClick={() => onFilterChange('serviceId', 'new-service')}
          >
            Change Filter
          </button>
        </div>
      ));

      // Act
      render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters
            filterValues={mockFilterValues}
            onFilterChange={mockOnFilterChange}
          >
            {renderFilters}
          </SubscriptionManagerFilters>
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(renderFilters).toHaveBeenCalledTimes(1);
      expect(renderFilters).toHaveBeenCalledWith({
        filterValues: mockFilterValues,
        onFilterChange: mockOnFilterChange,
      });
      expect(screen.getByTestId('filters')).toBeInTheDocument();
      expect(screen.getByTestId('service-id')).toHaveTextContent('service-1');
    });


    it('should not render anything when children is not provided', () => {
      // Act
      const { container } = render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters 
            filterValues={mockFilterValues}
            onFilterChange={mockOnFilterChange}
          />
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(container.querySelector('[data-testid="filters"]')).not.toBeInTheDocument();
    });
  });


  describe('Filter Change Handling', () => {
    it('should call onFilterChange from props when filter changes', () => {
      // Arrange
      const renderFilters = ({ onFilterChange }: any) => (
        <button
          data-testid="change-filter"
          onClick={() => onFilterChange('serviceId', 'new-service')}
        >
          Change Filter
        </button>
      );

      // Act
      render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters
            filterValues={mockFilterValues}
            onFilterChange={mockOnFilterChange}
          >
            {renderFilters}
          </SubscriptionManagerFilters>
        </SubscriptionManagerProvider>,
      );

      const changeButton = screen.getByTestId('change-filter');
      fireEvent.click(changeButton);

      // Assert
      expect(mockOnFilterChange).toHaveBeenCalledWith('serviceId', 'new-service');
    });

    it('should handle null filter values', () => {
      // Arrange
      const renderFilters = ({ onFilterChange }: any) => (
        <button
          data-testid="clear-filter"
          onClick={() => onFilterChange('serviceId', null)}
        >
          Clear Filter
        </button>
      );

      // Act
      render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters
            filterValues={mockFilterValues}
            onFilterChange={mockOnFilterChange}
          >
            {renderFilters}
          </SubscriptionManagerFilters>
        </SubscriptionManagerProvider>,
      );

      const clearButton = screen.getByTestId('clear-filter');
      fireEvent.click(clearButton);

      // Assert
      expect(mockOnFilterChange).toHaveBeenCalledWith('serviceId', null);
    });
  });


  describe('Edge Cases', () => {
    it('should handle empty filterValues object', () => {
      // Arrange
      const renderFilters = ({ filterValues }: any) => (
        <div data-testid="filters">
          {Object.keys(filterValues).length === 0 ? 'No filters' : 'Has filters'}
        </div>
      );

      // Act
      render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters 
            filterValues={{}}
            onFilterChange={mockOnFilterChange}
          >
            {renderFilters}
          </SubscriptionManagerFilters>
        </SubscriptionManagerProvider>,
      );

      // Assert
      expect(screen.getByText('No filters')).toBeInTheDocument();
    });

    it('should handle multiple filter changes', () => {
      // Arrange
      const renderFilters = ({ onFilterChange }: any) => (
        <>
          <button
            data-testid="change-service"
            onClick={() => onFilterChange('serviceId', 'service-2')}
          >
            Change Service
          </button>
          <button
            data-testid="change-region"
            onClick={() => onFilterChange('region', 'US')}
          >
            Change Region
          </button>
        </>
      );

      // Act
      render(
        <SubscriptionManagerProvider>
          <SubscriptionManagerFilters
            filterValues={mockFilterValues}
            onFilterChange={mockOnFilterChange}
          >
            {renderFilters}
          </SubscriptionManagerFilters>
        </SubscriptionManagerProvider>,
      );

      fireEvent.click(screen.getByTestId('change-service'));
      fireEvent.click(screen.getByTestId('change-region'));

      // Assert
      expect(mockOnFilterChange).toHaveBeenCalledWith('serviceId', 'service-2');
      expect(mockOnFilterChange).toHaveBeenCalledWith('region', 'US');
      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
    });
  });
});

