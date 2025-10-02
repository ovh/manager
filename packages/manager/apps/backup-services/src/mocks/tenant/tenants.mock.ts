import { Tenant } from '@/types/Tenant.type';

export const TENANTS_MOCKS: Tenant[] = [
  {
    id: '1999f2f7-5140-4000-t1',
    resourceStatus: 'CREATING',
    targetSpec: {
      name: 'Tenant1',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t1',
      name: 'Tenant1',
      vaults: [
        {
          azName: 'eu-west-par',
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
          azName: 'eu-west-par',
          id: '1999f2f7-5140-4000-t1vspc',
          name: 'VspcTenant1',
          status: 'CREATING',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
  {
    id: '1999f2f7-5140-4000-t2',
    resourceStatus: 'DELETING',
    targetSpec: {
      name: 'Tenant2',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t2',
      name: 'Tenant2',
      vaults: [
        {
          azName: 'eu-west-rbx',
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
          azName: 'eu-west-rbx',
          id: '1999f2f7-5140-4000-t2v2vspc',
          name: 'VspcTenant2',
          status: 'DELETING',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
  {
    id: '1999f2f7-5140-4000-t3',
    resourceStatus: 'ERROR',
    targetSpec: {
      name: 'Tenant3',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t3',
      name: 'Tenant3',
      vaults: [
        {
          azName: 'ap-southeast-sgp',
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
          azName: 'ap-southeast-sgp',
          id: '1999f2f7-5140-4000-t3vspc',
          name: 'VspcTenant3',
          status: 'ERROR',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
  {
    id: '1999f2f7-5140-4000-t4',
    resourceStatus: 'READY',
    targetSpec: {
      name: 'Tenant4',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t4',
      name: 'Tenant4',
      vaults: [
        {
          azName: 'eu-central-waw',
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
          azName: 'eu-central-waw',
          id: '1999f2f7-5140-4000-t4vspc',
          name: 'VspcTenant4',
          status: 'READY',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
  {
    id: '1999f2f7-5140-4000-t5',
    resourceStatus: 'SUSPENDED',
    targetSpec: {
      name: 'Tenant5',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t5',
      name: 'Tenant5',
      vaults: [
        {
          azName: 'ca-east-tor',
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
          azName: 'ca-east-tor',
          id: '1999f2f7-5140-4000-t5vspc',
          name: 'VspcTenant5',
          status: 'SUSPENDED',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
  {
    id: '1999f2f7-5140-4000-t6',
    resourceStatus: 'UPDATING',
    targetSpec: {
      name: 'Tenant6',
    },
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
    currentState: {
      id: '1999f2f7-5140-4000-t6',
      name: 'Tenant6',
      vaults: [
        {
          azName: 'us-west-lz-pao',
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
          azName: 'us-west-lz-pao',
          id: '1999f2f7-5140-4000-t6vspc',
          name: 'VspcTenant6',
          status: 'UPDATING',
        },
      ],
    },
    currentTasks: [
      {
        id: '1999f2f7-5140-4000-8bd4-a0030367a880',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
  },
];
