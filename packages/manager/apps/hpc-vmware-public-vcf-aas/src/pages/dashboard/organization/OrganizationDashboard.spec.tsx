import React from 'react';
import { vi } from 'vitest';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../../test-utils';
import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
  };
});

describe('Organization Dashboard Page', () => {
  it('display the VCD dashboard page', async () => {
    await renderTest({ initialRoute: `/${organizationList[0].id}` });

    const layoutElements = [
      organizationList[0].currentState.fullName,
      organizationList[0].currentState.description,
      labels.dashboard.managed_vcd_dashboard_general_information,
      VIRTUAL_DATACENTERS_LABEL,
    ];

    layoutElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error if organization service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}`,
      isOrganizationKo: true,
    });

    await assertTextVisibility('Organization error');
  });
});
