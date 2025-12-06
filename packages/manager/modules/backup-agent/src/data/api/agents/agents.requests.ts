import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

export const getBackupAgentsListRoute = (vspcTenantId: string) =>
  `/backup/tenant/vspc/${vspcTenantId}/backupAgent`;

export const getBackupAgentsDetailsRoute = (vspcTenantId: string, backupAgentId: string) =>
  `/backup/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getEditConfigurationBackupAgentsRoute = (
  vspcTenantId: string,
  backupAgentId: string,
) => `/backup/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export const getDeleteBackupAgentsRoute = (vspcTenantId: string, backupAgentId: string) =>
  `/backup/tenant/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

export type EditConfigurationBackupAgentsParams = {
  vspcTenantId: string;
  backupAgentId: string;
  ips: string[];
  displayName: string;
  policy: string;
};

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
