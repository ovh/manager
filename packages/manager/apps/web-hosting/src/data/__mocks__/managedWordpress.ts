/* eslint-disable max-lines */
import {
  ManagedWordpressCmsType,
  ManagedWordpressResourceDetailsType,
  ManagedWordpressResourceTask,
  ManagedWordpressResourceType,
  ManagedWordpressWebsiteDetails,
  ManagedWordpressWebsites,
} from '../types/product/managedWordpress';
import { Status } from '../types/product/ssl';
import { ResourceStatus, TaskStatus } from '../types/status';

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
export const managedWordpressWebsitesMock: ManagedWordpressWebsites[] = [
  {
    id: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    resourceStatus: ResourceStatus.READY,
    checksum: 'aaaaa',
    currentState: {
      cms: ManagedWordpressCmsType.WORDPRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: '5281b1f7a943.foo.managed-cms.ovh',
      diskUsageBytes: 1073741824,
      import: null,
      phpVersion: '8.4',
      id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
    },
    currentTasks: [
      {
        id: '866f8418-9e30-456b-8311-bc465aaf0b7b',
        link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844/website/f9c60740-5e93-45a1-9cee-87987c4ddfe5',
        status: TaskStatus.RUNNING,
        type: 'WEBSITE_CREATE',
      },
    ],
    iam: {
      displayName: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
      id: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
      tags: {},
      urn: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    },
    targetSpec: null,
  },
  {
    id: 'f9c60740-5e93-45a1-9cee-87987c4ddfe5',
    resourceStatus: ResourceStatus.CREATING,
    checksum: 'aaaaa',
    currentState: {
      cms: ManagedWordpressCmsType.WORDPRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: 'test.fr',
      diskUsageBytes: 0,
      phpVersion: '8.3',
      id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
      import: {
        checkResult: {
          cmsSpecific: {
            wordPress: {
              plugins: [],
              themes: [],
            },
          },
        },
      },
    },
    currentTasks: [
      {
        id: '866f8418-9e30-456b-8311-bc465aaf0b7b',
        link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844/website/f9c60740-5e93-45a1-9cee-87987c4ddfe5',
        status: TaskStatus.RUNNING,
        type: 'WEBSITE_CREATE',
      },
    ],
    iam: {
      displayName: 'f9c60740-5e93-45a1-9cee-87987c4ddfe5',
      id: 'f9c60740-5e93-45a1-9cee-87987c4ddfe5',
      tags: {},
      urn: 'f9c60740-5e93-45a1-9cee-87987c4ddfe5',
    },
    targetSpec: {
      creation: {
        adminLogin: 'admin@admin.com',
        cms: ManagedWordpressCmsType.WORDPRESS,
        cmsSpecific: {
          wordPress: {
            language: 'fr_FR',
          },
        },
        phpVersion: '8.3',
      },
      import: {
        adminLogin: 'admin@admin.com',
        adminURL: 'https://test.fr/wp-admin',
        cms: ManagedWordpressCmsType.WORDPRESS,
        cmsSpecific: {
          wordPress: {
            selection: {
              comments: null,
              media: null,
              pages: null,
              plugins: [],
              posts: null,
              tags: null,
              themes: [],
              users: null,
              wholeDatabase: true,
            },
          },
        },
      },
    },
  },
];

export const managedWordpressWebsitesDetailsMock: ManagedWordpressWebsiteDetails = {
  id: '88f3766f-7951-45fc-8336-fea9418c14f4',
  resourceStatus: ResourceStatus.CREATING,
  checksum: 'aaaaa',
  targetSpec: {
    import: {
      adminURL: 'https://someexternalwordpress.com/wp-admin.php',
      adminLogin: 'admin',
      cms: ManagedWordpressCmsType.WORDPRESS,
    },
  },
  currentState: {
    cms: ManagedWordpressCmsType.WORDPRESS,
    createdAt: '2025-01-01T08:00:00+01:00',
    defaultFQDN: 'example.com',
    diskUsageBytes: 0,
    import: {
      checkResult: {
        cmsSpecific: {
          wordPress: {
            plugins: [
              { name: 'plugin1', version: '1.0', enabled: true },
              { name: 'plugin2', version: '2.0', enabled: false },
            ],
            themes: [
              { name: 'theme1', version: '1.0', active: true },
              { name: 'theme2', version: '2.0', active: false },
            ],
          },
        },
      },
    },
    phpVersion: '8.1',
    serviceId: 'service123',
  },
  currentTasks: [
    {
      id: '663d955c-9063-46d7-bd4c-e92c3c8d50af',
      link: '/v2/managedCMS/resource/ddb77eb4-3316-420b-8cee-f02aa3094963/website/88f3766f-7951-45fc-8336-fea9418c14f4',
      status: Status.RUNNING,
      type: 'WEBSITE_IMPORT',
    },
  ],
};

export const managedWordpressWebsitesDeleteMock: ManagedWordpressWebsiteDetails = {
  id: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
  resourceStatus: ResourceStatus.DELETING,
  checksum: 'bbbbb',
  currentState: {
    cms: ManagedWordpressCmsType.WORDPRESS,
    phpVersion: '8.4',
    createdAt: '2025-01-01T08:00:00+01:00',
    defaultFQDN: '5281b1f7a943.foo.managed-cms.ovh',
    diskUsageBytes: 1073741824,
    serviceId: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
  },
  currentTasks: [
    {
      id: '866f8418-9e30-456b-8311-bc465aaf0b7b',
      link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844/website/214daed5-19d9-45ea-8d2c-5281b1f7a943',
      status: Status.PENDING,
      type: 'WEBSITE_DELETE',
    },
  ],
  iam: {
    displayName: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    id: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    tags: {},
    urn: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
  },
};

export const managedWordpressWebsitesTaskMock: ManagedWordpressResourceTask = {
  id: '0e9114ac-5a58-4b2d-894a-4b1b5fe67077',
  link: '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844',
  status: Status.RUNNING,
  type: 'SERVICE_CDN_FLUSH',
  createdAt: '2025-07-01T08:00:00+02:00',
  startedAt: '2025-07-01T08:01:00+02:00',
  updatedAt: '2025-07-01T08:01:01+02:00',
  message: '',
  progress: [],
  errors: [],
};

export const managedWordpressRerefenceAvailableLanguageMock = [
  {
    code: 'de_DE',
    name: 'Deutsch',
  },
  {
    code: 'en_GB',
    name: 'English (UK)',
  },
  {
    code: 'es_ES',
    name: 'Español',
  },
  {
    code: 'fr_CA',
    name: 'Français du Canada',
  },
  {
    code: 'fr_FR',
    name: 'Français',
  },
  {
    code: 'it_IT',
    name: 'Italiano',
  },
  {
    code: 'pl_PL',
    name: 'Polski',
  },
  {
    code: 'pt_PT',
    name: 'Português',
  },
];
