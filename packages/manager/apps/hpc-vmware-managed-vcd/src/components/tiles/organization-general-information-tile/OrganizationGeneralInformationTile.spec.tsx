import { act, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18n as i18nType } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  assertAsyncTextVisibility,
  assertElementLabel,
  assertTextVisibility,
  getElementByTestId,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import OrganizationGeneralInformationTile from './OrganizationGeneralInformationTile.component';
import TEST_IDS from '../../../utils/testIds.constants';
import { APP_NAME, TRACKING } from '../../../tracking.constants';
import { labels, translations } from '../../../test-utils';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ id: 'id' }),
}));

const vcdOrg: VCDOrganization = {
  currentState: {
    apiUrl: 'https://vcd.my.demo.lab',
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
    region: 'CA-EAST-BHS',
    billingType: 'MONTHLY',
    name: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
    spla: true,
    webInterfaceUrl: 'https://vcd.my.second.lab',
  },
  id: '61ebdcec-0623-4a61-834f-a1719cd475b4',
  resourceStatus: 'READY',
  updatedAt: '2023-01-01T00:00:00Z',
  targetSpec: {
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
  },
  iam: {
    id: 'iam:id',
    urn: 'test:urn',
  },
};

let i18n: i18nType;
const renderComponent = async () => {
  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={new QueryClient()}>
        <OrganizationGeneralInformationTile vcdOrganization={vcdOrg} />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

describe('OrganizationGeneralInformationTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    const user = userEvent.setup();
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_general_information,
      labels.dashboard.managed_vcd_dashboard_name,
      labels.dashboard.managed_vcd_dashboard_description,
      labels.dashboard.managed_vcd_dashboard_location,
      labels.dashboard.managed_vcd_dashboard_region,
      labels.dashboard.managed_vcd_dashboard_datacentres_count,
      labels.dashboard.managed_vcd_dashboard_management_interface,
      vcdOrg.currentState.fullName,
      vcdOrg.currentState.description,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);

    // and
    const webUrlLink = getElementByTestId(TEST_IDS.dashboardVcdInterfaceLink);
    assertElementLabel({
      element: webUrlLink,
      label: labels.dashboard.managed_vcd_dashboard_management_interface_access,
    });
    expect(webUrlLink).toHaveAttribute(
      'href',
      vcdOrg.currentState.webInterfaceUrl,
    );

    await act(() => user.click(webUrlLink));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.dashboard.goToVcdPortal,
    );
  });
});
