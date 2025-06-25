import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  createSecretResponseMock,
  mockSecret1,
  secretsMock,
} from './secrets.mock';

// LIST
export type GetSecretsMockParams = {
  isSecretKO?: boolean;
  nbSecret?: number;
};

const findSecretByPath = (params: PathParams) => {
  return secretsMock.find(({ path }) => path === params.secretPath);
};

export const getSecretsMock = ({
  isSecretKO,
  nbSecret = secretsMock.length,
}: GetSecretsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret',
    response: isSecretKO
      ? {
          status: 500,
          data: {
            message: 'secrets error',
          },
        }
      : secretsMock.slice(0, nbSecret),
    status: isSecretKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/secret/:secretPath',
    response: isSecretKO
      ? { message: 'secret error' }
      : (_: unknown, params: PathParams) => findSecretByPath(params),
    status: isSecretKO ? 500 : 200,
    api: 'v2',
  },
];

// GET
export type GetSecretMockParams = {
  isSecretKO?: boolean;
  nbSecret?: number;
};

export const getSecretMock = ({
  isSecretKO,
}: GetSecretsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:path',
    response: isSecretKO
      ? {
          status: 500,
          data: {
            message: 'secrets error',
          },
        }
      : mockSecret1,
    status: isSecretKO ? 500 : 200,
    api: 'v2',
  },
];

// POST
export type CreateSecretsMockParams = {
  isCreateSecretKO?: boolean;
};

export const createSecretsMock = ({
  isCreateSecretKO,
}: CreateSecretsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret',
    response: isCreateSecretKO
      ? {
          status: 500,
          data: {
            message: 'createsecrets error',
          },
        }
      : createSecretResponseMock,
    status: isCreateSecretKO ? 500 : 200,
    api: 'v2',
    method: 'post',
  },
];
