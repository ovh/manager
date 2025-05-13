import { screen, waitFor } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-helpers';
import '@testing-library/jest-dom';

describe('onboarding', () => {
  const orderLabel = labels.onboarding.order_button_label;
  const onboardingDescription = labels.onboarding.description;

  it('displays the onboarding page if there is 0 backup', async () => {
    const { container } = await renderTest({ nbBackup: 0, initialRoute: '/' });

    await assertTextVisibility(onboardingDescription);
    await getOdsButtonByLabel({ container, label: orderLabel });
    expect(
      screen.queryByText(labels.listing.description),
    ).not.toBeInTheDocument();
  });

  it('displays the listing page if there is at least 1 backup', async () => {
    await renderTest({ nbBackup: 1 });

    await assertTextVisibility(labels.listing.description);
    expect(screen.queryByText(onboardingDescription)).not.toBeInTheDocument();
  });

  it('displays message and disable action button if there is no organization', async () => {
    const { container } = await renderTest({
      nbBackup: 0,
      nbOrganization: 0,
      initialRoute: '/',
    });

    await waitFor(
      () => {
        assertTextVisibility(onboardingDescription);
      },
      { timeout: 10_000 },
    );
    await waitFor(
      () => {
        assertTextVisibility(labels.common.no_organization_message);
      },
      { timeout: 10_000 },
    );
    await getOdsButtonByLabel({ container, label: orderLabel, disabled: true });
  });
});
