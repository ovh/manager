import { mockVaults } from '@/mocks/vaults/vaults.mock';

import {
  selectHasVaultReady,
  selectVaultBuckets,
  selectVaultName,
  selectVaultRegion,
} from '../vaults.selectors';

describe('vaults.selectors', () => {
  const vaultResource = mockVaults[0]!;

  describe('selectVaultBuckets', () => {
    it('returns the buckets from vault resource', () => {
      const buckets = selectVaultBuckets(vaultResource);
      expect(buckets).toHaveLength(5);
      expect(buckets[0]!.name).toBe('production-primary-bucket');
    });
  });

  describe('selectVaultName', () => {
    it('returns the vault name', () => {
      expect(selectVaultName(vaultResource)).toBe('production-backup-vaults-primary');
    });
  });

  describe('selectVaultRegion', () => {
    it('returns the vault region', () => {
      expect(selectVaultRegion(vaultResource)).toBe('eu-central-waw');
    });
  });

  describe('selectHasVaultReady', () => {
    const isNotReady = (vault: (typeof mockVaults)[0]) => vault.currentState.status !== 'READY';

    it('returns true when at least one vault has READY status', () => {
      expect(selectHasVaultReady(mockVaults)).toBe(true);
    });

    it('returns true when only one vault is READY', () => {
      expect(selectHasVaultReady([mockVaults[0]!])).toBe(true);
    });

    it('returns false when no vault has READY status', () => {
      const nonReadyVaults = mockVaults.filter(isNotReady);
      expect(selectHasVaultReady(nonReadyVaults)).toBe(false);
    });

    it('returns false for empty array', () => {
      expect(selectHasVaultReady([])).toBe(false);
    });
  });
});
