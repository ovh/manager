import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../../test-utils';

describe('Organizations Listing Page', () => {
  it('display the listing page', async () => {
    await renderTest();
    await waitFor(() =>
      expect(
        screen.getByText(labels.listing.managed_vcd_listing_description),
      ).toBeVisible(),
    );
  });
});
