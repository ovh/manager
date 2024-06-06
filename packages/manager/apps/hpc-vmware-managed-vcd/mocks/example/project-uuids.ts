import { Handler } from '../../../../../../playwright-helpers';
import uuidList from './project-uuids.json';

export type GetUUIDMocksParams = { isKo?: boolean; nb?: number };

export const getUUIDMocks = ({
  isKo,
  nb = Number.POSITIVE_INFINITY,
}: GetUUIDMocksParams): Handler[] => [
  {
    url: '*',
    response: isKo
      ? {
          message: 'Example error',
        }
      : uuidList.slice(0, nb),
    status: isKo ? 500 : 200,
    api: 'v6',
  },
  {
    url: '*',
    response: isKo
      ? {
          message: 'Example error',
        }
      : uuidList.slice(0, nb),
    status: isKo ? 500 : 200,
    api: 'v2',
  },
];
