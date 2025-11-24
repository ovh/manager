import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { mockTenantBackupPolicies } from '@/mocks/tenant/backupPolicies.mock';

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
>) =>
  useQuery({
    queryFn: () => Promise.resolve(mockTenantBackupPolicies),
    queryKey: BACKUP_TENANT_POLICIES_QUERY_KEY(tenantId!),
    enabled: !!tenantId,
    ...options,
  });
