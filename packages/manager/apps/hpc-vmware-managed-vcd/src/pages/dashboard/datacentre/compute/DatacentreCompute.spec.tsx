import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  checkTextVisibility,
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { datacentreList } from '../../../../../mocks/vcd-organization/vcd-datacentre.mock';
import { organizationList } from '../../../../../mocks/vcd-organization/vcd-organization.mock';
import { COMPUTE_TITLE } from '../DatacentreDashboard.constant';
import { VHOSTS_TITLE } from '../compute/DatacentreCompute.constants';

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    // access compute tab
    await checkTextVisibility(COMPUTE_TITLE);
    const tab = screen.getByText(COMPUTE_TITLE);
    await waitFor(() => userEvent.click(tab));

    // check page title & CTA
    await checkTextVisibility(VHOSTS_TITLE);
    await checkTextVisibility(
      labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
      isComputeKO: true,
    });

    await checkTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
