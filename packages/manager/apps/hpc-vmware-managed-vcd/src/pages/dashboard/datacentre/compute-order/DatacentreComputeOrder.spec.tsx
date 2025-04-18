import React from 'react';
import { vitest } from 'vitest';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertAsyncTextVisibility,
  getAsyncElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

// remove mock when ods element-internals-polyfill is fixed
vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" name="radio-order-compute" />,
  };
});

const orderCTA = labels.datacentresCompute.managed_vcd_vdc_compute_order_cta;
const orderTitle = orderCTA;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;

describe('Datacentre Compute Order Page', () => {
  it('access and display compute order page', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute`,
    });

    const orderButton = await getAsyncElementByTestId(TEST_IDS.computeOrderCta);
    await act(() => userEvent.click(orderButton));

    await assertAsyncTextVisibility(orderTitle);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isOrderableResourceKO: true,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbOrderableResource: 0,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      isCatalogKO: true,
    });
    await assertAsyncTextVisibility(orderError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}/datacentres/${datacentreList[0].id}/compute/order`,
      nbCatalogProduct: 0,
    });
    await assertAsyncTextVisibility(orderError);
  });
});
