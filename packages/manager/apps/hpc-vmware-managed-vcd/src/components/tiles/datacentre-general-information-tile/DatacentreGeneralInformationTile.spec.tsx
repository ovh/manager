import React from 'react';
import { act, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { i18n as i18nType } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import {
  getElementByTestId,
  assertElementLabel,
  assertAsyncTextVisibility,
  initTestI18n,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import DatacentreGeneralInformationTile from './DatacentreGeneralInformationTile.component';
import { labels, translations } from '../../../test-utils';
import { ID_LABEL } from '../../../pages/dashboard/dashboard.constants';
import TEST_IDS from '../../../utils/testIds.constants';
import { APP_NAME, TRACKING } from '../../../tracking.constants';

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

const vcdOrg = {
  currentState: {
    apiUrl: 'https://vcd.my.demo.lab',
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
    region: 'CA-EAST-BHS',
    name: 'org-ca-east-bhs-61ebdcec-0623-4a61-834f-a1719cd475b4',
    spla: true,
    webInterfaceUrl: 'https://vcd.my.second.lab',
  },
  id: '61ebdcec-0623-4a61-834f-a1719cd475b4',
  resourceStatus: 'READY',
  targetSpec: {
    description: 'My demo VCD Organization',
    fullName: 'Demo VCD',
  },
  iam: {
    id: 'iam:id',
    urn: 'test:urn',
  },
};

const datacentre = {
  currentState: {
    commercialRange: 'NSX',
    ipQuota: 4,
    storageQuota: 128,
    vCPUCount: 8,
    region: 'EU-WEST-GRA',
    description: 'organization Virtual DataCenter',
    memoryQuota: 16,
    name: 'vdc-eu-west-gra-f88f2da8-b12a-4796-8765-1e2afb323ad2',
    vCPUSpeed: 60,
  },
  id: 'f88f2da8-b12a-4796-8765-1e2afb323ad2',
  resourceStatus: 'UPDATING',
  targetSpec: {
    description: 'Primary organization Virtual DataCenter',
    vCPUSpeed: 60,
  },
  iam: {
    id: 'iam:id',
    urn: 'test2:urn',
  },
};

let i18n: i18nType;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const renderComponent = async () => {
  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <DatacentreGeneralInformationTile
          vcdOrganization={vcdOrg as VCDOrganization}
          vcdDatacentre={datacentre as VCDDatacentre}
        />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

describe('DatacentreGeneralInformationTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    const user = userEvent.setup();
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_general_information,
      labels.datacentres.managed_vcd_vdc_commercial_range,
      labels.datacentres.managed_vcd_vdc_vcpu_count,
      labels.datacentres.managed_vcd_vdc_ram_count,
      labels.datacentres.managed_vcd_vdc_vcpu_speed,
      labels.dashboard.managed_vcd_dashboard_management_interface,
      labels.dashboard.managed_vcd_dashboard_api_url,
      ID_LABEL,
      datacentre.currentState.description,
      datacentre.currentState.vCPUCount.toString(),
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);

    // and
    const webUrlLink = getElementByTestId(
      TEST_IDS.dashboardDatacentreInterfaceLink,
    );
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
      TRACKING.datacentreDashboard.goToVcdPortal,
    );
  });
});
