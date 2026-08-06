import { BackupLicenseResource, CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';

/**
 * Jeux de données de développement. `vaultId` (licences 2 et 3) est le champ de jointure
 * hypothétique lu par `matchLicenseToVault` (cf. §14 de la spec BKP-1225 : nom de champ non
 * confirmé côté BE). À supprimer une fois l'endpoint déployé (cf. §15 de la spec).
 */
/** Le `resourceName` que la cascade résout : nom de service côté `/services` et côté Agora. */
export const MOCK_BACKUP_LICENSE_RESOURCE_NAME = 'backuplicenses-mock-resource';

export const mockBackupLicenses: BackupLicenseResource[] = [
  {
    id: 'd3c9e5f6-0000-4000-8000-000000000001',
    resourceStatus: 'READY',
    currentState: {
      id: 'd3c9e5f6-0000-4000-8000-000000000001',
      resourceName: MOCK_BACKUP_LICENSE_RESOURCE_NAME,
    },
    currentTasks: [],
  },
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

/** Réponse simulée du POST de création (cf. mocks.config.ts) : reprend les champs saisis. */
export const mockCreateBackupLicense = (body: CreateBackupLicenseBody): BackupServerResource => {
  const id = `mock-backup-server-${Date.now()}`;

  return {
    id,
    status: 'CREATING',
    currentTasks: [],
    currentState: {
      id,
      displayName: body.displayName,
      externalIps: body.backupServerExternalIp,
      privateIps: body.backupServerPrivateIp,
      licenseTypeRequested: body.licenseType,
      licenseStatus: LicenseStatus.CREATING,
    },
  };
};
