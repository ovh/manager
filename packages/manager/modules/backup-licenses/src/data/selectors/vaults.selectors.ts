import { MODULE_PRODUCT_LINE } from '@/module.constants';
import { VaultBucket, VaultResource } from '@/types/Vault.type';

export const selectBackupLicensesVaults = (vaults: VaultResource[]): VaultResource[] =>
  vaults
    .filter(({ currentState: { vaultProductLine } }) => vaultProductLine === MODULE_PRODUCT_LINE)
    .sort((a, b) => a.currentState.name.localeCompare(b.currentState.name));

/**
 * Bucket dont la modale d'identifiants montre les clés (BKP-1222). C'est le statut qui compte,
 * pas l'ordre : un vault peut porter plusieurs buckets PRIMARY dont le premier est suspendu.
 */
export const selectVaultCredentialsBucket = (vault: VaultResource): VaultBucket | undefined =>
  vault.currentState.buckets?.find(({ role, status }) => role === 'PRIMARY' && status === 'READY');

/** `type` et non `includedSoftQuotaGb` : ce champ est aussi null « when not applicable ». */
export const selectIsIncludedVault = (vault: VaultResource): boolean =>
  vault.currentState.type === 'BUNDLE';

export const selectCanTerminateVault = (vault: VaultResource): boolean =>
  vault.currentState.type === 'PAYGO';

export const selectIsVaultSettled = (vault: VaultResource): boolean =>
  vault.resourceStatus === 'READY';
