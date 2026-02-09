import { useQuery } from '@tanstack/react-query';

import { getBackupPolicies } from '@/data/api/tenants/backupPolicies.requests';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { useGetVspcTenantId } from './useVspcTenantId';

export const BACKUP_TENANT_POLICIES_QUERY_KEY = () => [
  ...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(),
  'policies',
];

export const useBackupTenantPolicies = () => {
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();

  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      const vspcTenantId = await getVspcTenantId();
      return getBackupPolicies(backupServicesId!, vspcTenantId);
    },
    queryKey: BACKUP_TENANT_POLICIES_QUERY_KEY(),
  });
};
