import { Handler } from '@ovh-ux/manager-core-test-utils';
import { mockSecretConfigOkms } from './secretConfigOkms.mock';

// GET Secret Config
export type GetSecretConfigOkmsMockParams = {
  isSecretConfigKO?: boolean;
};

export const getSecretConfigOkmsMock = ({
  isSecretConfigKO,
}: GetSecretConfigOkmsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secretConfig',
    response: isSecretConfigKO
      ? {
          status: 500,
          data: {
            message: 'secret config error',
          },
        }
      : mockSecretConfigOkms,
    status: isSecretConfigKO ? 500 : 200,
    api: 'v2',
  },
];
