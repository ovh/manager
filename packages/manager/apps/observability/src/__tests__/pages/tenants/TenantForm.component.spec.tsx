import React from 'react';

import { useNavigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseFormReturn } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { CreateTenantsPayload } from '@/data/api/tenants.props';
import { useCreateTenants } from '@/data/hooks/tenants/useCreateTenants.hook';
import { useTenantsFormSchema } from '@/hooks/form/useTenantsFormSchema.hook';
import { TenantForm } from '@/pages/tenants/TenantForm.component';
import { urls } from '@/routes/Routes.constants';
import { ObservabilityService } from '@/types/observability.type';
import { Tenant, TenantFormData } from '@/types/tenants.type';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/tenants/useCreateTenants.hook', () => ({
  useCreateTenants: vi.fn(),
}));

vi.mock('@/hooks/form/useTenantsFormSchema.hook', () => ({
  useTenantsFormSchema: vi.fn(),
}));

vi.mock('@/components/form/information-form/InformationForm.component', () => ({
  InformationForm: vi.fn(() => <div data-testid="information-form">InformationForm</div>),
}));

vi.mock('@/components/infrastructures/region-selector/RegionSelector.component', () => ({
  default: vi.fn(() => <div data-testid="region-selector">RegionSelector</div>),
}));

vi.mock('@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component', () => ({
  TenantConfigurationForm: vi.fn(() => (
    <div data-testid="tenant-configuration-form">TenantConfigurationForm</div>
  )),
}));

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  Divider: ({ spacing }: { spacing?: string }) => (
    <div data-testid="divider" data-spacing={spacing} />
  ),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  Text: ({
    children,
    preset,
    className,
  }: {
    children: React.ReactNode;
    preset?: string;
    className?: string;
  }) => (
    <span data-testid="text" data-preset={preset} className={className}>
      {children}
    </span>
  ),
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
    outline: 'outline',
  },
  BUTTON_SIZE: {
    sm: 'sm',
  },
  BUTTON_COLOR: {
    primary: 'primary',
  },
  TEXT_PRESET: {
    heading4: 'heading4',
  },
}));

// Mock translation namespaces
vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    ACTIONS: 'actions',
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tenants:creation.title': 'Create Tenant',
        'tenants:creation.tenantInformation': 'Tenant Information',
        'tenants:creation.namePlaceholder': 'Enter tenant name',
        'tenants:creation.descriptionPlaceholder': 'Enter tenant description',
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
const mockUseCreateTenants = vi.mocked(useCreateTenants);
const mockUseTenantsFormSchema = vi.mocked(useTenantsFormSchema);
const mockInformationForm = vi.mocked(InformationForm);

// Test wrapper for React Query
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

