import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';

import { Tenant } from '@/types/Tenant.type';

export const GET_BACKUP_TENANTS_ROUTE = '/backup/tenant';

export const getBackupTenants = async (
  params?: Omit<IcebergFetchParamsV2, 'route'>,
): Promise<IcebergFetchResultV2<Tenant>> =>
  fetchIcebergV2({ ...params, route: GET_BACKUP_TENANTS_ROUTE });
