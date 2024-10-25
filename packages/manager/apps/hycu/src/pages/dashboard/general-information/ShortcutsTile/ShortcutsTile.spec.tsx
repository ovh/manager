import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

describe('License Hycu shortcuts tile for dashboard test suite', () => {
  it('should show links of service to activate', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
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
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
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
          screen.getByText(labels.dashboard.hycu_dashboard_link_regenerate),
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

  it('should show links of services activated', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
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
          screen.getByText(labels.dashboard.hycu_dashboard_link_regenerate),
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

  it('Can open activate modal with IAM authorization', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.TO_ACTIVATE,
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('hycu_link_activated_test_id'),
        ).not.toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );
    await act(() =>
      user.click(screen.getByTestId('hycu_link_activated_test_id')),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_license_activate_description,
          ),
        ).toBeVisible(),
      { timeout: 20_000 },
    );
  });

  it("Can't open activate modal without IAM authorization", async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[1].serviceName}`, {
      licenseStatus: LicenseStatus.TO_ACTIVATE,
    });

    await waitFor(
      () =>
        expect(screen.getByTestId('hycu_link_activated_test_id')).toBeVisible(),
      { timeout: 30_000 },
    );

    await user.click(screen.getByTestId('hycu_link_activated_test_id'));

    await waitFor(
      () =>
        expect(
          screen.queryByText(
            labels.dashboard.hycu_dashboard_license_activate_description,
          ),
        ).not.toBeInTheDocument(),
      { timeout: 20_000 },
    );
  });

  it('Can open regenerate modal with IAM authorization', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('hycu_link_regenerate_test_id'),
        ).not.toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );
    await act(() =>
      user.click(screen.getByTestId('hycu_link_regenerate_test_id')),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          ),
        ).toBeVisible(),
      { timeout: 20_000 },
    );
  });

  it("Can't open regenerate modal without IAM authorization", async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[1].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () =>
        expect(
          screen.getByTestId('hycu_link_regenerate_test_id'),
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await act(() =>
      user.click(screen.getByTestId('hycu_link_regenerate_test_id')),
    );

    await waitFor(
      () =>
        expect(
          screen.queryByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          ),
        ).not.toBeInTheDocument(),
      { timeout: 20_000 },
    );
  });
});
