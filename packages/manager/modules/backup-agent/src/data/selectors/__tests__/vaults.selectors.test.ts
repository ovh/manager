import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VaultProductLine, VaultResource } from '@/types/Vault.type';

import {
  selectBackupAgentVaults,
  selectHasVaultReady,
  selectIsProvenBackupAgentVault,
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

  describe('product-line scope', () => {
    const withProductLine = (
      id: string,
      vaultProductLine: VaultProductLine | null | undefined,
    ): VaultResource => ({
      ...vaultResource,
      id,
      currentState: { ...vaultResource.currentState, id, vaultProductLine },
    });

    describe('selectBackupAgentVaults', () => {
      it('keeps a vault of this product line', () => {
        const ours = withProductLine('ours', 'BACKUP_AGENT');
        expect(selectBackupAgentVaults([ours])).toEqual([ours]);
      });

      it('discards a vault of the other product line', () => {
        expect(selectBackupAgentVaults([withProductLine('theirs', 'BACKUP_LICENSES')])).toEqual([]);
      });

      it.each([['null, as the contract allows', null] as const, ['absent', undefined] as const])(
        'keeps a vault whose product line is %s, rather than emptying the screen',
        (_, value) => {
          const unproven = withProductLine('unproven', value);
          expect(selectBackupAgentVaults([unproven])).toEqual([unproven]);
        },
      );

      it('keeps everything but the other product line out of a mixed list', () => {
        const ours = withProductLine('ours', 'BACKUP_AGENT');
        const unproven = withProductLine('unproven', null);
        const theirs = withProductLine('theirs', 'BACKUP_LICENSES');
        expect(selectBackupAgentVaults([theirs, ours, unproven])).toEqual([ours, unproven]);
      });
    });

    describe('selectIsProvenBackupAgentVault', () => {
      it('is true only on an explicit product line of ours', () => {
        expect(selectIsProvenBackupAgentVault(withProductLine('ours', 'BACKUP_AGENT'))).toBe(true);
      });

      it.each([
        ['the other product line', 'BACKUP_LICENSES'] as const,
        ['null', null] as const,
        ['absent', undefined] as const,
      ])('is false when the product line is %s, so a destructive action refuses it', (_, value) => {
        expect(selectIsProvenBackupAgentVault(withProductLine('v', value))).toBe(false);
      });
    });
  });
});
