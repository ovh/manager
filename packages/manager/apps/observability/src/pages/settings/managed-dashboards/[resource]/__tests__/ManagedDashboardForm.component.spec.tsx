import React from 'react';

import { useNavigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseFormReturn } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { CreateGrafanaPayload } from '@/data/api/grafana.props';
import { useCreateGrafana } from '@/data/hooks/grafana/useCreateGrafana.hook';
import { useManagedDashboardFormSchema } from '@/hooks/form/useManagedDashboardFormSchema.hook';
import ManagedDashboardForm from '@/pages/settings/managed-dashboards/[resource]/ManagedDashboardForm.component';
import { urls } from '@/routes/Routes.constants';
import { Grafana, ManagedDashboardFormData } from '@/types/managedDashboards.type';
import { ObservabilityService } from '@/types/observability.type';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/grafana/useCreateGrafana.hook', () => ({
  useCreateGrafana: vi.fn(),
}));

vi.mock('@/hooks/form/useManagedDashboardFormSchema.hook', () => ({
  useManagedDashboardFormSchema: vi.fn(),
}));

vi.mock('@/components/form/information-form/InformationForm.component', () => ({
  InformationForm: vi.fn(() => <div data-testid="information-form">InformationForm</div>),
}));

vi.mock('@/components/infrastructures/region-selector/RegionSelector.component', () => ({
  default: vi.fn(() => <div data-testid="region-selector">RegionSelector</div>),
}));

vi.mock('@/pages/settings/managed-dashboards/[resource]/grafana/GrafanaForm.component', () => ({
  GrafanaForm: vi.fn(() => <div data-testid="grafana-form">GrafanaForm</div>),
}));

vi.mock('@/pages/metrics/MetricsForm.layout', () => ({
  MetricsFormLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="metrics-form-layout">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Divider: ({ className }: { className?: string }) => (
    <div data-testid="divider" className={className} />
  ),
}));

vi.mock('@ovh-ux/muk', () => ({
  Button: ({
    id,
    children,
    onClick,
    type,
    disabled,
    loading,
  }: {
    id: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <button
      data-testid={id}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-loading={loading}
    >
      {children}
    </button>
  ),
  BUTTON_VARIANT: {
    ghost: 'ghost',
  },
  BUTTON_SIZE: {
    sm: 'sm',
  },
  BUTTON_COLOR: {
    primary: 'primary',
    neutral: 'neutral',
  },
  useNotifications: () => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
  }),
}));

vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    ACTIONS: 'actions',
    ERROR: 'error',
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'managed-dashboards:creation.information': 'Dashboard Information',
        'managed-dashboards:creation.namePlaceholder': 'Enter dashboard name',
        'managed-dashboards:creation.descriptionPlaceholder': 'Enter dashboard description',
        'managed-dashboards:creation.success': 'Dashboard created successfully',
        'actions:cancel': 'Cancel',
        'actions:create': 'Create',
      };
      return translations[key] || key;
    },
  })),
}));

const mockNavigate = vi.fn();
const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseCreateGrafana = vi.mocked(useCreateGrafana);
const mockUseManagedDashboardFormSchema = vi.mocked(useManagedDashboardFormSchema);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
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

