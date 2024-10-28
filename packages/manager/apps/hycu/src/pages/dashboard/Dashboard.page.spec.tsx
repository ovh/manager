import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

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
      isGetServiceLicenseHycuKo: true,
    });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeVisible(), {
      timeout: 30_000,
    });
  });
});
