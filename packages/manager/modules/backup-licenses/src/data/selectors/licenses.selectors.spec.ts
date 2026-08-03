import { describe, expect, it } from 'vitest';

import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { VaultResource } from '@/types/Vault.type';

import { matchLicenseToVault } from './licenses.selectors';

const buildVault = (id: string): VaultResource => ({
  id,
  resourceStatus: 'READY',
  currentState: { id, name: id, resourceName: id, region: 'EU-WEST-PAR', type: 'PAYGO' },
});

const buildLicense = (id: string, vaultId?: string): BackupLicenseResource => ({
  id,
  resourceStatus: 'READY',
  currentState: { id, resourceName: id, vaultId },
});

describe('matchLicenseToVault', () => {
  it('matches the license whose vaultId points to the vault', () => {
    const vault = buildVault('vault-1');
    const license = buildLicense('license-1', 'vault-1');
    expect(matchLicenseToVault([license], vault)).toBe(license);
  });

  it('returns undefined when no license matches the vault', () => {
    const vault = buildVault('vault-1');
    const license = buildLicense('license-1', 'vault-2');
    expect(matchLicenseToVault([license], vault)).toBeUndefined();
  });
});
