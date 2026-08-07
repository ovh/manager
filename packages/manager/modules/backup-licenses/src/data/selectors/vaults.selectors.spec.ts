import { describe, expect, it } from 'vitest';

import { VaultProductLine, VaultResource } from '@/types/Vault.type';

import { selectBackupLicensesVaults } from './vaults.selectors';

const buildVault = (id: string, vaultProductLine?: VaultProductLine | null): VaultResource => ({
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

  it('discards vaults of the other product line', () => {
    const vaults = [buildVault('v1', 'BACKUP_AGENT')];
    expect(selectBackupLicensesVaults(vaults)).toEqual([]);
  });

  it.each([['absent', undefined] as const, ['null, as the contract allows', null] as const])(
    'keeps vaults whose vaultProductLine is %s',
    (_, vaultProductLine) => {
      const vaults = [buildVault('v1', vaultProductLine)];
      expect(selectBackupLicensesVaults(vaults)).toEqual(vaults);
    },
  );

  it('sorts the kept vaults alphabetically by name', () => {
    const vaults = [buildVault('charlie'), buildVault('alpha'), buildVault('bravo')];
    expect(selectBackupLicensesVaults(vaults).map((v) => v.currentState.name)).toEqual([
      'alpha',
      'bravo',
      'charlie',
    ]);
  });
});
