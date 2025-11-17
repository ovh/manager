import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { labels } from '@/common/utils/tests/init.i18n';
import { PAGE_SPINNER_TEST_ID } from '@/common/components/page-spinner/PageSpinner.constants';
import { OKMS_DASHBOARD_TEST_IDS } from './OkmsDashboard.constants';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsMock[0].id);

vi.mock(
  '@/common/components/okms-dashboard/OkmsDomainDashboardTiles.component',
  async (original) => ({
    ...(await original()),
    OkmsDomainDashboardTiles: vi.fn(() => (
      <div data-testid={OKMS_DASHBOARD_TEST_IDS.okmsDashboardTiles} />
    )),
  }),
);

describe('OkmsDashboard page test suite', () => {
  it('should display a PageSpinner while the data is fetched', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl);

    // THEN
    await waitFor(
      () => expect(screen.getByTestId(PAGE_SPINNER_TEST_ID)).toBeVisible(),
      { timeout: 5000 },
    );
  });

  it('should display an error when there is an API error', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl, { isOkmsKO: true });

    // THEN
    await waitFor(
      () =>
        expect(
          screen.getByTestId(OKMS_DASHBOARD_TEST_IDS.errorBanner),
        ).toBeVisible(),
      {
        timeout: 5000,
      },
    );
  });

  it('should display the page', async () => {
    // GIVEN

    // WHEN
    await renderTestApp(mockPageUrl);

    // THEN
    await assertTextVisibility(labels.secretManager.okms_dashboard_title);

    await assertBreadcrumbItems([
      'RootBreadcrumbItem',
      'OkmsBreadcrumbItem',
      'OkmsDashboardBreadcrumbItem',
    ]);

    expect(
      screen.getByTestId(OKMS_DASHBOARD_TEST_IDS.okmsDashboardTiles),
    ).toBeInTheDocument();
  });
});
