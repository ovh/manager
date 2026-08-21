import { describe, expect, it } from 'vitest';

import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';

import {
  BACKUP_LICENSES_ORDER_PLAN_CODES,
  BACKUP_LICENSES_CONFIGURATION_LABELS as LABELS,
  buildBackupLicensesOrderComposition,
} from './orderComposition';

const form: ServerVaultFormState = {
  displayName: 'backup-prod-paris',
  backupServerExternalIp: '203.0.113.10',
  veeamClientIp: '',
  isBehindNat: false,
  backupServerPrivateIp: '',
  vaultDisplayName: 'vault-prod-paris',
  regionApiValue: 'eu-west-par',
};

const build = (overrides: Partial<ServerVaultFormState> = {}) =>
  buildBackupLicensesOrderComposition({ ...form, ...overrides }, LicenseApiValue.VDP_PREMIUM);

describe('buildBackupLicensesOrderComposition', () => {
  it('names the tenant as the main item', () => {
    expect(build().product.planCode).toBe(BACKUP_LICENSES_ORDER_PLAN_CODES.tenant);
  });

  it('nests the licence under the VSPC tenant, and the vault under the tenant', () => {
    const [vspcTenant, bundledVault] = build().product.options;

    expect([vspcTenant?.planCode, bundledVault?.planCode]).toEqual([
      BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenant,
      BACKUP_LICENSES_ORDER_PLAN_CODES.bundledVault,
    ]);
    expect(vspcTenant?.options.map(({ planCode }) => planCode)).toEqual([
      BACKUP_LICENSES_ORDER_PLAN_CODES.vspcTenantLicenses,
    ]);
    expect(bundledVault?.options).toEqual([]);
  });

  it('assumes no pricing: mode, duration and quantity are the cart definitions to give', () => {
    expect(Object.keys(build())).toEqual(['product', 'configurationValues']);
    expect(JSON.stringify(build())).not.toMatch(/P1M|pricingMode|quantity/);
  });

  it('carries the selected card enum value, verbatim', () => {
    expect(build().configurationValues[LABELS.licenseType]).toBe('VEEAM_DATA_PLATFORM_PREMIUM');
  });

  it('names the configuration labels as the cart claims them, in kebab-case', () => {
    expect(Object.keys(build().configurationValues)).toEqual([
      'backupserver-displayname',
      'backupserver-public-ip',
      'license-type',
      'vault-azname',
      'vault-name',
    ]);
  });

  it('carries the vault name, trimmed', () => {
    expect(build({ vaultDisplayName: '  vault-prod-paris  ' }).configurationValues[LABELS.vaultName]).toBe(
      'vault-prod-paris',
    );
  });

  it('omits the private IP entirely when the server is not behind a NAT', () => {
    const { configurationValues } = build({
      isBehindNat: false,
      backupServerPrivateIp: '192.168.1.10',
    });

    expect(LABELS.backupServerPrivateIp in configurationValues).toBe(false);
  });

  it('carries the private IP when the NAT toggle is on, with its /32 host mask added', () => {
    const { configurationValues } = build({
      isBehindNat: true,
      backupServerPrivateIp: '192.168.1.10',
    });

    expect(configurationValues[LABELS.backupServerPrivateIp]).toBe('192.168.1.10/32');
  });

  it('trims what the customer typed, so a stray space never reaches the cart', () => {
    const { configurationValues } = build({ backupServerExternalIp: '  203.0.113.10  ' });

    expect(configurationValues[LABELS.backupServerPublicIp]).toBe('203.0.113.10/32');
  });

  it('adds the /32 host mask to the public IP, never left for the customer to type', () => {
    const { configurationValues } = build({ backupServerExternalIp: '203.0.113.10' });

    expect(configurationValues[LABELS.backupServerPublicIp]).toBe('203.0.113.10/32');
  });

  it('carries the VBR server display name, trimmed', () => {
    expect(build({ displayName: '  backup-prod-paris  ' }).configurationValues[LABELS.backupServerDisplayName]).toBe(
      'backup-prod-paris',
    );
  });

  it('leaves the region undefined rather than empty when none is chosen', () => {
    expect(build({ regionApiValue: null }).configurationValues[LABELS.vaultAzName]).toBeUndefined();
  });
});
