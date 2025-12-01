import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { enGB } from 'date-fns/locale';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TenantConfigurationForm } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructureSettings } from '@/data/hooks/infrastructures/useInfrastructureSettings.hook';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import {
  FormattedExtraSettingsDuration,
  useFormattedDurationSetting,
} from '@/hooks/useFormattedExtraSettings.hook';
import { InfraStructureExtraSettings } from '@/types/infrastructures.type';
import { TenantFormData } from '@/types/tenants.type';

// Mock dependencies
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/infrastructures/useInfrastructureSettings.hook', () => ({
  useInfrastructureSettings: vi.fn(),
}));

vi.mock('@/hooks/useFormattedExtraSettings.hook', () => ({
  useFormattedDurationSetting: vi.fn(),
}));

vi.mock('@/hooks/useDateFnsLocale.hook', () => ({
  useDateFnsLocale: vi.fn(),
}));

vi.mock('@/utils/form.utils', () => ({
  toRequiredLabel: vi.fn((label: string, requiredLabel: string) => `${label} - ${requiredLabel}`),
}));

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  FormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  FormFieldHelper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-helper">{children}</div>
  ),
  FormFieldLabel: ({ children }: { children: React.ReactNode }) => (
    <label data-testid="form-field-label">{children}</label>
  ),
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="ods-text" data-preset={preset}>
      {children}
    </span>
  ),
  TEXT_PRESET: {
    heading2: 'heading2',
    heading4: 'heading4',
    paragraph: 'paragraph',
    caption: 'caption',
  },
  Quantity: ({
    children,
    name,
    min,
    max,
    value,
    onValueChange,
    invalid,
    disabled,
  }: {
    children: React.ReactNode;
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
    disabled?: boolean;
  }) => (
    <div data-testid={`quantity-${name}`} data-disabled={disabled}>
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
              disabled?: boolean;
            }>,
            {
              name,
              min,
              max,
              value,
              onValueChange,
              invalid,
              disabled,
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
    disabled,
  }: {
    children?: React.ReactNode;
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
    disabled?: boolean;
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
              disabled?: boolean;
            }>,
            {
              name,
              min,
              max,
              value,
              onValueChange,
              invalid,
              disabled,
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
    disabled,
  }: {
    name?: string;
    min?: number;
    max?: number;
    value?: string;
    onValueChange?: (detail: { value: string }) => void;
    invalid?: boolean;
    disabled?: boolean;
  }) => (
    <input
      data-testid={`quantity-input-${name}`}
      type="number"
      name={name}
      min={min}
      max={max}
      value={value || ''}
      onChange={(e) => {
        onValueChange?.({ value: e.target.value });
      }}
      data-has-error={invalid}
      disabled={disabled}
    />
  ),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
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
    heading2: 'heading2',
    heading4: 'heading4',
    heading6: 'heading6',
    paragraph: 'paragraph',
    caption: 'caption',
  },
}));

