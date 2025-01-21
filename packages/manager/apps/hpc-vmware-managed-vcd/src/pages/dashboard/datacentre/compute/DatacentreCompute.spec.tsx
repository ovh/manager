import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertTextVisibility,
  getButtonByIcon,
} from '@ovh-ux/manager-core-test-utils';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';

describe.skip('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page', async () => {
    const { container } = await renderTest({
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
    const deleteButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.BIN,
      disabled: true,
    });
    expect(deleteButton.closest('osds-tooltip')).toHaveTextContent(
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
