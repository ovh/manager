import { act, screen } from '@testing-library/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { assertVersionDatagridVisilibity } from './versions/Versions.page.spec';

const mockOkmsId = '12345';
const mockSecret = secretsMock[0];
const mockSecretPath = mockSecret.path;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretDashboard(
  mockOkmsId,
  mockSecretPath,
);

describe('Secrets dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    // GIVEN isSecretKO
    // WHEN
    await renderTestApp(mockPageUrl, { isSecretKO: true });

    // THEN
    expect(
      await screen.findByAltText('OOPS', {}, WAIT_FOR_DEFAULT_OPTIONS),
    ).toBeInTheDocument();
  });

  it('should display the secret dashboard page', async () => {
    // GIVEN
    // WHEN
    const { container } = await renderTestApp(mockPageUrl);

    // THEN
    await assertBreadcrumbItems([
      'RootBreadcrumbItem',
      'DomainBreadcrumbItem',
      'SecretBreadcrumbItem',
    ]);

    const labelOnce = [
      // tabs
      labels.secretManager.common.versions,
      // general information tile
      labels.secretManager.common.path,
      labels.secretManager.common.urn,
      labels.secretManager.dashboard.last_update,
      // settings tile
      labels.secretManager.dashboard.settings,
      mockSecret.metadata.deactivateVersionAfter,
      labels.secretManager.dashboard.maximum_number_of_versions,
      mockSecret.metadata.maxVersions,
      labels.secretManager.dashboard.cas_with_description,
      labels.secretManager.dashboard.deactivated,
      // actions tile
      labels.secretManager.common.actions,
    ];

    const labelTwice = [
      // tabs
      labels.secretManager.dashboard.general_information,
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
        expect(
          await screen.findAllByText(text, {}, WAIT_FOR_DEFAULT_OPTIONS),
        ).toHaveLength(2);
      }),
    );

    // Check clipboard component
    expect(
      container.querySelector(`ods-clipboard[value="${mockSecret.iam.urn}"]`),
    ).toBeVisible();

    // check actions
    const revealSecretLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.common.reveal_secret,
      isLink: true,
    });

    expect(revealSecretLink).toBeVisible();

    const addNewVersionLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.common.add_new_version,
      isLink: true,
    });

    expect(addNewVersionLink).toBeVisible();

    const deleteSecretLink = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.common.delete_secret,
      isLink: true,
    });

    expect(deleteSecretLink).toBeVisible();
  });

  /* TABS */
  describe('dashboard tabs', () => {
    it(`should navigate to the versions page on click on versions tab`, async () => {
      // GIVEN
      const user = userEvent.setup();
      await renderTestApp(mockPageUrl);

      expect(
        await screen.findAllByText(
          mockSecret.path,
          {},
          WAIT_FOR_DEFAULT_OPTIONS,
        ),
      ).toHaveLength(2);

      // WHEN
      user.click(screen.getByText(labels.secretManager.common.versions));

      // THEN
      await assertVersionDatagridVisilibity();
    });
  });

  /* ACTIONS TILE */
  type ActionCase = {
    actionLabel: string;
    assertion: () => Promise<void>;
  };

  const actionCases: ActionCase[] = [
    {
      actionLabel: labels.secretManager.common.reveal_secret,
      assertion: () => assertTextVisibility(labels.secretManager.common.values),
    },
    {
      actionLabel: labels.secretManager.common.add_new_version,
      assertion: () =>
        assertTextVisibility(labels.secretManager.create.data_textarea_label),
    },
    {
      actionLabel: labels.secretManager.common.delete_secret,
      assertion: () =>
        assertTextVisibility(
          labels.secretManager.common.delete_secret_modal_title,
        ),
    },
  ];

  describe('Actions tile', () => {
    it.each(actionCases)(
      'should correctly handle click on $actionLabel',
      async ({ actionLabel, assertion }) => {
        // GIVEN
        const user = userEvent.setup();
        const { container } = await renderTestApp(mockPageUrl);

        const actionLink = await getOdsButtonByLabel({
          container,
          label: actionLabel,
          isLink: true,
        });

        // WHEN
        await act(() => user.click(actionLink));

        // THEN
        await assertion();
      },
    );
  });
});
