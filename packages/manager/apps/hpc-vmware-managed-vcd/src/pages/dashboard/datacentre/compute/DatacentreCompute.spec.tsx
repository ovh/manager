import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertTextVisibility,
  getButtonByIcon,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { ODS_ICON_NAME, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page without banner info for special offer', async () => {
    const { container, getByText, queryByText } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': false },
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
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

    await waitFor(() => {
      const banner = queryByText(
        labels.datacentresCompute.managed_vcd_vdc_compute_special_offer,
      );
      expect(banner).not.toBeInTheDocument();
    });
  });

  it('access and display compute listing page with banner info for special offer', async () => {
    const { getByText } = await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': true },
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check banner info for special offer
    await waitFor(() => {
      const banner = getByText(
        labels.datacentresCompute.managed_vcd_vdc_compute_special_offer,
      );
      expect(banner).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.info);
      expect(banner.closest('osds-message')).toHaveAttribute(
        'type',
        ODS_MESSAGE_TYPE.info,
      );
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
