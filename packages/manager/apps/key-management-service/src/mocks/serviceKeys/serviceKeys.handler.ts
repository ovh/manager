import { PathParams } from 'msw';
import { Handler } from '../../../../../../../playwright-helpers';
import { serviceKeyMock } from './serviceKeys.mock';

export type GetServiceKeysMockParams = {
  isServiceKeyKO?: boolean;
  nbServiceKey?: number;
};

const findOkmsById = (params: PathParams) =>
  serviceKeyMock.find(({ id }) => id === params.id);

export const getServiceKeysMock = ({
  isServiceKeyKO,
  nbServiceKey = serviceKeyMock.length,
}: GetServiceKeysMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/serviceKey',
    response: isServiceKeyKO
      ? {
          status: 500,
          data: {
            message: 'serviceKeys error',
          },
        }
      : (_: unknown, params: PathParams) => findOkmsById(params),
    status: isServiceKeyKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/serviceKey/:serviceKeyId',
    response: isServiceKeyKO
      ? { message: 'serviceKey error' }
      : serviceKeyMock.slice(0, nbServiceKey),
    status: isServiceKeyKO ? 500 : 200,
    api: 'v2',
  },
];
