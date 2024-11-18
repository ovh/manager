import { screen, waitFor } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest, labels } from '../../../test-utils';

describe('Organizations Listing Page', () => {
  it('display the listing page if there is at least one organization', async () => {
    await renderTest({ nbOrganization: 1 });

    await waitFor(() =>
      expect(
        screen.getByText(labels.listing.managed_vcd_listing_description),
      ).toBeVisible(),
    );

    await waitFor(() =>
      expect(
        screen.getByText(organizationList[0].currentState.fullName),
      ).toBeVisible(),
    );
  });
});
