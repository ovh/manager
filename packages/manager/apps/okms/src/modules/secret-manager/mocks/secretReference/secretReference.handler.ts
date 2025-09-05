import { Handler } from '@ovh-ux/manager-core-test-utils';
import { mockSecretConfigReference } from './secretReference.mock';

export type GetSecretConfigReferenceMockParams = {
  isSecretConfigReferenceKO?: boolean;
};

export const getSecretConfigReferenceMock = ({
  isSecretConfigReferenceKO,
}: GetSecretConfigReferenceMockParams): Handler[] => [
  {
    url: '/okms/reference/secretConfig',
    response: isSecretConfigReferenceKO
      ? {
          status: 500,
          data: {
            message: 'secret config reference error',
          },
        }
      : mockSecretConfigReference,
    status: isSecretConfigReferenceKO ? 500 : 200,
    api: 'v2',
  },
];
