import { queryOptions, useQuery } from '@tanstack/react-query';

import { getBackupAgentsDetails } from '@/data/api/agents/agents.requests';
import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';

export const BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY = (
  vspcTenantId: string,
  agentId: string,
) => [...BACKUP_TENANT_DETAILS_QUERY_KEY(vspcTenantId), agentId];

export const useBackupVSPCTenantAgentDetailsOptions = ({
  tenantId,
  agentId,
}: {
  tenantId?: string;
  agentId?: string;
}) =>
  queryOptions({
    queryFn: () => getBackupAgentsDetails(tenantId!, agentId!),
    queryKey: BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY(tenantId!, agentId!),
    enabled: !!tenantId && !!agentId,
  });

export const useBackupVSPCTenantAgentDetails = ({
  tenantId,
  agentId,
  ...options
}: {
  tenantId?: string;
  agentId?: string;
}) =>
  useQuery({
    ...useBackupVSPCTenantAgentDetailsOptions({ tenantId, agentId }),
    ...options,
  });
