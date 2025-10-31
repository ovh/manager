import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { identityUsers } from './identityUsers.mock';

const findIdentityUserById = (params: PathParams) =>
  identityUsers.find((user) => user.login === params.userId);

export const getIdentityUsers = (): Handler[] => [
  {
    url: `/me/identity/user/:userId`,
    response: (_: unknown, params: PathParams) => findIdentityUserById(params),
    status: 200,
    api: 'v6',
  },
];
