import {
  ApiResponse,
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  v2,
} from '@ovh-ux/manager-core-api';

import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { Resource } from '@/types/Resource.type';

export const GET_BACKUP_TENANTS_ROUTE = '/backup/tenants';
export const GET_VSPC_TENANTS_ROUTE = `${GET_BACKUP_TENANTS_ROUTE}/vspc`;

const getDetailsTenantRoute = (tenantId: string) => `${GET_BACKUP_TENANTS_ROUTE}/${tenantId}`;

const getDetailsVspcTenantRoute = (tenantId: string) => `${GET_VSPC_TENANTS_ROUTE}/${tenantId}`;

export const getBackupTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Resource<Tenant>>> =>
  fetchIcebergV2({ ...params, route: GET_BACKUP_TENANTS_ROUTE });

export const getTenantDetails = async (tenantId: string) =>
  (await v2.get<Tenant>(getDetailsTenantRoute(tenantId))).data;

export const getVSPCTenantDetails = async (vspcTenantId: string) =>
  (await v2.get<Tenant>(getDetailsVspcTenantRoute(vspcTenantId))).data;


export const getVSPCTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Resource<VSPCTenant>>> =>
  fetchIcebergV2({ ...params, route: GET_VSPC_TENANTS_ROUTE });

export const deleteVSPCTenant = async (vspcTenantId: string): Promise<ApiResponse<string>> =>
  v2.delete(`${GET_VSPC_TENANTS_ROUTE}/${vspcTenantId}`);
