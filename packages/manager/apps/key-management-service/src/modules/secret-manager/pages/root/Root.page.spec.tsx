import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

describe('Secret Manager root page test suite', () => {
  it('should navigate to the onboarding page if no kms exists', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot, {
      nbOkms: 0,
    });

    await assertTextVisibility(labels.secretManager.common.secret_manager);
  });

  it('should navigate to the secrets list page if there is only one kms in the first region', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot, {
      nbOkms: 1,
    });

    await assertTextVisibility(labels.secretManager.common.path);
    await assertTextVisibility(labels.secretManager.common.version);
  });

  it('should navigate to the domains list page if there is more than one kms in the first region', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot, {
      nbOkms: 3,
    });

    await assertTextVisibility(labels.secretManager.domains.domains_list);
  });
});
