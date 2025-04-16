import {
  assertAsyncElementAbsence,
  assertAsyncTextVisibility,
  assertIsDisabled,
  getAsyncElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  datacentreList,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  labels,
  mockEditInputValue,
  mockSubmitNewValue,
  renderTest,
} from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

describe('Datacentre General Information Page Updates', () => {
  it('display the datacentre dashboard general page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await assertAsyncTextVisibility(
      labels.dashboard.managed_vcd_dashboard_general_information,
    );
  });
});

describe('Datacentre General Information Page Updates', () => {
  it.skip('update the description of the datacentre', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    await assertAsyncTextVisibility(
      labels.datacentres.managed_vcd_vdc_vcpu_count,
    );

    const editButton = screen.getByTestId(TEST_IDS.editButton);

    await act(() => userEvent.click(editButton));
    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    expect(modal).toBeVisible();

    const submitCta = screen.getByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });
    await assertAsyncElementAbsence(modal);

    expect(
      labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
    ).toBeVisible();
  });

  it('display helper message when the description input is invalid', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
    });
    const expectedError =
      labels.dashboard
        .managed_vcd_dashboard_edit_description_modal_helper_error;

    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    expect(modal).toBeVisible();
    const submitCta = screen.getByTestId(TEST_IDS.modalSubmitCta);

    await mockEditInputValue('');
    expect(within(modal).getByText(expectedError)).toBeVisible();
    assertIsDisabled(submitCta);

    await mockEditInputValue('a'.repeat(256));
    expect(within(modal).getByText(expectedError)).toBeVisible();
    assertIsDisabled(submitCta);
  });

  it.skip('display an error if update datacentre service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    expect(modal).toBeVisible();

    const submitCta = screen.getByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });

    expect(modal).toBeVisible();
    expect(within(modal).getByText('Datacentre update error')).toBeVisible();
  });
});
