import React from 'react';
import { vitest, expect } from 'vitest';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
  orderableResourceData,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
  getAsyncElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';
import { PERFORMANCE_CLASS_LABEL } from './datacentreStorageOrder.constants';
import TEST_IDS from '../../../../utils/testIds.constants';

// remove mock when ods element-internals-polyfill is fixed
vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" name="radio-order-storage" />,
  };
});

const orderLabel = labels.datacentresStorage.managed_vcd_vdc_storage_order_cta;
const orderTitle = labels.datacentresOrder.managed_vcd_vdc_order_storage_title;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe('Datacentre Storage Order Page', () => {
  it('access and display storage order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage`,
    });

    const { name, performanceClass } = orderableResourceData.storage[0];

    // checks CTA
    const orderButton = await getAsyncElementByTestId(TEST_IDS.storageOrderCta);
    expect(orderButton).toHaveAttribute('label', orderLabel);
    await act(() => userEvent.click(orderButton));

    await assertAsyncTextVisibility(orderTitle);

    // check datagrid content
    const elements = [
      labels.datacentresOrder.managed_vcd_vdc_order_type,
      name,
      PERFORMANCE_CLASS_LABEL,
      labels.datacentresOrder.managed_vcd_vdc_order_performance_class
        .toString()
        .replace('{{performanceClass}}', performanceClass),
      labels.datacentresOrder.managed_vcd_vdc_order_price,
      '80.00 €',
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isOrderableResourceKO: true,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbOrderableResource: 0,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      isCatalogKO: true,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/storage/order`,
      nbCatalogProduct: 0,
    });
    await assertAsyncTextVisibility(orderError);
  });
});
