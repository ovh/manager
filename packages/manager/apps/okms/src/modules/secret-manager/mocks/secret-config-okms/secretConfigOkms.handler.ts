import { Handler } from '@ovh-ux/manager-core-test-utils';

import { buildMswResponseMock } from '@/common/utils/tests/msw';

import { mockSecretConfigOkms } from './secretConfigOkms.mock';

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
      isError: isSecretConfigKO ?? false,
    }),
    status: isSecretConfigKO ? 500 : 200,
    api: 'v2',
  },
];

// PUT Secret Config
export const updateSecretConfigErrorMessage = 'put-secret-config-error-message';

export type UpdateSecretConfigOkmsMockParams = {
  isUpdateSecretConfigKO?: boolean;
};

export const updateSecretConfigOkmsMock = ({
  isUpdateSecretConfigKO,
}: UpdateSecretConfigOkmsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secretConfig',
    response: buildMswResponseMock({
      data: mockSecretConfigOkms,
      errorMessage: updateSecretConfigErrorMessage,
      isError: isUpdateSecretConfigKO,
    }),
    status: isUpdateSecretConfigKO ? 500 : 200,
    api: 'v2',
    method: 'put',
  },
];
