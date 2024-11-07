import { PathParams } from 'msw';
import { Handler } from '../../../../../../../playwright-helpers';
import { kmsIamMock } from './iam.mock';

export type GetIamAuthorizationMockParams = {
  isIamKO?: boolean;
};

const findResourceByUrn = (params: PathParams) =>
  kmsIamMock.find(({ urn }) => urn === params.urn);

export const getIamMocks = ({
  isIamKO,
}: GetIamAuthorizationMockParams): Handler[] => [
  {
    method: 'post',
    url: '/iam/resource/:urn/authorization/check',
    response: isIamKO
      ? {
          status: 500,
          data: {
            message: 'iam authorization error',
          },
        }
      : (_: unknown, params: PathParams) => findResourceByUrn(params),
    status: isIamKO ? 500 : 200,
    api: 'v2',
  },
];
