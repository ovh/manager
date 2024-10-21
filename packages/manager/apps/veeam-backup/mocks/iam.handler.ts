import { PathParams } from 'msw';
import { Handler } from '../../../../../playwright-helpers';
import { iamResponse } from './iam.mock';

const findResourceByUrn = (params: PathParams) =>
  iamResponse.find(({ urn }) => urn === params.urn);

export const getIamMocks = (): Handler[] => [
  {
    url: '/iam/resource/:urn/authorization/check',
    response: (_: unknown, params: PathParams) => findResourceByUrn(params),
    api: 'v2',
    method: 'post',
  },
];
