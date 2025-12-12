import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockTenantBackupPolicies } from './backupPolicies.mock';

export type TTenantBackupPolicieMockParams = {
  isTenantBackupPoliciesError?: boolean;
};

export const getTenantBackupPolicieMocks = ({
  isTenantBackupPoliciesError = false,
}: TTenantBackupPolicieMockParams = {}): Handler[] => [
  {
    url: '/backupServices/tenant/:tenantId/vspc/:vspcTenantId/backupPolicies',
    response: () => {
      return isTenantBackupPoliciesError ? null : mockTenantBackupPolicies;
    },
    api: 'v2',
    method: 'get',
    status: isTenantBackupPoliciesError ? 500 : 200,
  },
];
