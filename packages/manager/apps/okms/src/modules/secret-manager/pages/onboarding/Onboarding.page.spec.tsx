import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';

describe('Secret Manager onboarding test suite', () => {
  it('should display the onboarding page', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.onboarding);

    await assertTextVisibility(labels.secretManager.secret_manager);
    await assertTextVisibility(labels.secretManager.onboarding_description_1);
    await assertTextVisibility(labels.secretManager.onboarding_description_2);

    expect(
      screen.getByRole('button', { name: labels.secretManager.create_a_secret }),
    ).toBeVisible();
  });

  it('should navigate to the secrets creation page', async () => {
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.onboarding);

    const button = screen.getByRole('button', {
      name: labels.secretManager.create_a_secret,
    });

    await act(() => user.click(button));

    await assertTextVisibility(labels.secretManager.create_a_secret);
    await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
  });
});
