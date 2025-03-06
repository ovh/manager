import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';

describe('Organizations Listing Page', () => {
  it('display the listing page if there is at least one organization', async () => {
    // when
    await renderTest({ nbOrganization: 1 });

    // then
    const headers = [
      labels.listing.managed_vcd_listing_name,
      labels.listing.managed_vcd_listing_description,
      labels.listing.managed_vcd_listing_location,
      labels.listing.managed_vcd_listing_region,
      labels.listing.managed_vcd_listing_web_interface_url,
    ];

    headers.forEach((element) => assertTextVisibility(element));

    // and
    const vcdDetails = organizationList[0].currentState;
    const vcdNameLink = await getElementByTestId(TEST_IDS.listingVcdNameLink);

    await assertTextVisibility(vcdDetails.description);
    await assertElementVisibility(vcdNameLink);
    await assertElementLabel({
      element: vcdNameLink,
      label: vcdDetails.fullName,
    });
  });
});
