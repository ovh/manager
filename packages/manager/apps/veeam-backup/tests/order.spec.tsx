import { screen } from '@testing-library/react';
import { setupTest, labels } from './helpers';
import '@testing-library/jest-dom';

describe('order', () => {
  it('displays the onboarding page if there is 0 backup', async () => {
    await setupTest({ nbBackup: 0 });
    expect(screen.getByText(labels.onboarding.description)).toBeVisible();
    expect(
      screen.queryByText(labels.listing.description),
    ).not.toBeInTheDocument();
  });

  it('displays the listing page if there is at least 1 backup', async () => {
    await setupTest({ nbBackup: 1 });
    expect(screen.getByText(labels.listing.description)).toBeVisible();
    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });
});
