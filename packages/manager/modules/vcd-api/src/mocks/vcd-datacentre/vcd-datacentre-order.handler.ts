import { Handler, VCDOrderableResourceData } from '../../types';
import { catalogProductList } from '../vcd-organization/vcd-catalog.mock';
import { orderableResourceData } from './vdc-orderable-resource.mock';

export type GetDatacentreOrderMocksParams = {
  isCatalogKO?: boolean;
  nbCatalogProduct?: number;
  isOrderableResourceKO?: boolean;
  nbOrderableResource?: number;
};

export const getDatacentreOrderMocks = ({
  isCatalogKO,
  nbCatalogProduct = Number.POSITIVE_INFINITY,
  isOrderableResourceKO,
  nbOrderableResource = Number.POSITIVE_INFINITY,
}: GetDatacentreOrderMocksParams): Handler[] => {
  const selectedOrderableResource: VCDOrderableResourceData = {
    compute: orderableResourceData.compute.slice(0, nbOrderableResource),
    storage: orderableResourceData.storage.slice(0, nbOrderableResource),
  };

  return [
    {
      url:
        '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/orderableResource',
      response: isOrderableResourceKO
        ? { message: 'OrderableResource error' }
        : selectedOrderableResource,
      api: 'v2',
      status: isOrderableResourceKO ? 500 : 200,
    },
    {
      url: '/order/cartServiceOption/vmwareCloudDirector/:id',
      response: isCatalogKO
        ? { message: 'Catalog error' }
        : catalogProductList.slice(0, nbCatalogProduct),
      api: 'v6',
      status: isCatalogKO ? 500 : 200,
    },
  ];
};
