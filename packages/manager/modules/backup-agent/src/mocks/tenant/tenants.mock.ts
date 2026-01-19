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
  },
  {
    id: '1999f2f7-5140-4000-t2',
    resourceStatus: 'DELETING',
    targetSpec: {
      name: 'Tenant2',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t2',
      name: 'Tenant2',
      vaults: [
        {
          region: 'eu-west-rbx',
          id: '1999f2f7-5140-4000-t2v',
          name: 'Vault2',
          performance: 'HIGHPERF',
          resourceName: 'tenant2-vault2',
          status: 'DELETING',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'eu-west-rbx',
          id: '1999f2f7-5140-4000-t2v2vspc',
          name: 'VspcTenant2',
          status: 'DELETING',
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
  },
  {
    id: '1999f2f7-5140-4000-t3',
    resourceStatus: 'ERROR',
    targetSpec: {
      name: 'Tenant3',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t3',
      name: 'Tenant3',
      vaults: [
        {
          region: 'ap-southeast-sgp',
          id: '1999f2f7-5140-4000-t3v',
          name: 'Vault3',
          performance: 'HIGHPERF',
          resourceName: 'tenant3-vault3',
          status: 'ERROR',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'ap-southeast-sgp',
          id: '1999f2f7-5140-4000-t3vspc',
          name: 'VspcTenant3',
          status: 'ERROR',
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
  },
  {
    id: '1999f2f7-5140-4000-t4',
    resourceStatus: 'READY',
    targetSpec: {
      name: 'Tenant4',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t4',
      name: 'Tenant4',
      vaults: [
        {
          region: 'eu-central-waw',
          id: '1999f2f7-5140-4000-t4v',
          name: 'Vault3',
          performance: 'HIGHPERF',
          resourceName: 'tenant4-vault4',
          status: 'READY',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'eu-central-waw',
          id: '1999f2f7-5140-4000-t4vspc',
          name: 'VspcTenant4',
          status: 'READY',
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
  },
  {
    id: '1999f2f7-5140-4000-t5',
    resourceStatus: 'SUSPENDED',
    targetSpec: {
      name: 'Tenant5',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t5',
      name: 'Tenant5',
      vaults: [
        {
          region: 'ca-east-tor',
          id: '1999f2f7-5140-4000-t5v',
          name: 'Vault3',
          performance: 'HIGHPERF',
          resourceName: 'tenant5-vault5',
          status: 'SUSPENDED',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'ca-east-tor',
          id: '1999f2f7-5140-4000-t5vspc',
          name: 'VspcTenant5',
          status: 'SUSPENDED',
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
  },
  {
    id: '1999f2f7-5140-4000-t6',
    resourceStatus: 'UPDATING',
    targetSpec: {
      name: 'Tenant6',
    },
    currentState: {
      id: '1999f2f7-5140-4000-t6',
      name: 'Tenant6',
      vaults: [
        {
          region: 'us-west-lz-pao',
          id: '1999f2f7-5140-4000-t6v',
          name: 'Vault3',
          performance: 'HIGHPERF',
          resourceName: 'tenant6-vault6',
          status: 'UPDATING',
          type: 'BUNDLE',
        },
      ],
      vspcTenants: [
        {
          region: 'us-west-lz-pao',
          id: '1999f2f7-5140-4000-t6vspc',
          name: 'VspcTenant6',
          status: 'UPDATING',
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
  },
];
