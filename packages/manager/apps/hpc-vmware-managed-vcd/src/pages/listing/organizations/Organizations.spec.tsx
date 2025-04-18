import { expect } from 'vitest';
import { screen } from '@testing-library/react';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';

describe('Organizations Listing Page', () => {
  it('display the listing page if there is at least one organization', async () => {
    // when
    await renderTest({ nbOrganization: 1 });

    // then
    const elements = [
      labels.listing.managed_vcd_listing_name,
      labels.listing.managed_vcd_listing_description,
      labels.listing.managed_vcd_listing_location,
      labels.listing.managed_vcd_listing_region,
      labels.listing.managed_vcd_listing_web_interface_url,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);

    // and
    const vcdDetails = organizationList[0].currentState;
    const vcdNameLink = screen.getByTestId(TEST_IDS.listingVcdNameLink);

    assertTextVisibility(vcdDetails.description);
    expect(vcdNameLink).toBeVisible();
    expect(vcdNameLink).toHaveAttribute('label', vcdDetails.fullName);
  });
});
