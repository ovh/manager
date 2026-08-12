import { Bucket } from '@/types/Bucket.type';
import { VaultResource } from '@/types/Vault.type';

const FOREIGN_PRODUCT_LINE = 'BACKUP_LICENSES';

export const selectBackupAgentVaults = (vaults: VaultResource[]): VaultResource[] =>
  vaults.filter(
    ({ currentState: { vaultProductLine } }) => vaultProductLine !== FOREIGN_PRODUCT_LINE,
  );

export const selectIsProvenBackupAgentVault = (vault: VaultResource): boolean =>
  vault.currentState.vaultProductLine === 'BACKUP_AGENT';

export const selectVaultBuckets = (vault: VaultResource): Bucket[] => vault.currentState.buckets;

export const selectVaultName = (vault: VaultResource): string => vault.currentState.name;

export const selectVaultRegion = (vault: VaultResource): string => vault.currentState.region;

export const selectHasVaultReady = (vaults: VaultResource[]): boolean =>
  vaults.some((vault) => vault.currentState.status === 'READY');
