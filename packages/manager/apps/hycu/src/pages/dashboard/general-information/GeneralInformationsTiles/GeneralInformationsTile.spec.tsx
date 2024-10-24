import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { LicenseStatus } from '@/types/hycu.details.interface';

describe('License Hycu general informations tile for dashboard test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp('/4a26ef55-d46b-4b71-88c8-76ad71b154b4');

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_generals_informations_title,
          )[1],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_name),
    ).toBeVisible();
    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_status),
    ).toBeVisible();
    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_pack_type),
    ).toBeVisible();
    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_controller_id),
    ).toBeVisible();
    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_license_key),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.dashboard.hycu_dashboard_download_license_file),
    ).not.toBeInTheDocument();
  });

  it('should show download license button when license is activated', async () => {
    await renderTestApp('/4a26ef55-d46b-4b71-88c8-76ad71b154b4', {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_generals_informations_title,
          )[1],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_download_license_file,
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(
      screen.queryByText(labels.dashboard.hycu_dashboard_wait_for_activation),
    ).not.toBeInTheDocument();
  });

  it('should show wait for activation if license is not activated', async () => {
    await renderTestApp('/4a26ef55-d46b-4b71-88c8-76ad71b154b4', {
      licenseStatus: LicenseStatus.TO_ACTIVATE,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_generals_informations_title,
          )[1],
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_wait_for_activation,
          )[0],
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    expect(
      screen.queryByText(labels.dashboard.hycu_dashboard_download_license_file),
    ).not.toBeInTheDocument();
  });
});
