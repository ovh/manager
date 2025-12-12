import { useQuery } from '@tanstack/react-query';

import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { getBackupTenants } from '../../api/tenants/tenants.requests';

export const BACKUP_TENANTS_QUERY_KEY = ['backup', 'tenants'];

export const useBackupTenants = () =>
  useQuery({
    queryKey: BACKUP_TENANTS_QUERY_KEY,
    queryFn: () => getBackupTenants(),
    select: (res) =>
      res.data.map((tenantResource) => mapTenantResourceToTenantResourceWithRegion(tenantResource)),
  });
