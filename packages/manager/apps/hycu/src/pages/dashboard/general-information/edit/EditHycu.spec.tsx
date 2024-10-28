import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { licensesHycu } from '@/mocks/licenseHycu/licenseHycu.data';

describe('License Hycu edit name modal test suite', () => {
  it('Can open regenerate modal with IAM authorization', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${licensesHycu[0].serviceName}`, {
      licenseStatus: LicenseStatus.ACTIVATED,
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('edit-hycu-displayname-action'),
        ).toBeVisible();
        expect(
          screen.getByTestId('edit-hycu-displayname-action'),
        ).not.toHaveAttribute('disabled');
      },
      { timeout: 30_000 },
    );
    await act(() =>
      user.click(screen.getByTestId('edit-hycu-displayname-action')),
    );

    await waitFor(
      () =>
        expect(
          screen.queryAllByText(
            labels.dashboard.hycu_dashboard_update_display_name_pattern_message,
          )[0],
        ).toBeVisible(),
      { timeout: 20_000 },
    );
  });
});
