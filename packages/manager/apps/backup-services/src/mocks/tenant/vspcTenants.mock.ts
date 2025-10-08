import { VSPCTenant } from '@/types/VspcTenant.type';

export const VSPC_TENANTS_MOCKS: VSPCTenant[] = [
  {
    id: '1999f2f7-5140-4000-t1',
    resourceStatus: 'CREATING',
    targetSpec: {
      name: 'Tenant1',
    },
    currentState: {
      azName: 'eu-west-par',
      backupAgents: [
        {
          id: 'bkp-ag-t1',
          ip: ['192.0.2.1'],
          name: 'name-ag-t1',
          type: 'type-ag-t1',
          vspcTenant: 'vspcTenant-t1',
        },
      ],
      companyName: 'inc-par-vspc1',
      id: '1999f2f7-5140-4000-t1',
      name: 'name-par-vspc',
      status: 'CREATING',
      vaults: ['vspc-t1-vault'],
    },
    currentTasks: [],
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
      azName: 'eu-west-rbx',
      backupAgents: [
        {
          id: 'bkp-ag-t2',
          ip: ['192.0.2.2'],
          name: 'name-ag-t2',
          type: 'type-ag-t2',
          vspcTenant: 'vspcTenant-t2',
        },
      ],
      companyName: 'inc-rbx-vspc2',
      id: '1999f2f7-5140-4000-t2',
      name: 'name-rbx-vspc',
      status: 'DELETING',
      vaults: ['vspc-t2-vault'],
    },
    currentTasks: [],
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
      azName: 'ap-southeast-sgp',
      backupAgents: [
        {
          id: 'bkp-ag-t3',
          ip: ['192.0.2.3'],
          name: 'name-ag-t3',
          type: 'type-ag-t3',
          vspcTenant: 'vspcTenant-t3',
        },
      ],
      companyName: 'inc-sgp-vspc3',
      id: '1999f2f7-5140-4000-t3',
      name: 'name-sgp-vspc',
      status: 'ERROR',
      vaults: ['vspc-t3-vault'],
    },
    currentTasks: [],
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
      azName: 'eu-central-waw',
      backupAgents: [
        {
          id: 'bkp-ag-t4',
          ip: ['192.0.2.4'],
          name: 'name-ag-t4',
          type: 'type-ag-t4',
          vspcTenant: 'vspcTenant-t4',
        },
      ],
      companyName: 'inc-waw-vspc4',
      id: '1999f2f7-5140-4000-t4',
      name: 'name-waw-vspc',
      status: 'READY',
      vaults: ['vspc-t4-vault'],
    },
    currentTasks: [],
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
      azName: 'ca-east-tor',
      backupAgents: [
        {
          id: 'bkp-ag-t5',
          ip: ['192.0.2.5'],
          name: 'name-ag-t5',
          type: 'type-ag-t5',
          vspcTenant: 'vspcTenant-t5',
        },
      ],
      companyName: 'inc-tor-vspc5',
      id: '1999f2f7-5140-4000-t5',
      name: 'name-tor-vspc',
      status: 'SUSPENDED',
      vaults: ['vspc-t5-vault'],
    },
    currentTasks: [],
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
      azName: 'us-west-lz-pao',
      backupAgents: [
        {
          id: 'bkp-ag-t6',
          ip: ['192.0.2.6'],
          name: 'name-ag-t6',
          type: 'type-ag-t6',
          vspcTenant: 'vspcTenant-t6',
        },
      ],
      companyName: 'inc-pao-vspc6',
      id: '1999f2f7-5140-4000-t6',
      name: 'name-pao-vspc',
      status: 'UPDATING',
      vaults: ['vspc-t6-vault'],
    },
    currentTasks: [],
    createdAt: '2025-10-01T09:51:51.572Z',
    updatedAt: '2025-10-01T09:51:51.572Z',
  },
];
