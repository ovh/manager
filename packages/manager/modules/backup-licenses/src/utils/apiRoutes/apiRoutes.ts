export const BACKUP_SERVICES_ROUTE = '/backupServices/tenant';

export const LOCATIONS_ROUTE = '/location';

export const getBackupServicesBaseRoute = (backupServicesId: string) =>
  `${BACKUP_SERVICES_ROUTE}/${backupServicesId}`;

export const getVspcTenantsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vspc`;

export const getBackupLicensesRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getVspcTenantsRoute(backupServicesId)}/${vspcTenantId}/backupLicenses`;

export const getBackupServersRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getVspcTenantsRoute(backupServicesId)}/${vspcTenantId}/backupLicenses/backupServer`;

export const getBackupServerRoute = (
  backupServicesId: string,
  vspcTenantId: string,
  backupServerId: string,
) => `${getBackupServersRoute(backupServicesId, vspcTenantId)}/${backupServerId}`;
