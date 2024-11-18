import { PathParams } from 'msw';
import { Handler } from '../../types';
import { resourceList } from './iam.mock';

const findResourceByUrn = (params: PathParams) =>
  resourceList.find(({ urn }) => urn === params.urn);

export const getIamMocks = (): Handler[] => [
  {
    url: '/iam/resource/:urn/authorization/check',
    response: (_: unknown, params: PathParams) => findResourceByUrn(params),
    api: 'v2',
    method: 'post',
  },
];
