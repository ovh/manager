import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockBackupServicesTenants, mockVspcTenants } from '@/mocks/tenants/tenants.mock';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';
import { BACKUP_SERVICES_ROUTE, getVspcTenantsRoute } from '@/utils/apiRoutes/apiRoutes';

export const getBackupServicesTenants = async (): Promise<Resource<BackupServicesTenant>[]> => {
  if (USE_API_MOCKS) return mockBackupServicesTenants;

  const { data } = await fetchIcebergV2<Resource<BackupServicesTenant>>({
    route: BACKUP_SERVICES_ROUTE,
  });
  return data;
};

export const getVspcTenants = async (backupServicesId: string): Promise<Resource<VspcTenant>[]> => {
  if (USE_API_MOCKS) return mockVspcTenants;

  const { data } = await fetchIcebergV2<Resource<VspcTenant>>({
    route: getVspcTenantsRoute(backupServicesId),
  });
  return data;
};
