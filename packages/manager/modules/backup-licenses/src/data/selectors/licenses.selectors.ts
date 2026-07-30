import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { VaultResource } from '@/types/Vault.type';

/**
 * Champ de jointure licence ↔ vault non confirmé côté API (cf. §14 de la spec BKP-1225) :
 * `vaultId` est un nom de champ hypothétique, isolé ici pour n'avoir qu'un point à corriger
 * une fois le contrat connu. Tant qu'aucune licence ne correspond, la colonne « Prix
 * licence » affiche simplement `—` (cf. `LicensePriceCell`).
 */
export const matchLicenseToVault = (
  licenses: BackupLicenseResource[],
  vault: VaultResource,
): BackupLicenseResource | undefined =>
  licenses.find((license) => license.currentState.vaultId === vault.id);
