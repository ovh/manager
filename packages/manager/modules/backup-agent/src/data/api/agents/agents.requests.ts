export const getBackupAgentsListRoute = (vspcTenantId: string) =>
  `/backup/tenant/vspc/${vspcTenantId}/backupAgent`;

export const getBackupAgentsDetailsRoute = (vspcTenantId: string, backupAgentId: string) =>
  `${getBackupAgentsListRoute(vspcTenantId)}/${backupAgentId}`;