describe('TenantForm', () => {
  const mockService: ObservabilityService = {
    id: 'service-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Test Service' },
    iam: { id: 'iam-123', urn: 'urn:service:123' },
  };

  const mockForm = {
    handleSubmit: vi.fn((callback: (data: TenantFormData) => void) => (e: Event) => {
      e.preventDefault();
      const mockData: TenantFormData = {
        title: 'Test Tenant',
        description: 'Test Description',
        infrastructureId: 'infra-1',
        retentionId: 'retention-1',
        maxSeries: 1000,
      };
      callback(mockData);
    }),
    formState: {
      isValid: true,
      errors: {},
      isDirty: false,
      isSubmitting: false,
    },
    control: {},
    register: vi.fn(),
    getValues: vi.fn(),
  } as unknown as UseFormReturn<TenantFormData>;

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
    mockUseTenantsFormSchema.mockReturnValue({
      form: mockForm,
      schema: {} as unknown as ReturnType<typeof useTenantsFormSchema>['schema'],
    });
    mockUseCreateTenants.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
    } as unknown as UseMutationResult<Tenant, Error, CreateTenantsPayload>);
  });

  describe('Rendering', () => {
    it.each([
      ['region-selector', 'testId'],
      ['information-form', 'testId'],
      ['tenant-configuration-form', 'testId'],
      ['cancel-tenant', 'testId'],
      ['create-tenant', 'testId'],
    ])('should render %s', (identifier, queryType) => {
      render(<TenantForm />, { wrapper: createWrapper() });

      if (queryType === 'text') {
        expect(screen.getByText(identifier)).toBeInTheDocument();
      } else {
        expect(screen.getByTestId(identifier)).toBeInTheDocument();
      }
    });

    it('should render dividers between sections', () => {
      render(<TenantForm />, { wrapper: createWrapper() });

      const dividers = screen.getAllByTestId('divider');
      expect(dividers).toHaveLength(2);
      dividers.forEach((divider) => {
        expect(divider).toHaveAttribute('data-spacing', '24');
      });
    });

    it('should pass correct props to InformationForm', () => {
      render(<TenantForm />, { wrapper: createWrapper() });

      expect(mockInformationForm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tenant Information',
          namePlaceholder: 'Enter tenant name',
          descriptionPlaceholder: 'Enter tenant description',
        }),
        expect.anything(),
      );
    });
  });

  describe('Button States', () => {
    it('should enable create button when form is valid and service is selected', () => {
      render(<TenantForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-tenant');
      expect(createButton).not.toBeDisabled();
      expect(createButton).toHaveAttribute('data-loading', 'false');
    });

    it.each([
      {
        scenario: 'no service is selected',
        setup: () => {
          mockUseObservabilityServiceContext.mockReturnValue({
            selectedService: undefined,
            isSuccess: true,
            services: [],
            setSelectedService: vi.fn(),
            isLoading: false,
            error: null,
          });
        },
      },
      {
        scenario: 'form is invalid',
        setup: () => {
          mockUseTenantsFormSchema.mockReturnValue({
            form: {
              ...mockForm,
              formState: {
                ...mockForm.formState,
                isValid: false,
              },
            },
            schema: {} as unknown as ReturnType<typeof useTenantsFormSchema>['schema'],
          });
        },
      },
    ])('should disable create button when $scenario', ({ setup }) => {
      setup();
      render(<TenantForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-tenant');
      expect(createButton).toBeDisabled();
    });

    it('should disable both buttons when mutation is pending', () => {
      mockUseCreateTenants.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
      } as unknown as UseMutationResult<Tenant, Error, CreateTenantsPayload>);

      render(<TenantForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-tenant');
      const cancelButton = screen.getByTestId('cancel-tenant');

      expect(createButton).toBeDisabled();
      expect(createButton).toHaveAttribute('data-loading', 'true');
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to tenants list when cancel button is clicked', () => {
      render(<TenantForm />, { wrapper: createWrapper() });

      const cancelButton = screen.getByTestId('cancel-tenant');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith(urls.tenants);
    });

    it('should navigate back to tenants list after successful creation', async () => {
      const mockTenant: Tenant = {
        id: 'tenant-123',
        createdAt: '2025-11-01T08:00:00.001Z',
        updatedAt: '2025-11-01T08:00:00.001Z',
        currentState: {
          title: 'Test Tenant',
          description: 'Test Description',
        },
      };

      let onSuccessCallback:
        | ((data: Tenant, variables: CreateTenantsPayload, context: unknown) => unknown)
        | undefined;
      mockUseCreateTenants.mockImplementation((options) => {
        onSuccessCallback = options?.onSuccess;
        return {
          mutate: mockMutate,
          isPending: false,
          isError: false,
          isSuccess: false,
          error: null,
          data: undefined,
        } as unknown as UseMutationResult<Tenant, Error, CreateTenantsPayload>;
      });

      render(<TenantForm />, { wrapper: createWrapper() });

      // Trigger the success callback
      if (onSuccessCallback) {
        onSuccessCallback(mockTenant, {} as CreateTenantsPayload, undefined);
      }

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(urls.tenants);
      });
    });
  });

  describe('Form Submission', () => {
    it('should call createTenant with correct payload on form submit', async () => {
      const { container } = render(<TenantForm />, {
        wrapper: createWrapper(),
      });

      const form = container.querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining<CreateTenantsPayload>({
            resourceName: 'service-123',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            targetSpec: expect.objectContaining({
              title: 'Test Tenant',
              description: 'Test Description',
              infrastructure: {
                id: 'infra-1',
              },
              limits: {
                numberOfSeries: {
                  maximum: 1000,
                },
                retention: {
                  id: 'retention-1',
                },
              },
            }),
          }),
        );
      });
    });

    it('should not submit when selectedService is null', async () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      const mockHandleSubmitCallback = vi.fn();
      mockUseTenantsFormSchema.mockReturnValue({
        form: {
          ...mockForm,
          handleSubmit: vi.fn((callback: (data: TenantFormData) => void) => (e: Event) => {
            e.preventDefault();
            const mockData: TenantFormData = {
              title: 'Test Tenant',
              description: 'Test Description',
              infrastructureId: 'infra-1',
              retentionId: 'retention-1',
              maxSeries: 1000,
            };
            callback(mockData);
            mockHandleSubmitCallback(mockData);
          }),
        } as unknown as UseFormReturn<TenantFormData>,
        schema: {} as unknown as ReturnType<typeof useTenantsFormSchema>['schema'],
      });

      const { container } = render(<TenantForm />, {
        wrapper: createWrapper(),
      });

      const form = container.querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockHandleSubmitCallback).toHaveBeenCalled();
      });

      // mutate should not be called when service is null
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should use default maxSeries value when null', async () => {
      const mockFormWithNullMaxSeries = {
        ...mockForm,
        handleSubmit: vi.fn((callback: (data: TenantFormData) => void) => (e: Event) => {
          e.preventDefault();
          const mockData: TenantFormData = {
            title: 'Test Tenant',
            description: 'Test Description',
            infrastructureId: 'infra-1',
            retentionId: 'retention-1',
            maxSeries: null,
          };
          callback(mockData);
        }),
      } as unknown as UseFormReturn<TenantFormData>;

      mockUseTenantsFormSchema.mockReturnValue({
        form: mockFormWithNullMaxSeries,
        schema: {} as unknown as ReturnType<typeof useTenantsFormSchema>['schema'],
      });

      const { container } = render(<TenantForm />, {
        wrapper: createWrapper(),
      });

      const form = container.querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining<CreateTenantsPayload>({
            resourceName: 'service-123',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            targetSpec: expect.objectContaining({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              limits: expect.objectContaining({
                numberOfSeries: {
                  maximum: 102,
                },
              }),
            }),
          }),
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle creation error', async () => {
      const mockError = new Error('Failed to create tenant');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      let onErrorCallback:
        | ((error: Error, variables: CreateTenantsPayload, context: unknown) => unknown)
        | undefined;
      mockUseCreateTenants.mockImplementation((options) => {
        onErrorCallback = options?.onError;
        return {
          mutate: mockMutate,
          isPending: false,
          isError: false,
          isSuccess: false,
          error: null,
          data: undefined,
        } as unknown as UseMutationResult<Tenant, Error, CreateTenantsPayload>;
      });

      render(<TenantForm />, { wrapper: createWrapper() });

      // Trigger the error callback
      if (onErrorCallback) {
        onErrorCallback(mockError, {} as CreateTenantsPayload, undefined);
      }

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create tenant:', mockError);
      });

      // Should not navigate on error
      expect(mockNavigate).not.toHaveBeenCalledWith(urls.tenants);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Integration', () => {
    it('should render form within layout with correct structure', () => {
      const { container } = render(<TenantForm />, {
        wrapper: createWrapper(),
      });

      // Check that the layout wrapper exists
      const layoutDiv = container.querySelector('.grid.grid-cols-1.w-1\\/2');
      expect(layoutDiv).toBeInTheDocument();

      // Check that form is inside layout
      const form = container.querySelector('form') as HTMLFormElement;
      expect(layoutDiv).toContainElement(form);
    });

    it('should call form handleSubmit on create button click', async () => {
      render(<TenantForm />, { wrapper: createWrapper() });

      const createButton = screen.getByTestId('create-tenant');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockForm.handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
