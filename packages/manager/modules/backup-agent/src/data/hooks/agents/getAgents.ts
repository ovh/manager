import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { mockAgents } from '@/mocks/agents/agents';
import { mockVaults } from '@/mocks/vaults/vaults';

// Remove during unmocking
export const BACKUP_AGENTS_LIST_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
  'agents',
];

export const useBackupAgentList = (
  {
    // tenantId
    // pageSize,
  }: {
    pageSize: number;
    tenantId: string;
  } = { pageSize: 9999 },
) => ({ flattenData: mockAgents, isLoading: false });
// useResourcesIcebergV2<VaultResource>({
//   route: getBackupAgentsList(tenantId),
//   queryKey: BACKUP_AGENTS_LIST_QUERY_KEY(tenantId),
//   pageSize,
// });
