import { userEvent } from '@testing-library/user-event';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

describe('License Hycu billing information tile for dashboard test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp(`/${licensesHycu[0].serviceName}`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.dashboard.hycu_dashboard_subscription_title,
          )[0],
        ).toBeVisible(),
      { timeout: 30_000 },
    );

    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_label_renew),
    ).toBeVisible();
    expect(
      screen.getByText(labels.dashboard.hycu_dashboard_field_label_contacts),
    ).toBeVisible();
    expect(
      screen.getByText(
        labels.dashboard.hycu_dashboard_field_label_date_creation,
      ),
    ).toBeVisible();
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
