import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { labels } from '@/utils/tests/init.i18n';
import { licensesHycuService } from '@/mocks/serviceLicenseHycu/serviceLicenseHycu.data';

describe('License Hycu Dashboard route test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(licensesHycu[0].serviceName)[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should show error if api services fail', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      getServicesKo: true,
      isGetLicenseHycuKo: true,
      getDetailsServicesKo: true,
    });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeVisible(), {
      timeout: 30_000,
    });
  });

  it('should show error if license activation is in error', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ERROR,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_error_license_message.replace(
              '{{error}}',
              '',
            ),
          ),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
  });

  it('should show info if service is suspended', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      serviceResponse: {
        ...licensesHycuService,
        resource: {
          ...licensesHycuService.resource,
          ...{ state: 'suspended' },
        },
      },
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.hycu_dashboard_warning_license_suspended_message,
          ),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
  });
});
