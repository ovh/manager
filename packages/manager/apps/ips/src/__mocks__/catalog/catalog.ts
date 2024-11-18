import { Handler } from '@ovh-ux/manager-core-test-utils';
import { catalogIp } from './ip-catalog';
import { catalogPcc } from './pcc-catalog';
import {
  availableDurations,
  availableOperations,
  ipMigrationOrderRecap,
  ipMigrationPostResponse,
} from './dedicated-server-catalog';

export type GetCatalogMocksParams = {
  isIpCatalogKo?: boolean;
  isPccCatalogKo?: boolean;
  isDedicatedServerIpMigrationAvailableDurationsKo?: boolean;
  isIpMigrationUnavailableInOperations?: boolean;
};

export const getCatalogMocks = ({
  isIpCatalogKo,
  isPccCatalogKo,
  isDedicatedServerIpMigrationAvailableDurationsKo,
  isIpMigrationUnavailableInOperations,
}: GetCatalogMocksParams): Handler[] => [
  {
    url: '/order/dedicated/server/:serviceName/ipMigration/:duration',
    response: ipMigrationPostResponse,
    api: 'v6',
    method: 'post',
  },
  {
    url: '/order/dedicated/server/:serviceName/ipMigration/:duration',
    response: ipMigrationOrderRecap,
    api: 'v6',
  },
  {
    url: '/order/dedicated/server/:serviceName/ipMigration',
    response: isDedicatedServerIpMigrationAvailableDurationsKo
      ? {
          message: 'Service expired',
        }
      : availableDurations,
    api: 'v6',
    status: isDedicatedServerIpMigrationAvailableDurationsKo ? 460 : 200,
  },
  {
    url: '/order/dedicated/server/:serviceName',
    response: availableOperations.filter(
      (operation) =>
        !isIpMigrationUnavailableInOperations || operation !== 'ipMigration',
    ),
    api: 'v6',
  },
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
