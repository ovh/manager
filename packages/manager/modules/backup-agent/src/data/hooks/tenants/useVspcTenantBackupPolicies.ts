import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { getBackupPolicies } from '@/data/api/tenants/backupPolicies.requests';
import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';

import { useBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_TENANT_POLICIES_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
  'policies',
];

export const useBackupTenantPolicies = ({
  tenantId,
  ...options
}: {
  tenantId?: string;
} & Partial<
  Omit<DefinedInitialDataOptions<string[], unknown, string[]>, 'queryKey' | 'queryFn'>
>) => {
  const { backupServicesId } = useBackupServicesId();

  return useQuery({
    queryFn: () => getBackupPolicies(backupServicesId, tenantId!),
    queryKey: BACKUP_TENANT_POLICIES_QUERY_KEY(tenantId!),
    enabled: !!backupServicesId && !!tenantId,
    ...options,
  });
};
