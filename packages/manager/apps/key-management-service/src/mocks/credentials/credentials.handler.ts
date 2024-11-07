import { PathParams } from 'msw';
import { Handler } from '../../../../../../../playwright-helpers';
import { credentialMock } from './credentials.mock';

export type GetCredentialsMockParams = {
  isCredentialKO?: boolean;
  nbCredential?: number;
};

const findCredentialByID = (params: PathParams) =>
  credentialMock.find(({ id }) => id === params.id);

export const getCredentialsMock = ({
  isCredentialKO,
  nbCredential = credentialMock.length,
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
      : (_: unknown, params: PathParams) => findCredentialByID(params),
    status: isCredentialKO ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/okms/resource/:okmsId/credential/:credentialId',
    response: isCredentialKO
      ? { message: 'credential error' }
      : credentialMock.slice(0, nbCredential),
    status: isCredentialKO ? 500 : 200,
    api: 'v2',
  },
];
