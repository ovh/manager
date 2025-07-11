import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { versionsMock } from '@secret-manager/mocks/versions/versions.mock';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';

const MOCK_DOMAIN_ID = '123123';
const MOCK_SECRET_PATH = 'a/secret';

export const assertVersionDatagridVisilibity = async () => {
  // assert datagrid column visiblity
  await assertTextVisibility(labels.secretManager.common.version);
  await assertTextVisibility(labels.common.status.status);
  await assertTextVisibility(labels.common.dashboard.creation_date);
  await assertTextVisibility(labels.secretManager.common.expiration_date);

  // assert we display versions rows
  versionsMock.forEach(async (version) => {
    await assertTextVisibility(version.id.toString());
  });
};

describe('Secret versions page test suite', () => {
  it('should display the version datagrid', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretVersions(
        MOCK_DOMAIN_ID,
        MOCK_SECRET_PATH,
      ),
    );

    // THEN
    await assertVersionDatagridVisilibity();
  });
});
