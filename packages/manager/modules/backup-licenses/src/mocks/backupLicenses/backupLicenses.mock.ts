import { BackupLicenseResource } from '@/types/BackupLicense.type';

/** Jeux de données de développement. */
/** `id` sert de `resourceName` que la cascade résout : nom de service côté `/services` et côté Agora. */
export const MOCK_BACKUP_LICENSE_RESOURCE_NAME = 'd3c9e5f6-0000-4000-8000-000000000001';

export const mockBackupLicenses: BackupLicenseResource[] = [
  {
    id: MOCK_BACKUP_LICENSE_RESOURCE_NAME,
    resourceStatus: 'READY',
    currentState: { id: MOCK_BACKUP_LICENSE_RESOURCE_NAME },
    currentTasks: [],
    iam: {
      id: MOCK_BACKUP_LICENSE_RESOURCE_NAME,
      urn: `urn:v1:eu:resource:backupServices:vspc/backupLicenses/${MOCK_BACKUP_LICENSE_RESOURCE_NAME}`,
      displayName: MOCK_BACKUP_LICENSE_RESOURCE_NAME,
    },
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
