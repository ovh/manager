import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { SMS_ROUTES_URLS } from '@/routes/routes.constants';

describe('SMS onboarding test suite', () => {
  it('should display the onboarding page', async () => {
    const { container } = await renderTestApp(SMS_ROUTES_URLS.secretRoot, {
      nbOkms: 0,
    });

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
      label: labels.secrets.onboarding.createButtonLabel,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });
  });

  it('should navigate to the secrets list page if a kms exists', async () => {
    await renderTestApp(SMS_ROUTES_URLS.secretRoot, { nbOkms: 1 });

    expect(
      await screen.findByText(
        // TODO: replace this with a real label when the page is available
        'Secrets list page',
        {},
        WAIT_FOR_DEFAULT_OPTIONS,
      ),
    ).toBeVisible();
  });

  it('should navigate to the secrets creation page', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(SMS_ROUTES_URLS.secretRoot, {
      nbOkms: 0,
    });

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secrets.onboarding.createButtonLabel,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });

    await user.click(button);

    expect(
      await screen.findByText(
        // TODO: replace this with a real label when the page is available
        'Create secret page',
        {},
        WAIT_FOR_DEFAULT_OPTIONS,
      ),
    ).toBeVisible();
  });
});
