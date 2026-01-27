import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

describe('Secret Manager onboarding test suite', () => {
  it('should display the onboarding page', async () => {
    const { container } = await renderTestApp(SECRET_MANAGER_ROUTES_URLS.onboarding);

    await assertTextVisibility(labels.secretManager.secret_manager);
    await assertTextVisibility(labels.secretManager.onboarding_description_1);
    await assertTextVisibility(labels.secretManager.onboarding_description_2);

    await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });
  });

  it('should navigate to the secrets creation page', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(SECRET_MANAGER_ROUTES_URLS.onboarding);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
      ...WAIT_FOR_DEFAULT_OPTIONS,
    });

    await act(async () => {
      await user.click(button);
    });

    // Wait for navigation and loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    await assertTextVisibility(labels.secretManager.create_a_secret, {}, { timeout: 10_000 });
    await assertTextVisibility(
      labels.secretManager.create_secret_form_region_section_title,
      {},
      { timeout: 10_000 },
    );
  });
});
