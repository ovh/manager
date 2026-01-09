import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { useGetBackupVSPCTenantDetailsOptions } from '@/data/hooks/tenants/useVspcTenantDetails';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

import { getVSPCTenants } from '../../api/tenants/tenants.requests';
import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

export const GET_VSPC_TENANTS_QUERY_KEY = [...BACKUP_TENANTS_QUERY_KEY, 'vspc'];

export const useVSPCTenantsOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();

  return queryOptions({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      return getVSPCTenants({ backupServicesId: backupServicesId! });
    },
  });
};

export const useVSPCTenants = () => useQuery(useVSPCTenantsOptions());

export const useInstalledBackupAgents = ({
  vspcTenantIds,
}: Readonly<{
  vspcTenantIds: readonly string[];
}>) => {
  const getBackupVspcOptions = useGetBackupVSPCTenantDetailsOptions();
  return useQueries({
    queries: vspcTenantIds.map((vspcTenantId) => getBackupVspcOptions({ tenantId: vspcTenantId })),
    combine: (results) => {
      const tenants = results
        .map((r) => r.data?.currentState)
        .filter((t) => Boolean(t)) as VSPCTenant[];

      return {
        installedBackupAgents: countBackupAgents(tenants),
        isPending: results.some((q) => q.isPending),
      };
    },
  });
};