// Mock BoundsFormFieldHelper
vi.mock('@/components/form/bounds-form-field-helper/BoundsFormFieldHelper.component', () => ({
  BoundsFormFieldHelper: ({
    min,
    max,
    error,
  }: {
    min?: string;
    max?: string;
    error?: { message?: string };
  }) => (
    <div data-testid="bounds-helper" data-min={min} data-max={max}>
      {error?.message && <span data-testid="error-message">{error.message}</span>}
      {min && max && (
        <span>
          Min: {min}, Max: {max}
        </span>
      )}
    </div>
  ),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseInfrastructureSettings = vi.mocked(useInfrastructureSettings);
const mockUseFormattedDurationSetting = vi.mocked(useFormattedDurationSetting);
const mockUseDateFnsLocale = vi.mocked(useDateFnsLocale);

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
      retentionDuration: '',
      retentionUnit: '',
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
  const mockExtraSettings: InfraStructureExtraSettings = {
    mimir: {
      configurable: {
        compactor_blocks_retention_period: {
          default: '7d',
          min: '7d',
          max: '400d',
          type: 'DURATION',
        },
        max_global_series_per_user: {
          default: 100,
          min: 1,
          max: 1000,
          type: 'NUMERIC',
        },
      },
    },
  };

  const mockFormattedDurationSetting: FormattedExtraSettingsDuration = {
    unit: 'd',
    default: { value: 7, label: '7 days' },
    min: { value: 7, label: '7 days' },
    max: { value: 400, label: '400 days' },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: {
        id: 'test-service-id',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: { displayName: 'Test Service' },
      },
      setSelectedService: vi.fn(),
      services: [],
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    mockUseDateFnsLocale.mockReturnValue(enGB);

    mockUseInfrastructureSettings.mockReturnValue({
      data: mockExtraSettings,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    });

    mockUseFormattedDurationSetting.mockReturnValue(mockFormattedDurationSetting);
  });

  describe('Rendering', () => {
    it('should render the configuration title', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(screen.getByTestId('text-heading2')).toHaveTextContent('configuration.title');
    });

    it('should render retention quantity input', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const retentionQuantity = screen.getByTestId('quantity-retention-quantity');
      expect(retentionQuantity).toBeInTheDocument();
    });

    it('should render maxSeries quantity input', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const limitQuantity = screen.getByTestId('quantity-limit-quantity');
      expect(limitQuantity).toBeInTheDocument();
    });

    it('should render form field labels', () => {
      render(
        <TestWrapper>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const formFieldLabels = screen.getAllByTestId('form-field-label');
      expect(formFieldLabels).toHaveLength(2);
    });
  });

  describe('Retention Field Behavior', () => {
    it('should disable retention input when no infrastructure is selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const retentionQuantity = screen.getByTestId('quantity-retention-quantity');
      expect(retentionQuantity).toHaveAttribute('data-disabled', 'true');
    });

    it('should enable retention input when infrastructure is selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const retentionQuantity = screen.getByTestId('quantity-retention-quantity');
      expect(retentionQuantity).toHaveAttribute('data-disabled', 'false');
    });

    it('should handle retention value change', async () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123', retentionDuration: '7' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const retentionInput = screen.getByTestId('quantity-input-retention-quantity');
      fireEvent.change(retentionInput, { target: { value: '30' } });

      await waitFor(() => {
        expect(retentionInput).toHaveValue(30);
      });
    });
  });

  describe('MaxSeries Quantity Field Behavior', () => {
    it('should render with default value when provided', () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: 100, infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input-limit-quantity');
      expect(quantityInput).toHaveValue(100);
    });

    it('should handle quantity change', async () => {
      render(
        <TestWrapper defaultValues={{ maxSeries: 100, infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input-limit-quantity');
      fireEvent.change(quantityInput, { target: { value: '250' } });

      await waitFor(() => {
        expect(quantityInput).toHaveValue(250);
      });
    });

    it('should disable maxSeries input when no infrastructure is selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const limitQuantity = screen.getByTestId('quantity-limit-quantity');
      expect(limitQuantity).toHaveAttribute('data-disabled', 'true');
    });

    it('should handle null maxSeries value when no settings available', () => {
      // When no settings are available, the default value should not be set
      mockUseInfrastructureSettings.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: false,
      });
      mockUseFormattedDurationSetting.mockReturnValue(undefined);

      render(
        <TestWrapper defaultValues={{ maxSeries: null, infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const quantityInput = screen.getByTestId('quantity-input-limit-quantity');
      expect(quantityInput).toHaveValue(null);
    });
  });

  describe('useInfrastructureSettings Hook Integration', () => {
    it('should call useInfrastructureSettings with correct parameters', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseInfrastructureSettings).toHaveBeenCalledWith('test-service-id', 'infra-123');
    });

    it('should call useInfrastructureSettings with empty infrastructure when not selected', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: '' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseInfrastructureSettings).toHaveBeenCalledWith('test-service-id', '');
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

      expect(mockUseInfrastructureSettings).toHaveBeenCalledWith('', 'infra-123');
    });
  });

  describe('useFormattedDurationSetting Hook Integration', () => {
    it('should call useFormattedDurationSetting with duration settings', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      expect(mockUseFormattedDurationSetting).toHaveBeenCalledWith(
        mockExtraSettings.mimir?.configurable?.compactor_blocks_retention_period,
      );
    });
  });

  describe('Context Integration', () => {
    it('should use selected service from context', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'custom-service-id',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Custom' },
        },
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

      expect(mockUseInfrastructureSettings).toHaveBeenCalledWith('custom-service-id', 'infra-123');
    });
  });

  describe('Bounds Helper', () => {
    it('should render bounds helper for retention field', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const boundsHelpers = screen.getAllByTestId('bounds-helper');
      expect(boundsHelpers.length).toBeGreaterThanOrEqual(1);
    });

    it('should render bounds helper for maxSeries field', () => {
      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      const boundsHelpers = screen.getAllByTestId('bounds-helper');
      expect(boundsHelpers.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined extraSettings', () => {
      mockUseInfrastructureSettings.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: false,
      });
      mockUseFormattedDurationSetting.mockReturnValue(undefined);

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      // Component should still render without crashing
      expect(screen.getByTestId('text-heading2')).toBeInTheDocument();
    });

    it('should handle loading state for infrastructure settings', () => {
      mockUseInfrastructureSettings.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
      });

      render(
        <TestWrapper defaultValues={{ infrastructureId: 'infra-123' }}>
          <TenantConfigurationForm />
        </TestWrapper>,
      );

      // Component should still render
      expect(screen.getByTestId('text-heading2')).toBeInTheDocument();
    });
  });
});
