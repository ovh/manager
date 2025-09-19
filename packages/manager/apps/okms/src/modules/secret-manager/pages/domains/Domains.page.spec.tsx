import { screen } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';

const mockRegion = 'eu-west-rbx';
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretDomains(mockRegion);

const checkPageToBeDisplayed = async (container: HTMLElement) => {
  const user = userEvent.setup();

  // Check the page title
  await assertTextVisibility(labels.secretManager.domains.domains_list);

  // Check there is clipboard components displayed in the datagrid
  expect(
    (await screen.findAllByTestId('clipboard', {}, WAIT_FOR_DEFAULT_OPTIONS))
      .length,
  ).toBeGreaterThan(0);

  // Check the first okms link on the datagrid
  const okmsNameLink = await getOdsButtonByLabel({
    container,
    label: okmsMock[0].iam.displayName,
    isLink: true,
  });
  expect(okmsNameLink).toBeInTheDocument();

  return { user, okmsNameLink };
};

describe('Secret domains listing test suite', () => {
  it('should display the okms listing page', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await checkPageToBeDisplayed(container);
  });

  it('should display the listing table with all columns', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await checkPageToBeDisplayed(container);

    const name = labels.listing.key_management_service_listing_name_cell;
    const id = labels.listing.key_management_service_listing_id_cell;
    const secret = labels.listing.key_management_service_listing_secret_cell;
    const status = labels.listing.key_management_service_listing_status_cell;

    expect(await screen.findAllByText(name)).toHaveLength(1);
    expect(await screen.findAllByText(id)).toHaveLength(1);
    expect(await screen.findAllByText(secret)).toHaveLength(1);
    expect(await screen.findAllByText(status)).toHaveLength(1);
  });

  it(`should navigate to the kms creation form on click on order kms button`, async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const { user } = await checkPageToBeDisplayed(container);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.create.key_management_service_create_title,
    });

    user.click(button);

    await assertTextVisibility(
      labels.create.key_management_service_create_subtitle,
    );
  });

  it('should navigate to the secrets listing page on click on domain name', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const { user, okmsNameLink } = await checkPageToBeDisplayed(container);

    user.click(okmsNameLink);

    await assertTextVisibility(labels.secretManager.common.secret_manager);
  });

  describe('should redirect to the default region page', async () => {
    it('when the kms list is empty', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretDomains('ca-east-bhs'),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await checkPageToBeDisplayed(container);
    });

    it('when the region is not valid', async () => {
      const { container } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretDomains('notValidRegionName'),
      );

      // manager redirects to the root page
      // then to the default region page that displays the okms list
      await checkPageToBeDisplayed(container);
    });
  });
});
