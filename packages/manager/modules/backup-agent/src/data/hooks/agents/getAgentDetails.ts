import { queryOptions, useQuery } from '@tanstack/react-query';

import { getBackupAgentsDetails } from '@/data/api/agents/agents.requests';
import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { GetBackupAgentParams } from '@/utils/apiRoutes';

import { useBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY = (
  vspcTenantId: string,
  agentId: string,
) => [...BACKUP_TENANT_DETAILS_QUERY_KEY(vspcTenantId), agentId];

export const useBackupVSPCTenantAgentDetailsOptions = ({
  backupServicesId,
  vspcTenantId,
  backupAgentId,
}: GetBackupAgentParams) => {
  return queryOptions({
    queryFn: () =>
      getBackupAgentsDetails({
        backupServicesId,
        vspcTenantId,
        backupAgentId,
      }),
    queryKey: BACKUP_VSPC_TENANT_AGENT_DETAILS_QUERY_KEY(vspcTenantId, backupAgentId),
    enabled: !!backupServicesId && !!vspcTenantId && !!backupAgentId,
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
  const { backupServicesId } = useBackupServicesId();

  return useQuery({
    ...useBackupVSPCTenantAgentDetailsOptions({
      backupServicesId,
      vspcTenantId: tenantId!,
      backupAgentId: agentId!,
    }),
    ...options,
  });
};
