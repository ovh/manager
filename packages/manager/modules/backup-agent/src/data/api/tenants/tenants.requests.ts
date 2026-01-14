import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  v2,
} from '@ovh-ux/manager-core-api';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import {
  BACKUP_SERVICES_ROUTE,
  getBackupBaseRoute,
  getVspcTenantDetailsRoute,
  getVspcTenantsRoute,
} from '@/utils/apiRoutes';

// Backup Tenants
export const getBackupTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Resource<Tenant>>> =>
  fetchIcebergV2({ ...params, route: BACKUP_SERVICES_ROUTE });

export const getTenantDetails = async (backupServicesId: string) => {
  const { data } = await v2.get<Resource<Tenant>>(getBackupBaseRoute(backupServicesId));
  return data;
};

// Backup VSPC Tenants
export const getVSPCTenants = async ({
  backupServicesId,
  ...params
}: { backupServicesId: string } & Omit<IcebergFetchParamsV2, 'route'>) =>
  (
    await fetchIcebergV2<Resource<VSPCTenant>>({
      ...params,
      route: getVspcTenantsRoute(backupServicesId),
    })
  ).data;

export const getVSPCTenantDetails = async (backupServicesId: string, vspcTenantId: string) => {
  const { data } = await v2.get<Resource<VSPCTenant>>(
    getVspcTenantDetailsRoute(backupServicesId, vspcTenantId),
  );

  return data;
};

export const deleteVSPCTenant = async (
  backupServicesId: string,
  vspcTenantId: string,
): Promise<string> => {
  const { data } = await v2.delete<string>(
    getVspcTenantDetailsRoute(backupServicesId, vspcTenantId),
  );

  return data;
};
