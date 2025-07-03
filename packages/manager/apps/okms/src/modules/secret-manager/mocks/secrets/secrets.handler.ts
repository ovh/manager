import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { secretsMock } from './secrets.mock';

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
