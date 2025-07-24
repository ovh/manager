import {
  ManagedWordpressResourceType,
  ManagedWordpressWebsiteDetailsType,
  ResourceStatus,
  ManagedWordpressCmsType,
  ManagedWordpressLanguage,
  ManagedWordpressPhpVersion,
  TaskStatus,
} from '../type';

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
        link:
          '/v2/managedCMS/resource/ddb77eb4-3316-420b-8cee-f02aa3094963/website/ad5be906-3106-4567-bd89-63931cee91e3',
        status: 'WAITING_USER_INPUT',
        type: 'WEBSITE_IMPORT',
      },
    ],
  },
];
export const managedCmsResourceWebsiteMock: ManagedWordpressWebsiteDetailsType[] = [
  {
    websiteId: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    resourceStatus: ResourceStatus.READY,
    checksum: 'aaaaa',
    currentState: {
      cms: ManagedWordpressCmsType.WORD_PRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: '5281b1f7a943.foo.managed-cms.ovh',
      diskUsageBytes: 1073741824,
      import: null,
      phpVersion: ManagedWordpressPhpVersion.v8_4,
      id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
    },
    currentTasks: [
      {
        id: '866f8418-9e30-456b-8311-bc465aaf0b7b',
        link:
          '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844/website/f9c60740-5e93-45a1-9cee-87987c4ddfe5',
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
    websiteId: 'f9c60740-5e93-45a1-9cee-87987c4ddfe5',
    resourceStatus: ResourceStatus.CREATING,
    checksum: 'aaaaa',
    currentState: {
      cms: ManagedWordpressCmsType.WORD_PRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: 'test.fr',
      diskUsageBytes: 0,
      phpVersion: ManagedWordpressPhpVersion.v8_3,
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
        link:
          '/v2/managedCMS/resource/b698cfa5-21bd-466a-9d8f-80eca2e3f844/website/f9c60740-5e93-45a1-9cee-87987c4ddfe5',
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
        cms: ManagedWordpressCmsType.WORD_PRESS,
        cmsSpecific: {
          wordPress: {
            language: ManagedWordpressLanguage.fr_FR,
          },
        },
        phpVersion: ManagedWordpressPhpVersion.v8_3,
      },
      import: {
        adminLogin: 'admin@admin.com',
        adminURL: 'https://test.fr/wp-admin',
        cms: ManagedWordpressCmsType.WORD_PRESS,
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
