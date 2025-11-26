import { act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  assertOdsModalText,
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { datacentreList, organizationList } from '@ovh-ux/manager-module-vcd-api';

import { labels, mockEditInputValue, renderTest } from '../../../test-utils';
import TEST_IDS from '../../../utils/testIds.constants';
import { COMPUTE_LABEL, STORAGE_LABEL } from './datacentreDashboard.constants';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useNavigationGetUrl: vi.fn(([basePath, pathWithId]) => ({
      data: `${basePath}${pathWithId}`,
    })),
  };
});

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
    });

    const layoutElements = [
      datacentreList[0].id,
      datacentreList[0].currentState.description,
      labels.commun.dashboard.general_information,
      COMPUTE_LABEL,
      STORAGE_LABEL,
    ];

    layoutElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error is datacentre service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
      isDatacentresKo: true,
    });

    await assertTextVisibility('Datacentre error');
  });

  it('successfully updates description: closes modal and display success banner', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/edit-description`,
    });
    const value = 'description toto';
    const successMessage = labels.dashboard.managed_vcd_dashboard_edit_description_modal_success;
    await assertOdsModalVisibility({
      container,
      isVisible: true,
    });
    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await waitFor(() => expect(submitCta).toBeDisabled());
    await mockEditInputValue(value);
    await waitFor(() => expect(submitCta).toBeEnabled());
    act(() => {
      submitCta.click();
    });
    await assertOdsModalVisibility({ container, isVisible: false });
    await assertTextVisibility(successMessage);
  });

  it('Display helper message when the input is invalid', async () => {
    const error = labels.dashboard.managed_vcd_dashboard_edit_description_modal_helper_error;
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/edit-description`,
    });
    await assertOdsModalVisibility({
      container,
      isVisible: true,
    });
    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockEditInputValue('');
    await assertOdsModalText({ container, text: error });
    expect(submitCta).toBeDisabled();

    await mockEditInputValue('a'.repeat(256));
    await assertOdsModalText({ container, text: error });
    expect(submitCta).toBeDisabled();
  });

  it('keeps modal open and display error message if api return error', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/edit-description`,
      isDatacentreUpdateKo: true,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockEditInputValue('Valid description');
    await waitFor(() => expect(submitCta).toBeEnabled());
    act(() => {
      submitCta.click();
    });
    await assertOdsModalVisibility({ container, isVisible: true });
    await assertOdsModalText({
      container,
      text: labels.commun.error.error_message.replace('{{message}}', 'Datacentre update error'),
    });
  });

  it('display a warning message when the service is suspended', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[1].id}`,
    });

    await assertTextVisibility('cancel_service_success');
  });
});
