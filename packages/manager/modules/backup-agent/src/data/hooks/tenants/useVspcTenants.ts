import { queryOptions, useQuery } from '@tanstack/react-query';

import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';
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

export const useInstalledBackupAgents = () => {
  const { data: vspcTenantDetails, isPending } = useBackupVSPCTenantDetails();

  return {
    installedBackupAgents: countBackupAgents(
      vspcTenantDetails?.currentState ? [vspcTenantDetails.currentState] : [],
    ),
    isPending,
  };
};
