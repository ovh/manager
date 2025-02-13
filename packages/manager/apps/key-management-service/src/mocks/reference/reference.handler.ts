import { Handler } from '@ovh-ux/manager-core-test-utils';
import { referenceServiceKeyMock } from './reference.mock';

export type GetReferenceMockParams = {
  isReferenceKO?: boolean;
};

export const getReferenceMock = ({
  isReferenceKO,
}: GetReferenceMockParams): Handler[] => [
  {
    url: '/okms/reference/serviceKey',
    response: isReferenceKO
      ? {
          status: 500,
          data: {
            message: 'serviceKeys error',
          },
        }
      : () => referenceServiceKeyMock,
    status: isReferenceKO ? 500 : 200,
    api: 'v2',
  },
];
