export type GetBackupAgentParams = {
  backupServicesId: string;
  vspcTenantId: string;
  backupAgentId: string;
};

// Backup Services
export const BACKUP_SERVICES_ROUTE = '/backupServices/tenant';

// Base route
const getBackupBaseRoute = (backupServicesId: string) =>
  `/backupServices/tenant/${backupServicesId}`;

// Vaults
export const getVaultsRoute = (backupServicesId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vault`;

export const getVaultDetailsRoute = (backupServicesId: string, vaultId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vault/${vaultId}`;

// VSPC Tenants
export const getVspcTenantsRoute = (backupServicesId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc`;

export const getVspcTenantDetailsRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc/${vspcTenantId}`;

// Backup Agents
export const getBackupAgentsRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc/${vspcTenantId}/backupAgent`;

export const getBackupAgentDetailsRoute = ({
  backupServicesId,
  vspcTenantId,
  backupAgentId,
}: GetBackupAgentParams) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`;

// Policies
export const getBackupPoliciesRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc/${vspcTenantId}/backupPolicies`;

// Management Agents
export const getManagementAgentsRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getBackupBaseRoute(backupServicesId)}/vspc/${vspcTenantId}/managementAgent`;

// Service Consumption
export const getServiceConsumptionRoute = (resourceName: string) =>
  `/services/${resourceName}/consumption/element`;
