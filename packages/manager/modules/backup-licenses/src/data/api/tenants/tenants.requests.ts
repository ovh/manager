import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';
import { BACKUP_SERVICES_ROUTE, getVspcTenantsRoute } from '@/utils/apiRoutes/apiRoutes';

export const getBackupServicesTenants = async (): Promise<Resource<BackupServicesTenant>[]> => {
  const { data } = await fetchIcebergV2<Resource<BackupServicesTenant>>({
    route: BACKUP_SERVICES_ROUTE,
  });
  return data;
};

export const getVspcTenants = async (backupServicesId: string): Promise<Resource<VspcTenant>[]> => {
  const { data } = await fetchIcebergV2<Resource<VspcTenant>>({
    route: getVspcTenantsRoute(backupServicesId),
  });
  return data;
};
