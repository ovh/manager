import userEvent from '@testing-library/user-event';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { versionActiveMock } from '@secret-manager/mocks/versions/versions.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';

const mockOkmsId = '123123';

describe('Version list page test suite', () => {
  it('should display the version datagrid', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecret1.path),
    );

    // THEN
    await assertVersionDatagridVisilibity();
  });

  it('navigate to reveal value drawer on click on active version', async () => {
    // GIVEN
    const user = userEvent.setup();

    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecret1.path),
    );

    await assertVersionDatagridVisilibity();

    const versionLink = await getOdsButtonByLabel({
      container,
      label: versionActiveMock.id.toString(),
      isLink: true,
      disabled: false,
    });

    // WHEN
    user.click(versionLink);

    // THEN
    await assertTextVisibility(labels.secretManager.values);
  });
});
