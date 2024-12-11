import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  getButtonByLabel,
  assertModalVisibility,
  assertModalText,
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels, mockSubmitNewValue } from '../../../../test-utils';

const submitButtonLabel =
  labels.dashboard.managed_vcd_dashboard_edit_modal_cta_edit;

describe.skip('Organization General Information Page', () => {
  it('modify the name of the organization', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_data_protection,
    );

    let editButton;
    await waitFor(() => {
      editButton = screen.getAllByTestId('editIcon').at(0);
      return expect(editButton).toBeEnabled();
    }, WAIT_FOR_DEFAULT_OPTIONS);
    await waitFor(() => userEvents.click(editButton));

    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await assertModalVisibility({ container, isVisible: false });
    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_edit_name_modal_success,
    );
  });

  it('trying to update name displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-name`,
      isOrganizationUpdateKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({ container, text: 'Organization update error' });
  });

  it('modify the description of the organization', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[1].id}`,
    });

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_data_protection,
    );

    let editButton;
    await waitFor(() => {
      editButton = screen.getAllByTestId('editIcon').at(1);
      return expect(editButton).toBeEnabled();
    }, WAIT_FOR_DEFAULT_OPTIONS);
    await waitFor(() => userEvents.click(editButton));

    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await assertModalVisibility({ container, isVisible: false });
    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
    );
  });

  it('trying to update description displays an error if update organization service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/edit-description`,
      isOrganizationUpdateKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({ container, text: 'Organization update error' });
  });

  // uncomment below: when API for resetPassword is available
  // it('resets the password of the organization', async () => {
  //   const { container } = await renderTest({
  //     initialRoute: `/${organizationList[1].id}`,
  //   });

  //   await assertTextVisibility(
  //     labels.dashboard.managed_vcd_dashboard_password_renew,
  //   );

  //   const resetPasswordLink = await getButtonByLabel({
  //     container,
  //     label: labels.dashboard.managed_vcd_dashboard_password_renew,
  //     isLink: true,
  //   });
  //   await waitFor(() => userEvents.click(resetPasswordLink));

  //   await assertModalVisibility({ container, isVisible: true });

  //   const validateButton = await getButtonByLabel({
  //     container,
  //     label: labels.dashboard.managed_vcd_dashboard_edit_modal_cta_validate,
  //   });
  //   await waitFor(() => userEvents.click(validateButton));

  //   await assertModalVisibility({ container, isVisible: false });
  //   await assertTextVisibility(
  //     labels.dashboard.managed_vcd_dashboard_password_renew_success,
  //   );
  // });

  // uncomment below: when API for resetPassword is available
  // it('trying to reset password displays an error if reset password service is KO', async () => {
  //   const { container } = await renderTest({
  //     initialRoute: `/${organizationList[0].id}/reset-password`,
  //     isOrganizationResetPasswordKo: true,
  //   });

  //   await assertModalVisibility({ container, isVisible: true });

  //   const validateButton = await getButtonByLabel({
  //     container,
  //     label: labels.dashboard.managed_vcd_dashboard_edit_modal_cta_validate,
  //   });
  //   await waitFor(() => userEvents.click(validateButton));

  //   await assertModalVisibility({ container, isVisible: false });
  //   await assertTextVisibility(
  //     labels.dashboard.managed_vcd_dashboard_password_renew_error,
  //   );
  // });
});
