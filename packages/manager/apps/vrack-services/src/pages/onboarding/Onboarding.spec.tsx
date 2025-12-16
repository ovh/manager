import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import React from 'react';
import {
  assertEnabled,
  getElementByText,
  labels,
  renderTestComponent,
} from '@/test-utils';
import OnboardingPage from './Onboarding.page';

describe('OnboardingPage', () => {
  it('order button should be enabled if the feature is available', async () => {
    await renderTestComponent({
      component: <OnboardingPage />,
      nbVs: 0,
    });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);

    const orderButton = await getElementByText({
      // container,
      value: labels.onboarding.orderButtonLabel,
    });
    const moreInfoButton = await getElementByText({
      // container,
      value: labels.onboarding.moreInfoButtonLabel,
    });

    await assertEnabled(orderButton);
    expect(moreInfoButton).toBeEnabled();
  });
});
