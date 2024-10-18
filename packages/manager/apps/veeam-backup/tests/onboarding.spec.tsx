import { screen, waitFor } from '@testing-library/react';
import { setupTest, labels } from './helpers';
import '@testing-library/jest-dom';

describe('onboarding', () => {
  it('displays the onboarding page if there is 0 backup', async () => {
    await setupTest({ nbBackup: 0 });
    expect(screen.getByText(labels.onboarding.description)).toBeVisible();
    expect(
      screen.queryByText(labels.listing.description),
    ).not.toBeInTheDocument();
    await waitFor(
      () =>
        expect(
          screen.getByText(labels.onboarding.order_button_label),
        ).toBeEnabled(),
      { timeout: 30000 },
    );
  });

  it('displays the listing page if there is at least 1 backup', async () => {
    await setupTest({ nbBackup: 1 });
    expect(screen.getByText(labels.listing.description)).toBeVisible();
    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it('displays message and disable action button if there is no organization', async () => {
    await setupTest({ nbBackup: 0, nbOrganization: 0 });
    expect(
      screen.getByText(labels.onboarding.order_button_label),
    ).toBeDisabled();
    expect(
      screen.getByText(labels.onboarding.more_info_button_label),
    ).toBeEnabled();
    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.no_organization_message),
        ).toBeVisible(),
      { timeout: 30000 },
    );
  });
});
