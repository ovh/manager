import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OKMS_LIST_CELL_TEST_IDS } from '@/common/components/okms-datagrid/ListingCells.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTitleVisibility } from '@/common/utils/tests/uiTestHelpers';
import { SERVICE_KEYS_LABEL } from '@/constants';

const mockOkmsFirst = okmsRoubaix1Mock;

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing, { nbOkms: 0 });

    await assertTitleVisibility({
      title: labels.onboarding.title,
      level: 1,
    });
  });

  it('should display the kms listing page', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    await assertTitleVisibility({
      title: labels.listing.key_management_service_listing_title,
      level: 1,
    });

    expect(screen.queryByText(labels.onboarding.description)).not.toBeInTheDocument();
  });

  it('should display the listing table with all columns', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    await assertTitleVisibility({
      title: labels.listing.key_management_service_listing_title,
      level: 1,
    });

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
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    const button = await screen.findByRole('button', {
      name: labels.listing.key_management_service_listing_add_kms_button,
    });

    await waitFor(() => userEvent.click(button));

    await assertTitleVisibility({
      title: labels.create.key_management_service_create_title,
      level: 1,
    });
  });

  it('should navigate to a kms dashboard on click on kms name', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsListing);

    const kmsNameLink = await screen.findByTestId(OKMS_LIST_CELL_TEST_IDS.name(mockOkmsFirst.id));
    const dashboardUrl = KMS_ROUTES_URLS.kmsDashboard(mockOkmsFirst.id);
    expect(kmsNameLink.getAttribute('to')).toBe(dashboardUrl);
  });
});
