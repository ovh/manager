import { Handler } from '@ovh-ux/manager-core-test-utils';
import { catalogIp } from './ip-catalog';
import { catalogPcc } from './pcc-catalog';

export const getCatalogMocks = (): Handler[] => [
  {
    url: '/order/cartServiceOption/privateCloud/:serviceName',
    api: 'v6',
    response: catalogPcc,
  },
  {
    url: '/order/catalog/formatted/ip',
    response: catalogIp,
    api: 'v6',
  },
];
