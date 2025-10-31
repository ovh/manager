import { Handler } from '@ovh-ux/manager-core-test-utils';
import { catalogMock } from './catalog.mock';
import { buildMswResponseMock } from '@/common/utils/tests/msw';

export type GetCatalogKmsMocksParams = {
  isCatalogOkmsKo?: boolean;
};

export const getCatalogKmsErrorMessage = 'catalog error';

export const getCatalogKmsMocks = ({
  isCatalogOkmsKo = false,
}: GetCatalogKmsMocksParams): Handler[] => {
  return [
    {
      url: '/order/catalog/public/okms',
      response: buildMswResponseMock({
        data: catalogMock,
        errorMessage: getCatalogKmsErrorMessage,
        isError: isCatalogOkmsKo,
      }),
      status: isCatalogOkmsKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
