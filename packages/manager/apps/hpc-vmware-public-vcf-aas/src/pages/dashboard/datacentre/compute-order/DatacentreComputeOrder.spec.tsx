import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vitest } from 'vitest';

import { assertTextVisibility, getElementByTestId } from '@ovh-ux/manager-core-test-utils';

import { subRoutes } from '@/routes/routes.constant';
import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

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

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  orderCTA: labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
  orderTitle: labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
  defaultError: labels.error.manager_error_page_default,
  emptyOrderableResourceError: 'OrderableResource error',
  emptyCatalogError: 'Catalog error',
  emptyLabel: 'Aucun résultat',
};
const initialRoute = `/${config.org.id}/virtual-datacenters/${config.vdc.id}/compute`;
const orderRoute = `${initialRoute}/${subRoutes.datacentreComputeOrder}`;

describe('Datacentre Compute Order Page', () => {
  it('access and display compute order page', async () => {
    await renderTest({ initialRoute });

    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
    await waitFor(() => userEvent.click(orderButton));

    await assertTextVisibility(config.orderTitle);
  });

  it('display an error if orderableResource service is KO', async () => {
    await renderTest({ initialRoute: orderRoute, isOrderableResourceKO: true });
    await assertTextVisibility(config.emptyOrderableResourceError);
    await assertTextVisibility(config.defaultError);
  });

  it('display an error if there is no orderableResource', async () => {
    await renderTest({ initialRoute: orderRoute, nbOrderableResource: 0 });
    await assertTextVisibility(config.emptyLabel);
  });

  it('display an error if catalog service is KO', async () => {
    await renderTest({ initialRoute: orderRoute, isCatalogKO: true });
    await assertTextVisibility(config.emptyCatalogError);
  });

  it('display an error if there is no catalog products', async () => {
    await renderTest({ initialRoute: orderRoute, nbCatalogProduct: 0 });
    await assertTextVisibility(config.emptyLabel);
  });
});
