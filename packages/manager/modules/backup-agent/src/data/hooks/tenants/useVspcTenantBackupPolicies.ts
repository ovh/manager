import { useQuery } from '@tanstack/react-query';

import { getBackupPolicies } from '@/data/api/tenants/backupPolicies.requests';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_TENANT_POLICIES_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId),
  'policies',
];

export const useBackupTenantPolicies = ({ tenantId }: { tenantId?: string }) => {
  const getBackupServiceId = useGetBackupServicesId();

  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      return getBackupPolicies(backupServicesId!, tenantId!);
    },
    queryKey: BACKUP_TENANT_POLICIES_QUERY_KEY(tenantId!),
    enabled: !!tenantId,
  });
};
