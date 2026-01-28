import { act } from '@testing-library/react';

import {
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  network: SAFE_MOCK_DATA.vcdAclNetworkStandard,
};
const initialRoute = `/${config.org.id}/network-acl`;

describe('Network ACL Listing Page', () => {
  it('displays the listing page with network ACL entries', async () => {
    await renderTest({ initialRoute });

    const headers = [
      labels.networkAcl.managed_vcd_network_acl_ip_name,
      labels.commun.status.status,
      labels.commun.dashboard.description,
    ];

    await Promise.all(headers.map((text) => assertTextVisibility(text)));
  });

  it('displays the add network acl button', async () => {
    await renderTest({ initialRoute });

    const addButton = await getElementByTestId(TEST_IDS.networkAclCta);
    await assertElementVisibility(addButton);
    // TODO [POST-MIG-ESLINT]: fix this line below
    // expect(addButton).toBeEnabled();
  });

  it('displays action for each row', async () => {
    await renderTest({ initialRoute });

    const addButton = await getElementByTestId(TEST_IDS.networkAclCta);
    await assertElementVisibility(addButton);
    // TODO [POST-MIG-ESLINT]: fix this line below
    // expect(addButton).toBeEnabled();
  });

  it('should display actions menu when clicked', async () => {
    await renderTest({ initialRoute });

    const { name } = config.network;
    const actionMenuButton = await getElementByTestId('navigation-action-trigger-action');

    act(() => actionMenuButton.click());

    const modifyButton = await getElementByTestId(`actions-modify-${name}`);
    const deleteButton = await getElementByTestId(`actions-delete-${name}`);

    expect(modifyButton).toBeVisible();
    expect(deleteButton).toBeVisible();
  });
});
