import { Handler } from '@ovh-ux/manager-core-test-utils';
import { veeamBackupCatalog } from './veeam-backup-catalog.mock';

export type GetCatalogMocksParams = {
  isCatalogKo?: boolean;
};

export const getCatalogMocks = ({
  isCatalogKo,
}: GetCatalogMocksParams): Handler[] => [
  {
    url: '/order/catalog/public/vmwareCloudDirectorBackup',
    response: isCatalogKo
      ? {
          message: 'catalog KO',
        }
      : veeamBackupCatalog,
    api: 'v6',
    method: 'get',
    status: isCatalogKo ? 500 : 200,
  },
];
