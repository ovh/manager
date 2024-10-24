import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';

describe('License Hycu billing information tile for dashboard test suite', () => {
  it('should show informations of services', async () => {
    await renderTestApp('/fake-id');

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
});
