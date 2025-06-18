import { Handler } from '@ovh-ux/manager-core-test-utils';
import { secretsMock } from './secrets.mock';

export type GetSecretsMockParams = {
  isSecretKO?: boolean;
  nbSecret?: number;
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
];
