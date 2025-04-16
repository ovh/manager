import React from 'react';
import { vi } from 'vitest';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../../test-utils';

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

    const elements = [
      organizationList[0].currentState.description,
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_datacentres_title,
      labels.dashboard.managed_vcd_dashboard_data_protection,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });

  it('display an error if organization service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}`,
      isOrganizationKo: true,
    });

    await assertAsyncTextVisibility('Organization error');
  });
});
