import { Handler } from '../../../../../playwright-helpers';
import productList from './catalog-example.json';

export type GetCatalogMocksParams = { isKo?: boolean };

export const getCatalogMocks = ({ isKo }: GetCatalogMocksParams): Handler[] => [
  {
    url: '/catalog',
    response: isKo
      ? {
          message: 'Catalog error',
        }
      : productList,
    status: isKo ? 500 : 200,
    api: 'aapi',
  },
];
