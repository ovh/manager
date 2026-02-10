import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { versionActiveMock } from '@secret-manager/mocks/versions/versions.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { screen } from '@testing-library/react';

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

  it('should have the correct href attribute to open the value drawer', async () => {
    // GIVEN
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.versionList(mockOkmsId, mockSecret1.path));

    await assertVersionDatagridVisilibity();

    const versionLink = await screen.findByText(versionActiveMock.id.toString());

    const expectedHref = SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
      mockOkmsId,
      mockSecret1.path,
      versionActiveMock.id,
    );
    expect(versionLink.getAttribute('to')).toBe(expectedHref);
  });
});
