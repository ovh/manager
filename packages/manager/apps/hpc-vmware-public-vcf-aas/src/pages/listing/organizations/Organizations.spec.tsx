import { screen } from '@testing-library/dom';
import { act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';

import { labels, renderTest } from '../../../test-utils';
import { ORDER_VCD_REDIRECTION_URL } from '../../../utils/orderVcdRedirection.constants';
import TEST_IDS from '../../../utils/testIds.constants';

describe('Organizations Listing Page', () => {
  it('display the listing page if there is at least one organization', async () => {
    // when
    await renderTest({ nbOrganization: 1 });

    // then
    const texts = [
      labels.listing.managed_vcd_listing_name,
      labels.commun.dashboard.description,
      labels.commun.region.localisation,
      labels.commun.region.region,
      labels.listing.managed_vcd_listing_web_interface_url,
    ];

    await Promise.all(texts.map((text) => assertTextVisibility(text)));

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

  it('should disable action menu and terminate button when service is suspended', async () => {
    await renderTest();

    const {
      id,
      currentState: { description },
    } = organizationList[2];

    await assertTextVisibility(description);
    const terminateButton = screen.queryByTestId(`terminate-cta-${id}`);
    const actionMenuButton = terminateButton?.closest('ods-button');
    expect(terminateButton).toBeDisabled();
    expect(actionMenuButton).toBeDisabled();
  });
});

describe('VCD Order CTA redirection', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('is visible and redirects to the correct URL when clicked', async () => {
    await renderTest({ nbOrganization: 1 });

    const orderButton = await getElementByTestId(TEST_IDS.vcdOrderCta);
    await assertElementVisibility(orderButton);

    const expectedUrl = ORDER_VCD_REDIRECTION_URL.FR;

    act(() => {
      orderButton.click();
    });

    await waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });
});
