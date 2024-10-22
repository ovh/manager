import { Handler } from '../../../../../../../playwright-helpers';
import { catalog } from './catalogHycu.data';

export type CatalogHycuMocksParams = {
  isCatalogHycuKo?: boolean;
};

export const getCatalogHycuMocks = ({
  isCatalogHycuKo = false,
}: CatalogHycuMocksParams): Handler[] => {
  return [
    {
      url: '/order/catalog/public/licenseHycu',
      response: isCatalogHycuKo
        ? {
            message: 'Backup error',
          }
        : catalog,
      status: isCatalogHycuKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
