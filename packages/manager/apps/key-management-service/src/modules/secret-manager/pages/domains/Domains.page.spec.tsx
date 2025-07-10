import { act, screen, waitFor } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';

const mockRegion = 'eu-west-rbx';
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretDomains(mockRegion);

const renderAndCheckPage = async (url: string) => {
  const { container } = await renderTestApp(url);
  const user = userEvent.setup();

  await assertTextVisibility(labels.secretManager.domains.domains_list);

  expect(
    (await screen.findAllByTestId('clipboard', {}, { timeout: 3000 })).length,
  ).toBeGreaterThan(0);

  return { container, user };
};

describe('Secret domains listing test suite', () => {
  it('should display the okms listing page', async () => {
    await renderAndCheckPage(mockPageUrl);
  });

  it('should display the listing table with all columns', async () => {
    await renderAndCheckPage(mockPageUrl);

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
    const { container, user } = await renderAndCheckPage(mockPageUrl);

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
    const { container, user } = await renderAndCheckPage(mockPageUrl);

    await assertTextVisibility(labels.secretManager.domains.domains_list);

    const okmsNameLink = await getOdsButtonByLabel({
      container,
      label: okmsMock[0].iam.displayName,
      isLink: true,
    });

    user.click(okmsNameLink);

    await assertTextVisibility(labels.secretManager.common.secret_manager);
  });

  it('should redirect to the default region page when the kms list is empty', async () => {
    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretDomains('notValidRegionName'),
    );

    // manager redirects to the root page
    // then to the default region page that displays the okms list

    // Check some clipboard elements are present
    expect(
      (await screen.findAllByTestId('clipboard', {}, { timeout: 3000 })).length,
    ).toBeGreaterThan(0);

    // Check the okms link with the first okmsMock name is present
    const okmsNameLink = await getOdsButtonByLabel({
      container,
      label: okmsMock[0].iam.displayName,
      isLink: true,
    });
    expect(okmsNameLink).toBeInTheDocument();
  });
});
