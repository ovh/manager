import { Handler } from '@ovh-ux/manager-core-test-utils';
import { catalogIp } from './ip-catalog';
import { catalogPcc } from './pcc-catalog';

export type GetCatalogMocksParams = {
  isIpCatalogKo?: boolean;
  isPccCatalogKo?: boolean;
};

export const getCatalogMocks = ({
  isIpCatalogKo,
  isPccCatalogKo,
}: GetCatalogMocksParams): Handler[] => [
  {
    url: '/order/cartServiceOption/privateCloud/:serviceName',
    response: isPccCatalogKo ? { message: 'PCC Catalog KO' } : catalogPcc,
    status: isPccCatalogKo ? 400 : 200,
    api: 'v6',
  },
  {
    url: '/order/catalog/formatted/ip',
    response: isIpCatalogKo ? { message: 'PCC Catalog KO' } : catalogIp,
    status: isIpCatalogKo ? 400 : 200,
    api: 'v6',
  },
];
