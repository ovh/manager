import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getTenantDetails } from '@/data/api/tenants/tenants.requests';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

export const BACKUP_TENANT_DETAILS_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_TENANTS_QUERY_KEY,
  tenantId,
];

export const useBackupTenantDetails = ({
  tenantId,
}: { tenantId: string } & Partial<
  Omit<
    DefinedInitialDataOptions<Resource<Tenant>, unknown, Resource<WithRegion<Tenant>>>,
    'queryKey' | 'queryFn'
  >
>) => {
  const getBackupServiceId = useGetBackupServicesId();

  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      return getTenantDetails(backupServicesId!, tenantId);
    },
    queryKey: BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
    enabled: !!tenantId,
    select: (data): Resource<WithRegion<Tenant>> =>
      mapTenantResourceToTenantResourceWithRegion(data),
  });
};
