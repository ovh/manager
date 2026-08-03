import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { VAULT_IAM_ACTIONS } from '@/mocks/iam/iam.mock';

export type TIamMockParams = {
  /** Denied actions; every other published action is granted. */
  unauthorizedIamActions?: string[];
};

export const getIamMocks = ({ unauthorizedIamActions = [] }: TIamMockParams): Handler[] => [
  {
    url: '/iam/resource/:urn/authorization/check',
    response: (_: unknown, params: PathParams) => ({
      urn: String(params.urn),
      authorizedActions: VAULT_IAM_ACTIONS.filter(
        (action) => !unauthorizedIamActions.includes(action),
      ),
      unauthorizedActions: unauthorizedIamActions,
    }),
    api: 'v2',
    method: 'post',
    status: 200,
    delay: 0,
  },
];
