import { screen, waitFor } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import {
  regionWithMultipleOkms,
  regionWithoutOkms,
} from '@key-management-service/mocks/kms/okms.mock';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertRegionSelectorIsVisible } from '@/modules/secret-manager/utils/tests/regionSelector';
import { labels } from '@/common/utils/tests/init.i18n';
import { OKMS_LIST_CELL_TEST_IDS } from '@/common/components/okmsDatagrid/ListingCells.constants';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.okmsList(
  regionWithMultipleOkms.region,
);

const checkOkmsListPageToBeDisplayed = async (container: HTMLElement) => {
  const user = userEvent.setup();

  // Check the page title
  await assertTextVisibility(labels.secretManager.okms_list);

  // Check there is clipboard components displayed in the datagrid
  const firstOkmsId = regionWithMultipleOkms.okmsMock[0].id;
  const firstClipboardTestId = OKMS_LIST_CELL_TEST_IDS.id(firstOkmsId);
  await waitFor(() => {
    expect(screen.getByTestId(firstClipboardTestId)).toBeInTheDocument();
  });

  // Check the first okms link on the datagrid
  const okmsNameLink = await getOdsButtonByLabel({
    container,
    label: regionWithMultipleOkms.okmsMock[0].iam.displayName,
    isLink: true,
  });
  expect(okmsNameLink).toBeEnabled();

  return { user, okmsNameLink };
};

describe('Okms List page test suite', () => {
  it('should display the okms listing page', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await checkOkmsListPageToBeDisplayed(container);
  });

  it('should display the breadcrumb', async () => {
    await renderTestApp(mockPageUrl);

    await assertBreadcrumbItems(['RootBreadcrumbItem']);
  });

  it('should display the region selector', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await assertRegionSelectorIsVisible(container);
  });

  it('should display the listing table with all columns', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await checkOkmsListPageToBeDisplayed(container);

    const name = labels.listing.key_management_service_listing_name_cell;
    const id = labels.listing.key_management_service_listing_id_cell;
    const secret = labels.listing.key_management_service_listing_secret_cell;
    const status = labels.listing.key_management_service_listing_status_cell;

    expect(await screen.findAllByText(name)).toHaveLength(1);
    expect(await screen.findAllByText(id)).toHaveLength(1);
    expect(await screen.findAllByText(secret)).toHaveLength(1);
    expect(await screen.findAllByText(status)).toHaveLength(1);
  });

  it(`should navigate to the secret creation page on click on create a secret button`, async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const { user } = await checkOkmsListPageToBeDisplayed(container);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
    });

    user.click(button);

    await assertTextVisibility(
      labels.secretManager.create_secret_form_region_section_title,
    );
  });

  it('should navigate to the secrets listing page on click on okms name', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const { user, okmsNameLink } = await checkOkmsListPageToBeDisplayed(
      container,
    );

    user.click(okmsNameLink);

    await assertTextVisibility(labels.secretManager.secret_manager);
  });

  describe('should redirect to the default region page', async () => {
    it('when the kms list is empty', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.okmsList(regionWithoutOkms.region),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await checkOkmsListPageToBeDisplayed(container);
    });

    it('when the region is not valid', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.okmsList('notValidRegionName'),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await checkOkmsListPageToBeDisplayed(container);
    });
  });

  it('should redirect to the secret list when the kms list has one item', async () => {
    await renderTestApp(mockPageUrl, { nbOkms: 1 });

    await assertTextVisibility(labels.secretManager.secret_manager);
  });
});
