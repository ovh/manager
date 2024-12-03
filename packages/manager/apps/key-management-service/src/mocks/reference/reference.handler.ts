import { Handler } from '../../../../../../../playwright-helpers';
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
      : () => {
          console.log(referenceServiceKeyMock);
          return referenceServiceKeyMock;
        },
    status: isReferenceKO ? 500 : 200,
    api: 'v2',
  },
];
