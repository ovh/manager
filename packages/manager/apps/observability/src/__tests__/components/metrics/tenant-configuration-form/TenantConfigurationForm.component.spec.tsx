import React from 'react';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { enGB } from 'date-fns/locale';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TenantConfigurationForm } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useRetentions } from '@/data/hooks/infrastructures/useRetentions.hook';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { Retention } from '@/types/infrastructures.type';
import { TenantFormData } from '@/types/tenants.type';

// Mock dependencies
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/infrastructures/useRetentions.hook', () => ({
  useRetentions: vi.fn(),
  getRetentionsQueryKey: vi.fn(),
}));

vi.mock('@/hooks/useDateFnsLocale.hook', () => ({
  useDateFnsLocale: vi.fn(),
}));

vi.mock('@/utils/duration.utils', () => ({
  formatDuration: vi.fn((duration: string) => {
    const map: Record<string, string> = {
      P1M: '1 month',
      P3M: '3 months',
      P6M: '6 months',
      P1Y: '1 year',
    };
    return map[duration] || duration;
  }),
}));

vi.mock('@/utils/form.utils', () => ({
  toRequiredLabel: vi.fn((label: string) => `${label}*`),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  FormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  FormFieldHelper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-helper">{children}</div>
  ),
  Quantity: ({
    children,
    name,
    min,
    max,
    value,
    onValueChange,
    invalid,
  }: {
    children: React.ReactNode;
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
  }) => (
    <div data-testid="quantity">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{
              name?: string;
              min?: number;
              max?: number;
              value?: string;
              onValueChange?: (detail: { value: string }) => void;
              invalid?: boolean;
            }>,
            {
              name,
              min,
              max,
              value,
              onValueChange,
              invalid,
            },
          );
        }
        return child;
      })}
    </div>
  ),
  QuantityControl: ({
    children,
    name,
    min,
    max,
    value,
    onValueChange,
    invalid,
  }: {
    children?: React.ReactNode;
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
  }) => (
    <div data-testid="quantity-control">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{
              name?: string;
              min?: number;
              max?: number;
              value?: string;
              onValueChange?: (detail: { value: string }) => void;
              invalid?: boolean;
            }>,
            {
              name,
              min,
              max,
              value,
              onValueChange,
              invalid,
            },
          );
        }
        return child;
      })}
    </div>
  ),
  QuantityInput: ({
    name,
    min,
    max,
    value,
    onValueChange,
    invalid,
  }: {
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
  }) => (
    <input
      data-testid="quantity-input"
      type="number"
      name={name}
      min={min}
      max={max}
      value={value || ''}
      onChange={(e) => {
        onValueChange?.({ value: e.target.value });
      }}
      data-has-error={invalid}
    />
  ),
  Text: ({
    children,
    preset,
    slot,
  }: {
    children: React.ReactNode;
    preset?: string;
    slot?: string;
  }) => (
    <span data-testid={`text-${slot || preset || 'default'}`} data-preset={preset} data-slot={slot}>
      {children}
    </span>
  ),
  TEXT_PRESET: {
    heading4: 'heading4',
    heading6: 'heading6',
    paragraph: 'paragraph',
    caption: 'caption',
  },
}));

