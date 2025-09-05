import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  useVcdOrganization,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import OrganizationServiceManagementTile from './OrganizationServiceManagementTile.component';
import { labels } from '../../../test-utils';
import { subRoutes, urls } from '../../../routes/routes.constant';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useHref: () => urls.resetPassword.replace(subRoutes.dashboard, 'id'),
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'id' }),
  };
});

const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
  },
};

vi.mock('@ovh-ux/manager-module-vcd-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-module-vcd-api');
  return {
    ...mod,
    useVcdOrganization: vi.fn().mockReturnValue({
      data: { data: { resourceStatus: 'SUSPENDED' } },
    } as UseQueryResult<ApiResponse<VCDOrganization>, ApiError>),
  };
});

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrganizationServiceManagementTile />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('ServiceManagementTile component unit test suite', () => {
  afterAll(vi.clearAllMocks);

  it('should define tileTitle and sections', async () => {
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_service_management,
      labels.dashboard.managed_vcd_dashboard_service_renew,
      labels.dashboard.managed_vcd_dashboard_service_cancellation,
      labels.dashboard.managed_vcd_dashboard_password,
      labels.dashboard.managed_vcd_dashboard_contact_list,
    ];

    elements.forEach(async (element) => assertTextVisibility(element));
  });

  it('service actions should be disabled when the service is suspended', () => {
    const { container } = renderComponent();

    expect(useVcdOrganization).toHaveBeenCalledWith({ id: 'id' });
    const cancelButton = container.querySelector(
      'ods-button[label="managed_vcd_dashboard_service_cancellation"]',
    );
    expect(cancelButton?.getAttribute('is-disabled')).toBe('true');
    const renewPwdLink = container.querySelector(
      'ods-link[label="managed_vcd_dashboard_password_renew"]',
    );
    expect(renewPwdLink?.getAttribute('is-disabled')).toBe('true');
  });
});
