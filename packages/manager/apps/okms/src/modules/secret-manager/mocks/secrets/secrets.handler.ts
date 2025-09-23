import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { createSecretResponseMock, secretListMock } from './secrets.mock';
import { findSecretMockByPath } from './secretsMock.utils';

// LIST
export type GetSecretsMockParams = {
  isSecretListKO?: boolean;
  nbSecrets?: number;
};

export const getSecretsMock = ({
  isSecretListKO,
  nbSecrets = secretListMock.length,
}: GetSecretsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret',
    response: isSecretListKO
      ? {
          status: 500,
          data: {
            message: 'secrets error',
          },
        }
      : secretListMock.slice(0, nbSecrets),
    status: isSecretListKO ? 500 : 200,
    api: 'v2',
  },
];

// GET
export type GetSecretMockParams = {
  isSecretKO?: boolean;
};

export const getSecretMock = ({
  isSecretKO,
}: GetSecretMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath',
    response: isSecretKO
      ? {
          status: 500,
          data: {
            message: 'secrets error',
          },
        }
      : (request: Request, params: PathParams) =>
          findSecretMockByPath(secretListMock, request, params),
    status: isSecretKO ? 500 : 200,
    api: 'v2',
  },
];

// POST
export const createSecretErrorMessage = 'create-secret-error-message';

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
          message: createSecretErrorMessage,
        }
      : createSecretResponseMock,
    status: isCreateSecretKO ? 500 : 200,
    api: 'v2',
    method: 'post',
  },
];

// DELETE
export const deleteSecretErrorMessage = 'delete-secret-error-message';

export type DeleteSecretMockParams = {
  isDeleteSecretKO?: boolean;
};

export const deleteSecretMock = ({
  isDeleteSecretKO,
}: DeleteSecretMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:path',
    response: isDeleteSecretKO
      ? {
          message: deleteSecretErrorMessage,
        }
      : null,
    status: isDeleteSecretKO ? 500 : 200,
    api: 'v2',
    method: 'delete',
  },
];
