import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = screen.getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check page title & CTA
    await assertTextVisibility(VHOSTS_LABEL);
    await assertTextVisibility(
      labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
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
