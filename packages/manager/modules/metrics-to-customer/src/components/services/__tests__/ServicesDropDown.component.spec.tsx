import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ServicesDropDown from '@/components/services/ServicesDropDown.component';
import { ObservabilityService } from '@/types/observability.type';

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

// Mock services data
const mockServices: ObservabilityService[] = [
  {
    id: 'service-1',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service One' },
  },
  {
    id: 'service-2',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Service Two' },
  },
  {
    id: 'service-3',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: null }, // Test null displayName for fallback
  },
];

describe('ServicesDropDown', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display skeleton when loading', () => {
      // Arrange & Act
      render(<ServicesDropDown services={undefined} isLoading={true} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('select')).not.toBeInTheDocument();
      expect(screen.queryByText('listing.service')).not.toBeInTheDocument();
    });

    it('should not display skeleton when not loading', () => {
      // Arrange & Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });
  });

  describe('Empty Services', () => {
    it('should return null when services array is empty', () => {
      // Arrange & Act
      const { container } = render(
        <ServicesDropDown services={[]} isLoading={false} onChange={mockOnChange} />,
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('should render dropdown when services is undefined but not loading', () => {
      // Arrange & Act
      render(<ServicesDropDown services={undefined} isLoading={false} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });
  });

  describe('Services Rendering', () => {
    it('should render form field with label', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByText('listing.service')).toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should render select with correct attributes', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      const select = screen.getByTestId('select');
      expect(select).toHaveAttribute('name', 'select-observability-service');
      expect(select).toHaveAttribute('data-placeholder', 'listing.select_observability_service');
    });

    it('should render all service options', () => {
      // Act
      const { container } = render(
        <ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />,
      );

      // Assert
      const options = container.querySelectorAll('option');
      expect(options).toHaveLength(3);

      expect(screen.getByText('Service One')).toBeInTheDocument();
      expect(screen.getByText('Service Two')).toBeInTheDocument();
      expect(screen.getByText('service-3')).toBeInTheDocument();
    });

    it('should set correct option values', () => {
      // Act
      const { container } = render(
        <ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />,
      );

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
    it('should display selected service value', () => {
      // Act
      render(
        <ServicesDropDown
          services={mockServices}
          selectedServiceId="service-1"
          isLoading={false}
          onChange={mockOnChange}
        />,
      );

      // Assert
      const select = screen.getByTestId('select');
      expect((select as HTMLSelectElement).value).toBe('service-1');
    });

    it('should call onChange when selection changes', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      const select = screen.getByTestId('select');
      fireEvent.change(select, { target: { value: 'service-2' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('service-2');
    });

    it('should handle null value in onChange', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      const select = screen.getByTestId('select');
      fireEvent.change(select, { target: { value: '' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should not throw error when onChange is not provided', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} />);

      // Assert
      const select = screen.getByTestId('select');

      expect(() => {
        fireEvent.change(select, { target: { value: 'service-1' } });
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

      // Assert
      const label = screen.getByText('listing.service');
      const select = screen.getByTestId('select');

      expect(label).toBeInTheDocument();
      expect(select).toHaveAttribute('name', 'select-observability-service');
    });

    it('should have meaningful placeholder text', () => {
      // Act
      render(<ServicesDropDown services={mockServices} isLoading={false} onChange={mockOnChange} />);

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
        },
      ];

      // Act
      render(
        <ServicesDropDown
          services={servicesWithSpecialChars}
          isLoading={false}
          onChange={mockOnChange}
        />,
      );

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
        },
      ];

      // Act
      render(
        <ServicesDropDown
          services={servicesWithNullDisplayName}
          isLoading={false}
          onChange={mockOnChange}
        />,
      );

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
      }));

      // Act
      const { container } = render(
        <ServicesDropDown services={manyServices} isLoading={false} onChange={mockOnChange} />,
      );

      // Assert
      const options = container.querySelectorAll('option');
      expect(options).toHaveLength(100);
      expect(screen.getByText('Service 0')).toBeInTheDocument();
      expect(screen.getByText('Service 99')).toBeInTheDocument();
    });
  });
});

