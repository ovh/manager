import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';

const orderCTA = labels.datacentresCompute.managed_vcd_vdc_compute_order_cta;
const orderTitle = orderCTA;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe.skip('Datacentre Compute Order Page', () => {
  it('access and display compute order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
    });

    await assertTextVisibility(orderCTA);
    const orderButton = screen.getByText(orderCTA);
    await waitFor(() => userEvent.click(orderButton));

    await assertTextVisibility(orderTitle);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isOrderableResourceKO: true,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbOrderableResource: 0,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isCatalogKO: true,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbCatalogProduct: 0,
    });
    await assertTextVisibility(orderError);
  });
});
