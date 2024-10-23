import { PathParams } from 'msw';
import { Handler } from '../../../../../../../playwright-helpers';
import { okmsMock } from './okms.mock';

export type GetOkmsMocksParams = {
  isOkmsKO?: boolean;
  nbOkms?: number;
};

const findOkmsById = (params: PathParams) =>
  okmsMock.find(({ id }) => id === params.id);

export const getOkmsMocks = ({
  isOkmsKO,
  nbOkms = okmsMock.length,
}: GetOkmsMocksParams): Handler[] => [
  {
    url: '/okms/resource',
    response: isOkmsKO
      ? { message: 'okms list error' }
      : okmsMock.slice(0, nbOkms),
    status: isOkmsKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:id',
    response: isOkmsKO
      ? {
          status: 500,
          data: {
            message: 'okms error',
          },
        }
      : (_: unknown, params: PathParams) => findOkmsById(params),
    status: isOkmsKO ? 500 : 200,
    api: 'v2',
  },
];
