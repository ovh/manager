import {
  assertAsyncElementAbsence,
  assertAsyncTextVisibility,
  assertElementVisibility,
  assertIsDisabled,
  assertTextVisibility,
  assertTextWithinElement,
  getAsyncElementByTestId,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  datacentreList,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';
import { act } from '@testing-library/react';
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

    const editButton = getElementByTestId(TEST_IDS.editButton);

    await act(() => userEvent.click(editButton));
    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    assertElementVisibility(modal);

    const submitCta = getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });
    await assertAsyncElementAbsence(modal);

    assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
    );
  });

  it('display helper message when the description input is invalid', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
    });
    const expectedError =
      labels.dashboard
        .managed_vcd_dashboard_edit_description_modal_helper_error;

    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    assertElementVisibility(modal);
    const submitCta = getElementByTestId(TEST_IDS.modalSubmitCta);

    await mockEditInputValue('');
    assertTextWithinElement({ element: modal, text: expectedError });
    assertIsDisabled(submitCta);

    await mockEditInputValue('a'.repeat(256));
    assertTextWithinElement({ element: modal, text: expectedError });
    assertIsDisabled(submitCta);
  });

  it.skip('display an error if update datacentre service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    const modal = await getAsyncElementByTestId(TEST_IDS.modalEdit);
    assertElementVisibility(modal);

    const submitCta = getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });

    assertElementVisibility(modal);
    assertTextWithinElement({
      element: modal,
      text: 'Datacentre update error',
    });
  });
});
