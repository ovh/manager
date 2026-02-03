import { QueryKey, queryOptions, useQuery } from '@tanstack/react-query';

import { getVSPCTenantDetails } from '@/data/api/tenants/tenants.requests';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { useGetVspcTenantId } from './useVspcTenantId';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

export const BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY = (vspcTenantID?: string | QueryKey) => [
  ...GET_VSPC_TENANTS_QUERY_KEY,
  vspcTenantID,
];

export const useGetBackupVSPCTenantDetailsOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();

  return () =>
    queryOptions({
      queryFn: async () => {
        const backupServicesId = await getBackupServiceId();
        const vspcTenantId = await getVspcTenantId();

        return getVSPCTenantDetails(backupServicesId!, vspcTenantId);
      },
      queryKey: BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(),
    });
};

export const useBackupVSPCTenantDetails = () => {
  return useQuery(useGetBackupVSPCTenantDetailsOptions()());
};
