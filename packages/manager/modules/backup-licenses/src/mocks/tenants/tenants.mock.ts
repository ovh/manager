/**
 * Tenants de développement : ils n'existent que pour satisfaire la cascade
 * service → tenant VSPC quand `USE_API_MOCKS` est actif (cf. mocks.config.ts).
 */
import { Resource } from '@/types/Resource.type';
import { ADVANCED_VSPC_TYPE, BACKUP_LICENSES_ADDON, VspcTenant } from '@/types/VspcTenant.type';

export const mockVspcTenants: Resource<VspcTenant>[] = [
  {
    id: 'c2b8d4e5-0000-4000-8000-000000000001',
    resourceStatus: 'READY',
    iam: {
      id: 'c2b8d4e5-0000-4000-8000-000000000001',
      urn: 'urn:v1:eu:resource:backupServices:vspc/c2b8d4e5-0000-4000-8000-000000000001',
      displayName: 'c2b8d4e5-0000-4000-8000-000000000001',
    },
    currentState: {
      id: 'c2b8d4e5-0000-4000-8000-000000000001',
      vspcType: ADVANCED_VSPC_TYPE,
      enabledAddons: [BACKUP_LICENSES_ADDON],
    },
    currentTasks: [],
  },
];
