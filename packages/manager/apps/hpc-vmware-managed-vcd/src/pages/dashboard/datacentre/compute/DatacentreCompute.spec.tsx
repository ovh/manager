import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertOdsElementEnabledState,
  assertOdsElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
  getOneElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';
import TEST_IDS from '../../../../utils/testIds.constants';

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = screen.getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check page title
    await assertTextVisibility(VHOSTS_LABEL);

    // check order CTA
    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
    await assertElementVisibility(orderButton);
    await assertOdsElementLabel({
      element: orderButton,
      label: labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
    });

    // check datagrid delete CTA
    const deleteButton = await getOneElementByTestId(TEST_IDS.cellDeleteCta);
    await assertElementVisibility(deleteButton);
    assertOdsElementEnabledState({ element: deleteButton, enabled: false });

    const tooltip = await getOneElementByTestId(TEST_IDS.cellDeleteTooltip);
    expect(tooltip).toHaveTextContent(
      labels.datacentres.managed_vcd_vdc_contact_support,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
      isComputeKO: true,
    });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
