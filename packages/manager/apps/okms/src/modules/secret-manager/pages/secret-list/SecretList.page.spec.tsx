import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { assertVersionDatagridVisilibity } from '@secret-manager/utils/tests/versionList';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getOdsButtonByIcon,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { PATH_LABEL } from '@/constants';
import { assertRegionSelectorIsVisible } from '@/modules/secret-manager/utils/tests/regionSelector';

import { CREATE_VERSION_DRAWER_TEST_IDS } from '../drawers/create-version-drawer/CreateVersionDrawer.constants';

const mockOkms = okmsRoubaix1Mock;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretList(mockOkms.id);

const renderPage = async () => {
  const results = await renderTestApp(mockPageUrl);

  // Check title
  await assertTextVisibility(labels.secretManager.secret_manager, {}, { timeout: 5_000 });

  return results;
};

// TEMP fix to ensure ods links and buttons are properly rendered
const assertDatagridIsLoaded = async (container: HTMLElement) => {
  await waitFor(() => {
    const skeletons = container.querySelectorAll<HTMLElement>('ods-skeleton');
    expect(skeletons.length).toBe(0);
  });
};

describe('Secret list page test suite', () => {
  it('should display the secrets list page', async () => {
    await renderPage();

    await assertTextVisibility(labels.secretManager.secret_manager);
  });

  it('should display the breadcrumb', async () => {
    await renderPage();

    await assertBreadcrumbItems(['RootBreadcrumbItem', 'OkmsBreadcrumbItem']);
  });

  it('should display the region selector', async () => {
    const { container } = await renderPage();

    await assertRegionSelectorIsVisible(container);
  });

  it('should display the secret table with all columns', async () => {
    // GIVEN
    // WHEN
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    // THEN
    const tableHeaders = [
      PATH_LABEL,
      labels.secretManager.version,
      labels.common.dashboard.creation_date,
    ];

    tableHeaders.forEach((header) => {
      expect(screen.queryAllByText(header)).toHaveLength(1);
    });

    // Wait for the first secret to appear (ensures data is loaded)
    const firstSecret = secretListMock[0];
    if (firstSecret) {
      const firstSecretTestId = `secret-list-cell-${firstSecret.path}-path`;
      await waitFor(
        () => {
          expect(screen.getByTestId(firstSecretTestId)).toBeInTheDocument();
        },
        { timeout: 10_000 },
      );

      // Then verify all secrets are visible
      secretListMock.forEach((secret) => {
        const secretTestId = `secret-list-cell-${secret.path}-path`;
        expect(screen.getByTestId(secretTestId)).toBeInTheDocument();
      });
    }
  });

  it('should navigate to a secret detail page on click on secret path', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    const secretPageLink = await getOdsButtonByLabel({
      container,
      label: secretListMock[0]?.path ?? '',
      isLink: true,
    });

    // WHEN
    await act(() => user.click(secretPageLink));

    // Wait for navigation to complete and page to load
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // THEN
    const dashboardPageLabels = await screen.findAllByText(
      labels.common.dashboard.general_information,
      {},
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    expect(dashboardPageLabels.length).toBeGreaterThan(0);
  });

  it('should navigate to OKMS dashboard on click on "manage okms" button', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    const manageOkmsButton = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.okms_manage_label,
    });

    // WHEN
    await act(() => user.click(manageOkmsButton));

    // Wait for navigation to complete and page to load
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // THEN
    await assertTextVisibility(labels.secretManager.okms_dashboard_title, {}, { timeout: 10_000 });
  });

  /* DATAGRID ACTIONS */
  it('should navigate to create a secret page on click on datagrid CTA', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    const createSecretButton = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
    });

    // WHEN
    await act(() => user.click(createSecretButton));

    // Wait for navigation to complete and page to load
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // THEN
    await assertTextVisibility(labels.secretManager.create_a_secret, {}, { timeout: 10_000 });
    await assertTextVisibility(
      labels.secretManager.create_secret_form_region_section_title,
      {},
      { timeout: 10_000 },
    );
  });

  /* ITEM MENU ACTIONS */
  type ActionCase = {
    actionLabel: string;
    assertion: () => Promise<void>;
  };

  const actionCases: ActionCase[] = [
    {
      actionLabel: labels.secretManager.reveal_secret,
      assertion: () => assertTextVisibility(labels.secretManager.values),
    },
    {
      actionLabel: labels.secretManager.add_new_version,
      assertion: async () =>
        expect(
          await screen.findByTestId(CREATE_VERSION_DRAWER_TEST_IDS.drawer),
        ).toBeInTheDocument(),
    },
    {
      actionLabel: labels.secretManager.access_versions,
      assertion: () => assertVersionDatagridVisilibity(),
    },
    {
      actionLabel: labels.secretManager.delete_secret,
      assertion: () => assertTextVisibility(labels.secretManager.delete_secret_modal_title),
    },
  ];

  describe('Menu actions', () => {
    /* TODO: temporary skipped flaky test */
    it.skip.each(actionCases)(
      'should correctly handle click on $actionLabel',
      async ({ actionLabel, assertion }) => {
        // GIVEN
        const user = userEvent.setup();
        const { container } = await renderPage();
        await assertDatagridIsLoaded(container);

        const mainActionButton = await getOdsButtonByIcon({
          container,
          iconName: 'ellipsis-vertical',
        });

        await act(() => user.click(mainActionButton));

        const actionButton = await getOdsButtonByLabel({
          container,
          label: actionLabel,
          disabled: false,
        });

        // WHEN
        await act(() => user.click(actionButton));

        // THEN
        await assertion();
      },
    );
  });
});
