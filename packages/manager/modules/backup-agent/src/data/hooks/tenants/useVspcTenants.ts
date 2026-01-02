import { useQueries, useQuery } from '@tanstack/react-query';

import { AssociatedTenantVSPC } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

import { getVSPCTenantDetails, getVSPCTenants } from '../../api/tenants/tenants.requests';
import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

export const GET_VSPC_TENANTS_QUERY_KEY = [...BACKUP_TENANTS_QUERY_KEY, 'vspc'];

export const useVSPCTenants = () => {
  const getBackupServiceId = useGetBackupServicesId();

  return useQuery({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      return getVSPCTenants({ backupServicesId: backupServicesId! });
    },
    select: (res) => res.data,
  });
};

export const useInstalledBackupAgents = ({
  vspcTenants,
}: Readonly<{
  vspcTenants: readonly AssociatedTenantVSPC[];
}>) => {
  const getBackupServiceId = useGetBackupServicesId();
  const vspcTenantIds = vspcTenants?.map((v) => v.id) ?? [];

  return useQueries({
    queries: vspcTenantIds.map((vspcTenantId) => ({
      queryKey: ['vspcTenantDetails', vspcTenantId],
      queryFn: async () => {
        const backupServicesId = await getBackupServiceId();
        return getVSPCTenantDetails(backupServicesId!, vspcTenantId);
      },
      enabled: !!vspcTenantId,
    })),
    combine: (results) => {
      const tenants = results
        .map((r) => r.data?.currentState)
        .filter((t) => Boolean(t)) as VSPCTenant[];

      return {
        installedBackupAgents: countBackupAgents(tenants),
        isLoading: results.some((q) => q.isLoading),
      };
    },
  });
};
