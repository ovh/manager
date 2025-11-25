import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { mockAgents } from '@/mocks/agents/agents';
import { Agent } from '@/types/Agent.type';
import { Resource } from '@/types/Resource.type';

export const BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY = (
  vspcTenantID: string,
  backupId: string,
) => [...BACKUP_TENANT_DETAILS_QUERY_KEY(vspcTenantID), backupId];

export const useBackupVSPCTenantDetails = ({
  tenantId,
  backupId,
  ...options
}: {
  tenantId: string;
  backupId: string;
} & Partial<
  Omit<DefinedInitialDataOptions<Resource<Agent>, unknown, Resource<Agent>>, 'queryKey' | 'queryFn'>
>) =>
  useQuery({
    queryFn: () =>
      new Promise<Resource<Agent>>((resolve, reject) => {
        const result = mockAgents.find((agent) => agent.id === tenantId);
        result ? resolve(result) : reject(new Error('Agent not found'));
      }),
    queryKey: BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY(tenantId, backupId),
    ...options,
  });
