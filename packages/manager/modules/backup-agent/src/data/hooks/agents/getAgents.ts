import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { getBackupAgentsListRoute } from '@/data/api/agents/agents.requests';
import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { Agent } from '@/types/Agent.type';
import { Resource } from '@/types/Resource.type';

export const BACKUP_AGENTS_LIST_QUERY_KEY = (tenantId: string) => [
  ...BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
  'agents',
];

export const useBackupAgentList = (
  {
    tenantId,
    pageSize,
  }: {
    tenantId?: string;
    pageSize: number;
  } = { pageSize: 9999 },
) =>
  useResourcesIcebergV2<Resource<Agent>>({
    route: getBackupAgentsListRoute(tenantId!),
    queryKey: BACKUP_AGENTS_LIST_QUERY_KEY(tenantId!),
    enabled: !!tenantId,
    pageSize,
  });
