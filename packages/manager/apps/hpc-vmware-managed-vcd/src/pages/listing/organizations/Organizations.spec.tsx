import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../../test-utils';

describe.skip('Organizations Listing Page', () => {
  it('display the listing page if there is at least one organization', async () => {
    await renderTest({ nbOrganization: 1 });

    await assertTextVisibility(labels.listing.managed_vcd_listing_description);

    await assertTextVisibility(organizationList[0].currentState.fullName);
  });
});
