import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { serviceKeyMock } from './serviceKeys.mock';

export type GetServiceKeysMockParams = {
  isServiceKeyKO?: boolean;
  nbServiceKey?: number;
};

const findServiceKeyById = (params: PathParams) =>
  serviceKeyMock.find(({ id }) => id === params.serviceKeyId);

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
      : serviceKeyMock.slice(0, nbServiceKey),
    status: isServiceKeyKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/serviceKey/:serviceKeyId',
    response: isServiceKeyKO
      ? { message: 'serviceKey error' }
      : (_: unknown, params: PathParams) => findServiceKeyById(params),
    status: isServiceKeyKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/serviceKey/:serviceKeyId',
    method: 'put',
    response: (_: unknown, params: PathParams) => findServiceKeyById(params),
    status: 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/serviceKey',
    method: 'post',
    response: (_: unknown, params: PathParams) => {
      findServiceKeyById(params);
    },
    status: 200,
    api: 'v2',
  },
];