vi.mock('@/components/form/select-field/SelectField.component', () => ({
  SelectField: ({
    value,
    name,
    label,
    onChange,
    error,
    isDisabled,
    className,
    options,
  }: {
    value?: string;
    name: string;
    label?: string;
    placeholder?: string;
    onChange?: (value: string | null) => void;
    error?: string;
    isDisabled?: boolean;
    className?: string;
    options?: Array<{ value: string; label: string }>;
  }) => {
    const [selectValue, setSelectValue] = React.useState(value || '');

    React.useEffect(() => {
      setSelectValue(value || '');
    }, [value]);

    return (
      <div data-testid="select-field-wrapper">
        {label && <label data-testid="select-label">{label}</label>}
        <select
          data-testid="select-retention"
          name={name}
          value={selectValue}
          disabled={isDisabled}
          className={className}
          onChange={(e) => {
            setSelectValue(e.target.value);
            onChange?.(e.target.value);
          }}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span data-testid="select-error">{error}</span>}
      </div>
    );
  },
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseRetentions = vi.mocked(useRetentions);
const mockUseDateFnsLocale = vi.mocked(useDateFnsLocale);

// Helper to create mock query result
const createMockRetentionsResult = (
  overrides: Partial<UseQueryResult<Retention[], Error>> = {},
): UseQueryResult<Retention[], Error> =>
  ({
    data: undefined,
    isLoading: false,
    isSuccess: false,
    error: null,
    isError: false,
    isPending: false,
    isRefetching: false,
    refetch: vi.fn(),
    status: 'idle',
    fetchStatus: 'idle',
    isLoadingError: false,
    isRefetchError: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isStale: false,
    ...overrides,
  }) as UseQueryResult<Retention[], Error>;

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
  defaultValues?: Partial<TenantFormData>;
  onSubmit?: (data: TenantFormData) => void;
  withErrors?: Partial<Record<keyof TenantFormData, string>>;
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
  withErrors,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const methods = useForm<TenantFormData>({
    defaultValues: {
      title: '',
      description: '',
      infrastructureId: '',
      retentionId: '',
      maxSeries: null,
      ...defaultValues,
    },
  });

  // Set errors if provided
  React.useEffect(() => {
    if (withErrors) {
      Object.entries(withErrors).forEach(([key, message]) => {
        methods.setError(key as keyof TenantFormData, { message });
      });
    }
  }, [methods, withErrors]);

  const handleSubmit = (data: TenantFormData) => {
    onSubmit(data);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(handleSubmit)(e);
          }}
        >
          {children}
        </form>
      </FormProvider>
    </QueryClientProvider>
  );
};

