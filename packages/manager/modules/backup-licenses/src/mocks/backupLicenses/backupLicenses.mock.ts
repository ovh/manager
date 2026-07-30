/**
 * Jeux de données de développement pour le prix de licence (BKP-1225, §3.2).
 * `vaultId` est le champ de jointure hypothétique lu par `matchLicenseToVault`
 * (cf. §14 de la spec : nom de champ non confirmé côté BE). À supprimer une fois
 * l'endpoint déployé (cf. §15 de la spec).
 */
import { BackupLicenseResource } from '@/types/BackupLicense.type';

export const mockBackupLicenses: BackupLicenseResource[] = [
  {
    id: 'license-1',
    resourceStatus: 'READY',
    currentState: { id: 'license-1', resourceName: 'license-1', vaultId: 'vault-1' },
  },
  {
    id: 'license-2',
    resourceStatus: 'READY',
    currentState: { id: 'license-2', resourceName: 'license-2', vaultId: 'vault-2' },
  },
  {
    id: 'license-3',
    resourceStatus: 'READY',
    currentState: { id: 'license-3', resourceName: 'license-3', vaultId: 'vault-3' },
  },
];
