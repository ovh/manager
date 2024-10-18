import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../../test-utils';
import { organizationList } from '../../../../mocks/vcd-organization/vcd-organization.mock';

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
