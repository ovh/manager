import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';
import HYCU_CONFIG from '@/hycu.config';

describe('License Hycu listing test suite', () => {
  it('should redirect to the onboarding page when the license hycu list is empty', async () => {
    await renderTestApp('/', { nbLicenseHycu: 0 });

    expect(screen.getByText(HYCU_CONFIG.rootLabel)).toBeVisible();
    expect(
      screen.getByText(labels.onboarding.hycu_onboarding_guide1_title),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(labels.listing.hycu_name),
    ).not.toBeInTheDocument();
  });

  it('should display the hycu listing page', async () => {
    await renderTestApp();

    expect(screen.getByText(labels.listing.hycu_order)).toBeVisible();

    expect(
      screen.queryByText(labels.onboarding.hycu_onboarding_guide1_title),
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
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_generals_informations_title,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it('should navigate to hycu order on click order button ', async () => {
    await renderTestApp();

    await act(() =>
      userEvent.click(screen.getByText(labels.listing.hycu_order)),
    );

    await waitFor(
      () =>
        expect(screen.getByText(labels.order.hycu_order_title)).toBeVisible(),
      { timeout: 30_000 },
    );
  });

  it('open terminate modal on click on resiliate', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}`);

    await waitFor(
      () => {
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_subscription_title,
          )[0],
        ).toBeVisible();
        expect(
          screen.getByText(labels.dashboard.hycu_dashboard_link_terminate),
        ).not.toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );

    const resiliateButton = await screen.getByText(
      labels.dashboard.hycu_dashboard_link_terminate,
    );

    await act(() => user.click(resiliateButton));

    await waitFor(
      () =>
        expect(
          screen.getByTestId('manager-delete-modal-description'),
        ).toBeVisible(),
      { timeout: 10_000 },
    );
  });

  it('See success message after terminate service', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}/terminate`);

    await waitFor(
      () =>
        expect(
          screen.getByTestId('manager-delete-modal-description'),
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    const resiliateButton = await screen.findByTestId(
      'manager-delete-modal-confirm',
    );
    await act(() => user.click(resiliateButton));

    await waitFor(
      () => {
        expect(
          screen.queryByText(labels.terminate.hycu_terminate_success_message),
        ).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );
  });
});
