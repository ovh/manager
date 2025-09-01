import { Handler } from '@ovh-ux/manager-core-test-utils';
import { catalogMock } from './catalog.mock';

export type GetCatalogKmsMocksParams = {
  isCatalogOkmsKo?: boolean;
};

export const getCatalogKmsMocks = ({
  isCatalogOkmsKo = false,
}: GetCatalogKmsMocksParams): Handler[] => {
  return [
    {
      url: '/order/catalog/public/okms',
      response: isCatalogOkmsKo
        ? {
            message: 'catalog error',
          }
        : catalogMock,
      status: isCatalogOkmsKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
