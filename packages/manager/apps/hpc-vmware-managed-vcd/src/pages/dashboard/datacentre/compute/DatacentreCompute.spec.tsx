import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
  getElementByTestId,
  getNthElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { expect } from 'vitest';
import { OdsMessageColor } from '@ovhcloud/ods-components';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';
import TEST_IDS from '../../../../utils/testIds.constants';

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page without banner info for special offer', async () => {
    const { getByText, queryByText } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': false },
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check page title
    await assertTextVisibility(VHOSTS_LABEL);

    // check order CTA
    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
    await assertElementVisibility(orderButton);
    await assertElementLabel({
      element: orderButton,
      label: labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
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

    await waitFor(() => {
      const banner = queryByText(
        labels.datacentresCompute.managed_vcd_vdc_compute_special_offer,
      );
      expect(banner).not.toBeInTheDocument();
    });
  });

  it('access and display compute listing page with banner info for special offer', async () => {
    const { getByText, getByTestId } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': true },
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check banner info for special offer
    await waitFor(() => {
      const banner = getByTestId(TEST_IDS.computeSpecialOfferBanner);
      const expectedColor: OdsMessageColor = 'information';
      expect(banner).toHaveAttribute('color', expectedColor);
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
      isComputeKO: true,
    });

    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
