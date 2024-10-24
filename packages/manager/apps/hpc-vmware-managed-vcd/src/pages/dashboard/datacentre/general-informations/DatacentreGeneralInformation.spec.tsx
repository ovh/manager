import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  checkModalError,
  checkModalVisibility,
  labels,
  mockEditInputValue,
  renderTest,
} from '../../../../test-utils';
import { organizationList } from '../../../../../mocks/vcd-organization/vcd-organization.mock';
import { datacentreList } from '../../../../../mocks/vcd-organization/vcd-datacentre.mock';
import {
  DEFAULT_TIMEOUT,
  mockSubmitNewValue,
} from '../../../../test-utils/uiTestHelpers';

const submitButtonLabel =
  labels.dashboard.managed_vcd_dashboard_edit_modal_cta_edit;

describe('Datacentre General Information Page', () => {
  it('modify the description of the datacentre', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.datacentres.managed_vcd_vdc_vcpu_count),
        ).toBeVisible(),
      { timeout: DEFAULT_TIMEOUT },
    );

    let editButton;
    await waitFor(
      () => {
        editButton = screen.getByTestId('editIcon');
        return expect(editButton).toBeEnabled();
      },
      { timeout: DEFAULT_TIMEOUT },
    );

    await waitFor(() => userEvent.click(editButton));
    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });
    await checkModalVisibility({ container, isVisible: false });

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

    await checkModalVisibility({ container, isVisible: true });

    await mockEditInputValue('');
    await checkModalError({ container, error: expectedError });

    await mockEditInputValue('a'.repeat(256));
    await checkModalError({ container, error: expectedError });
  });

  it('display an error if update datacentre service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    await checkModalVisibility({ container, isVisible: true });

    await mockSubmitNewValue({ submitButtonLabel });

    await checkModalVisibility({ container, isVisible: true });
    await checkModalError({ container, error: 'Datacentre update error' });
  });
});
