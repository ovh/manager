import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

export const VSPC_TENANTS_MOCKS: Resource<VSPCTenant>[] = [
  {
    id: '1999f2f7-5140-4000-t1',
    resourceStatus: 'CREATING',
    targetSpec: {
      name: 'Tenant1',
    },
    currentState: {
      region: 'eu-west-par',
      backupAgents: [
        {
          id: 'bkp-ag-t1',
          ip: ['192.0.2.1'],
          name: 'name-ag-t1',
          type: 'type-ag-t1',
          vspcTenant: 'vspcTenant-t1',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-par-vspc1',
      id: '1999f2f7-5140-4000-t1',
      name: 'name-par-vspc',
      status: 'CREATING',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'eu-west-par',
          id: '1999f2f7-5140-4000-t1v',
          name: 'Vault1',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant1-vault1',
          status: 'CREATING',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],

    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
      region: 'eu-west-rbx',
      backupAgents: [
        {
          id: 'bkp-ag-t2',
          ip: ['192.0.2.2'],
          name: 'name-ag-t2',
          type: 'type-ag-t2',
          vspcTenant: 'vspcTenant-t2',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-rbx-vspc2',
      id: '1999f2f7-5140-4000-t2',
      name: 'name-rbx-vspc',
      status: 'DELETING',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'eu-west-rbx',
          id: '1999f2f7-5140-4000-t2v',
          name: 'Vault2',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant2-vault2',
          status: 'DELETING',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],

    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
      region: 'ap-southeast-sgp',
      backupAgents: [
        {
          id: 'bkp-ag-t3',
          ip: ['192.0.2.3'],
          name: 'name-ag-t3',
          type: 'type-ag-t3',
          vspcTenant: 'vspcTenant-t3',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-sgp-vspc3',
      id: '1999f2f7-5140-4000-t3',
      name: 'name-sgp-vspc',
      status: 'ERROR',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'ap-southeast-sgp',
          id: '1999f2f7-5140-4000-t3v',
          name: 'Vault3',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant3-vault3',
          status: 'ERROR',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],

    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
      region: 'eu-central-waw',
      backupAgents: [
        {
          id: 'bkp-ag-t4',
          ip: ['192.0.2.4'],
          name: 'name-ag-t4',
          type: 'type-ag-t4',
          vspcTenant: 'vspcTenant-t4',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-waw-vspc4',
      id: '1999f2f7-5140-4000-t4',
      name: 'name-waw-vspc',
      status: 'READY',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'eu-central-waw',
          id: '1999f2f7-5140-4000-t4v',
          name: 'Vault4',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant4-vault4',
          status: 'READY',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],

    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
      region: 'ca-east-tor',
      backupAgents: [
        {
          id: 'bkp-ag-t5',
          ip: ['192.0.2.5'],
          name: 'name-ag-t5',
          type: 'type-ag-t5',
          vspcTenant: 'vspcTenant-t5',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-tor-vspc5',
      id: '1999f2f7-5140-4000-t5',
      name: 'name-tor-vspc',
      status: 'SUSPENDED',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'ca-east-tor',
          id: '1999f2f7-5140-4000-t5v',
          name: 'Vault5',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant5-vault5',
          status: 'SUSPENDED',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],
    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
      region: 'us-west-lz-pao',
      backupAgents: [
        {
          id: 'bkp-ag-t6',
          ip: ['192.0.2.6'],
          name: 'name-ag-t6',
          type: 'type-ag-t6',
          vspcTenant: 'vspcTenant-t6',
          productResourceName: 'my-resource-name',
        },
      ],
      companyName: 'inc-pao-vspc6',
      id: '1999f2f7-5140-4000-t6',
      name: 'name-pao-vspc',
      status: 'UPDATING',
      accessUrl: 'https://vspc.example.com',
      vaults: [
        {
          region: 'us-west-lz-pao',
          id: '1999f2f7-5140-4000-t6v',
          name: 'Vault6',
          performance: 'HIGHPERF',
          resourceName: 'vspc-tenant6-vault6',
          status: 'UPDATING',
          type: 'BUNDLE',
        },
      ],
    },
    currentTasks: [],
    iam: {
      displayName: 'Production Backup Vspc Tenant',
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
