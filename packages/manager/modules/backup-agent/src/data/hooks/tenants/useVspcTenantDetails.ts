import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getVSPCTenantDetails } from '@/data/api/tenants/tenants.requests';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

type UseVSPCTenantDetailsParams = {
  tenantId: string;
} & Omit<UseQueryOptions<Resource<VSPCTenant>>, 'queryKey' | 'queryFn'>;

export const BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY = (vspcTenantID: string) => [
  ...GET_VSPC_TENANTS_QUERY_KEY,
  vspcTenantID,
];

export const useBackupVSPCTenantDetails = ({
  tenantId,
  ...options
}: UseVSPCTenantDetailsParams) => {
  const getBackupServiceId = useGetBackupServicesId();

  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();

      return getVSPCTenantDetails(backupServicesId!, tenantId);
    },
    queryKey: BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId),
    enabled: !!tenantId,
    ...options,
  });
};
