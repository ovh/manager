import { Handler } from '../../../../../../playwright-helpers';
import exampleList from './example-data.json';

export type GetExampleMocksParams = { isKo?: boolean; nb?: number };

export const getExampleMocks = ({
  isKo,
  nb = Number.POSITIVE_INFINITY,
}: GetExampleMocksParams): Handler[] => [
  {
    url: '*',
    response: isKo
      ? {
          message: 'Example error',
        }
      : exampleList.slice(0, nb),
    status: isKo ? 500 : 200,
    api: 'v6',
  },
  {
    url: '*',
    response: isKo
      ? {
          message: 'Example error',
        }
      : exampleList.slice(0, nb),
    status: isKo ? 500 : 200,
    api: 'v2',
  },
];
