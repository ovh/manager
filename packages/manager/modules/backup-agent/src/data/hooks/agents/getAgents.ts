import { QueryKey, queryOptions, useQuery } from '@tanstack/react-query';

import { getBackupAgents } from '@/data/api/agents/agents.requests';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';

type UseBackupAgentListParams = {
  tenantId?: string;
  pageSize?: number;
};

export const BACKUP_AGENTS_LIST_QUERY_KEY = (tenantId?: string) =>
  [...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId), 'agents'] as (QueryKey & string)[];

export const useGetBackupAgentListOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();

  return (tenantId: string) =>
    queryOptions({
      queryFn: async () => {
        const backupServicesId = await getBackupServiceId();

        return getBackupAgents(backupServicesId!, tenantId);
      },
      queryKey: BACKUP_AGENTS_LIST_QUERY_KEY(tenantId),
      enabled: !!tenantId,
    });
};

export const useBackupAgentList = ({ tenantId = '' }: UseBackupAgentListParams) => {
  return useQuery(useGetBackupAgentListOptions()(tenantId));
};
