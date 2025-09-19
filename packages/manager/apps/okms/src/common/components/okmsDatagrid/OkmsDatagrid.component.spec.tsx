import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ServiceDetails,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { OkmsDatagrid } from './OkmsDatagrid.component';
import { SERVICE_KEYS_LABEL } from '@/constants';
import { OkmsDatagridType } from './okmsDatagrid.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link) => link),
    useSearchParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...module,
    useServiceDetails: vi.fn(),
  };
});

vi.mocked(useServiceDetails).mockReturnValue({
  data: { data: { resource: { state: 'mockedState' } } },
} as UseQueryResult<ApiResponse<ServiceDetails>, ApiError>);

const environment = {
  getUser: vi.fn().mockReturnValue({ ovhSubsidiary: 'FR' }),
  getUserLocale: vi.fn().mockReturnValue('fr_FR'),
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getEnvironment: vi.fn(() => environment),
    },
    shell: {
      environment: {
        getEnvironment: vi.fn(() => environment),
      },
    },
  }),
  useOvhTracking: () => ({ trackClick: vi.fn() }),
}));

const columns = {
  name: 'key_management_service_listing_name_cell',
  id: 'key_management_service_listing_id_cell',
  status: 'key_management_service_listing_status_cell',
  secretCount: 'key_management_service_listing_secret_cell',
  kmipCount: 'key_management_service_listing_kmip_cell',
  servicekeyCount: SERVICE_KEYS_LABEL,
  region: 'key_management_service_listing_region_cell',
  terminate: 'key_management_service_listing_terminate',
};

describe('Okms Datagrid tests suite', () => {
  const renderComponent = (type: OkmsDatagridType) => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <OkmsDatagrid type={type} okmsList={okmsMock} />
      </QueryClientProvider>,
    );
  };

  it('should display the according columns when kms type is used', async () => {
    renderComponent('kms');

    // visible columns
    expect(await screen.findAllByText(columns.name)).toHaveLength(1);
    expect(await screen.findAllByText(columns.id)).toHaveLength(1);
    expect(await screen.findAllByText(columns.kmipCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.servicekeyCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.region)).toHaveLength(1);
    expect(await screen.findAllByText(columns.status)).toHaveLength(1);
    expect(screen.getByTestId('header-action')).toBeVisible();

    // hidden columns
    expect(screen.queryByText(columns.secretCount)).not.toBeInTheDocument();
  });

  it('should display the according columns when secret-manager type is used', async () => {
    renderComponent('secret-manager');

    // visible columns
    expect(await screen.findAllByText(columns.name)).toHaveLength(1);
    expect(await screen.findAllByText(columns.id)).toHaveLength(1);
    expect(await screen.findAllByText(columns.secretCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.status)).toHaveLength(1);

    // hidden columns
    expect(screen.queryByText(columns.kmipCount)).not.toBeInTheDocument();
    expect(screen.queryByText(columns.servicekeyCount)).not.toBeInTheDocument();
    expect(screen.queryByText(columns.region)).not.toBeInTheDocument();
    expect(screen.queryByTestId('header-action')).not.toBeInTheDocument();
  });
});
