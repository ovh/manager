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

export const getVaultsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vault`;

/** Stockage d'un vault : `quantity` et `price` en un seul appel (§3.1 de la spec BKP-1225). */
export const getServiceConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption/element`;

/** Prix de la licence : pas de `quantity` à lire, `/consumption` sans `/element` (§3.2). */
export const getLicenseConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption`;
