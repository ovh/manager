import userEvent from '@testing-library/user-event';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

describe('Secret Manager onboarding test suite', () => {
  it('should display the onboarding page', async () => {
    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding,
    );

    await assertTextVisibility(labels.secretManager.common.secret_manager);
    await assertTextVisibility(labels.secretManager.onboarding.description_1);
    await assertTextVisibility(labels.secretManager.onboarding.description_2);

    getOdsButtonByLabel({
      container,
      label: labels.secretManager.onboarding.create_button,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });
  });

  it('should navigate to the secrets creation page', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding,
    );

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.onboarding.create_button,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });

    await user.click(button);

    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(
      labels.secretManager.create.domain_section_title,
    );
  });
});
