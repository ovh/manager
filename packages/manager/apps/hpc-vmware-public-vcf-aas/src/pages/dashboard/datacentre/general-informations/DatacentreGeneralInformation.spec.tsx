import {
  assertOdsModalText,
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  datacentreList,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';
import { vi } from 'vitest';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  labels,
  mockEditInputValue,
  mockSubmitNewValue,
  renderTest,
} from '../../../../test-utils';

import TEST_IDS from '../../../../utils/testIds.constants';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useNavigationGetUrl: vi.fn(([basePath, pathWithId]) => ({
      data: `${basePath}${pathWithId}`,
    })),
  };
});

describe('Datacentre General Information Page Updates', () => {
  it('display the datacentre dashboard general page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
    });

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_general_information,
    );
  });
});

describe('Datacentre General Information Page Updates', () => {
  it.skip('update the description of the datacentre', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
    });

    await assertTextVisibility(labels.datacentres.managed_vcd_vdc_vcpu_count);

    const editButton = await getElementByTestId(TEST_IDS.editButton);

    await waitFor(() => userEvent.click(editButton));
    await assertOdsModalVisibility({ container, isVisible: true });

    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });
    await assertOdsModalVisibility({ container, isVisible: false });

    expect(
      screen.queryByText(
        labels.dashboard.managed_vcd_dashboard_edit_description_modal_success,
      ),
    ).toBeVisible();
  });

  it('display helper message when the description input is invalid', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/edit-description`,
    });
    const expectedError =
      labels.dashboard
        .managed_vcd_dashboard_edit_description_modal_helper_error;

    await assertOdsModalVisibility({ container, isVisible: true });
    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);

    await mockEditInputValue('');
    await assertOdsModalText({ container, text: expectedError });
    expect(submitCta).toBeDisabled();

    await mockEditInputValue('a'.repeat(256));
    await assertOdsModalText({ container, text: expectedError });
    expect(submitCta).toBeDisabled();
  });

  it.skip('display an error if update datacentre service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });

    await assertOdsModalVisibility({ container, isVisible: true });
    await assertOdsModalText({ container, text: 'Datacentre update error' });
  });
});
