import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getTenantDetails } from '@/data/api/tenants/tenants.requests';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

export const BACKUP_TENANT_DETAILS_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_TENANTS_QUERY_KEY,
  tenantId,
];

export const useBackupTenantDetails = ({
  tenantId,
  ...options
}: {
  tenantId: string;
} & Partial<
  Omit<
    DefinedInitialDataOptions<Resource<Tenant>, unknown, Resource<WithRegion<Tenant>>>,
    'queryKey' | 'queryFn'
  >
>) =>
  useQuery({
    queryFn: () => getTenantDetails(tenantId),
    queryKey: BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
    select: (data): Resource<WithRegion<Tenant>> =>
      mapTenantResourceToTenantResourceWithRegion(data),
    ...options,
  });
