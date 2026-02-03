import { queryOptions, useQuery } from '@tanstack/react-query';

import { getBackupAgentsDetails } from '@/data/api/agents/agents.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';
import { useGetVspcTenantId } from '@/data/hooks/tenants/useVspcTenantId';

export type GetBackupAgentDetailsParams = {
  backupAgentId: string;
};

export const BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY = (agentId: string) => [
  ...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(),
  agentId,
];

export const useBackupVSPCTenantAgentDetailsOptions = ({
  backupAgentId,
}: GetBackupAgentDetailsParams) => {
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();

  return queryOptions({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      const vspcTenantId = await getVspcTenantId();

      return getBackupAgentsDetails({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        backupAgentId,
      });
    },
    queryKey: BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY(backupAgentId),
    enabled: !!backupAgentId,
  });
};

export const useBackupVSPCTenantAgentDetails = ({ agentId, ...options }: { agentId?: string }) => {
  return useQuery({
    ...useBackupVSPCTenantAgentDetailsOptions({
      backupAgentId: agentId!,
    }),
    ...options,
  });
};
