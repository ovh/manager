import { act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  assertOdsModalText,
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

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

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  vdcSuspended: SAFE_MOCK_DATA.vdcSuspended,
};
const initialRoute = `/${config.org.id}/virtual-datacenters/${config.vdc.id}`;
const editDescriptionRoute = `${initialRoute}/edit-description`;
const editSuspendedDescriptionRoute = `/${config.org.id}/virtual-datacenters/${config.vdcSuspended.id}`;

describe('Datacentre Dashboard Page', () => {
  it('display the datacentre dashboard page', async () => {
    await renderTest({ initialRoute });

    const layoutElements = [
      config.vdc.id,
      config.vdc.currentState.description,
      labels.commun.dashboard.general_information,
      COMPUTE_LABEL,
      STORAGE_LABEL,
    ];

    layoutElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error is datacentre service is KO', async () => {
    await renderTest({ initialRoute, isDatacentresKo: true });

    await assertTextVisibility('Datacentre error');
  });

  it('successfully updates description: closes modal and display success banner', async () => {
    const { container } = await renderTest({ initialRoute: editDescriptionRoute });
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
    const { container } = await renderTest({ initialRoute: editDescriptionRoute });
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
      initialRoute: editDescriptionRoute,
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

  it('display a warning message when the datacentre service is suspended', async () => {
    await renderTest({ initialRoute: editSuspendedDescriptionRoute });

    await assertTextVisibility('cancel_service_success');
  });
});
