import { CmsType } from '@/data/types/product/managedWordpress/cms';
import {
  ManagedWordpressWebsiteDetails,
  ManagedWordpressWebsites,
} from '@/data/types/product/managedWordpress/website';
import { Status } from '@/data/types/product/ssl';
import { ResourceStatus, TaskStatus } from '@/data/types/status';

export const managedWordpressWebsitesMock: ManagedWordpressWebsites[] = [
  {
    id: '214daed5-19d9-45ea-8d2c-5281b1f7a943',
    resourceStatus: ResourceStatus.READY,
    checksum: 'aaaaa',
    currentState: {
      cms: CmsType.WORDPRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: '5281b1f7a943.foo.managed-cms.ovh',
      diskUsageBytes: 1073741824,
      import: {
        checkResult: {
          cmsSpecific: {
            wordpress: {
              plugins: [],
              themes: [],
            },
          },
        },
      },
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
      cms: CmsType.WORDPRESS,
      createdAt: '2025-01-01T08:00:00+01:00',
      defaultFQDN: 'test.fr',
      diskUsageBytes: 0,
      phpVersion: '8.3',
      id: 'b698cfa5-21bd-466a-9d8f-80eca2e3f844',
      import: {
        checkResult: {
          cmsSpecific: {
            wordpress: {
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
        cms: CmsType.WORDPRESS,
        cmsSpecific: {
          wordpress: {
            language: 'fr_FR',
          },
        },
        phpVersion: '8.3',
      },
      import: {
        adminLogin: 'admin@admin.com',
        adminURL: 'https://test.fr/wp-admin',
        cms: CmsType.WORDPRESS,
        cmsSpecific: {
          wordpress: {
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
      cms: CmsType.WORDPRESS,
    },
  },
  currentState: {
    cms: CmsType.WORDPRESS,
    createdAt: '2025-01-01T08:00:00+01:00',
    defaultFQDN: 'example.com',
    diskUsageBytes: 0,
    import: {
      checkResult: {
        cmsSpecific: {
          wordpress: {
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
    cms: CmsType.WORDPRESS,
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
