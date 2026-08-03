import { VaultBucket, VaultResource } from '@/types/Vault.type';

/**
 * `vaultProductLine` n'a 0 occurrence dans aucun contrat API connu (cf. §14 de la spec
 * BKP-1225) : les vaults dont le champ est absent sont conservés, sinon l'écran serait
 * vide tant que le BE ne le renvoie pas encore.
 */
export const selectBackupLicensesVaults = (vaults: VaultResource[]): VaultResource[] =>
  vaults.filter(
    ({ currentState }) =>
      currentState.vaultProductLine === undefined ||
      currentState.vaultProductLine === 'BACKUP_LICENSES',
  );

/**
 * Bucket dont la modale d'identifiants montre les clés (BKP-1222). C'est le statut qui compte,
 * pas l'ordre : un vault peut porter plusieurs buckets PRIMARY dont le premier est suspendu.
 */
export const selectVaultCredentialsBucket = (vault: VaultResource): VaultBucket | undefined =>
  vault.currentState.buckets?.find(({ role, status }) => role === 'PRIMARY' && status === 'READY');

export const selectIsIncludedVault = (vault: VaultResource): boolean =>
  vault.currentState.type === 'BUNDLE';

export const selectCanTerminateVault = (vault: VaultResource): boolean =>
  vault.currentState.type === 'PAYGO';

export const selectIsVaultSettled = (vault: VaultResource): boolean =>
  vault.resourceStatus === 'READY';
