import { queryOptions, useQuery } from '@tanstack/react-query';

import { getBackupAgentsDetails } from '@/data/api/agents/agents.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';

export type GetBackupAgentDetailsParams = {
  vspcTenantId: string;
  backupAgentId: string;
};

export const BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY = (
  vspcTenantId: string,
  agentId: string,
) => [...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(vspcTenantId), agentId];

export const useBackupVSPCTenantAgentDetailsOptions = ({
  vspcTenantId,
  backupAgentId,
}: GetBackupAgentDetailsParams) => {
  const getBackupServiceId = useGetBackupServicesId();
  return queryOptions({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();

      return getBackupAgentsDetails({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        backupAgentId,
      });
    },
    queryKey: BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY(vspcTenantId, backupAgentId),
    enabled: !!vspcTenantId && !!backupAgentId,
  });
};

export const useBackupVSPCTenantAgentDetails = ({
  tenantId,
  agentId,
  ...options
}: {
  tenantId?: string;
  agentId?: string;
}) => {
  return useQuery({
    ...useBackupVSPCTenantAgentDetailsOptions({
      vspcTenantId: tenantId!,
      backupAgentId: agentId!,
    }),
    ...options,
  });
};
