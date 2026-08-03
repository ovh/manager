import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockBackupServicesTenants } from '@/mocks/tenants/tenants.mock';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

export type TTenantMockParams = {
  backupServicesTenants?: Resource<BackupServicesTenant>[];
  isBackupServicesTenantsError?: boolean;
};

export const getTenantMocks = ({
  backupServicesTenants,
  isBackupServicesTenantsError,
}: TTenantMockParams): Handler[] => [
  {
    url: '/backupServices/tenant',
    response: () =>
      isBackupServicesTenantsError
        ? { message: 'Internal server error' }
        : (backupServicesTenants ?? mockBackupServicesTenants),
    api: 'v2',
    method: 'get',
    status: isBackupServicesTenantsError ? 500 : 200,
    delay: 0,
  },
];
