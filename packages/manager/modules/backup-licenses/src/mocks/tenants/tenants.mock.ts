/** Tenants de test : ils satisfont la cascade service → tenant VSPC que les écrans traversent. */
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { ADVANCED_VSPC_TYPE, BACKUP_LICENSES_ADDON, VspcTenant } from '@/types/VspcTenant.type';

export const BACKUP_SERVICES_TENANT_ID = 'a1c7e3d2-0000-4000-8000-000000000001';

export const mockBackupServicesTenants: Resource<BackupServicesTenant>[] = [
  {
    id: BACKUP_SERVICES_TENANT_ID,
    resourceStatus: 'READY',
    currentState: { id: BACKUP_SERVICES_TENANT_ID, name: 'Backup Licenses' },
    currentTasks: [],
  },
];

export const VSPC_TENANT_ID = 'c2b8d4e5-0000-4000-8000-000000000001';

export const buildBackupLicensesVspcTenant = (
  id: string,
  currentState: Partial<VspcTenant> = {},
): Resource<VspcTenant> => ({
  id,
  resourceStatus: 'READY',
  currentState: {
    id,
    vspcType: ADVANCED_VSPC_TYPE,
    enabledAddons: [BACKUP_LICENSES_ADDON],
    ...currentState,
  },
});

export const mockVspcTenants: Resource<VspcTenant>[] = [
  {
    ...buildBackupLicensesVspcTenant(VSPC_TENANT_ID),
    iam: {
      id: VSPC_TENANT_ID,
      urn: `urn:v1:eu:resource:backupServices:vspc/${VSPC_TENANT_ID}`,
      displayName: VSPC_TENANT_ID,
    },
    currentTasks: [],
  },
];
