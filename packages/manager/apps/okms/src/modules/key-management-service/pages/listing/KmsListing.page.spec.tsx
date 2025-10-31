import { act, screen, waitFor } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { labels } from '@/common/utils/tests/init.i18n';
import { SERVICE_KEYS_LABEL } from '@/constants';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing, { nbOkms: 0 });

    await waitFor(
      () => expect(screen.getByText(labels.onboarding.title)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.queryByText(labels.listing.key_management_service_listing_title),
    ).not.toBeInTheDocument();
  });

  it('should display the kms listing page', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it('should display the listing table with all columns', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const tableHeaders = [
      labels.listing.key_management_service_listing_name_cell,
      labels.listing.key_management_service_listing_id_cell,
      labels.listing.key_management_service_listing_kmip_cell,
      SERVICE_KEYS_LABEL,
      labels.listing.key_management_service_listing_region_cell,
      labels.listing.key_management_service_listing_status_cell,
    ];

    tableHeaders.forEach((header) => {
      expect(screen.queryAllByText(header)).toHaveLength(1);
    });
  });

  it(`should navigate to the kms creation form on click on "${labels.listing.key_management_service_listing_add_kms_button}" button`, async () => {
    const { container } = await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    const button = await getOdsButtonByLabel({
      container,
      label: labels.listing.key_management_service_listing_add_kms_button,
      altLabel: 'key_management_service_listing_add_kms_button',
    });

    await waitFor(() => userEvent.click(button));

    await assertTextVisibility(
      labels.create.key_management_service_create_title,
    );
  });

  it('should navigate to a kms dashboard on click on kms name', async () => {
    const { container } = await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    const dashboardLink = await getOdsButtonByLabel({
      container,
      label: okmsMock[0].iam.displayName,
      isLink: true,
    });

    await act(() => userEvent.click(dashboardLink));

    await assertTextVisibility(labels.dashboard.billing_informations);
  });
});
