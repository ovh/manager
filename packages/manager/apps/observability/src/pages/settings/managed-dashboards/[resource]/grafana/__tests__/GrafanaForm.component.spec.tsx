import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useGrafanaReleases } from '@/data/hooks/grafana/useGrafanaReleases.hook';
import { GrafanaForm } from '@/pages/settings/managed-dashboards/[resource]/grafana/GrafanaForm.component';
import { GrafanaReleasesResponse, ManagedDashboardFormData } from '@/types/managedDashboards.type';
import { ObservabilityService } from '@/types/observability.type';

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/grafana/useGrafanaReleases.hook', () => ({
  useGrafanaReleases: vi.fn(),
}));

vi.mock('@/components/form/select-field/SelectField.component', () => ({
  SelectField: ({
    name,
    label,
    placeholder,
    value,
    onChange,
    options,
    isLoading,
    isDisabled,
    error,
  }: {
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string | null) => void;
    options: { value: string; label: string }[];
    isLoading: boolean;
    isDisabled: boolean;
    error?: string;
  }) => (
    <div data-testid="select-field">
      <label data-testid="select-label">{label}</label>
      <select
        data-testid={`select-${name}`}
        value={value}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isDisabled}
        data-loading={isLoading}
        data-error={error}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('@/components/form/text-field/TextField.component', () => ({
  TextField: ({
    id,
    label,
    placeholder,
    value,
    onChange,
    isDisabled,
    error,
    helper,
  }: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    isDisabled: boolean;
    error?: string;
    helper: string;
  }) => (
    <div data-testid="text-field">
      <label data-testid="textarea-label">{label}</label>
      <textarea
        data-testid={`textarea-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        placeholder={placeholder}
        data-error={error}
      />
      <span data-testid="textarea-helper">{helper}</span>
    </div>
  ),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  TEXT_PRESET: {
    heading2: 'heading2',
  },
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
}));

vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    FORM: 'form',
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'managed-dashboards:grafana.title': 'Grafana Configuration',
        'managed-dashboards:grafana.release.label': 'Grafana Version',
        'managed-dashboards:grafana.release.placeholder': 'Select a version',
        'managed-dashboards:grafana.allowedNetworks.label': 'Trusted Networks',
        'managed-dashboards:grafana.allowedNetworks.placeholder': 'Enter your IP addresses here',
        'managed-dashboards:grafana.allowedNetworks.helper':
          'List of client IP addresses (IPv4). Format: 1.2.3.4, 42.42.42.0/24',
        'form:required': 'required',
      };
      return translations[key] || key;
    },
  })),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseGrafanaReleases = vi.mocked(useGrafanaReleases);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<ManagedDashboardFormData>({
      defaultValues: {
        title: '',
        description: '',
        infrastructureId: 'infra-123',
        releaseId: '',
        allowedNetworks: [],
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <FormProvider {...methods}>{children}</FormProvider>
      </QueryClientProvider>
    );
  };
  FormWrapper.displayName = 'FormWrapper';
  return FormWrapper;
};

const createWrapperWithoutInfrastructure = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<ManagedDashboardFormData>({
      defaultValues: {
        title: '',
        description: '',
        infrastructureId: '',
        releaseId: '',
        allowedNetworks: [],
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <FormProvider {...methods}>{children}</FormProvider>
      </QueryClientProvider>
    );
  };
  FormWrapper.displayName = 'FormWrapper';
  return FormWrapper;
};

describe('GrafanaForm', () => {
  const mockService: ObservabilityService = {
    id: 'service-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Test Service' },
    resourceStatus: 'READY',
    iam: { id: 'iam-123', urn: 'urn:service:123' },
  };

  const mockReleasesResponse: GrafanaReleasesResponse = {
    releases: [
      {
        id: 'release-deprecated',
        status: 'DEPRECATED',
        version: '11.0.0',
      },
      {
        id: 'release-supported-1',
        status: 'SUPPORTED',
        version: '11.1.0',
      },
      {
        id: 'release-supported-2',
        status: 'SUPPORTED',
        version: '12.2.1',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: mockService,
      isSuccess: true,
      services: [mockService],
      setSelectedService: vi.fn(),
      isLoading: false,
      error: null,
    });
    mockUseGrafanaReleases.mockReturnValue({
      data: mockReleasesResponse,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    } as unknown as ReturnType<typeof useGrafanaReleases>);
  });

  describe('Rendering', () => {
    it('should render the form title', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      expect(screen.getByText('Grafana Configuration')).toBeInTheDocument();
    });

    it('should render the release select field', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      expect(screen.getByTestId('select-releaseId')).toBeInTheDocument();
      expect(screen.getByTestId('select-label')).toHaveTextContent('Grafana Version - required');
    });

    it('should render the allowed networks textarea', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      expect(screen.getByTestId('textarea-allowedNetworks')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-label')).toHaveTextContent('Trusted Networks');
      expect(screen.getByTestId('textarea-helper')).toHaveTextContent(
        'List of client IP addresses (IPv4). Format: 1.2.3.4, 42.42.42.0/24',
      );
    });
  });

  describe('Release options filtering', () => {
    it('should only show SUPPORTED releases in the select options', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      const options = select.querySelectorAll('option');

      // Placeholder + 2 SUPPORTED releases (DEPRECATED is filtered out)
      expect(options).toHaveLength(3);
      expect(options[1]).toHaveTextContent('11.1.0');
      expect(options[2]).toHaveTextContent('12.2.1');
    });

    it('should not show DEPRECATED releases', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      expect(select).not.toHaveTextContent('11.0.0');
    });
  });

  describe('Loading state', () => {
    it('should show loading state when releases are being fetched', () => {
      mockUseGrafanaReleases.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        isSuccess: false,
        error: null,
      } as unknown as ReturnType<typeof useGrafanaReleases>);

      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      expect(select).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Disabled state', () => {
    it('should disable fields when no infrastructure is selected', () => {
      render(<GrafanaForm />, { wrapper: createWrapperWithoutInfrastructure() });

      const select = screen.getByTestId('select-releaseId');
      const textarea = screen.getByTestId('textarea-allowedNetworks');

      expect(select).toBeDisabled();
      expect(textarea).toBeDisabled();
    });

    it('should enable fields when infrastructure is selected', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      const textarea = screen.getByTestId('textarea-allowedNetworks');

      expect(select).not.toBeDisabled();
      expect(textarea).not.toBeDisabled();
    });
  });

  describe('User interactions', () => {
    it('should update networks text when user types in textarea', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      const textarea = screen.getByTestId('textarea-allowedNetworks');
      fireEvent.change(textarea, { target: { value: '1.2.3.4, 5.6.7.8' } });

      expect(textarea).toHaveValue('1.2.3.4, 5.6.7.8');
    });
  });

  describe('Hook calls', () => {
    it('should call useGrafanaReleases with correct parameters', () => {
      render(<GrafanaForm />, { wrapper: createWrapper() });

      expect(mockUseGrafanaReleases).toHaveBeenCalledWith('service-123', 'infra-123');
    });

    it('should call useGrafanaReleases with empty strings when no service or infrastructure', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        isSuccess: true,
        services: [],
        setSelectedService: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<GrafanaForm />, { wrapper: createWrapperWithoutInfrastructure() });

      expect(mockUseGrafanaReleases).toHaveBeenCalledWith('', '');
    });
  });

  describe('Empty releases', () => {
    it('should handle empty releases array', () => {
      mockUseGrafanaReleases.mockReturnValue({
        data: { releases: [] },
        isLoading: false,
        isError: false,
        isSuccess: true,
        error: null,
      } as unknown as ReturnType<typeof useGrafanaReleases>);

      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      const options = select.querySelectorAll('option');

      // Only placeholder
      expect(options).toHaveLength(1);
    });

    it('should handle undefined releases data', () => {
      mockUseGrafanaReleases.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: null,
      } as unknown as ReturnType<typeof useGrafanaReleases>);

      render(<GrafanaForm />, { wrapper: createWrapper() });

      const select = screen.getByTestId('select-releaseId');
      const options = select.querySelectorAll('option');

      // Only placeholder
      expect(options).toHaveLength(1);
    });
  });
});
