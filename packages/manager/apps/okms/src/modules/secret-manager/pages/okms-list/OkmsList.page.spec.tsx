import {
  regionWithMultipleOkms,
  regionWithoutOkms,
} from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { assertTextVisibility, getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { OKMS_LIST_CELL_TEST_IDS } from '@/common/components/okms-datagrid/ListingCells.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertRegionSelectorIsVisible } from '@/modules/secret-manager/utils/tests/regionSelector';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.okmsList(regionWithMultipleOkms.region);

const expectOkmsListPageToBeDisplayed = async (container: HTMLElement) => {
  const user = userEvent.setup();

  // Wait for page to fully load (spinner to disappear)
  await waitFor(
    () => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Check the page title
  await assertTextVisibility(labels.secretManager.okms_list, {}, { timeout: 5_000 });

  // Check there is clipboard components displayed in the datagrid
  const firstOkmsId = regionWithMultipleOkms?.okmsMock?.[0]?.id ?? '';
  const firstClipboardTestId = OKMS_LIST_CELL_TEST_IDS.id(firstOkmsId);
  await waitFor(
    () => {
      expect(screen.getByTestId(firstClipboardTestId)).toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Check the first okms link on the datagrid
  const okmsNameLink = await getOdsButtonByLabel({
    container,
    label: regionWithMultipleOkms?.okmsMock?.[0]?.iam?.displayName ?? '',
    isLink: true,
  });
  expect(okmsNameLink).toBeEnabled();

  return { user, okmsNameLink };
};

describe('Okms List page test suite', () => {
  it('should display the okms listing page', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await expectOkmsListPageToBeDisplayed(container);
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

    await expectOkmsListPageToBeDisplayed(container);

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

    const { user } = await expectOkmsListPageToBeDisplayed(container);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
    });

    await act(async () => {
      await user.click(button);
    });

    await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
  });

  it('should navigate to the secrets listing page on click on okms name', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const { user, okmsNameLink } = await expectOkmsListPageToBeDisplayed(container);

    await act(async () => {
      await user.click(okmsNameLink);
    });

    await assertTextVisibility(labels.secretManager.secret_manager);
  });

  describe('should redirect to the default region page', () => {
    it('when the kms list is empty', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.okmsList(regionWithoutOkms.region),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await expectOkmsListPageToBeDisplayed(container);
    });

    it('when the region is not valid', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.okmsList('notValidRegionName'),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await expectOkmsListPageToBeDisplayed(container);
    });
  });

  it('should redirect to the secret list when the kms list has one item', async () => {
    await renderTestApp(mockPageUrl, { nbOkms: 1 });

    await assertTextVisibility(labels.secretManager.secret_manager);
  });
});
