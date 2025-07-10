import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';
import { TRACKING } from '../../../tracking.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
    }),
  };
});

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

describe('Tracking test suite', () => {
  it('should track terminate service action', async () => {
    // when
    await renderTest({ nbOrganization: 1 });
    const user = userEvent.setup();

    // then
    const terminateCta = await getElementByTestId(
      TEST_IDS.terminateIdCta(organizationList[0].id),
    );
    await act(() => user.click(terminateCta));

    expect(trackClickMock).toHaveBeenCalledWith(TRACKING.terminate.fromListing);
  });
});
