import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { credentialListMock } from './credentials.mock';

export type GetCredentialsMockParams = {
  isCredentialKO?: boolean;
  nbCredential?: number;
};

const findCredentialByID = (params: PathParams) =>
  credentialListMock.find(({ id }) => id === params.credentialId);

export const getCredentialsMock = ({
  isCredentialKO,
  nbCredential = credentialListMock.length,
}: GetCredentialsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/credential',
    response: isCredentialKO
      ? {
          status: 500,
          data: {
            message: 'credentials error',
          },
        }
      : credentialListMock.slice(0, nbCredential),
    status: isCredentialKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/credential/:credentialId',
    response: isCredentialKO
      ? { message: 'credential error' }
      : (_: unknown, params: PathParams) => findCredentialByID(params),
    status: isCredentialKO ? 500 : 200,
    api: 'v2',
  },
];

export type CreateCredentialsMockParams = {
  fromCSR?: boolean;
};

export const createCredentialsMock = ({
  fromCSR = false,
}: CreateCredentialsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/credential',
    method: 'post',
    response: { ...credentialListMock[1], fromCSR },
    status: 200,
    api: 'v2',
  },
];

export type DeleteCredentialsMockParams = {
  isCredentialDeleteKO?: boolean;
};

export const deleteCredentialMock = ({
  isCredentialDeleteKO,
}: DeleteCredentialsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/credential/:credentialId',
    method: 'delete',
    response: {
      status: isCredentialDeleteKO ? 500 : 200,
      data: {},
    },
    status: isCredentialDeleteKO ? 500 : 200,
    api: 'v2',
  },
];
