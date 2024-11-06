import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  checkTextVisibility,
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { STORAGE_TITLE } from '../DatacentreDashboard.constant';

describe('Datacentre Storage Listing Page', () => {
  it('access and display storage listing page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}`,
    });

    // access storage tab
    await checkTextVisibility(STORAGE_TITLE);
    const tab = screen.getByText(STORAGE_TITLE);
    await waitFor(() => userEvent.click(tab));

    // check page title & CTA
    await checkTextVisibility(STORAGE_TITLE);
    await checkTextVisibility(
      labels.datacentresStorage.managed_vcd_vdc_storage_order_cta,
    );
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage`,
      isStorageKO: true,
    });

    await checkTextVisibility(DEFAULT_LISTING_ERROR);
  });
});
