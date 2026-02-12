import { mockVaults } from '@/mocks/vaults/vaults.mock';

import { selectVaultBuckets, selectVaultName, selectVaultRegion } from '../vaults.selectors';

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
});
