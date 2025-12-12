import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';

export const TENANTS_MOCKS: Resource<Tenant>[] = [
  {
    id: '1999f2f7-5140-4000-t1',
    resourceStatus: 'CREATING',
    targetSpec: {
      name: 'Tenant1',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t1',
      name: 'Tenant1',
      vaults: [
        {
          region: 'eu-west-par',
          id: '1999f2f7-5140-4000-t1v',
          name: 'Vault1',
          performance: 'HIGHPERF',
          resourceName: 'tenant1-vault1',
          status: 'CREATING',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'eu-west-par',
          id: '1999f2f7-5140-4000-t1vspc',
          name: 'VspcTenant1',
          status: 'CREATING',
        },
      ],
    },
    currentTasks: [],
    iam: {
      displayName: 'Production Backup Tenant',
      id: 'a1b2c3d4-1234-4000-8aa0-9994438d3b80',
      tags: {
        environment: 'production',
        team: 'infrastructure',
        'ovh:region': 'eu-west-1',
      },
      urn: 'urn:ovh:vaults:eu-west-1:prod-vaults-001',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
  }
];
