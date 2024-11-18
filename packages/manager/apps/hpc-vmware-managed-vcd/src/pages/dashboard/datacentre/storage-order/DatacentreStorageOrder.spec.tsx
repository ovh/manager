import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  checkTextVisibility,
  labels,
  renderTest,
} from '../../../../test-utils';

const orderCTA = labels.datacentresStorage.managed_vcd_vdc_storage_order_cta;
const orderTitle = labels.datacentresOrder.managed_vcd_vdc_order_storage_title;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe('Datacentre Storage Order Page', () => {
  it('access and display storage order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage`,
    });

    await checkTextVisibility(orderCTA);
    const orderButton = screen.getByText(orderCTA);
    await waitFor(() => userEvent.click(orderButton));

    await checkTextVisibility(orderTitle);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isOrderableResourceKO: true,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbOrderableResource: 0,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isCatalogKO: true,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbCatalogProduct: 0,
    });
    await checkTextVisibility(orderError);
  });
});
