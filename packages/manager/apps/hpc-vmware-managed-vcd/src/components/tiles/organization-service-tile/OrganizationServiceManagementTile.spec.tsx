import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
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
import { TRACKING } from '../../../tracking.constants';
import TEST_IDS from '../../../utils/testIds.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useHref: () => urls.resetPassword.replace(subRoutes.dashboard, 'id'),
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'id' }),
    useMatches: () => [{ pathname: '/somewhere' }],
  };
});

const shellContext = {
  environment: {
    getRegion: vi.fn(),
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

describe('Tracking test suite', () => {
  it('should track terminate service action', async () => {
    // when
    renderComponent();
    const user = userEvent.setup();

    // then
    const terminateCta = await screen.findByTestId(TEST_IDS.terminateCta);
    await act(() => user.click(terminateCta));

    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.terminate.fromDashboard,
    );
  });
});
