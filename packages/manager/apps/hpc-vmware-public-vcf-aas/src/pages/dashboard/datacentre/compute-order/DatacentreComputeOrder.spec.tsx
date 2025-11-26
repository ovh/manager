import React from 'react';

import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vitest } from 'vitest';

import { assertTextVisibility, getElementByTestId } from '@ovh-ux/manager-core-test-utils';
import { datacentreList, organizationList } from '@ovh-ux/manager-module-vcd-api';

import { subRoutes } from '../../../../routes/routes.constant';
import { labels, renderTest } from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

// remove mock when ods element-internals-polyfill is fixed
vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual('@ovhcloud/ods-components/react');

  return {
    ...originalModule,
    OdsRadio: () => <input type="radio" name="radio-order-compute" />,
  };
});

const orderCTA = labels.datacentresCompute.managed_vcd_vdc_compute_order_cta;
const orderTitle = orderCTA;
const orderError = labels.datacentresOrder.managed_vcd_vdc_order_unavailable;
const initialRoute = `/${organizationList[0].id}/${subRoutes.virtualDatacenters}/${datacentreList[0].id}/compute`;
const orderRoute = `${initialRoute}/${subRoutes.datacentreComputeOrder}`;

describe('Datacentre Compute Order Page', () => {
  it('access and display compute order page', async () => {
    await renderTest({ initialRoute });

    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
    await waitFor(() => userEvent.click(orderButton));

    await assertTextVisibility(orderTitle);
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
