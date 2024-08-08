import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import OrganizationGeneralInformationTile from './OrganizationGeneralInformationTile.component';

describe('OrganizationGeneralInformationTile component unit test suite', () => {
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

    // when
    const { getByText } = render(
      <OrganizationGeneralInformationTile vcdOrganization={vcdOrg} />,
    );

    // then
    const title = getByText('managed_vcd_dashboard_general_information');
    expect(title).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(title).toHaveAttribute('level', ODS_THEME_TYPOGRAPHY_LEVEL.heading);

    // and
    const description = getByText(vcdOrg.currentState.description);
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
