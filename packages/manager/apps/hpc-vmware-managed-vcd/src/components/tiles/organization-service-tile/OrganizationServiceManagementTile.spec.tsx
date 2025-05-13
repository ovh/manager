import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import OrganizationServiceManagementTile from './OrganizationServiceManagementTile.component';
import { labels } from '../../../test-utils';
import { subRoutes, urls } from '../../../routes/routes.constant';

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useHref: () => urls.resetPassword.replace(subRoutes.dashboard, 'id'),
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ id: 'id' }),
}));

const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
  },
};

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
});
