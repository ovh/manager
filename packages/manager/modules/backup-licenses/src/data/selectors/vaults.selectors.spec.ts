import { describe, expect, it } from 'vitest';

import { VaultResource } from '@/types/Vault.type';

import { selectBackupLicensesVaults } from './vaults.selectors';

const buildVault = (id: string, vaultProductLine?: string): VaultResource => ({
  id,
  resourceStatus: 'READY',
  currentState: {
    id,
    name: id,
    resourceName: id,
    region: 'EU-WEST-PAR',
    type: 'PAYGO',
    vaultProductLine,
  },
});

describe('selectBackupLicensesVaults', () => {
  it('keeps vaults whose vaultProductLine is BACKUP_LICENSES', () => {
    const vaults = [buildVault('v1', 'BACKUP_LICENSES')];
    expect(selectBackupLicensesVaults(vaults)).toEqual(vaults);
  });

  it('discards vaults whose vaultProductLine is another value', () => {
    const vaults = [buildVault('v1', 'ICEBERG')];
    expect(selectBackupLicensesVaults(vaults)).toEqual([]);
  });

  it('keeps vaults whose vaultProductLine field is absent (BE tolerance, §14)', () => {
    const vaults = [buildVault('v1', undefined)];
    expect(selectBackupLicensesVaults(vaults)).toEqual(vaults);
  });
});
