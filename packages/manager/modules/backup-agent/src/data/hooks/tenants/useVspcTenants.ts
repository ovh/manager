import {
  DefinedInitialDataOptions,
  UseQueryResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query';

import { Resource } from '@/types/Resource.type';
import { AssociatedTenantVSPC } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

import { getVSPCTenantDetails, getVSPCTenants } from '../../api/tenants/tenants.requests';
import { useBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';

type TUseVSPCTenantsResult = UseQueryResult<Resource<VSPCTenant>[], Error>;

export const GET_VSPC_TENANTS_QUERY_KEY = [...BACKUP_TENANTS_QUERY_KEY, 'vspc'];

export const useVSPCTenants = (): TUseVSPCTenantsResult => {
  const { backupServicesId } = useBackupServicesId();

  return useQuery({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: () => getVSPCTenants({ backupServicesId }),
    select: (res) => res.data,
    enabled: !!backupServicesId,
  });
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
