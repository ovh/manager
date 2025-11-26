import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vitest } from 'vitest';

import {
  assertElementLabel,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  datacentreList,
  orderableResourceData,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';

import { subRoutes } from '../../../../routes/routes.constant';
import { labels, renderTest } from '../../../../test-utils';
import { IOPS_LABEL } from '../../../../utils/label.constants';
import TEST_IDS from '../../../../utils/testIds.constants';
import { PERFORMANCE_CLASS_LABEL } from './datacentreStorageOrder.constants';

// remove mock when ods element-internals-polyfill is fixed
vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual('@ovhcloud/ods-components/react');

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" name="radio-order-storage" />,
  };
});

const orderLabel = labels.datacentresStorage.managed_vcd_vdc_storage_order_cta;
const orderTitle = labels.datacentresOrder.managed_vcd_vdc_order_storage_title;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;
const initialRoute = `/${organizationList[0].id}/${subRoutes.virtualDatacenters}/${datacentreList[0].id}/storage`;
const orderRoute = `${initialRoute}/${subRoutes.datacentreStorageOrder}`;

describe('Datacentre Storage Order Page', () => {
  it('access and display storage order page', async () => {
    await renderTest({ initialRoute });

    const { name, performanceClass } = orderableResourceData.storage[0];

    // checks CTA
    const orderButton = await getElementByTestId(TEST_IDS.storageOrderCta);
    await assertElementLabel({ element: orderButton, label: orderLabel });
    await waitFor(() => userEvent.click(orderButton));

    await assertTextVisibility(orderTitle);

    // check datagrid content
    const datagridElements = [
      labels.datacentresOrder.managed_vcd_vdc_order_type,
      name,
      PERFORMANCE_CLASS_LABEL,
      labels.datacentresOrder.managed_vcd_vdc_order_performance_class
        .toString()
        .replace('{{performanceClass}}', `${performanceClass} ${IOPS_LABEL}`),
      labels.datacentresOrder.managed_vcd_vdc_order_price,
      '80.00 €',
    ];

    datagridElements.forEach(async (element) => assertTextVisibility(element));
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({ initialRoute: orderRoute, isOrderableResourceKO: true });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({ initialRoute: orderRoute, nbOrderableResource: 0 });
    await assertTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({ initialRoute: orderRoute, isCatalogKO: true });
    await assertTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({ initialRoute: orderRoute, nbCatalogProduct: 0 });
    await assertTextVisibility(orderError);
  });
});
