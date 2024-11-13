import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-helpers';
import '@testing-library/jest-dom';

describe('onboarding', () => {
  it('displays the onboarding page if there is 0 backup', async () => {
    await renderTest({ nbBackup: 0, initialRoute: '/' });
    await waitFor(
      () =>
        expect(screen.getByText(labels.onboarding.description)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.queryByText(labels.listing.description),
    ).not.toBeInTheDocument();
    await waitFor(
      () =>
        expect(
          screen.getByText(labels.onboarding.order_button_label),
        ).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('displays the listing page if there is at least 1 backup', async () => {
    await renderTest({ nbBackup: 1 });
    await waitFor(
      () => expect(screen.getByText(labels.listing.description)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it('displays message and disable action button if there is no organization', async () => {
    await renderTest({ nbBackup: 0, nbOrganization: 0, initialRoute: '/' });
    await waitFor(
      () =>
        expect(
          screen.getByText(labels.onboarding.order_button_label),
        ).toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.no_organization_message, {
            exact: false,
          }),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
