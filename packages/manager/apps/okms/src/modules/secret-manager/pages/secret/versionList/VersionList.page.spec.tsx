import userEvent from '@testing-library/user-event';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { versionActiveMock } from '@secret-manager/mocks/versions/versions.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { getOdsLinkByTestId } from '@/utils/tests/uiTestHelpers';
import { versionLinkTestId } from './VersionCells.constants';

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

    await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecret1.path),
    );

    await assertVersionDatagridVisilibity();

    const versionLink = await getOdsLinkByTestId({
      testId: versionLinkTestId(versionActiveMock.id),
      disabled: false,
    });

    // WHEN
    user.click(versionLink);

    // THEN
    await assertTextVisibility(labels.secretManager.values);
  });
});
