import { vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

const createFakeFile = () => {
  // Create a Blob with the desired content
  const content = 'Hello, this is hycu license! Yes trust me !';
  const blob = new Blob([content], { type: 'text/plain' });

  // Convert the Blob to a File object
  return new File([blob], 'license.req', {
    type: 'text/plain',
    lastModified: Date.now(),
  });
};

describe('License Hycu regenerate license route test suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should show modal title', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}/regenerate-license`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(
      screen.getByTestId('hycu-dashboard-regenerate-upload-confirm'),
    ).toBeVisible();

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should show error if api services fail', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}/regenerate-license`, {
      getServicesKo: true,
      isGetLicenseHycuKo: true,
      isGetServiceLicenseHycuKo: true,
    });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeVisible(), {
      timeout: 30_000,
    });
  });

  it('should not call mutate when form is empty', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}/regenerate-license`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    const submitButton = screen.getByTestId(
      'hycu-dashboard-regenerate-upload-confirm',
    );

    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should call mutate when form valid and submitted', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}/regenerate-license`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_regenerate_upload_confirm,
          )[0],
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    const submitButton = screen.getByText(
      labels.dashboard.hycu_dashboard_regenerate_upload_confirm,
    );

    await act(() =>
      user.upload(screen.getByTestId('license-file-input'), createFakeFile()),
    );

    await act(() => user.click(submitButton));

    expect(
      screen.queryByText(
        labels.dashboard.hycu_dashboard_upload_license_required,
      ),
    ).not.toBeInTheDocument();

    await waitFor(
      () =>
        expect(
          screen.queryByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          ),
        ).not.toBeInTheDocument(),
      { timeout: 10_000 },
    );
  });

  it('should show a error if server fail', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}/regenerate-license`, {
      isPostLicenseHycuKo: true,
    });

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_regenerate_upload_confirm,
          )[0],
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    const submitButton = screen.getByText(
      labels.dashboard.hycu_dashboard_regenerate_upload_confirm,
    );

    await act(() =>
      user.upload(screen.getByTestId('license-file-input'), createFakeFile()),
    );

    await act(() => user.click(submitButton));

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('disabled');
        expect(
          screen.queryByText(
            labels.dashboard.hycu_dashboard_license_regenerate_description,
          ),
        ).toBeVisible();
        expect(
          screen.queryAllByText(
            labels.dashboard.hycu_dashboard_regenerate_error_message,
          )[1],
        ).toBeVisible();
      },
      { timeout: 10_000 },
    );
  });
});
