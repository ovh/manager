import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { PATH_LABEL, URN_LABEL } from '@/constants';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockSecret = mockSecret1;
const mockSecretPath = mockSecret.path;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secret(mockOkmsId, mockSecretPath);

describe('Secret page test suite', () => {
  it('should display an error if the API is KO', async () => {
    // GIVEN isSecretKO
    // WHEN
    await renderTestApp(mockPageUrl, { isSecretKO: true });

    // THEN
    expect(await screen.findByAltText('OOPS', {}, WAIT_FOR_DEFAULT_OPTIONS)).toBeInTheDocument();
  });

  it('should display the secret page', async () => {
    // GIVEN
    // WHEN
    const { container } = await renderTestApp(mockPageUrl);

    // THEN
    await assertBreadcrumbItems([
      'RootBreadcrumbItem',
      'OkmsBreadcrumbItem',
      'SecretBreadcrumbItem',
    ]);

    const labelOnce = [
      // tabs
      labels.secretManager.versions,
      // general information tile
      PATH_LABEL,
      URN_LABEL,
      labels.secretManager.last_update,
      // settings tile
      labels.secretManager.settings,
      labels.secretManager.maximum_number_of_versions,
      labels.secretManager.cas_with_description,
      // settings tile values
      mockSecret.metadata.deactivateVersionAfter,
      mockSecret.metadata.maxVersions,
      labels.secretManager.activated,
      // actions tile
      labels.secretManager.actions,
    ];

    const labelTwice = [
      // tabs
      labels.common.dashboard.general_information,
      // title & general information tile
      mockSecret.path,
    ];

    // Check labels appearing once
    await Promise.all(
      labelOnce.map(async (text) => {
        await assertTextVisibility(text.toString());
      }),
    );

    // Check labels appearing twice
    await Promise.all(
      labelTwice.map(async (text) => {
        expect(await screen.findAllByText(text, {}, WAIT_FOR_DEFAULT_OPTIONS)).toHaveLength(2);
      }),
    );

    // Check clipboard component
    expect(container.querySelector(`ods-clipboard[value="${mockSecret.iam.urn}"]`)).toBeVisible();

    // check actions
    const revealSecretLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.reveal_secret,
      isLink: true,
    });

    expect(revealSecretLink).toBeVisible();

    const addNewVersionLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.add_new_version,
      isLink: true,
    });

    expect(addNewVersionLink).toBeVisible();

    const deleteSecretLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.delete_secret,
      isLink: true,
    });

    expect(deleteSecretLink).toBeVisible();
  });

  /* TABS */
  describe('Secret page tabs', () => {
    it(`should navigate to the version list page on click on versions tab`, async () => {
      // GIVEN
      const user = userEvent.setup();
      await renderTestApp(mockPageUrl);

      expect(
        await screen.findAllByText(mockSecret.path, {}, WAIT_FOR_DEFAULT_OPTIONS),
      ).toHaveLength(2);

      // WHEN
      await act(async () => {
        await user.click(screen.getByText(labels.secretManager.versions));
      });

      // THEN
      await assertVersionDatagridVisilibity();
    });
  });
});
