import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

import { Agent } from '@/types/Agent.type';
import { AgentDownloadLinks } from '@/types/AgentDownloadLinks';
import { Resource } from '@/types/Resource.type';

export const getBackupAgentsListRoute = (tenantId: string, vspcTenantId: string) =>
  `/backupServices/tenant/${tenantId}/vspc/${vspcTenantId}/backupAgent`;

export const getBackupAgentsDetailsRoute = (tenantId: string, vspcTenantId: string, backupAgentId: string) =>
  `/backupServices/tenant/${tenantId}/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getEditConfigurationBackupAgentsRoute = (
  tenantId: string, vspcTenantId: string,
  backupAgentId: string,
) => `/backupServices/tenant/${tenantId}/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getDeleteBackupAgentsRoute = (tenantId: string, vspcTenantId: string, backupAgentId: string) =>
  `/backupServices/tenant/${tenantId}/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getDownloadLinkBackupAgentsRoute = (tenantId: string, vspcTenantId: string) =>
  `/backupServices/tenant/${tenantId}/vspc/${vspcTenantId}/managementAgent`;

export type EditConfigurationBackupAgentsParams = {
  tenantId: string;
  vspcTenantId: string;
  backupAgentId: string;
  ips: string[];
  displayName: string;
  policy: string;
};

export const getBackupAgentsDetails = async (tenantId: string, vspcTenantId: string, agentId: string) =>
  (await v2.get<Resource<Agent>>(getBackupAgentsDetailsRoute(tenantId, vspcTenantId, agentId))).data;

export const editConfigurationBackupAgents = async ({
  tenantId,
  vspcTenantId,
  backupAgentId,
  ...payload
}: EditConfigurationBackupAgentsParams): Promise<ApiResponse<string>> =>
  v2.put(getEditConfigurationBackupAgentsRoute(tenantId, vspcTenantId, backupAgentId), payload);

export const deleteBackupAgent = async (
  tenantId: string,
  vspcTenantId: string,
  agentId: string,
): Promise<ApiResponse<string>> =>
  v2.delete(`${getDeleteBackupAgentsRoute(tenantId, vspcTenantId, agentId)}`);

export const downloadLinkBackupAgent = async (tenantId: string, vspcTenantId: string) =>
  (await v2.get<AgentDownloadLinks>(getDownloadLinkBackupAgentsRoute(tenantId, vspcTenantId))).data;
