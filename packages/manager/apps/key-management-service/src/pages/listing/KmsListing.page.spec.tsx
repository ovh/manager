import { screen, waitFor } from '@testing-library/react';
import {
  assertOdsModalVisibility,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp('/', { nbOkms: 0 });

    expect(screen.getByText(labels.onboarding.title)).toBeVisible();

    expect(
      screen.queryByText(labels.listing.key_management_service_listing_title),
    ).not.toBeInTheDocument();
  });

  it('should display the kms listing page', async () => {
    await renderTestApp();

    expect(
      screen.getByText(labels.listing.key_management_service_listing_title),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it(`should navigate to the kms creation form on click on "${labels.listing.key_management_service_listing_add_kms_button}" button`, async () => {
    const { container } = await renderTestApp();

    const button = await getOdsButtonByLabel({
      container,
      label: labels.listing.key_management_service_listing_add_kms_button,
      altLabel: 'key_management_service_listing_add_kms_button',
    });

    await waitFor(() => userEvent.click(button));

    await assertTextVisibility(
      labels.create.key_management_service_create_subtitle,
    );
  });

  it('should navigate to a kms dashboard on click on kms name', async () => {
    const { container } = await renderTestApp();

    const dashboardLink = await getOdsButtonByLabel({
      container,
      label: okmsMock[0].iam.displayName,
      isLink: true,
    });

    await waitFor(() => userEvent.click(dashboardLink));

    await assertTextVisibility(labels.dashboard.billing_informations);
  });

  it(`should navigate to the kms delete modal on click on "${labels.listing.key_management_service_listing_terminate}" list action button`, async () => {
    const { container } = await renderTestApp();

    const terminateButton = await getOdsButtonByLabel({
      container,
      label: labels.listing.key_management_service_listing_terminate,
    });

    await waitFor(() => userEvent.click(terminateButton));

    await assertOdsModalVisibility({ container, isVisible: true });
  });
});
