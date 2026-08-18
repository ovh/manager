import { BackupLicenseResource, CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';

/** Jeux de données de développement. */
/** `id` sert de `resourceName` que la cascade résout : nom de service côté `/services` et côté Agora. */
export const MOCK_BACKUP_LICENSE_RESOURCE_NAME = 'd3c9e5f6-0000-4000-8000-000000000001';

export const mockBackupLicenses: BackupLicenseResource[] = [
  {
    id: MOCK_BACKUP_LICENSE_RESOURCE_NAME,
    resourceStatus: 'READY',
    currentState: { id: MOCK_BACKUP_LICENSE_RESOURCE_NAME },
    currentTasks: [],
  },
  {
    id: 'license-1',
    resourceStatus: 'READY',
    currentState: { id: 'license-1' },
  },
  {
    id: 'license-2',
    resourceStatus: 'READY',
    currentState: { id: 'license-2' },
  },
  {
    id: 'license-3',
    resourceStatus: 'READY',
    currentState: { id: 'license-3' },
  },
];

/** Réponse simulée du POST de création : reprend les champs saisis. */
export const mockCreateBackupLicense = (body: CreateBackupLicenseBody): BackupServerResource => {
  const id = `mock-backup-server-${Date.now()}`;

  return {
    id,
    status: 'CREATING',
    currentTasks: [],
    currentState: {
      id,
      displayName: body.displayName,
      externalIps: body.backupServerExternalIp.split(';').filter(Boolean),
      privateIps: body.backupServerPrivateIp,
      licenseTypeRequested: body.licenseType,
      licenseStatus: LicenseStatus.CREATING,
    },
  };
};
