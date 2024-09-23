import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import resourceList from './iam.json';

const findResourceByUrn = (params: PathParams) =>
  resourceList.find(({ resourceURN }) => resourceURN === params.urn);

export const getIamMocks = (): Handler[] => [
  {
    url: '/iam/resource/:urn/authorization/check',
    response: (_, params: PathParams) => findResourceByUrn(params),
    api: 'v2',
    method: 'post',
  },
];