describe('ManagedDashboardForm', () => {
  const mockService: ObservabilityService = {
    id: 'service-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Test Service' },
    resourceStatus: 'READY',
    iam: { id: 'iam-123', urn: 'urn:service:123' },
  };

  const createMockForm = (overrides?: Partial<UseFormReturn<ManagedDashboardFormData>>) => {
    const formState = {
      isValid: true,
      errors: {},
      isDirty: false,
      isSubmitting: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      isValidating: false,
      isLoading: false,
      validatingFields: {},
      defaultValues: {},
      disabled: false,
      ...overrides?.formState,
    };

    const unsubscribeFn = vi.fn();
    const control = {
      _subscribe: vi.fn(() => unsubscribeFn),
      _getWatch: vi.fn(),
      _formState: formState,
      _state: { mount: true },
      _subjects: {
        state: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
      },
      _proxyFormState: {
        isValid: true,
        errors: true,
        isDirty: true,
        isSubmitting: true,
        touchedFields: true,
        dirtyFields: true,
        isValidating: true,
        isLoading: true,
        disabled: true,
      },
      _setValid: vi.fn(),
      _updateValid: vi.fn(),
      _getDirty: vi.fn(),
      _updateFormState: vi.fn(),
      ...overrides?.control,
    };

    return {
      handleSubmit: vi.fn(
        (callback: (data: ManagedDashboardFormData) => void) => (e?: React.BaseSyntheticEvent) =>
          Promise.resolve().then(() => {
            e?.preventDefault();
            const mockData: ManagedDashboardFormData = {
              title: 'Test Dashboard',
              description: 'Test Description',
              infrastructureId: 'infra-1',
              releaseId: 'release-1',
              allowedNetworks: ['1.2.3.4'],
            };
            callback(mockData);
          }),
      ),
      formState,
      control,
      register: vi.fn(),
      getValues: vi.fn(),
      reset: vi.fn(),
      ...overrides,
    } as unknown as UseFormReturn<ManagedDashboardFormData>;
  };

  const mockForm = createMockForm();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: mockService,
      isSuccess: true,
      services: [mockService],
      setSelectedService: vi.fn(),
      isLoading: false,
      error: null,
    });
    mockUseManagedDashboardFormSchema.mockReturnValue({
      form: mockForm,
      schema: {} as unknown as ReturnType<typeof useManagedDashboardFormSchema>['schema'],
    });
    mockUseCreateGrafana.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
    } as unknown as UseMutationResult<Grafana, Error, CreateGrafanaPayload>);
  });

  describe('Rendering', () => {
    it('should render all form sections', () => {
      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      expect(screen.getByTestId('metrics-form-layout')).toBeInTheDocument();
      expect(screen.getByTestId('region-selector')).toBeInTheDocument();
      expect(screen.getByTestId('information-form')).toBeInTheDocument();
      expect(screen.getByTestId('grafana-form')).toBeInTheDocument();
    });

    it('should render cancel and create buttons', () => {
      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      expect(screen.getByTestId('cancel-managed-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('create-managed-dashboard')).toBeInTheDocument();
    });

    it('should render dividers between sections', () => {
      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const dividers = screen.getAllByTestId('divider');
      expect(dividers).toHaveLength(2);
    });
  });

  describe('Button states', () => {
    it('should enable create button when form is valid and service is selected', () => {
      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-managed-dashboard');
      expect(createButton).not.toBeDisabled();
    });

    it('should disable create button when no service is selected', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-managed-dashboard');
      expect(createButton).toBeDisabled();
    });

    it('should disable create button when form is invalid', () => {
      const invalidForm = createMockForm({
        formState: { isValid: false } as UseFormReturn<ManagedDashboardFormData>['formState'],
      });
      mockUseManagedDashboardFormSchema.mockReturnValue({
        form: invalidForm,
        schema: {} as unknown as ReturnType<typeof useManagedDashboardFormSchema>['schema'],
      });

      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-managed-dashboard');
      expect(createButton).toBeDisabled();
    });

    it('should disable buttons when mutation is pending', () => {
      mockUseCreateGrafana.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
      } as unknown as UseMutationResult<Grafana, Error, CreateGrafanaPayload>);

      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const cancelButton = screen.getByTestId('cancel-managed-dashboard');
      const createButton = screen.getByTestId('create-managed-dashboard');
      expect(cancelButton).toBeDisabled();
      expect(createButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when cancel button is clicked', () => {
      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const cancelButton = screen.getByTestId('cancel-managed-dashboard');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith(urls.managedDashboards);
    });
  });

  describe('Form submission', () => {
    it('should call createGrafana with correct payload on form submit', async () => {
      const { container } = render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const form = container.querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          resourceName: 'service-123',
          targetSpec: {
            title: 'Test Dashboard',
            description: 'Test Description',
            infrastructure: {
              id: 'infra-1',
            },
            datasource: {
              fullySynced: true,
            },
            release: {
              id: 'release-1',
            },
            allowedNetworks: ['1.2.3.4'],
          },
        });
      });
    });

    it('should not call createGrafana when no service is selected', async () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      const { container } = render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      const form = container.querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Mutation callbacks', () => {
    it('should navigate back on successful creation', () => {
      let onSuccessCallback: (() => void) | undefined;
      mockUseCreateGrafana.mockImplementation((options) => {
        onSuccessCallback = options?.onSuccess as () => void;
        return {
          mutate: mockMutate,
          isPending: false,
          isError: false,
          isSuccess: false,
          error: null,
          data: undefined,
        } as unknown as UseMutationResult<Grafana, Error, CreateGrafanaPayload>;
      });

      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      // Trigger the success callback
      onSuccessCallback?.();

      expect(mockNavigate).toHaveBeenCalledWith(urls.managedDashboards);
    });

    it('should provide onError callback to useCreateGrafana', () => {
      let onErrorCallback: ((error: Error) => void) | undefined;
      mockUseCreateGrafana.mockImplementation((options) => {
        onErrorCallback = options?.onError as (error: Error) => void;
        return {
          mutate: mockMutate,
          isPending: false,
          isError: false,
          isSuccess: false,
          error: null,
          data: undefined,
        } as unknown as UseMutationResult<Grafana, Error, CreateGrafanaPayload>;
      });

      render(<ManagedDashboardForm />, { wrapper: createWrapper() });

      expect(onErrorCallback).toBeDefined();
    });
  });
});
