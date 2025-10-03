import {
  ManagedWordpressResourceDetailsType,
  ManagedWordpressResourceType,
} from '@/data/types/product/managedWordpress/ressource';
import { Status } from '@/data/types/product/ssl';
import { ResourceStatus } from '@/data/types/status';

export const managedWordpressResourceMock: ManagedWordpressResourceType[] = [
  {
    id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
    resourceStatus: ResourceStatus.READY,
    checksum: 'aaaaa',
    iam: {
      displayName: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
      id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
      tags: {},
      urn: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
    },
    currentState: {
      plan: 'managed-cms-50',
      quotas: {
        websites: {
          planQuota: 50,
          additionalQuota: 10,
          totalQuota: 60,
          totalUsage: 2,
        },
        disk: {
          planQuotaBytes: 107374182400,
          additionalQuotaBytes: 10737418240,
          totalQuotaBytes: 118111600640,
          totalUsageBytes: 1073741824,
        },
        visits: {
          totalAdditionalQuota: 15000,
          boosts: [
            {
              initialAmount: 10000,
              currentAmount: 5000,
              createdAt: '2025-06-01T08:00:00+02:00',
              expiresAt: '2025-09-01T08:00:00+02:00',
            },
            {
              initialAmount: 10000,
              currentAmount: 10000,
              createdAt: '2025-07-01T08:00:00+02:00',
              expiresAt: '2025-10-01T08:00:00+02:00',
            },
          ],
        },
      },
      dashboards: {
        wordPress: '50ef1921508f.foo.managed-cms.ovh',
      },
      createdAt: '2025-01-01T08:00:00+01:00',
    },
    currentTasks: [
      {
        plan: 'test',
        id: '0e9114ac-5a58-4b2d-894a-4b1b5fe67077',
        link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844',
        status: 'RUNNING',
        type: 'SERVICE_CDN_FLUSH',
      },
    ],
  },
  {
    id: 'ddb77eb4-3316-420b-8cee-f02aa3094963',
    resourceStatus: ResourceStatus.READY,
    checksum: 'aaaaa',
    iam: {
      displayName: 'ddb77eb4-3316-420b-8cee-f02aa3094963',
      id: 'ddb77eb4-3316-420b-8cee-f02aa3094963',
      tags: {},
      urn: 'ddb77eb4-3316-420b-8cee-f02aa3094963',
    },
    currentState: {
      plan: 'managed-cms-10',
      quotas: {
        websites: {
          planQuota: 10,
          additionalQuota: 0,
          totalQuota: 10,
          totalUsage: 1,
        },
        disk: {
          planQuotaBytes: 107374182400,
          additionalQuotaBytes: 0,
          totalQuotaBytes: 107374182400,
          totalUsageBytes: 0,
        },
        visits: {
          totalAdditionalQuota: 0,
          boosts: [],
        },
      },
      dashboards: {
        wordPress: '70fc9615159c.foo.managed-cms.ovh',
      },
      createdAt: '2025-01-01T08:00:00+01:00',
    },
    currentTasks: [
      {
        plan: 'test',
        id: '663d955c-9063-46d7-bd4c-e92c3c8d50af',
        link: '/v2/managedCMS/resource/ddb77eb4-3316-420b-8cee-f02aa3094963/website/ad5be906-3106-4567-bd89-63931cee91e3',
        status: 'WAITING_USER_INPUT',
        type: 'WEBSITE_IMPORT',
      },
    ],
  },
];

export const managedWordpressResourceDetailsMock: ManagedWordpressResourceDetailsType = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  resourceStatus: ResourceStatus.READY,
  checksum: 'abc123def456ghi789',
  iam: {
    displayName: 'My WordPress Hosting',
    id: '321e6547-e89b-12d3-a456-426614174000',
    tags: {
      'ovh:project': 'wordpress-project',
      env: 'production',
    },
    urn: 'urn:ovh:resource:managed-wordpress:123e4567-e89b-12d3-a456-426614174000',
  },
  currentState: {
    plan: 'wp-professional',
    createdAt: '2024-01-15T10:30:00.000Z',
    dashboards: {
      wordPress: 'https://www.my-ovh-wordpress-dashboard.com',
    },
    quotas: {
      disk: {
        additionalQuotaBytes: 10 * 1024 * 1024 * 1024, // 10 GB
        planQuotaBytes: 50 * 1024 * 1024 * 1024, // 50 GB
        totalQuotaBytes: 60 * 1024 * 1024 * 1024, // 60 GB
        totalUsageBytes: 42 * 1024 * 1024 * 1024, // 42 GB
      },
      visits: {
        totalAdditionalQuota: 20000,
        boosts: [
          {
            createdAt: '2025-07-01T00:00:00.000Z',
            currentAmount: 8000,
            expiresAt: '2025-08-01T00:00:00.000Z',
            initialAmount: 10000,
          },
          {
            createdAt: '2025-06-01T00:00:00.000Z',
            currentAmount: 500,
            expiresAt: '2025-07-01T00:00:00.000Z',
            initialAmount: 5000,
          },
        ],
      },
      websites: {
        additionalQuota: 3,
        planQuota: 2,
        totalQuota: 5,
        totalUsage: 4,
      },
    },
  },
  currentTasks: [
    {
      id: '456e7890-e89b-12d3-a456-426614174000',
      link: 'https://www.my-ovh-tasks.com/task/456e7890',
      status: Status.RUNNING,
      type: 'UPGRADE_PLAN',
    },
    {
      id: '789e1234-e89b-12d3-a456-426614174000',
      link: 'https://www.my-ovh-tasks.com/task/789e1234',
      status: Status.SCHEDULED,
      type: 'UPDATE_QUOTA',
    },
  ],
};
