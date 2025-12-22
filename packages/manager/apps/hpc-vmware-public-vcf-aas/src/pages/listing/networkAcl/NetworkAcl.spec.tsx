import {
  organizationList,
  networkAclList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { act, waitFor } from '@testing-library/react';
import TEST_IDS from '../../../utils/testIds.constants';

import { labels, renderTest } from '../../../test-utils';

describe('Network ACL Listing Page', () => {
  it('displays the listing page with network ACL entries', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl`,
    });

    const headers = [
      labels.networkAcl.managed_vcd_network_acl_ip_name,
      labels.commun.status.status,
      labels.commun.dashboard.description,
    ];

    await waitFor(
      async () => {
        await Promise.all(headers.map((text) => assertTextVisibility(text)));
      },
      { timeout: 10000 },
    );
  });

  it('displays the add network acl button', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl`,
    });
    const addButton = await getElementByTestId(TEST_IDS.networkAclCta);
    await assertElementVisibility(addButton);
    expect(addButton).toBeEnabled();
  });

  it('displays action for each row', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl`,
    });
    const addButton = await getElementByTestId(TEST_IDS.networkAclCta);
    await assertElementVisibility(addButton);
    expect(addButton).toBeEnabled();
  });

  it('should display actions menu when clicked', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/network-acl`,
    });

    const { name } = networkAclList[0].currentState.networks[0];
    const actionMenuButton = await getElementByTestId(
      'navigation-action-trigger-action',
    );

    act(() => actionMenuButton.click());

    const modifyButton = await getElementByTestId(`actions-modify-${name}`);
    const deleteButton = await getElementByTestId(`actions-delete-${name}`);

    expect(modifyButton).toBeVisible();
    expect(deleteButton).toBeVisible();
  });
});
