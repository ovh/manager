import { useQueries, useQuery } from '@tanstack/react-query';

import { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

import { getVSPCTenants } from '../../api/tenants/tenants.requests';
import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';
import {useBackupVSPCTenantDetailsOptions} from "@/data/hooks/tenants/useVspcTenantDetails";

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
                                           vspcTenantIds,
}: Readonly<{
  vspcTenantIds: readonly string[];
}>) => {
  return useQueries({
    queries: vspcTenantIds.map((vspcTenantId) => useBackupVSPCTenantDetailsOptions({ tenantId: vspcTenantId })),
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
