import { BackupLicenseResource } from '@/types/BackupLicense.type';

/**
 * Un seul mock : la cascade backupServicesId → vspcTenantId → licence ne couvre
 * qu'un client mono-service (même principe que mockBackupServicesTenants/mockVspcTenants).
 */
export const mockBackupLicenses: BackupLicenseResource[] = [
  {
    id: 'd3c9e5f6-0000-4000-8000-000000000001',
    resourceStatus: 'READY',
    currentState: {
      id: 'd3c9e5f6-0000-4000-8000-000000000001',
      resourceName: 'backuplicenses-mock-resource',
    },
    currentTasks: [],
  },
];
