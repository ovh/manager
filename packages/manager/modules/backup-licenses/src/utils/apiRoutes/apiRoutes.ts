export const BACKUP_SERVICES_ROUTE = '/backupServices/tenant';

export const CATALOG_BACKUP_SERVICES_ROUTE = '/order/catalog/public/backupServices';

export const ORDER_CART_ROUTE = '/order/cart';

export const CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE = '/order/cartServiceOption/backupServices';

export const BACKUP_SERVICES_CART_ITEM_ENDPOINT = 'backupServices';

export const getOrderCartRoute = (cartId: string) => `${ORDER_CART_ROUTE}/${cartId}`;

export const getOrderCartAssignRoute = (cartId: string) => `${getOrderCartRoute(cartId)}/assign`;

export const getOrderCartCheckoutRoute = (cartId: string) =>
  `${getOrderCartRoute(cartId)}/checkout`;

export const getBackupServicesCartItemRoute = (cartId: string) =>
  `${getOrderCartRoute(cartId)}/${BACKUP_SERVICES_CART_ITEM_ENDPOINT}`;

/** Addons de l'item principal : c'est le corps, pas la route, qui porte l'`itemId` du parent. */
export const getBackupServicesCartOptionRoute = (cartId: string) =>
  `${getBackupServicesCartItemRoute(cartId)}/options`;

export const getCartItemRoute = (cartId: string, itemId: number) =>
  `${getOrderCartRoute(cartId)}/item/${itemId}`;

export const getCartItemRequiredConfigurationRoute = (cartId: string, itemId: number) =>
  `${getCartItemRoute(cartId, itemId)}/requiredConfiguration`;

export const getCartItemConfigurationRoute = (cartId: string, itemId: number) =>
  `${getCartItemRoute(cartId, itemId)}/configuration`;

/** Offres commandables sur un service existant, prix compris : la seule source de prix d'une commande sur service. */
export const getCartServiceOptionRoute = (serviceName: string) =>
  `${CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE}/${serviceName}`;

export const getBackupServicesBaseRoute = (backupServicesId: string) =>
  `${BACKUP_SERVICES_ROUTE}/${backupServicesId}`;

export const getVspcTenantsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vspc`;

export const getBackupLicensesRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getVspcTenantsRoute(backupServicesId)}/${vspcTenantId}/backupLicenses`;

export const getBackupServersRoute = (
  backupServicesId: string,
  vspcTenantId: string,
  backupLicensesId: string,
) => `${getBackupLicensesRoute(backupServicesId, vspcTenantId)}/${backupLicensesId}/backupServer`;

export const getBackupServerRoute = (
  backupServicesId: string,
  vspcTenantId: string,
  backupLicensesId: string,
  backupServerId: string,
) =>
  `${getBackupServersRoute(backupServicesId, vspcTenantId, backupLicensesId)}/${backupServerId}`;

export const getVaultsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vault`;

export const getVaultRoute = (backupServicesId: string, vaultId: string) =>
  `${getVaultsRoute(backupServicesId)}/${vaultId}`;

export const getVaultBucketCredentialsRoute = (
  backupServicesId: string,
  vaultId: string,
  bucketId: string,
) => `${getVaultRoute(backupServicesId, vaultId)}/bucket/${bucketId}/credentials`;

/** Stockage d'un vault : `quantity` et `price` en un seul appel (§3.1 de la spec BKP-1225). */
export const getServiceConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption/element`;

/** Prix de la licence : pas de `quantity` à lire, `/consumption` sans `/element` (§3.2). */
export const getLicenseConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption`;
