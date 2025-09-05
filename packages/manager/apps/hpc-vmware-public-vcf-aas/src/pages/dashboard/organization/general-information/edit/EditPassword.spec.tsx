import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../../../test-utils';
import { urls, subRoutes } from '../../../../../routes/routes.constant';

const initialRoute = urls.resetPassword.replace(
  subRoutes.dashboard,
  organizationList[0].id,
);

const {
  managed_vcd_dashboard_password_modal_title: title,
  managed_vcd_dashboard_password_modal_subtitle: content,
  managed_vcd_dashboard_password_renew_success: success,
  managed_vcd_dashboard_password_renew_error: error,
} = labels.dashboard;

const checkModalContent = () => {
  expect(screen.getByText(title)).toBeVisible();
  expect(screen.getByText(content)).toBeVisible();
};

describe('Delete Vrack Network Page', () => {
  it('should delete the network and display a success banner', async () => {
    await renderTest({ initialRoute });

    // check modal content
    await waitFor(() => checkModalContent(), { timeout: 10_000 });
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    expect(submitCta).toBeEnabled();
    await act(() => userEvent.click(submitCta));

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), {
      timeout: 10_000,
    });

    // check success banner
    expect(screen.getByText(success)).toBeVisible();
  });

  it('should display an error if updateService is KO', async () => {
    await renderTest({
      initialRoute,
      isOrganizationResetPasswordKo: true,
    });

    // check modal content
    await waitFor(() => checkModalContent(), { timeout: 10_000 });
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    await waitFor(
      async () => {
        expect(submitCta).toBeEnabled();
        await act(() => userEvent.click(submitCta));
      },
      { timeout: 10_000 },
    );

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), {
      timeout: 10_000,
    });

    // check error banner
    const testError = error.replace('{{errorApi}}', '');
    expect(screen.getByText(testError)).toBeVisible();
  });
});
