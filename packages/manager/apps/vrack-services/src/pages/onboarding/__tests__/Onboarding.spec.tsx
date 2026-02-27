import { describe, expect, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/__tests__/test-i18n';
import { assertEnabled, getElementByText, renderTestComponent } from '@/__tests__/uiTestHelpers';

import OnboardingPage from '../Onboarding.page';

describe('OnboardingPage', () => {
  it('order button should be enabled if the feature is available', async () => {
    await renderTestComponent({
      component: <OnboardingPage />,
      nbVs: 0,
    });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);

    const orderButton = await getElementByText({
      value: labels.onboarding.orderButtonLabel,
    });
    const moreInfoButton = await getElementByText({
      value: labels.onboarding.moreInfoButtonLabel,
    });

    if (!orderButton) {
      expect.fail('Order button not found');
    }

    await assertEnabled(orderButton);
    expect(moreInfoButton).toBeEnabled();
  });
});
