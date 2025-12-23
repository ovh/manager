import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getVSPCTenantDetails } from '@/data/api/tenants/tenants.requests';
import { BackupServiceAwareQuery } from '@/types/Query.type';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { useBackupServicesId } from '../backup/useBackupServicesId';
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
}: UseVSPCTenantDetailsParams): BackupServiceAwareQuery<Resource<VSPCTenant>, unknown> => {
  const { backupServicesId, isPending } = useBackupServicesId();

  const query = useQuery({
    queryFn: () => getVSPCTenantDetails(backupServicesId, tenantId),
    queryKey: BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId),
    enabled: !!backupServicesId && !!tenantId,
    ...options,
  });

  return { ...query, isLoadingBackupServicesId: isPending };
};
