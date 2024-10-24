import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';

describe('License Hycu Dashboard route test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp('/4a26ef55-d46b-4b71-88c8-76ad71b154b4');

    await waitFor(
      () =>
        expect(
          screen.getAllByText('425802fa-fb70-4b2a-9d5b-ec4de86bb40c')[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should show error if api services fail', async () => {
    await renderTestApp('/4a26ef55-d46b-4b71-88c8-76ad71b154b4', {
      getServicesKo: true,
      isGetLicenseHycuKo: true,
      isGetServiceLicenseHycuKo: true,
    });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeVisible(), {
      timeout: 30_000,
    });
  });
});