describe('TenantConfigurationForm', () => {
  const mockRetentions: Retention[] = [
    { id: '1', duration: 'P1M', default: true, supported: true },
    { id: '2', duration: 'P3M', default: false, supported: true },
    { id: '3', duration: 'P6M', default: false, supported: true },
    { id: '4', duration: 'P1Y', default: false, supported: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: { id: 'test-service-id', currentState: { displayName: 'Test Service' } },
      setSelectedService: vi.fn(),
      services: [],
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    mockUseDateFnsLocale.mockReturnValue(enGB);

    mockUseRetentions.mockReturnValue(
      createMockRetentionsResult({
        data: mockRetentions,
        isSuccess: true,
        isPending: false,
        isFetched: true,
      }),
    );
  });

  describe('Rendering', () => {
    it('should render the configuration title', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(screen.getByTestId('text-heading4')).toHaveTextContent('configuration.title');
    });

    it('should render retention select field with proper label', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(screen.getByTestId('select-label')).toHaveTextContent('configuration.retention*');
    });

    it('should render quantity input for maxSeries', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveAttribute('name', 'limit-quantity');
      expect(quantityInput).toHaveAttribute('min', '1');
      expect(quantityInput).toHaveAttribute('max', '1000');
    });

    it('should render limit title and description', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(screen.getByTestId('text-heading6')).toHaveTextContent('configuration.limit.title');
      expect(screen.getByTestId('text-paragraph')).toHaveTextContent(
        'configuration.limit.description',
      );
    });
  });

  describe('Retention Field Behavior', () => {
    it('should render retention options when retentions are loaded', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      const options = selectElement.querySelectorAll('option');

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('1');
      expect(options[0]).toHaveTextContent('1 month');
      expect(options[1]).toHaveValue('2');
      expect(options[1]).toHaveTextContent('3 months');
      expect(options[2]).toHaveValue('3');
      expect(options[2]).toHaveTextContent('6 months');
      expect(options[3]).toHaveValue('4');
      expect(options[3]).toHaveTextContent('1 year');
    });

    it('should disable retention select when no infrastructure is selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      expect(selectElement).toBeDisabled();
    });

    it('should enable retention select when infrastructure is selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      expect(selectElement).not.toBeDisabled();
    });

    it('should disable retention select when retentions are loading', () => {
      mockUseRetentions.mockReturnValue(
        createMockRetentionsResult({
          isPending: true,
          data: undefined,
        }),
      );

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      expect(selectElement).toBeDisabled();
    });

    it('should handle retention selection change', async () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');

      fireEvent.change(selectElement, { target: { value: '2' } });

      await waitFor(() => {
        expect(selectElement).toHaveValue('2');
      });
    });

    it('should display retention error when validation fails', () => {
      render(
        <TestWrapper
          defaultValues={{ infrastructureId: 'infra-123' }}
          withErrors={{ retentionId: 'Retention is required' }}
        >
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(screen.getByTestId('select-error')).toHaveTextContent('Retention is required');
    });
  });

  describe('MaxSeries Quantity Field Behavior', () => {
    it('should render with default value when provided', () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: 100 }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      expect(quantityInput).toHaveValue(100);
    });

    it('should handle quantity change', () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: 100 }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      fireEvent.change(quantityInput, { target: { value: '250' } });

      expect(quantityInput).toHaveValue(250);
    });

    it('should display error when maxSeries validation fails', () => {
      render(
        <TestWrapper withErrors={{ maxSeries: 'Must be between 1 and 1000' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      expect(quantityInput).toHaveAttribute('data-has-error', 'true');

      const errorHelper = screen.getByTestId('form-field-helper');
      expect(errorHelper).toHaveTextContent('Must be between 1 and 1000');
    });

    it('should not display error when maxSeries is valid', () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: 100 }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      expect(quantityInput).toHaveAttribute('data-has-error', 'false');
      expect(screen.queryByTestId('text-caption')).not.toBeInTheDocument();
    });
  });

  describe('useRetentions Hook Integration', () => {
    it('should call useRetentions with correct parameters', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: 'test-service-id',
        infrastructureId: 'infra-123',
      });
    });

    it('should call useRetentions with empty infrastructure when not selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: 'test-service-id',
        infrastructureId: '',
      });
    });

    it('should use empty resourceName when no service is selected', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: '',
        infrastructureId: 'infra-123',
      });
    });
  });

  describe('Context Integration', () => {
    it('should use selected service from context', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: { id: 'custom-service-id', currentState: { displayName: 'Custom' } },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: 'custom-service-id',
        infrastructureId: 'infra-123',
      });
    });

    it('should use dateFnsLocale for formatting durations', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseDateFnsLocale).toHaveBeenCalled();
    });
  });

  describe('Infrastructure ID Watch', () => {
    it('should watch infrastructure ID field changes', () => {
      // Test that the component properly watches the infrastructureId field
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      // When no infrastructure is selected, retention should be disabled
      expect(screen.getByTestId('select-retention')).toBeDisabled();

      // Verify that useRetentions was called with empty infrastructure
      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: 'test-service-id',
        infrastructureId: '',
      });
    });

    it('should enable retention select when infrastructure is provided', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-456' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      // When infrastructure is selected, retention should be enabled
      expect(screen.getByTestId('select-retention')).not.toBeDisabled();

      // Verify that useRetentions was called with the infrastructure ID
      expect(mockUseRetentions).toHaveBeenCalledWith({
        resourceName: 'test-service-id',
        infrastructureId: 'infra-456',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty retentions array', () => {
      mockUseRetentions.mockReturnValue(
        createMockRetentionsResult({
          data: [],
          isSuccess: true,
          isPending: false,
          isFetched: true,
        }),
      );

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      const options = selectElement.querySelectorAll('option');
      expect(options).toHaveLength(0);
    });

    it('should handle undefined retentions data', () => {
      mockUseRetentions.mockReturnValue(
        createMockRetentionsResult({
          data: undefined,
          isSuccess: false,
          isPending: false,
          isFetched: true,
        }),
      );

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const selectElement = screen.getByTestId('select-retention');
      const options = selectElement.querySelectorAll('option');
      expect(options).toHaveLength(0);
    });

    it('should handle null maxSeries value', () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: null }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input');
      expect(quantityInput).toHaveValue(null);
    });
  });
});
