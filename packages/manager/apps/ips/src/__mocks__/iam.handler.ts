import { Handler } from '@ovh-ux/manager-core-test-utils';
import { IAM_ACTION } from '@/utils';

export const getIamMocks = (): Handler[] => [
  {
    url: '/iam/resource/:urn/authorization/check',
    response: {
      authorizedActions: Object.values(IAM_ACTION),
      unauthorizedActions: [],
    },
    method: 'post',
    api: 'v2',
  },
];
