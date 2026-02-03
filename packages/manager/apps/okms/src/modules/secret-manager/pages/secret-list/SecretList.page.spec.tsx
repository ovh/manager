import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT, assertTitleVisibility } from '@/common/utils/tests/uiTestHelpers';
import { invariant } from '@/common/utils/tools/invariant';
import { PATH_LABEL } from '@/constants';
import { assertRegionSelectorIsVisible } from '@/modules/secret-manager/utils/tests/regionSelector';

const mockOkms = okmsRoubaix1Mock;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretList(mockOkms.id);

const renderPage = async () => {
  const results = await renderTestApp(mockPageUrl);

  // Check title
  await assertTitleVisibility({
    title: labels.secretManager.secret_manager,
    level: 1,
    timeout: TIMEOUT.MEDIUM,
  });

  return results;
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

describe('Secret list page test suite', () => {
  it('should display the secrets list page', async () => {
    await renderPage();

    await assertTitleVisibility({
      title: labels.secretManager.secret_manager,
      level: 1,
    });
  });

  it('should display the breadcrumb', async () => {
    await renderPage();

    await assertBreadcrumbItems(['RootBreadcrumbItem', 'OkmsBreadcrumbItem']);
  });

  it('should display the region selector', async () => {
    await renderPage();
    await assertRegionSelectorIsVisible();
  });

  it('should display the secret table with all columns', async () => {
    // GIVEN
    // WHEN
    await renderPage();

    // THEN
    const tableHeaders = [
      PATH_LABEL,
      labels.secretManager.version,
      labels.common.dashboard.creation_date,
    ];

    tableHeaders.forEach((header) => {
      expect(screen.queryAllByText(header)).toHaveLength(1);
    });

    secretListMock.forEach(async (secret) => {
      await assertTextVisibility(secret.path);
    });
  });

  it('should navigate to a secret detail page on click on secret path', async () => {
    // GIVEN
    await renderPage();

    const secretPath = secretListMock[0]?.path ?? '';
    invariant(secretPath, 'Secret path is not defined');
    const secretPageLink = await screen.findByText(secretPath);

    // THEN
    expect(secretPageLink.closest('a')).toHaveAttribute(
      'href',
      SECRET_MANAGER_ROUTES_URLS.secret(mockOkms.id, secretPath),
    );
  });

  it('should navigate to OKMS dashboard on click on "manage okms" button', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderPage();

    const manageOkmsButton = screen.getByRole('button', {
      name: labels.secretManager.okms_manage_label,
    });

    // WHEN
    await user.click(manageOkmsButton);

    // THEN
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        SECRET_MANAGER_ROUTES_URLS.okmsDashboard(mockOkms.id),
      );
    });
  });

  /* DATAGRID ACTIONS */
  it('should navigate to create a secret page on click on datagrid CTA', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderPage();

    const createSecretButton = screen.getByRole('button', {
      name: labels.secretManager.create_a_secret,
    });

    // WHEN
    await user.click(createSecretButton);

    // THEN
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: SECRET_MANAGER_ROUTES_URLS.createSecret,
        search: `?okmsId=${mockOkms.id}`,
      });
    });
  });

  /* ITEM MENU ACTIONS */
  type ActionCase = {
    buttonLabel: string;
    getExpectedUrl: (secretPath: string) => string;
  };

  const actionCases: ActionCase[] = [
    {
      buttonLabel: labels.secretManager.reveal_secret,
      getExpectedUrl: (secretPath: string) =>
        SECRET_MANAGER_ROUTES_URLS.secretListSecretValueDrawer(mockOkms.id, secretPath),
    },
    {
      buttonLabel: labels.secretManager.add_new_version,
      getExpectedUrl: (secretPath: string) =>
        SECRET_MANAGER_ROUTES_URLS.secretListCreateVersionDrawer(mockOkms.id, secretPath, 1),
    },
    {
      buttonLabel: labels.secretManager.access_versions,
      getExpectedUrl: (secretPath: string) =>
        SECRET_MANAGER_ROUTES_URLS.versionList(mockOkms.id, secretPath),
    },
    {
      buttonLabel: labels.secretManager.delete_secret,
      getExpectedUrl: (secretPath: string) =>
        SECRET_MANAGER_ROUTES_URLS.secretListDeleteSecretModal(mockOkms.id, secretPath),
    },
  ];

  describe('Menu actions', () => {
    it.each(actionCases)(
      'should correctly handle click on $buttonLabel',
      async ({ buttonLabel, getExpectedUrl }) => {
        // GIVEN
        const user = userEvent.setup();
        await renderPage();

        const secret = secretListMock[0];
        invariant(secret?.path, 'Secret path is not defined');
        const secretPath: string = secret.path;

        await screen.findByText(secretPath, {}, { timeout: 3000 });

        const actionMenuTrigger = await screen.findByTestId(
          `action-menu-trigger-SecretActionMenu-${secretPath}`,
        );

        // WHEN
        await user.click(actionMenuTrigger);

        // Wait for menu to open and find the button
        const actionItem = await screen.findByText(buttonLabel, {}, { timeout: 3000 });
        await user.click(actionItem);

        // THEN
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(getExpectedUrl(secretPath));
        });
      },
    );
  });
});
