import { Handler } from '../../../../../playwright-helpers';
import { veeamBackupCatalog } from './catalog.mock';

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
