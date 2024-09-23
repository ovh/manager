import { screen, waitFor } from '@testing-library/react';
import { setupTest, labels } from './helpers';
import '@testing-library/jest-dom';

describe('listing', () => {
  it('display the listing page', async () => {
    await setupTest();
    await waitFor(() =>
      expect(screen.getByText(labels.listing.description)).toBeVisible(),
    );
  });
});
