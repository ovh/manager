import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18n as i18nType } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import OrganizationServiceManagementTile from './OrganizationServiceManagementTile.component';
import { labels, translations } from '../../../test-utils';
import { APP_NAME } from '../../../tracking.constants';

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ id: 'id' }),
}));

let i18n: i18nType;
const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
  },
};

const renderComponent = async () => {
  const queryClient = new QueryClient();
  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <OrganizationServiceManagementTile />
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
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

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });
});
