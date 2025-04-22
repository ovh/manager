import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
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
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`,
    });

    // access storage tab
    await assertTextVisibility(STORAGE_LABEL);
    const tab = screen.getByText(STORAGE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check page title
    await assertTextVisibility(STORAGE_LABEL);

    // check page order CTA
    const orderButton = await getElementByTestId(TEST_IDS.storageOrderCta);
    await assertElementVisibility(orderButton);
    await assertElementLabel({
      element: orderButton,
      label: labels.datacentresStorage.managed_vcd_vdc_storage_order_cta,
    });

    // check datagrid delete CTA
    const deleteButton = await getNthElementByTestId({
      testId: TEST_IDS.cellDeleteCta,
    });
    await assertElementVisibility(deleteButton);
    expect(deleteButton).toBeDisabled();

    const tooltip = await getNthElementByTestId({
      testId: TEST_IDS.cellDeleteTooltip,
    });
    expect(tooltip).toHaveTextContent(
      labels.datacentres.managed_vcd_vdc_contact_support,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/storage`,
      isStorageKO: true,
    });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
