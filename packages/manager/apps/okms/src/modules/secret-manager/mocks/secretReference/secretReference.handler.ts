import { Handler } from '@ovh-ux/manager-core-test-utils';
import { mockSecretConfigReference } from './secretReference.mock';
import { buildMswResponseMock } from '@/utils/tests/msw';

export type GetSecretConfigReferenceMockParams = {
  isSecretConfigReferenceKO?: boolean;
};

export const getSecretConfigReferenceErrorMessage =
  'get-secret-config-reference-error-message';

export const getSecretConfigReferenceMock = ({
  isSecretConfigReferenceKO,
}: GetSecretConfigReferenceMockParams): Handler[] => [
  {
    url: '/okms/reference/secretConfig',
    response: buildMswResponseMock({
      data: mockSecretConfigReference,
      errorMessage: getSecretConfigReferenceErrorMessage,
      isError: isSecretConfigReferenceKO,
    }),
    status: isSecretConfigReferenceKO ? 500 : 200,
    api: 'v2',
  },
];
