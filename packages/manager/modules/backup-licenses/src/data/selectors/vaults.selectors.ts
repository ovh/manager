import { VaultResource } from '@/types/Vault.type';

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
