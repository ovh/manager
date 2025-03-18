import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  assertElementLabel,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import OrganizationGeneralInformationTile from './OrganizationGeneralInformationTile.component';
import TEST_IDS from '../../../utils/testIds.constants';

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

describe('OrganizationGeneralInformationTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    render(
      <QueryClientProvider client={new QueryClient()}>
        <OrganizationGeneralInformationTile vcdOrganization={vcdOrg} />,
      </QueryClientProvider>,
    );

    // then
    const elements = [
      'managed_vcd_dashboard_general_information',
      'managed_vcd_dashboard_name',
      'managed_vcd_dashboard_description',
      'managed_vcd_dashboard_location',
      'managed_vcd_dashboard_region',
      'managed_vcd_dashboard_datacentres_count',
      'managed_vcd_dashboard_management_interface',
      vcdOrg.currentState.fullName,
      vcdOrg.currentState.description,
    ];

    elements.forEach(async (element) => assertTextVisibility(element));

    // and
    const webUrlLink = await getElementByTestId(
      TEST_IDS.dashboardVcdInterfaceLink,
    );
    await assertElementLabel({
      element: webUrlLink,
      label: 'managed_vcd_dashboard_management_interface_access',
    });
    expect(webUrlLink).toHaveAttribute(
      'href',
      vcdOrg.currentState.webInterfaceUrl,
    );
  });
});
