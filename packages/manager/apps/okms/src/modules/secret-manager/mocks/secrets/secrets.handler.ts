import { Handler } from '@ovh-ux/manager-core-test-utils';
import { createSecretResponseMock, secretListMock } from './secrets.mock';
import { findSecretMockByPath } from './secretsMock.utils';
import { buildMswResponseMock } from '@/utils/tests/msw';

// LIST
export const getSecretsErrorMessage = 'get-secrets-error-message';

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
    response: buildMswResponseMock({
      data: secretListMock.slice(0, nbSecrets),
      errorMessage: getSecretsErrorMessage,
      isError: isSecretListKO,
    }),
    status: isSecretListKO ? 500 : 200,
    api: 'v2',
  },
];

// GET
export const getSecretErrorMessage = 'get-secret-error-message';

export type GetSecretMockParams = {
  isSecretKO?: boolean;
};

export const getSecretMock = ({
  isSecretKO,
}: GetSecretMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath',
    response: buildMswResponseMock({
      data: (request, params) =>
        findSecretMockByPath(secretListMock, request, params),
      errorMessage: getSecretErrorMessage,
      isError: isSecretKO,
    }),
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
    response: buildMswResponseMock({
      data: createSecretResponseMock,
      errorMessage: createSecretErrorMessage,
      isError: isCreateSecretKO,
    }),
    status: isCreateSecretKO ? 500 : 200,
    api: 'v2',
    method: 'post',
  },
];

// PUT (UPDATE)
export const updateSecretErrorMessage = 'update-secret-error-message';

export type UpdateSecretMockParams = {
  isUpdateSecretKO?: boolean;
};

export const updateSecretMock = ({
  isUpdateSecretKO,
}: UpdateSecretMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath',
    response: buildMswResponseMock({
      data: (request, params) => {
        const secret = findSecretMockByPath(secretListMock, request, params);
        return {
          path: secret.path,
          metadata: secret.metadata,
        };
      },
      errorMessage: updateSecretErrorMessage,
      isError: isUpdateSecretKO,
    }),
    status: isUpdateSecretKO ? 500 : 200,
    api: 'v2',
    method: 'put',
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
    response: buildMswResponseMock({
      data: null,
      errorMessage: deleteSecretErrorMessage,
      isError: isDeleteSecretKO,
    }),
    status: isDeleteSecretKO ? 500 : 200,
    api: 'v2',
    method: 'delete',
  },
];
