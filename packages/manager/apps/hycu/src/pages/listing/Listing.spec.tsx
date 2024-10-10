import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

describe('License Hycu listing test suite', () => {
  it('should redirect to the onboarding page when the license hycu list is empty', async () => {
    await renderTestApp({ nbLicenseHycu: 0 });

    expect(screen.getByText(labels.onboarding.title)).toBeVisible();

    expect(screen.queryByText(labels.listing.title)).not.toBeInTheDocument();
  });

  it('should display the hycu listing page', async () => {
    await renderTestApp();

    expect(screen.getByText(labels.listing.title)).toBeVisible();

    expect(
      screen.queryByText(labels.onboarding.description),
    ).not.toBeInTheDocument();
  });

  it('should navigate to a hycu dashboard on click on license hycu name', async () => {
    await renderTestApp();

    await act(() =>
      userEvent.click(screen.getByText(licensesHycu[0].serviceName)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.dashboard.general_informations),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });
});
