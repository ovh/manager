import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ServicesDropDown from '@/components/services/dropdown/ServicesDropDown.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { ObservabilityService } from '@/types/observability.type';

// Mock the API client
vi.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v2: {
      get: vi.fn(),
    },
  },
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock SelectField component (simplified mock that matches MUK structure)
vi.mock('@/components/form/select-field/SelectField.component', () => ({
  SelectField: ({
    label,
    value,
    name,
    placeholder,
    isLoading,
    onChange,
    options,
    className,
  }: {
    label?: string;
    value?: string;
    name: string;
    placeholder?: string;
    isLoading?: boolean;
    onChange: (value: string | null) => void;
    options?: Array<{ value: string; label: string }>;
    className?: string;
  }) => {
    if (isLoading) {
      return <div data-testid="skeleton" className={className} />;
    }
    return (
      <div data-testid="form-field">
        {label && <label data-testid="label">{label}</label>}
        <select
          data-testid="select"
          name={name}
          data-placeholder={placeholder}
          value={value || ''}
          className={className}
          onChange={(e) => {
            const selectedValue = e.target.value || null;
            onChange(selectedValue);
          }}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
}));

// Mock the context
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

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
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service One' },
    resourceStatus: 'READY',
  },
  {
    id: 'service-2',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service Two' },
    resourceStatus: 'READY',
  },
  {
    id: 'service-3',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: null }, // Test null displayName for fallback
    resourceStatus: 'READY',
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('select')).not.toBeInTheDocument();
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('select')).toBeInTheDocument();
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText('listing.service')).toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should render select with correct attributes', () => {
      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      expect(select).toHaveAttribute('name', 'select-observability-service');
      expect(select).toHaveAttribute('data-placeholder', 'listing.select_observability_service');
    });

    it('should render all service options', () => {
      // Act
      const { container } = render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const options = container.querySelectorAll('option');
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
      const options = container.querySelectorAll('option');
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
        selectedService: mockServices[0],
        services: mockServices,
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      expect((select as HTMLSelectElement).value).toBe('service-1');
    });

    it('should call setSelectedService when selection changes', () => {
      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      fireEvent.change(select, { target: { value: 'service-2' } });

      expect(mockSetSelectedService).toHaveBeenCalledWith(mockServices[1]);
    });

    it('should handle undefined value in onChange', () => {
      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      fireEvent.change(select, { target: { value: '' } });

      expect(mockSetSelectedService).toHaveBeenCalledWith(undefined);
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

    it('should apply correct CSS classes to select', () => {
      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      expect(select).toHaveClass('max-w-xs');
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('max-w-xs');
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
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const label = screen.getByText('listing.service');
      const select = screen.getByTestId('select');

      expect(label).toBeInTheDocument();
      expect(select).toHaveAttribute('name', 'select-observability-service');
    });

    it('should have meaningful placeholder text', () => {
      // Act
      render(<ServicesDropDown />, {
        wrapper: createWrapper(),
      });

      // Assert
      const select = screen.getByTestId('select');
      expect(select).toHaveAttribute('data-placeholder', 'listing.select_observability_service');
    });
  });

  describe('Edge Cases', () => {
    it('should handle services with special characters in displayName', () => {
      // Arrange
      const servicesWithSpecialChars: ObservabilityService[] = [
        {
          id: 'service-special',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Service & Co. <Test>' },
          resourceStatus: 'READY',
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
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: null },
          resourceStatus: 'READY',
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
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: `Service ${i}` },
        resourceStatus: 'READY',
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
      const options = container.querySelectorAll('option');
      expect(options).toHaveLength(100);
      expect(screen.getByText('Service 0')).toBeInTheDocument();
      expect(screen.getByText('Service 99')).toBeInTheDocument();
    });
  });
});
