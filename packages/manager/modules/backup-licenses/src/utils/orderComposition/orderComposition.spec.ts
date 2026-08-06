import { describe, expect, it } from 'vitest';

import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';

import {
  BACKUP_LICENSES_ORDER_PLAN_CODES,
  buildBackupLicensesOrderComposition,
} from './orderComposition';

const form: ServerVaultFormState = {
  displayName: 'backup-prod-paris',
  backupServerExternalIp: '203.0.113.10',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

const build = (overrides: Partial<ServerVaultFormState> = {}) =>
  buildBackupLicensesOrderComposition({ ...form, ...overrides }, LicenseApiValue.VDP_PREMIUM);

describe('buildBackupLicensesOrderComposition', () => {
  it('orders the tenant as the main item, monthly and by the unit', () => {
    expect(build().product).toEqual({
      planCode: BACKUP_LICENSES_ORDER_PLAN_CODES.tenant,
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
    });
  });

  it('adds the two VSPC addons then the bundled vault, in that order', () => {
    expect(build().addons.map(({ planCode }) => planCode)).toEqual([
      BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
      BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses,
      BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault,
    ]);
  });

  it('carries the selected card enum value, verbatim', () => {
    expect(build().configurationValues.licenseType).toBe('VEEAM_DATA_PLATFORM_PREMIUM');
  });

  it('omits the private IP entirely when the server is not behind a NAT', () => {
    const { configurationValues } = build({
      isBehindNat: false,
      backupServerPrivateIp: '192.168.1.10',
    });

    expect('backupServerPrivateIp' in configurationValues).toBe(false);
  });

  it('carries the private IP when the NAT toggle is on', () => {
    const { configurationValues } = build({
      isBehindNat: true,
      backupServerPrivateIp: '192.168.1.10',
    });

    expect(configurationValues.backupServerPrivateIp).toBe('192.168.1.10');
  });

  it('trims what the customer typed, so a stray space never reaches the cart', () => {
    const { configurationValues } = build({
      displayName: '  backup-prod-paris  ',
      vaultDisplayName: ' vault-prod-paris ',
    });

    expect(configurationValues.displayName).toBe('backup-prod-paris');
    expect(configurationValues.vaultDisplayName).toBe('vault-prod-paris');
  });

  it('leaves the region undefined rather than empty when none is chosen', () => {
    expect(build({ regionApiValue: null }).configurationValues.region).toBeUndefined();
  });
});
