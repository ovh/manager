import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { OKMS_DOMAIN_DASHBOARD_TILES_TEST_IDS } from '@/common/components/okms-dashboard/okms-domain-dashboard-tiles/OkmsDomainDashboardTiles.constants';
import { PAGE_SPINNER_TEST_ID } from '@/common/components/page-spinner/PageSpinner.constants';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTitleVisibility } from '@/common/utils/tests/uiTestHelpers';

import { OKMS_DASHBOARD_TEST_IDS } from './OkmsDashboard.constants';

const mockOkms = okmsRoubaix1Mock;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.okmsDashboard(mockOkms.id);

// We mock @ovh-ux/manager-billing-informations module because it takes 3 secondes to load
// And make the test suite slow
vi.mock('@ovh-ux/manager-billing-informations', () => ({
  BillingInformationsTileStandard: vi.fn(() => <div>BillingInformationsTileStandard</div>),
}));

describe('OkmsDashboard page test suite', () => {
  it('should display a PageSpinner while the data is fetched', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl);

    // THEN
    await waitFor(() => expect(screen.getByTestId(PAGE_SPINNER_TEST_ID)).toBeVisible(), {
      timeout: 3000,
    });
  });

  it('should display an error when there is an API error', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl, { isOkmsKO: true });

    // THEN
    await waitFor(
      () => expect(screen.getByTestId(OKMS_DASHBOARD_TEST_IDS.errorBanner)).toBeVisible(),
      {
        timeout: 5000,
      },
    );
  });

  it('should display the page', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl, { feature: KMS_FEATURES.LOGS });

    // THEN
    await assertTitleVisibility({
      title: labels.secretManager.okms_dashboard_title,
      level: 1,
    });

    await assertBreadcrumbItems([
      'RootBreadcrumbItem',
      'OkmsBreadcrumbItem',
      'OkmsDashboardBreadcrumbItem',
    ]);

    expect(
      await screen.findByTestId(OKMS_DOMAIN_DASHBOARD_TILES_TEST_IDS.okmsDashboardTiles),
    ).toBeInTheDocument();
    expect(await screen.findByTestId('general-information')).toBeVisible();
    expect(await screen.findByTestId('logs')).toBeVisible();
  });
});
