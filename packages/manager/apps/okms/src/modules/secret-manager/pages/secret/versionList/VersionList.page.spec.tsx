import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import {
  versionActiveMock,
  versionListMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { getOdsButtonByLabel } from '@/utils/tests/uiTestHelpers';

const mockOkmsId = '123123';
const mockSecretPath = 'a/secret';

export const assertVersionDatagridVisilibity = async () => {
  // assert datagrid column visiblity
  await assertTextVisibility(labels.secretManager.version);
  await assertTextVisibility(labels.common.status.status);
  await assertTextVisibility(labels.common.dashboard.creation_date);
  await assertTextVisibility(labels.secretManager.expiration_date);

  // assert we display versions rows
  versionListMock.forEach(async (version) => {
    await assertTextVisibility(version.id.toString());
  });
};

describe('Version list page test suite', () => {
  it('should display the version datagrid', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecretPath),
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

    // WHEN
    const versionLink = await getOdsButtonByLabel({
      container,
      label: versionActiveMock.id.toString(),
      isLink: true,
      disabled: false,
    });

    await act(() => user.click(versionLink));

    // THEN
    await assertTextVisibility(labels.secretManager.values);
  });
});
