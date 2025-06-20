import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

describe('Secret Manager root page test suite', () => {
  it('should navigate to the onboarding page if no kms exists', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot, {
      nbOkms: 0,
    });

    expect(
      await screen.findByText(
        labels.secretManager.common.secret_manager,
        {},
        WAIT_FOR_DEFAULT_OPTIONS,
      ),
    ).toBeVisible();
  });

  it('should navigate to the secrets list page if a kms exists', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot, {
      nbOkms: 1,
    });

    const secretListTableHeaders = [
      labels.secretManager.common.path,
      labels.secretManager.common.version,
    ];

    waitFor(() => {
      secretListTableHeaders.forEach((header) => {
        expect(screen.queryAllByText(header)).toBeVisible();
      });
    });
  });
});
