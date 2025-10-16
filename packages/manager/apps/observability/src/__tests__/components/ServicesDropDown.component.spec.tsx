import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ServicesDropDown from '../../components/ServicesDropDown.component';
import { useObservabilityServiceContext } from '../../contexts/ObservabilityService.context';
import { ObservabilityService } from '../../types/observability.type';

// Mock the context
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

// Helper function to get ODS elements by tag name
const getOdsElement = (container: HTMLElement, tagName: string) => {
  return container.querySelector(tagName);
};

const getOdsElements = (container: HTMLElement, tagName: string) => {
  return container.querySelectorAll(tagName);
};

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

// Mock services data
const mockServices: ObservabilityService[] = [
  {
    id: 'service-1',
    currentState: { displayName: 'Service One' },
  },
  {
    id: 'service-2',
    currentState: { displayName: 'Service Two' },
  },
  {
    id: 'service-3',
    currentState: { displayName: null }, // Test null displayName for fallback
  },
];

describe('ServicesDropDown', () => {
  const mockSetSelectedService = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display skeleton when loading', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: undefined,
        isLoading: true,
        isSuccess: false,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getOdsElement(container, 'ods-skeleton')).toBeInTheDocument();
      expect(getOdsElement(container, 'ods-select')).not.toBeInTheDocument();
      expect(screen.queryByText('listing.service')).not.toBeInTheDocument();
    });

    it('should not display skeleton when not loading', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getOdsElement(container, 'ods-skeleton')).not.toBeInTheDocument();
      expect(getOdsElement(container, 'ods-select')).toBeInTheDocument();
    });
  });

  describe('Empty Services', () => {
    it('should return null when services array is empty and isSuccess is true', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('should render dropdown when services is undefined but isSuccess is false', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: undefined,
        isLoading: false,
        isSuccess: false,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(getOdsElement(container, 'ods-select')).toBeInTheDocument();
    });
  });

  describe('Services Rendering', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    });

    it('should render form field with label', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('listing.service')).toBeInTheDocument();
      expect(getOdsElement(container, 'ods-select')).toBeInTheDocument();
    });

    it('should render select with correct attributes', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');
      expect(select).toHaveAttribute('name', 'select-observability-service');
      expect(select).toHaveAttribute('placeholder', 'listing.select_observability_service');
    });

    it('should render all service options', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const options = getOdsElements(container, 'option');
      expect(options).toHaveLength(3);

      expect(screen.getByText('Service One')).toBeInTheDocument();
      expect(screen.getByText('Service Two')).toBeInTheDocument();
      expect(screen.getByText('service-3')).toBeInTheDocument();
    });

    it('should set correct option values', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const options = getOdsElements(container, 'option');
      const optionsArray = Array.from(options);

      expect(optionsArray.find((opt) => opt.textContent === 'Service One')).toHaveAttribute(
        'value',
        'service-1',
      );
      expect(optionsArray.find((opt) => opt.textContent === 'Service Two')).toHaveAttribute(
        'value',
        'service-2',
      );
      expect(optionsArray.find((opt) => opt.textContent === 'service-3')).toHaveAttribute(
        'value',
        'service-3',
      );
    });
  });

  describe('Service Selection', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    });

    it('should display selected service value', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: 'service-1',
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');
      expect(select).toHaveAttribute('value', 'service-1');
    });

    it('should call setSelectedService when selection changes', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');

      // Note: The actual ODS component uses onOdsChange with event.detail.value
      // We need to simulate the ODS-specific event structure
      const odsChangeEvent = new CustomEvent('odsChange', {
        detail: { value: 'service-2' },
      });

      if (select) fireEvent(select, odsChangeEvent);

      expect(mockSetSelectedService).toHaveBeenCalledWith('service-2');
    });

    it('should handle undefined value in onOdsChange', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');

      // Simulate change event with undefined value
      const odsChangeEvent = new CustomEvent('odsChange', {
        detail: { value: undefined },
      });

      if (select) fireEvent(select, odsChangeEvent);

      expect(mockSetSelectedService).toHaveBeenCalledWith(undefined);
    });

    it('should convert value to string when calling setSelectedService', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');

      // Simulate change event with number value (should be converted to string)
      const odsChangeEvent = new CustomEvent('odsChange', {
        detail: { value: 123 },
      });

      if (select) fireEvent(select, odsChangeEvent);

      expect(mockSetSelectedService).toHaveBeenCalledWith('123');
    });
  });

  describe('CSS Classes and Styling', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    });

    it('should apply correct CSS classes to form field', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const formField = getOdsElement(container, 'ods-form-field');
      expect(formField).toHaveClass('my-4', 'w-full');
    });

    it('should apply correct CSS classes to select', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');
      expect(select).toHaveClass('max-w-[15rem]');
    });

    it('should apply correct CSS classes to skeleton when loading', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: undefined,
        isLoading: true,
        isSuccess: false,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const skeleton = getOdsElement(container, 'ods-skeleton');
      expect(skeleton).toHaveClass('max-w-[15rem]');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    });

    it('should have proper label association', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const label = screen.getByText('listing.service');
      const select = getOdsElement(container, 'ods-select');

      // The label should be associated with the select via slot="label"
      expect(label).toHaveAttribute('slot', 'label');
      expect(select).toHaveAttribute('name', 'select-observability-service');
    });

    it('should have meaningful placeholder text', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = getOdsElement(container, 'ods-select');
      expect(select).toHaveAttribute('placeholder', 'listing.select_observability_service');
    });
  });

  describe('Edge Cases', () => {
    it('should handle services with special characters in displayName', () => {
      // Arrange
      const servicesWithSpecialChars: ObservabilityService[] = [
        {
          id: 'service-special',
          currentState: { displayName: 'Service & Co. <Test>' },
        },
      ];

      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: servicesWithSpecialChars,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      render(<ServicesDropDown />, { wrapper: createWrapper() });

      // Assert
      expect(screen.getByText('Service & Co. <Test>')).toBeInTheDocument();
    });

    it('should handle null displayName gracefully', () => {
      // Arrange
      const servicesWithNullDisplayName: ObservabilityService[] = [
        {
          id: 'service-null',
          currentState: { displayName: null },
        },
      ];

      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: servicesWithNullDisplayName,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      render(<ServicesDropDown />, { wrapper: createWrapper() });

      // Assert
      expect(screen.getByText('service-null')).toBeInTheDocument();
    });

    it('should handle large number of services', () => {
      // Arrange
      const manyServices: ObservabilityService[] = Array.from({ length: 100 }, (_, i) => ({
        id: `service-${i}`,
        currentState: { displayName: `Service ${i}` },
      }));

      mockUseObservabilityServiceContext.mockReturnValue({
        setSelectedService: mockSetSelectedService,
        selectedService: undefined,
        services: manyServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const options = getOdsElements(container, 'option');
      expect(options).toHaveLength(100);
      expect(screen.getByText('Service 0')).toBeInTheDocument();
      expect(screen.getByText('Service 99')).toBeInTheDocument();
    });
  });
});
