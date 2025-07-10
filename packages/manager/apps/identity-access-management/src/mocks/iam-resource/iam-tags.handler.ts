import { Handler } from '@ovh-ux/manager-core-test-utils';
import { iamReferenceResourceTypeMock } from './iam-resource.mock';

export const getIamReferenceResourceTypeMock = (): Handler[] => [
  {
    method: 'get',
    url: '/iam/reference/resource/type',
    response: iamReferenceResourceTypeMock,
    status: 200,
    api: 'v2',
  },
];
