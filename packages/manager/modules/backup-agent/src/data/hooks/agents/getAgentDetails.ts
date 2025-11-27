import { queryOptions, useQuery } from '@tanstack/react-query';

import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { mockAgents } from '@/mocks/agents/agents';
import { Agent } from '@/types/Agent.type';
import { Resource } from '@/types/Resource.type';

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
    queryFn: () =>
      new Promise<Resource<Agent>>((resolve, reject) => {
        setTimeout(() => {
          const result = mockAgents.find((agent) => agent.id === agentId);
          result ? resolve(result) : reject(new Error('Agent not found'));
        }, 1000);
      }),
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
