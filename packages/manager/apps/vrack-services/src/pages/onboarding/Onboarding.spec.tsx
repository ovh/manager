import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/react';
import { getButtonByLabel, labels, renderTest } from '@/test-utils';

describe('Vrack Services listing test suite', () => {
  it('order button should not appear if the feature is not available', async () => {
    const { container } = await renderTest({
      nbVs: 0,
      isVrackServicesOrderFeatureUnavailable: true,
    });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);

    const moreInfoButton = await getButtonByLabel({
      container,
      value: labels.onboarding.moreInfoButtonLabel,
    });
    const orderButton = container.querySelector(
      `ods-button[label="${labels.onboarding.orderButtonLabel}"`,
    );

    expect(orderButton).not.toBeInTheDocument();
    expect(moreInfoButton).toBeEnabled();
  });
  it('order button should be enable if the feature is available', async () => {
    const { container } = await renderTest({ nbVs: 0 });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);

    const orderButton = await getButtonByLabel({
      container,
      value: labels.onboarding.orderButtonLabel,
    });
    const moreInfoButton = await getButtonByLabel({
      container,
      value: labels.onboarding.moreInfoButtonLabel,
    });

    await waitFor(() => expect(orderButton).toBeEnabled());
    expect(moreInfoButton).toBeEnabled();
  });
});
