import { QueryKey, queryOptions, useQuery } from '@tanstack/react-query';

import { getVSPCTenantDetails } from '@/data/api/tenants/tenants.requests';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

type UseVSPCTenantDetailsParams = {
  tenantId: string;
};

export const BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY = (vspcTenantID?: string | QueryKey) => [
  ...GET_VSPC_TENANTS_QUERY_KEY,
  vspcTenantID,
];

export const useGetBackupVSPCTenantDetailsOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();

  return ({ tenantId }: UseVSPCTenantDetailsParams) =>
    queryOptions({
      queryFn: async () => {
        const backupServicesId = await getBackupServiceId();

        return getVSPCTenantDetails(backupServicesId!, tenantId);
      },
      queryKey: BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId),
      enabled: !!tenantId,
    });
};

export const useBackupVSPCTenantDetails = ({ tenantId }: UseVSPCTenantDetailsParams) => {
  return useQuery(useGetBackupVSPCTenantDetailsOptions()({ tenantId }));
};
