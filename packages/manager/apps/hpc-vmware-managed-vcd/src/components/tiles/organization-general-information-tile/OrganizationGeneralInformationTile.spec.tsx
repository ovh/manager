import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React from 'react';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrganizationGeneralInformationTile from './OrganizationGeneralInformationTile.component';

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({ navigate: vi.fn() }),
  useParams: () => ({ id: 'id' }),
}));

describe('OrganizationGeneralInformationTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // given
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

    // when
    const { getByText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <OrganizationGeneralInformationTile vcdOrganization={vcdOrg} />,
      </QueryClientProvider>,
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
