import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../test-helpers';
import '@testing-library/jest-dom';

describe('listing', () => {
  it('display the listing page', async () => {
    await renderTest();
    await waitFor(() =>
      expect(screen.getByText(labels.listing.description)).toBeVisible(),
    );
  });
});
