/**
 * Tenants de développement : ils n'existent que pour satisfaire la cascade
 * service → tenant VSPC quand `USE_API_MOCKS` est actif (cf. mocks.config.ts).
 */
import { Resource } from '@/types/Resource.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { ADVANCED_VSPC_TYPE, BACKUP_LICENSES_ADDON, VspcTenant } from '@/types/VspcTenant.type';

export const mockBackupServicesTenants: Resource<BackupServicesTenant>[] = [
  {
    id: 'b1a7c3d4-0000-4000-8000-000000000001',
    resourceStatus: 'READY',
    currentState: {
      id: 'b1a7c3d4-0000-4000-8000-000000000001',
      name: 'Backup Licenses mock service',
    },
    currentTasks: [],
  },
];

export const mockVspcTenants: Resource<VspcTenant>[] = [
  {
    id: 'c2b8d4e5-0000-4000-8000-000000000001',
    resourceStatus: 'READY',
    currentState: {
      id: 'c2b8d4e5-0000-4000-8000-000000000001',
      vspcType: ADVANCED_VSPC_TYPE,
      enabledAddons: [BACKUP_LICENSES_ADDON],
    },
    currentTasks: [],
  },
];
