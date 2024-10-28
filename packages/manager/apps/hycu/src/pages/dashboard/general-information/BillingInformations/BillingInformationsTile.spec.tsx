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
          screen.getByText(labels.terminate.hycu_terminate_description),
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
          screen.getByText(labels.terminate.hycu_terminate_description),
        ).toBeVisible(),
      { timeout: 10_000 },
    );

    await act(() =>
      fireEvent.change(screen.getByLabelText('delete-input'), {
        target: { value: 'TERMINATE' },
      }),
    );

    const resiliateButton = await screen.getByText(
      labels.terminate.hycu_terminate_confirm_label,
      {
        exact: true,
      },
    );

    await waitFor(
      () => expect(resiliateButton).not.toHaveAttribute('disabled'),
      { timeout: 10_000 },
    );

    await act(() => user.click(resiliateButton));

    await waitFor(
      () => {
        expect(
          screen.queryByText(labels.terminate.hycu_terminate_description),
        ).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );
  });
});
