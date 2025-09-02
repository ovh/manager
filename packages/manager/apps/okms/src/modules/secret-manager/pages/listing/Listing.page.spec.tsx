import { screen, act, waitFor } from '@testing-library/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import {
  assertTextVisibility,
  getOdsButtonByIcon,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import userEvent from '@testing-library/user-event';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { assertRegionSelectorIsVisible } from '@/modules/secret-manager/utils/tests/regionSelector';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { assertVersionDatagridVisilibity } from '../dashboard/versions/Versions.page.spec';

const mockOkmsId = '12345';
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretListing(mockOkmsId);

const renderPage = async () => {
  const results = await renderTestApp(mockPageUrl);

  // Check title
  await assertTextVisibility(labels.secretManager.common.secret_manager);

  return results;
};

// TEMP fix to ensure ods links and buttons are properly rendered
const assertDatagridIsLoaded = async (container: HTMLElement) => {
  await waitFor(async () => {
    const skeletons = container.querySelectorAll<HTMLElement>('ods-skeleton');
    expect(skeletons.length).toBe(0);
  });
};

describe('Secrets listing test suite', () => {
  it('should display the secrets listing page', async () => {
    await renderPage();
  });

  it('should display the breadcrumb', async () => {
    await renderPage();

    await assertBreadcrumbItems(['RootBreadcrumbItem', 'DomainBreadcrumbItem']);
  });

  it('should display the region selector', async () => {
    const { container } = await renderPage();

    await assertRegionSelectorIsVisible(container);
  });

  it('should display the listing table with all columns', async () => {
    // GIVEN
    // WHEN
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    // THEN
    const tableHeaders = [
      labels.secretManager.common.path,
      labels.secretManager.common.version,
      labels.common.dashboard.creation_date,
    ];

    tableHeaders.forEach((header) => {
      expect(screen.queryAllByText(header)).toHaveLength(1);
    });

    secretsMock.forEach(async (secret) => {
      await assertTextVisibility(secret.path);
    });
  });

  it('should navigate to a secret detail page on click on secret path', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    const secretPageLink = await getOdsButtonByLabel({
      container,
      label: secretsMock[0].path,
      isLink: true,
    });

    // WHEN
    await act(() => user.click(secretPageLink));

    // THEN
    const dashboardPageLabels = await screen.findAllByText(
      labels.secretManager.dashboard.general_information,
      {},
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    expect(dashboardPageLabels.length).toBeGreaterThan(0);
  });

  /* DATAGRID ACTIONS */
  it('should navigate to create a secret page on click on datagrid CTA', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderPage();
    await assertDatagridIsLoaded(container);

    const createSecretButton = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.common.create_secret,
    });

    // WHEN
    await act(() => user.click(createSecretButton));

    // THEN
    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(
      labels.secretManager.create.domain_section_title,
    );
  });

  /* ITEM MENU ACTIONS */
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
      actionLabel: labels.secretManager.common.access_versions,
      assertion: () => assertVersionDatagridVisilibity(),
    },
    {
      actionLabel: labels.secretManager.common.delete_secret,
      assertion: () =>
        assertTextVisibility(
          labels.secretManager.common.delete_secret_modal_title,
        ),
    },
  ];

  describe('Menu actions', () => {
    it.each(actionCases)(
      'should correctly handle click on $actionLabel',
      async ({ actionLabel, assertion }) => {
        // GIVEN
        const user = userEvent.setup();
        const { container } = await renderPage();
        await assertDatagridIsLoaded(container);

        const mainActionButton = await getOdsButtonByIcon({
          container,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
