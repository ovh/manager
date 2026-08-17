import { VaultBucket, VaultResource } from '@/types/Vault.type';

/**
 * `vaultProductLine` est nullable au contrat, « until existing vaults are backfilled » : les vaults
 * dont il n'est pas renseigné sont conservés, sinon l'écran serait vide tant que le BE n'a pas
 * rétro-rempli le champ.
 */
export const selectBackupLicensesVaults = (vaults: VaultResource[]): VaultResource[] =>
  vaults.filter(
    ({ currentState: { vaultProductLine } }) =>
      !vaultProductLine || vaultProductLine === 'BACKUP_LICENSES',
  );

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
