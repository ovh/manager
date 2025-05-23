import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { SMS_ROUTES_URLS } from '@sms/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

describe('SMS onboarding test suite', () => {
  it('should display the onboarding page', async () => {
    const { container } = await renderTestApp(SMS_ROUTES_URLS.smsOnboarding);

    const labelsToTest = [
      labels.secrets.onboarding.title,
      labels.secrets.onboarding.description1,
      labels.secrets.onboarding.description2,
    ];

    const checkAllLabelsPromises = labelsToTest.map(async (label) => {
      expect(
        await screen.findByText(label, {}, WAIT_FOR_DEFAULT_OPTIONS),
      ).toBeVisible();
    });

    await Promise.all(checkAllLabelsPromises);

    getOdsButtonByLabel({
      container,
      label: labels.secrets.onboarding.createButton,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });
  });

  it('should navigate to the secrets creation page', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(SMS_ROUTES_URLS.smsOnboarding);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secrets.onboarding.createButton,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });

    await user.click(button);

    expect(
      await screen.findByText(
        // TODO: replace this with a real label when the page is available
        'Create Secret',
        {},
        WAIT_FOR_DEFAULT_OPTIONS,
      ),
    ).toBeVisible();
  });
});
