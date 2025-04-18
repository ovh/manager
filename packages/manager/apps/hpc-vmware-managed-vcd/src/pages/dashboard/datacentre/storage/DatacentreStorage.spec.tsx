import { screen } from '@testing-library/dom';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertAsyncTextVisibility,
  assertElementLabel,
  assertElementVisibility,
  assertIsDisabled,
  assertTextVisibility,
  getAsyncElementByTestId,
  getNthElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { STORAGE_LABEL } from '../datacentreDashboard.constants';
import TEST_IDS from '../../../../utils/testIds.constants';

describe('Datacentre Storage Listing Page', () => {
  it('access and display storage listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    // access storage tab
    await assertAsyncTextVisibility(STORAGE_LABEL);
    const tab = screen.getByText(STORAGE_LABEL);
    await act(() => userEvent.click(tab));

    // check page title
    assertTextVisibility(STORAGE_LABEL);

    // check page order CTA
    const orderButton = await getAsyncElementByTestId(TEST_IDS.storageOrderCta);
    assertElementVisibility(orderButton);
    assertElementLabel({
      element: orderButton,
      label: labels.datacentresStorage.managed_vcd_vdc_storage_order_cta,
    });

    // check datagrid delete CTA
    const deleteButton = getNthElementByTestId({
      testId: TEST_IDS.cellDeleteCta,
    });
    assertElementVisibility(deleteButton);
    assertIsDisabled(deleteButton);

    const tooltip = getNthElementByTestId({
      testId: TEST_IDS.cellDeleteTooltip,
    });
    expect(tooltip).toHaveTextContent(
      labels.datacentres.managed_vcd_vdc_contact_support,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage`,
      isStorageKO: true,
    });

    await assertAsyncTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
