import { Handler } from '@ovh-ux/manager-core-test-utils';
import { mockSecretConfigOkms } from './secretConfigOkms.mock';
import { buildMswResponseMock } from '@/utils/tests/msw';

// GET Secret Config
export const getSecretConfigErrorMessage = 'get-secret-config-error-message';

export type GetSecretConfigOkmsMockParams = {
  isSecretConfigKO?: boolean;
};

export const getSecretConfigOkmsMock = ({
  isSecretConfigKO,
}: GetSecretConfigOkmsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secretConfig',
    response: buildMswResponseMock({
      data: mockSecretConfigOkms,
      errorMessage: getSecretConfigErrorMessage,
      isError: isSecretConfigKO,
    }),
    status: isSecretConfigKO ? 500 : 200,
    api: 'v2',
  },
];
