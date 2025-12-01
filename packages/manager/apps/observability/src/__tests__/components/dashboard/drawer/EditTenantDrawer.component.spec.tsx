import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import EditTenantDrawer from '@/components/drawer/EditTenantDrawer.component';

const { mockNavigate, mockUseTenant, mockUseEditTenant, mockUseTenantsFormSchema } = vi.hoisted(
  () => ({
    mockNavigate: vi.fn(),
    mockUseTenant: vi.fn(),
    mockUseEditTenant: vi.fn(),
    mockUseTenantsFormSchema: vi.fn(),
  }),
);

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { tenantName?: string }) =>
      options?.tenantName ? `${key}:${options.tenantName}` : key,
  }),
}));

vi.mock('react-hook-form', () => ({
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-provider">{children}</div>
  ),
  useFormContext: () => ({
    register: vi.fn(),
    control: {},
    formState: { errors: {} },
  }),
}));

vi.mock('@ovh-ux/muk', () => ({
  Drawer: {
    Root: ({
      children,
      isLoading,
    }: {
      children: React.ReactNode;
      isLoading?: boolean;
      onDismiss?: () => void;
    }) => (
      <div data-testid="drawer-root" data-loading={isLoading}>
        {children}
      </div>
    ),
    Header: ({ title }: { title: string }) => <header data-testid="drawer-header">{title}</header>,
    Content: ({ children }: { children: React.ReactNode }) => (
      <section data-testid="drawer-content">{children}</section>
    ),
    Footer: ({
      primaryButton,
      secondaryButton,
    }: {
      primaryButton: {
        label: string;
        isDisabled?: boolean;
        isLoading?: boolean;
        onClick?: () => void;
      };
      secondaryButton: { label: string; onClick?: () => void };
    }) => (
      <footer>
        <button
          type="button"
          data-testid="primary-button"
          disabled={primaryButton.isDisabled}
          onClick={primaryButton.onClick}
        >
          {primaryButton.label}
        </button>
        <button type="button" data-testid="secondary-button" onClick={secondaryButton.onClick}>
          {secondaryButton.label}
        </button>
      </footer>
    ),
  },
  useNotifications: () => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
  }),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <p data-testid="ods-text">{children}</p>,
  Divider: () => <hr data-testid="ods-divider" />,
  TEXT_PRESET: {
    paragraph: 'paragraph',
  },
}));

vi.mock('@/components/form/information-form/InformationForm.component', () => ({
  InformationForm: ({ title }: { title: string }) => (
    <div data-testid="information-form">{title}</div>
  ),
}));

vi.mock('@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component', () => ({
  TenantConfigurationForm: () => <div data-testid="tenant-configuration-form" />,
}));

vi.mock('@/pages/tenants/TenantsForm.layout', () => ({
  TenantsFormLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tenants-form-layout">{children}</div>
  ),
}));

vi.mock('@/data/hooks/tenants/useTenants.hook', () => ({
  useTenant: mockUseTenant,
}));

vi.mock('@/data/hooks/tenants/useEditTenant.hook', () => ({
  useEditTenant: mockUseEditTenant,
}));

vi.mock('@/hooks/form/useTenantsFormSchema.hook', () => ({
  useTenantsFormSchema: mockUseTenantsFormSchema,
}));

type MockForm = {
  handleSubmit: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
  formState: { isValid: boolean };
};

describe('EditTenantDrawer.component', () => {
  const tenant = {
    id: 'tenant-123',
    currentState: {
      title: 'Observability Tenant',
      description: 'Managed observability stack',
      infrastructure: {
        id: 'infra-1',
      },
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 1500,
        },
      },
    },
  };

  let mockForm: MockForm;
  let mockMutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockForm = {
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      formState: { isValid: true },
    };
    mockMutate = vi.fn();

    mockUseTenant.mockReturnValue({ data: tenant, isLoading: false });
    mockUseEditTenant.mockImplementation(() => ({
      mutate: mockMutate,
      isPending: false,
    }));
    mockUseTenantsFormSchema.mockReturnValue({ form: mockForm });
  });

  const renderDrawer = () =>
    render(<EditTenantDrawer tenantId="tenant-123" resourceName="services/logs" />);

  it('shows loading state while tenant data is fetching', () => {
    mockUseTenant.mockReturnValue({ data: undefined, isLoading: true });

    renderDrawer();

    expect(screen.getByTestId('drawer-root')).toHaveAttribute('data-loading', 'true');
    expect(screen.getByTestId('primary-button')).toBeDisabled();
  });

  it('resets the form with tenant initial values when data is loaded', async () => {
    renderDrawer();

    await waitFor(() => {
      expect(mockForm.reset).toHaveBeenCalledWith({
        title: tenant.currentState.title,
        description: tenant.currentState.description,
        infrastructureId: tenant.currentState.infrastructure?.id ?? '',
        retentionDuration:
          tenant.currentState.limits?.mimir?.compactor_blocks_retention_period ?? '',
        retentionUnit: '',
        maxSeries: tenant.currentState.limits?.mimir?.max_global_series_per_user ?? null,
      });
    });
  });

  it('submits tenant updates through the edit mutation', () => {
    const formValues = {
      title: 'Updated tenant',
      description: 'Updated description',
      infrastructureId: 'infra-42',
      retentionDuration: '30',
      retentionUnit: 'd',
      maxSeries: 5000,
    };
    mockForm.handleSubmit.mockImplementation(
      (submit: (data: typeof formValues) => void) => () => submit(formValues),
    );

    renderDrawer();

    fireEvent.click(screen.getByTestId('primary-button'));

    expect(mockForm.handleSubmit).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith({
      resourceName: 'services/logs',
      tenantId: 'tenant-123',
      targetSpec: {
        title: formValues.title,
        description: formValues.description,
        limits: {
          mimir: {
            compactor_blocks_retention_period: '30d',
            max_global_series_per_user: formValues.maxSeries,
          },
        },
      },
    });
  });

  it('navigates back when cancel is clicked', () => {
    renderDrawer();

    fireEvent.click(screen.getByTestId('secondary-button'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
