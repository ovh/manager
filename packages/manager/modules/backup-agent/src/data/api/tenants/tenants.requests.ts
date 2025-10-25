import {
  ApiResponse,
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  v2,
} from '@ovh-ux/manager-core-api';

import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const GET_BACKUP_TENANTS_ROUTE = '/backup/tenants';
export const GET_VSPC_TENANTS_ROUTE = `${GET_BACKUP_TENANTS_ROUTE}/vspc`;

export const getBackupTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Tenant>> =>
  fetchIcebergV2({ ...params, route: GET_BACKUP_TENANTS_ROUTE });

export const getVSPCTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<VSPCTenant>> =>
  fetchIcebergV2({ ...params, route: GET_VSPC_TENANTS_ROUTE });

export const deleteVSPCTenant = async (vspcTenantId: string): Promise<ApiResponse<string>> =>
  v2.delete(`${GET_VSPC_TENANTS_ROUTE}/${vspcTenantId}`);
