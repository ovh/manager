import { VaultResource } from '@/types/Vault.type';

export const mockVaults: VaultResource[] = [
  {
    createdAt: '2025-09-25T08:30:15.445Z',
    currentState: {
      azName: 'eu-central-waw',
      id: 'a1b2c3d4-1234-4000-85b0-badd52fc7a01',
      name: 'production-backup-vault-primary',
      performance: 'HIGHPERF',
      resourceName: 'prod-vault-001',
      status: 'READY',
      type: 'BUNDLE',
      vspc: [
        'a1b2c3d4-1234-4000-8b76-db7424950d01',
        'b2c3d4e5-2345-4000-8b76-db7424950d02',
        'b2c3d4e5-2345-4000-8b76-db7424950d03',
      ],
    },
    currentTasks: [],
    iam: {
      displayName: 'Production Backup Vault',
      id: 'a1b2c3d4-1234-4000-8aa0-9994438d3b80',
      tags: {
        environment: 'production',
        team: 'infrastructure',
        'ovh:region': 'eu-west-1',
      },
      urn: 'urn:ovh:vault:eu-west-1:prod-vault-001',
    },
    id: 'a1b2c3d4-1234-4000-82dc-5366d6786f80',
    resourceStatus: 'READY',
    targetSpec: {
      name: 'production-backup-vault',
    },
    updatedAt: '2025-09-26T09:15:22.123Z',
  },
  {
    createdAt: '2025-09-24T14:22:33.789Z',
    currentState: {
      azName: 'eu-west-rbx',
      id: 'b2c3d4e5-2345-4000-85b0-badd52fc7a02',
      name: 'staging-vault',
      performance: 'STANDARD',
      resourceName: 'staging-vault-001',
      status: 'UPDATING',
      type: 'PAYGO',
      vspc: ['b2c3d4e5-2345-4000-8b76-db7424950d03'],
    },
    currentTasks: [
      {
        id: 'b2c3d4e5-2345-4000-8008-b3ef9b81ca81',
        link: '/tasks/b2c3d4e5-2345-4000-8008-b3ef9b81ca81',
        status: 'RUNNING',
        type: 'vault_configuration_update',
      },
    ],
    iam: {
      displayName: 'Staging Environment Vault',
      id: 'b2c3d4e5-2345-4000-8aa0-9994438d3b81',
      tags: {
        environment: 'staging',
        team: 'development',
        'ovh:backup-policy': 'weekly',
      },
      urn: 'urn:ovh:vault:eu-central-1:staging-vault-001',
    },
    id: 'b2c3d4e5-2345-4000-82dc-5366d6786f81',
    resourceStatus: 'UPDATING',
    targetSpec: {
      name: 'staging-vault',
    },
    updatedAt: '2025-09-26T13:45:18.456Z',
  },
  {
    createdAt: '2025-09-26T10:15:44.332Z',
    currentState: {
      azName: 'eu-west-sbg',
      id: 'c3d4e5f6-3456-4000-85b0-badd52fc7a03',
      name: 'dev-test-vault',
      performance: 'STANDARD',
      resourceName: 'dev-vault-001',
      status: 'CREATING',
      type: 'PAYGO',
      vspc: ['c3d4e5f6-3456-4000-8b76-db7424950d04'],
    },
    currentTasks: [
      {
        id: 'c3d4e5f6-3456-4000-8008-b3ef9b81ca82',
        link: '/tasks/c3d4e5f6-3456-4000-8008-b3ef9b81ca82',
        status: 'RUNNING',
        type: 'vault_provisioning',
      },
      {
        id: 'c3d4e5f6-3456-4000-8008-b3ef9b81ca83',
        link: '/tasks/c3d4e5f6-3456-4000-8008-b3ef9b81ca83',
        status: 'PENDING',
        type: 'iam_setup',
      },
    ],
    iam: {
      displayName: 'Development Test Vault',
      id: 'c3d4e5f6-3456-4000-8aa0-9994438d3b82',
      tags: {
        environment: 'development',
        team: 'qa',
        'ovh:auto-delete': 'true',
        temporary: 'yes',
      },
      urn: 'urn:ovh:vault:us-east-1:dev-vault-001',
    },
    id: 'c3d4e5f6-3456-4000-82dc-5366d6786f82',
    resourceStatus: 'CREATING',
    targetSpec: {
      name: 'dev-test-vault',
    },
    updatedAt: '2025-09-26T10:15:44.332Z',
  },
  {
    createdAt: '2025-09-23T16:45:12.678Z',
    currentState: {
      azName: 'ap-southeast-1c',
      id: 'd4e5f6g7-4567-4000-85b0-badd52fc7a04',
      name: 'archive-vault-asia',
      performance: 'HIGHPERF',
      resourceName: 'archive-vault-asia-001',
      status: 'SUSPENDED',
      type: 'BUNDLE',
      vspc: [],
    },
    currentTasks: [
      {
        id: 'd4e5f6g7-4567-4000-8008-b3ef9b81ca84',
        link: '/tasks/d4e5f6g7-4567-4000-8008-b3ef9b81ca84',
        status: 'WAITING_USER_INPUT',
        type: 'vault_reactivation',
      },
    ],
    iam: {
      displayName: 'Asia Archive Vault',
      id: 'd4e5f6g7-4567-4000-8aa0-9994438d3b83',
      tags: {
        environment: 'archive',
        region: 'asia-pacific',
        'ovh:compliance': 'gdpr',
        'ovh:retention': '7years',
      },
      urn: 'urn:ovh:vault:ap-southeast-1:archive-vault-asia-001',
    },
    id: 'd4e5f6g7-4567-4000-82dc-5366d6786f83',
    resourceStatus: 'SUSPENDED',
    targetSpec: {
      name: 'archive-vault-asia',
    },
    updatedAt: '2025-09-25T11:30:55.789Z',
  },
  {
    createdAt: '2025-09-22T09:12:28.991Z',
    currentState: {
      azName: 'eu-west-3a',
      id: 'e5f6g7h8-5678-4000-85b0-badd52fc7a05',
      name: 'disaster-recovery-vault',
      performance: 'HIGHPERF',
      resourceName: 'dr-vault-001',
      status: 'ERROR',
      type: 'BUNDLE',
      vspc: ['e5f6g7h8-5678-4000-8b76-db7424950d05', 'e5f6g7h8-5678-4000-8b76-db7424950d06'],
    },
    currentTasks: [
      {
        id: 'e5f6g7h8-5678-4000-8008-b3ef9b81ca85',
        link: '/tasks/e5f6g7h8-5678-4000-8008-b3ef9b81ca85',
        status: 'ERROR',
        type: 'vault_recovery',
      },
    ],
    iam: {
      displayName: 'Disaster Recovery Vault',
      id: 'e5f6g7h8-5678-4000-8aa0-9994438d3b84',
      tags: {
        environment: 'disaster-recovery',
        priority: 'critical',
        'ovh:monitoring': 'enabled',
        'ovh:alert-level': 'high',
      },
      urn: 'urn:ovh:vault:eu-west-3:dr-vault-001',
    },
    id: 'e5f6g7h8-5678-4000-82dc-5366d6786f84',
    resourceStatus: 'ERROR',
    targetSpec: {
      name: 'disaster-recovery-vault',
    },
    updatedAt: '2025-09-26T07:22:11.445Z',
  },
];
