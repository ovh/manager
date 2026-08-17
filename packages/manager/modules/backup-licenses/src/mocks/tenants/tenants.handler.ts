import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockBackupServicesTenants, mockVspcTenants } from '@/mocks/tenants/tenants.mock';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

export type TTenantMockParams = {
  backupServicesTenants?: Resource<BackupServicesTenant>[];
  isBackupServicesTenantsError?: boolean;
  vspcTenants?: Resource<VspcTenant>[];
  isVspcTenantsError?: boolean;
};

export const getTenantMocks = ({
  backupServicesTenants,
  isBackupServicesTenantsError,
  vspcTenants,
  isVspcTenantsError,
}: TTenantMockParams): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc',
    response: () =>
      isVspcTenantsError ? { message: 'Internal server error' } : (vspcTenants ?? mockVspcTenants),
    api: 'v2',
    method: 'get',
    status: isVspcTenantsError ? 500 : 200,
    delay: 0,
  },
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
