import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { LicenseStatus } from '@/type/hycu.details.interface';

describe('License Hycu shortcuts tile for dashboard test suite', () => {
  it('should show links of service to activate', async () => {
    await renderTestApp('/fake-id', {
      licenseStatus: LicenseStatus.TO_ACTIVATE,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_shortcuts_title,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.dashboard.hycu_dashboard_link_activate),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
    expect(
      screen.queryByText(labels.dashboard.hycu_dashboard_link_change_pack_type),
    ).not.toBeInTheDocument();
  });

  it('should show links of services activated', async () => {
    await renderTestApp('/fake-id', { licenseStatus: LicenseStatus.ACTIVATED });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_shortcuts_title,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.dashboard.hycu_dashboard_link_reactivate),
        ).toBeVisible(),
      { timeout: 20_000 },
    );
    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_link_change_pack_type,
          ),
        ).toBeVisible(),
      { timeout: 20_000 },
    );
  });
});
