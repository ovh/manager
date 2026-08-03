import { BackupLicenseResource, CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';

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
