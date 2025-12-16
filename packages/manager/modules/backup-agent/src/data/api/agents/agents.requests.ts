import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

import { Agent } from '@/types/Agent.type';
import { AgentDownloadLinks } from '@/types/AgentDownloadLinks';
import { Resource } from '@/types/Resource.type';
import {
  GetBackupAgentParams,
  getBackupAgentDetailsRoute,
  getManagementAgentsRoute,
} from '@/utils/apiRoutes';

export type EditBackupAgentConfigParams = GetBackupAgentParams & {
  ips: string[];
  displayName: string;
  policy: string;
};

export const getBackupAgentsDetails = async ({
  backupServicesId,
  vspcTenantId,
  backupAgentId,
}: GetBackupAgentParams) => {
  const { data } = await v2.get<Resource<Agent>>(
    getBackupAgentDetailsRoute({ backupServicesId, vspcTenantId, backupAgentId }),
  );
  return data;
};

export const editConfigurationBackupAgents = async ({
  backupServicesId,
  vspcTenantId,
  backupAgentId,
  ...payload
}: EditBackupAgentConfigParams): Promise<ApiResponse<string>> =>
  v2.put(getBackupAgentDetailsRoute({ backupServicesId, vspcTenantId, backupAgentId }), payload);

export const deleteBackupAgent = async ({
  backupServicesId,
  vspcTenantId,
  backupAgentId,
}: GetBackupAgentParams): Promise<ApiResponse<string>> =>
  v2.delete(getBackupAgentDetailsRoute({ backupServicesId, vspcTenantId, backupAgentId }));

export const downloadLinkBackupAgent = async (backupServicesId: string, vspcTenantId: string) => {
  const { data } = await v2.get<AgentDownloadLinks>(
    getManagementAgentsRoute(backupServicesId, vspcTenantId),
  );
  return data;
};
