import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
  orderableResourceData,
} from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';
import { PERFORMANCE_CLASS_LABEL } from './datacentreStorageOrder.constants';

const orderCTA = labels.datacentresStorage.managed_vcd_vdc_storage_order_cta;
const orderTitle = labels.datacentresOrder.managed_vcd_vdc_order_storage_title;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe.skip('Datacentre Storage Order Page', () => {
  it('access and display storage order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage`,
    });

    const { name, performanceClass } = orderableResourceData.storage[0];

    // checks CTA
    await assertTextVisibility(orderCTA);
    const orderButton = screen.getByText(orderCTA);
    await waitFor(() => userEvent.click(orderButton));

    await assertTextVisibility(orderTitle);

    // check datagrid content
    await assertTextVisibility(
      labels.datacentresOrder.managed_vcd_vdc_order_type,
    );
    await assertTextVisibility(name);

    await assertTextVisibility(PERFORMANCE_CLASS_LABEL);
    await assertTextVisibility(
      labels.datacentresOrder.managed_vcd_vdc_order_performance_class
        .toString()
        .replace('{{performanceClass}}', performanceClass),
    );

    await assertTextVisibility(
      labels.datacentresOrder.managed_vcd_vdc_order_price,
    );
    await assertTextVisibility('80.00 €');
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isOrderableResourceKO: true,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbOrderableResource: 0,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isCatalogKO: true,
    });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbCatalogProduct: 0,
    });
    await assertTextVisibility(orderError);
  });
});
