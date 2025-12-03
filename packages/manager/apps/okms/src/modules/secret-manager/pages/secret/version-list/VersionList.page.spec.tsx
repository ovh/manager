import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { versionActiveMock } from '@secret-manager/mocks/versions/versions.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { assertTextVisibility, getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

const mockOkmsId = '123123';

describe('Version list page test suite', () => {
  it('should display the version datagrid', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecret1.path));

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
    await act(async () => {
      await user.click(versionLink);
    });

    // THEN
    await assertTextVisibility(labels.secretManager.values);
  });
});
