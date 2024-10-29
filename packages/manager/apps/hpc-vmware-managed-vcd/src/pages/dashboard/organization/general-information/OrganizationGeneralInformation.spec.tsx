import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  renderTest,
  labels,
  checkModalVisibility,
  mockSubmitNewValue,
  checkModalError,
  DEFAULT_TIMEOUT,
} from '../../../../test-utils';
import { organizationList } from '../../../../../mocks/vcd-organization/vcd-organization.mock';

const submitButtonLabel =
  labels.dashboard.managed_vcd_dashboard_edit_modal_cta_edit;

describe('Organization General Information Page', () => {
  it('modify the name of the organization', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.managed_vcd_dashboard_data_protection,
          ),
        ).toBeVisible(),
      { timeout: DEFAULT_TIMEOUT },
    );

    let editButton;
    await waitFor(
      () => {
        editButton = screen.getAllByTestId('editIcon').at(0);
        return expect(editButton).not.toHaveAttribute('disabled');
      },
      { timeout: DEFAULT_TIMEOUT },
    );
    await waitFor(() => userEvents.click(editButton));

    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await checkModalVisibility({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
      ),
    ).toBeVisible();
  });

  it('trying to update name displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-name`,
      isOrganizationUpdateKo: true,
    });

    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await checkModalVisibility({ container, isVisible: true });
    await checkModalError({ container, error: 'Organization update error' });
  });

  it('modify the description of the organization', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.managed_vcd_dashboard_data_protection,
          ),
        ).toBeVisible(),
      { timeout: DEFAULT_TIMEOUT },
    );

    let editButton;
    await waitFor(
      () => {
        editButton = screen.getAllByTestId('editIcon').at(1);
        return expect(editButton).not.toHaveAttribute('disabled');
      },
      { timeout: DEFAULT_TIMEOUT },
    );
    await waitFor(() => userEvents.click(editButton));

    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await checkModalVisibility({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
      ),
    ).toBeVisible();
  });

  it('trying to update description displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-description`,
      isOrganizationUpdateKo: true,
    });

    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await checkModalVisibility({ container, isVisible: true });
    await checkModalError({ container, error: 'Organization update error' });
  });
});
