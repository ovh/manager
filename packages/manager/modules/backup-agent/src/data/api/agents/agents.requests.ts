import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

import { Agent } from '@/types/Agent.type';
import { AgentDownloadLinks } from '@/types/AgentDownloadLinks';
import { Resource } from '@/types/Resource.type';

export const getBackupAgentsListRoute = (vspcTenantId: string) =>
  `/backupServices/tenant/vspc/${vspcTenantId}/backupAgent`;

export const getBackupAgentsDetailsRoute = (vspcTenantId: string, backupAgentId: string) =>
  `/backupServices/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getEditConfigurationBackupAgentsRoute = (
  vspcTenantId: string,
  backupAgentId: string,
) => `/backupServices/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getDeleteBackupAgentsRoute = (vspcTenantId: string, backupAgentId: string) =>
  `/backupServices/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getDownloadLinkBackupAgentsRoute = (vspcTenantId: string) =>
  `/backupServices/tenant/vspc/${vspcTenantId}/managementAgent`;

export type EditConfigurationBackupAgentsParams = {
  vspcTenantId: string;
  backupAgentId: string;
  ips: string[];
  displayName: string;
  policy: string;
};

export const getBackupAgentsDetails = async (vspcTenantId: string, agentId: string) =>
  (await v2.get<Resource<Agent>>(getBackupAgentsDetailsRoute(vspcTenantId, agentId))).data;

export const editConfigurationBackupAgents = async ({
  vspcTenantId,
  backupAgentId,
  ...payload
}: EditConfigurationBackupAgentsParams): Promise<ApiResponse<string>> =>
  v2.put(getEditConfigurationBackupAgentsRoute(vspcTenantId, backupAgentId), payload);

export const deleteBackupAgent = async (
  vspcTenantId: string,
  agentId: string,
): Promise<ApiResponse<string>> =>
  v2.delete(`${getDeleteBackupAgentsRoute(vspcTenantId, agentId)}`);

export const downloadLinkBackupAgent = async (vspcTenantId: string) =>
  (await v2.get<AgentDownloadLinks>(getDownloadLinkBackupAgentsRoute(vspcTenantId))).data;
