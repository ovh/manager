import { describe, expect, it } from 'vitest';

import {
  BACKUP_SERVICES_ROUTE,
  CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE,
  ORDER_CART_ROUTE,
  getBackupLicensesRoute,
  getBackupServerRoute,
  getBackupServersRoute,
  getBackupServicesBaseRoute,
  getCartItemConfigurationRoute,
  getCartItemRequiredConfigurationRoute,
  getCartServiceOptionRoute,
  getLicenseConsumptionRoute,
  getOrderCartAssignRoute,
  getOrderCartCheckoutRoute,
  getServiceConsumptionRoute,
  getVaultBucketCredentialsRoute,
  getVaultsRoute,
  getVspcTenantsRoute,
} from './apiRoutes';

describe('apiRoutes', () => {
  it('builds the backup services base route for a given tenant id', () => {
    expect(getBackupServicesBaseRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1`);
  });

  it('builds the vspc route for a given tenant id', () => {
    expect(getVspcTenantsRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1/vspc`);
  });

  it('builds the backup servers route for a given tenant, vspc tenant and license id', () => {
    expect(getBackupServersRoute('tenant-1', 'vspc-1', 'license-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vspc/vspc-1/backupLicenses/license-1/backupServer`,
    );
  });

  it('builds the single backup server route for a given server id', () => {
    expect(getBackupServerRoute('tenant-1', 'vspc-1', 'license-1', 'server-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vspc/vspc-1/backupLicenses/license-1/backupServer/server-1`,
    );
  });

  it('builds the backup licenses route for a given tenant and vspc tenant id', () => {
    expect(getBackupLicensesRoute('tenant-1', 'vspc-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vspc/vspc-1/backupLicenses`,
    );
  });

  it('builds the vaults route for a given tenant id', () => {
    expect(getVaultsRoute('tenant-1')).toBe(`${BACKUP_SERVICES_ROUTE}/tenant-1/vault`);
  });

  it('builds the bucket credentials route for a given vault and bucket id', () => {
    expect(getVaultBucketCredentialsRoute('tenant-1', 'vault-1', 'bucket-1')).toBe(
      `${BACKUP_SERVICES_ROUTE}/tenant-1/vault/vault-1/bucket/bucket-1/credentials`,
    );
  });

  it('builds the storage consumption route (/element) for a given service id', () => {
    expect(getServiceConsumptionRoute('service-1')).toBe('/services/service-1/consumption/element');
  });

  it('builds the license consumption route (no /element) for a given service id', () => {
    expect(getLicenseConsumptionRoute('service-1')).toBe('/services/service-1/consumption');
  });

  it('builds the service option route for a given service name', () => {
    expect(getCartServiceOptionRoute('backup-vault-1')).toBe(
      `${CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE}/backup-vault-1`,
    );
  });

  it('builds the cart assign and checkout routes for a given cart id', () => {
    expect(getOrderCartAssignRoute('cart-1')).toBe(`${ORDER_CART_ROUTE}/cart-1/assign`);
    expect(getOrderCartCheckoutRoute('cart-1')).toBe(`${ORDER_CART_ROUTE}/cart-1/checkout`);
  });

  it('builds the item configuration routes for a given cart and item id', () => {
    expect(getCartItemRequiredConfigurationRoute('cart-1', 42)).toBe(
      `${ORDER_CART_ROUTE}/cart-1/item/42/requiredConfiguration`,
    );
    expect(getCartItemConfigurationRoute('cart-1', 42)).toBe(
      `${ORDER_CART_ROUTE}/cart-1/item/42/configuration`,
    );
  });
});
