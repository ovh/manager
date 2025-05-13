import React from 'react';
import { act, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import {
  assertTextVisibility,
  getElementByTestId,
  assertElementLabel,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import DatacentreGeneralInformationTile from './DatacentreGeneralInformationTile.component';
import { labels } from '../../../test-utils';
import { ID_LABEL } from '../../../pages/dashboard/dashboard.constants';
import TEST_IDS from '../../../utils/testIds.constants';
import { TRACKING } from '../../../tracking.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

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

describe('DatacentreGeneralInformationTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    const user = userEvent.setup();
    // when
    render(
      <QueryClientProvider client={queryClient}>
        <DatacentreGeneralInformationTile
          vcdOrganization={vcdOrg as VCDOrganization}
          vcdDatacentre={datacentre as VCDDatacentre}
        />
      </QueryClientProvider>,
    );

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

    elements.forEach(async (element) => assertTextVisibility(element));

    // and
    const webUrlLink = await getElementByTestId(
      TEST_IDS.dashboardDatacentreInterfaceLink,
    );
    await assertElementLabel({
      element: webUrlLink,
      label: 'managed_vcd_dashboard_management_interface_access',
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
