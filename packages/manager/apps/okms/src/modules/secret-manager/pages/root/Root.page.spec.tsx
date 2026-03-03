import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';
import { PATH_LABEL } from '@/constants';

describe('Secret Manager root page test suite', () => {
  it('should navigate to the onboarding page if no kms exists', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.root, {
      nbOkms: 0,
    });

    await assertTextVisibility(labels.secretManager.secret_manager);
  });

  it('should navigate to the secrets list page if there is only one kms in the first region', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.root, {
      nbOkms: 1,
    });

    await assertTextVisibility(PATH_LABEL);
    await assertTextVisibility(labels.secretManager.version);
  });

  it('should navigate to the okms list page if there is more than one kms in the first region', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.root, {
      nbOkms: 3,
    });

    await assertTextVisibility(labels.secretManager.okms_list);
  });
});
