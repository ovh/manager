import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event';
import { act, screen, waitFor } from '@testing-library/react';
import { vi, vitest } from 'vitest';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';
import { downloadTextAsFile } from '@/utils/downloadTextAsFile';
import { LICENSE_FILE_NAME_TEMPLATE } from '@/constants';

describe('License Hycu general informations tile for dashboard test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.commonDashboard.general_information)[1],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(screen.getByText(labels.commonDashboard.name)).toBeVisible();
    expect(screen.getByText(labels.status.status)).toBeVisible();
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
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.commonDashboard.general_information)[1],
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
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.TO_ACTIVATE,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.commonDashboard.general_information)[1],
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

  it('Can open download modal with IAM authorization', async () => {
    vitest.mock('@/utils/downloadTextAsFile', () => ({
      downloadTextAsFile: vi.fn(),
    }));

    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('dashboard-license-download-link'),
        ).not.toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );
    await act(() =>
      user.click(screen.getByTestId('dashboard-license-download-link')),
    );

    await waitFor(
      () =>
        expect(downloadTextAsFile).toHaveBeenCalledWith(
          LICENSE_FILE_NAME_TEMPLATE.replace(
            '{serviceName}',
            licensesHycu[0].serviceName,
          ),
          'my license content',
        ),
      { timeout: 20_000 },
    );
  });

  it("Can't open download modal without IAM authorization", async () => {
    await renderTestApp(`/${licensesHycu[1].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('dashboard-license-download-link'),
        ).toBeVisible();
        expect(
          screen.getByTestId('dashboard-license-download-link'),
        ).toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );
  });
});
