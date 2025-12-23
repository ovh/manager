import { DefinedInitialDataOptions, useQueries, useQuery } from '@tanstack/react-query';

import { BackupServiceAwareQuery } from '@/types/Query.type';
import { Resource } from '@/types/Resource.type';
import { AssociatedTenantVSPC } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

import { getVSPCTenantDetails, getVSPCTenants } from '../../api/tenants/tenants.requests';
import { useBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

export const GET_VSPC_TENANTS_QUERY_KEY = [...BACKUP_TENANTS_QUERY_KEY, 'vspc'];

export const useVSPCTenants = (): BackupServiceAwareQuery<Resource<VSPCTenant>[]> => {
  const { backupServicesId, isPending } = useBackupServicesId();

  const query = useQuery({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: () => getVSPCTenants({ backupServicesId }),
    select: (res) => res.data,
    enabled: !!backupServicesId,
  });

  return { ...query, isLoadingBackupServicesId: isPending };
};

export const useInstalledBackupAgents = ({
  vspcTenants,
}: Readonly<{
  vspcTenants: readonly AssociatedTenantVSPC[];
}> &
  Readonly<
    Partial<Omit<DefinedInitialDataOptions<Resource<VSPCTenant>, unknown>, 'queryKey' | 'queryFn'>>
  >) => {
  const { backupServicesId } = useBackupServicesId();
  const vspcTenantIds = vspcTenants?.map((v) => v.id) ?? [];

  return useQueries({
    queries: vspcTenantIds.map((vspcTenantId) => ({
      queryKey: ['vspcTenantDetails', vspcTenantId],
      queryFn: () => getVSPCTenantDetails(backupServicesId, vspcTenantId),
      enabled: !!backupServicesId && !!vspcTenantId,
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
