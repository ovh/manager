export const BACKUP_SERVICES_ROUTE = '/backupServices/tenant';

export const getBackupServicesBaseRoute = (backupServicesId: string) =>
  `${BACKUP_SERVICES_ROUTE}/${backupServicesId}`;

export const getVspcTenantsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vspc`;
