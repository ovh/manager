import { QueryKey } from '@tanstack/react-query';

import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';
import { Agent } from '@/types/Agent.type';
import { AgentResource } from '@/types/Resource.type';
import { getBackupAgentsRoute } from '@/utils/apiRoutes';

import { useBackupServicesId } from '../backup/useBackupServicesId';

type UseBackupAgentListParams = {
  tenantId?: string;
  pageSize?: number;
};

export const BACKUP_AGENTS_LIST_QUERY_KEY = (tenantId?: string) =>
  [...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId), 'agents'] as (QueryKey & string)[];

export const useBackupAgentList = ({
  tenantId = '',
  pageSize = 9999,
}: UseBackupAgentListParams) => {
  const { data: backupServicesId } = useBackupServicesId();

  return useResourcesIcebergV2<AgentResource<Agent>>({
    route: getBackupAgentsRoute(backupServicesId!, tenantId),
    queryKey: BACKUP_AGENTS_LIST_QUERY_KEY(tenantId),
    enabled: !!backupServicesId && !!tenantId,
    pageSize,
  });
};
