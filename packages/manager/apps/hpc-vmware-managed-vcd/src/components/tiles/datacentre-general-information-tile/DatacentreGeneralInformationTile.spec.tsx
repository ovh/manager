import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React from 'react';
import DatacentreGeneralInformationTile from './DatacentreGeneralInformationTile.component';

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
}));

describe('DatacentreGeneralInformationTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // given
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
    };

    // when
    const { getByText } = render(
      <DatacentreGeneralInformationTile
        vcdOrganization={vcdOrg}
        vcdDatacentre={datacentre}
      />,
    );

    // then
    const title = getByText('managed_vcd_dashboard_general_information');
    expect(title).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(title).toHaveAttribute('level', ODS_THEME_TYPOGRAPHY_LEVEL.heading);

    // and
    const description = getByText(datacentre.currentState.description);
    expect(description).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(description).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.body,
    );

    // and
    const webUrlLink = getByText(
      'managed_vcd_dashboard_management_interface_access',
    ).closest('osds-link');
    expect(webUrlLink?.href).toBe(vcdOrg.currentState.webInterfaceUrl);
    expect(webUrlLink).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.primary);
  });
});
