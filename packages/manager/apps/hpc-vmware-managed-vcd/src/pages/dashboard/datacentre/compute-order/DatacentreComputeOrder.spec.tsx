import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  checkTextVisibility,
  labels,
  renderTest,
} from '../../../../test-utils';
import { datacentreList } from '../../../../../mocks/vcd-organization/vcd-datacentre.mock';
import { organizationList } from '../../../../../mocks/vcd-organization/vcd-organization.mock';

const orderCTA = labels.datacentresCompute.managed_vcd_vdc_compute_order_cta;
const orderTitle = orderCTA;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe('Datacentre Compute Order Page', () => {
  it('access and display compute order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
    });

    await checkTextVisibility(orderCTA);
    const orderButton = screen.getByText(orderCTA);
    await waitFor(() => userEvent.click(orderButton));

    await checkTextVisibility(orderTitle);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isOrderableResourceKO: true,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbOrderableResource: 0,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isCatalogKO: true,
    });
    await checkTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbCatalogProduct: 0,
    });
    await checkTextVisibility(orderError);
  });
});
