import { Handler } from '@ovh-ux/manager-core-test-utils';
import { identityUserIds } from './identityUserIds.mock';

export const getIdentityUserIds = (): Handler[] => {
  return [
    {
      url: '/me/identity/user',
      response: identityUserIds,
      status: 200,
      api: 'v6',
    },
  ];
};
