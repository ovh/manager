import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertModalVisibility,
  assertModalText,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import {
  labels,
  mockEditInputValue,
  renderTest,
  mockSubmitNewValue,
} from '@/test-utils';

const submitButtonLabel =
  labels.dashboard.managed_vcd_dashboard_edit_modal_cta_edit;

describe('Datacentre General Information Page', () => {
  it.skip('modify the description of the datacentre', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.datacentres.managed_vcd_vdc_vcpu_count),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    let editButton;
    await waitFor(() => {
      editButton = screen.getByTestId('editIcon');
      return expect(editButton).toBeEnabled();
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await waitFor(() => userEvent.click(editButton));
    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });
    await assertModalVisibility({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
      ),
    ).toBeVisible();
  });

  it('display helper message when the input is invalid', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
    });
    const expectedError =
      labels.dashboard
        .managed_vcd_dashboard_edit_description_modal_helper_error;

    await assertModalVisibility({ container, isVisible: true });

    await mockEditInputValue('');
    await assertModalText({ container, text: expectedError });

    await mockEditInputValue('a'.repeat(256));
    await assertModalText({ container, text: expectedError });
  });

  it('display an error if update datacentre service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({ container, text: 'Datacentre update error' });
  });
});
