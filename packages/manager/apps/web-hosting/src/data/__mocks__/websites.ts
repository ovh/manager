import { CmsType } from '../types/product/managedWordpress/cms';
import { WebHostingWebsiteDomainType, WebHostingWebsiteType } from '../types/product/webHosting';
import { TaskType, WebsiteType } from '../types/product/website';
import { GitStatus, ResourceStatus, ServiceStatus, TaskStatus } from '../types/status';

export const websitesMocks: WebsiteType[] = [
  {
    id: '1',
    currentState: {
      resourceStatus: ResourceStatus.READY,
      fqdn: 'example.com',
      path: '/www',
      cdn: { status: ServiceStatus.ACTIVE },
      firewall: { status: ServiceStatus.ACTIVE },
      git: {
        status: GitStatus.CREATED,
        vcsBranch: 'main',
        vcsUrl: 'https://github.com/ovh/manager',
      },
      ssl: { status: ServiceStatus.ACTIVE },
      hosting: {
        displayName: 'example.com',
        offer: 'hosting-performance-1',
        serviceName: 'example.cluster023.hosting.ovh.net',
        boostOffer: 'boost',
      },
      ownLog: 'true',
    },
    currentTasks: [],
  },
  {
    id: '2',
    currentState: {
      resourceStatus: ResourceStatus.READY,
      fqdn: 'test.ovh',
      path: '/www',
      cdn: { status: ServiceStatus.NONE },
      firewall: { status: ServiceStatus.ACTIVE },
      git: {
        status: GitStatus.DEPLOYING,
        vcsBranch: 'develop',
        vcsUrl: 'https://github.com/ovh/test',
      },
      ssl: { status: ServiceStatus.ACTIVE },
      hosting: {
        displayName: 'test.ovh',
        offer: 'hosting-perso',
        serviceName: 'test.cluster022.hosting.ovh.net',
        boostOffer: '',
      },
      ownLog: 'false',
    },
    currentTasks: [
      {
        id: 'uuid-1234',
        link: 'https://tasks.example.com/1234',
        status: TaskStatus.RUNNING,
        type: TaskType.DEPLOYMENT,
      },
    ],
  },
  {
    id: '3',
    currentState: {
      resourceStatus: ResourceStatus.ERROR,
      fqdn: 'error.ovh',
      path: '/www',
      cdn: { status: ServiceStatus.NONE },
      firewall: { status: ServiceStatus.NONE },
      git: {
        status: GitStatus.ERROR,
        vcsBranch: 'main',
        vcsUrl: 'https://github.com/ovh/error',
      },
      ssl: { status: ServiceStatus.NONE },
      hosting: {
        displayName: 'error.ovh',
        offer: 'hosting-pro',
        serviceName: 'error.cluster021.hosting.ovh.net',
        boostOffer: '',
      },
      ownLog: 'false',
    },
    currentTasks: [
      {
        id: 'uuid-5678',
        link: 'https://tasks.example.com/5678',
        status: TaskStatus.ERROR,
        type: TaskType.SSL_SETUP,
      },
    ],
  },
  {
    id: '4',
    currentState: {
      resourceStatus: ResourceStatus.READY,
      fqdn: 'multisite.ovh',
      path: '/www/multisite',
      cdn: { status: ServiceStatus.ACTIVE },
      firewall: { status: ServiceStatus.ACTIVE },
      git: {
        status: GitStatus.CREATED,
        vcsBranch: 'main',
        vcsUrl: 'https://github.com/ovh/multisite',
      },
      ssl: { status: ServiceStatus.ACTIVE },
      hosting: {
        displayName: 'multisite.ovh',
        offer: 'hosting-performance-2',
        serviceName: 'multisite.cluster024.hosting.ovh.net',
        boostOffer: 'boost',
      },
      ownLog: 'true',
    },
    currentTasks: [],
  },
  {
    id: '5',
    currentState: {
      resourceStatus: ResourceStatus.READY,
      fqdn: 'starter.ovh',
      path: '/www',
      cdn: { status: ServiceStatus.NONE },
      firewall: { status: ServiceStatus.NONE },
      git: {
        status: GitStatus.CREATED,
        vcsBranch: 'main',
        vcsUrl: 'https://github.com/ovh/starter',
      },
      ssl: { status: ServiceStatus.ACTIVE },
      hosting: {
        displayName: 'starter.ovh',
        offer: 'hosting-starter',
        serviceName: 'starter.cluster025.hosting.ovh.net',
        boostOffer: '',
      },
      ownLog: 'false',
    },
    currentTasks: [],
  },
];

export const WebHostingWebsiteMocks: WebHostingWebsiteType[] = [
  {
    id: '1',
    checksum: '',
    currentState: {
      path: 'www',
      name: 'nom de test1',
      linkedDomains: 2,
      git: {
        status: GitStatus.CREATED,
        vcsBranch: 'STARTER',
        vcsUrl: 'https://github.com/cocony21/TESTGIT.git',
      },
      module: {
        name: CmsType.JOOMLA,
      },
    },
    currentTasks: [],
    resourceStatus: ResourceStatus.READY,
    targetSpec: { name: 'toto' },
  },
];
export const WebHostingWebsiteDomainMocks: WebHostingWebsiteDomainType[] = [
  {
    id: '1',
    checksum: '',
    currentState: {
      fqdn: 'test.site',
      firewall: { status: ServiceStatus.NONE },
      cdn: { status: ServiceStatus.ACTIVE },
      name: 'deuxieme site',
      path: 'testsuppression',
      websiteId: '1',
    },
    currentTasks: [],
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      firewall: ServiceStatus.NONE,
      cdn: ServiceStatus.ACTIVE,
    },
  },
  {
    id: '2',
    checksum: '',
    currentState: {
      fqdn: 'www.test.site',
      firewall: { status: ServiceStatus.NONE },
      cdn: { status: ServiceStatus.ACTIVE },
      name: 'premier site',
      path: '.',
      websiteId: '1',
    },
    currentTasks: [],
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      firewall: ServiceStatus.NONE,
      cdn: ServiceStatus.NONE,
    },
  },
];
