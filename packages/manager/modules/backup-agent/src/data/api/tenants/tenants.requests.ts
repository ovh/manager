import {
  ApiResponse,
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  v2,
} from '@ovh-ux/manager-core-api';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const getBackupTenantRoute = () => `/backupServices/tenant`;
export const getVspcTenantRoute = (tenantId: string) => `/backupServices/tenant/${tenantId}/vspc`;

export const getDetailsTenantRoute = (tenantId: string) =>
  `${getBackupTenantRoute}/${tenantId}`;

export const getDetailsVspcTenantRoute = (tenantId: string, vspcTenantId: string) =>
  `${getVspcTenantRoute(tenantId)}/${vspcTenantId}`;

export const getBackupTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Resource<Tenant>>> =>
  fetchIcebergV2({ ...params, route: getBackupTenantRoute() });

export const getTenantDetails = async (tenantId: string) =>
  (await v2.get<Resource<Tenant>>(getDetailsTenantRoute(tenantId))).data;

export const getVSPCTenantDetails = async (tenantId: string, vspcTenantId: string) =>
  (await v2.get<Resource<VSPCTenant>>(getDetailsVspcTenantRoute(tenantId, vspcTenantId))).data;

export const getVSPCTenants = async (
  { tenantId, ...params }: { tenantId: string } & Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Resource<VSPCTenant>>> =>
  fetchIcebergV2({ ...params, route: getVspcTenantRoute(tenantId) });

export const deleteVSPCTenant = async (tenantId: string, vspcTenantId: string): Promise<ApiResponse<string>> =>
  v2.delete(`${getVspcTenantRoute(tenantId)}/${vspcTenantId}`);
