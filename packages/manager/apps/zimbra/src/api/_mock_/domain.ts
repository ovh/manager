import { DiagnosticResponse, DomainType } from '@/api/domain';
import { ResourceStatus } from '@/api/api.type';

export const domainDetailMock: DomainType = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  resourceStatus: ResourceStatus.READY,
  checksum: 'string',
  targetSpec: {
    organizationId: '00000000-0000-0000-0000-000000000000',
  },
  currentState: {
    organizationId: '00000000-0000-0000-0000-000000000000',
    name: 'NormalDomain',
    status: 'READY',
    createdAt: '2024-04-12T12:27:47.213Z',
    updatedAt: '2024-04-12T12:27:47.213Z',
    organizationLabel: 'ToyStory',
    cnameToCheck: '',
    accountsStatistics: [
      {
        offer: 'STARTER',
        configuredAccountsCount: 0,
        availableAccountsCount: 4,
      },
    ],
    expectedDNSConfig: {
      mx: [],
      ownership: {
        cname: null,
      },
    },
  },
  currentTasks: [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      type: 'string',
      link: 'string',
    },
  ],
};

export const domainsMock: DomainType[] = [
  domainDetailMock,
  {
    id: '3fa91f64-0000-4562-b3fc-000000000000',
    resourceStatus: ResourceStatus.READY,
    checksum: 'string',
    targetSpec: {
      organizationId: '00000000-0000-0000-0000-000000000000',
    },
    currentState: {
      organizationId: '00000000-0000-0000-0000-000000000000',
      name: 'AwesomeDomain',
      status: 'READY',
      createdAt: '2024-04-12T12:27:47.213Z',
      updatedAt: '2024-04-12T12:27:47.213Z',
      organizationLabel: 'Magret',
      cnameToCheck: '',
      accountsStatistics: [
        {
          offer: 'STARTER',
          configuredAccountsCount: 0,
          availableAccountsCount: 4,
        },
      ],
      expectedDNSConfig: {
        mx: [],
        ownership: {
          cname: null,
        },
      },
    },
    currentTasks: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        type: 'string',
        link: 'string',
      },
    ],
  },
  {
    id: '3fa91f64-0000-4562-b2fc-000000000000',
    resourceStatus: ResourceStatus.READY,
    checksum: 'string',
    targetSpec: {
      organizationId: '00000000-0000-0000-0000-000000000001',
    },
    currentState: {
      organizationId: '00000000-0000-0000-0000-000000000001',
      name: 'BlablaDomain',
      status: 'READY',
      createdAt: '2024-04-12T12:27:47.213Z',
      updatedAt: '2024-04-12T12:27:47.213Z',
      organizationLabel: 'Canard',
      cnameToCheck: '',
      accountsStatistics: [
        {
          offer: 'STARTER',
          configuredAccountsCount: 0,
          availableAccountsCount: 4,
        },
      ],
      expectedDNSConfig: {
        mx: [],
        ownership: {
          cname: 'mycname',
        },
      },
    },
    currentTasks: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        type: 'string',
        link: 'string',
      },
    ],
  },
];

export const domainZone: string[] = ['test.fr', 'mydomain.fr', 'domain.fr'];

export const domainDiagnosticMock = {
  expectedDNSConfig: {
    mx: [
      {
        priority: 5,
        target: 'mx0.mail.ovh.net',
      },
    ],
    ownership: {
      cname: 'mycname',
    },
  },
  diagnostic: {
    dkim: {
      errorCode: 'INCORRECT_CNAME_RECORD',
      errorMessage: 'string',
      recordsFound: ['string'],
      status: 'ERROR',
    },
    errorCode: 'DNS_TIMEOUT',
    errorMessage: 'string',
    mx: {
      errorCode: 'MISSING_VALID_MX_RECORD',
      errorMessage: 'string',
      recordsFound: [
        {
          priority: 0,
          target: 'string',
        },
      ],
      status: 'ERROR',
    },
    spf: {
      recordFound: 'string',
      status: 'OK',
    },
    status: 'ERROR',
  },
  domainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  domainName: 'string',
  id: '19386dad-2e50-4000-86d3-0698199f4a01',
} as DiagnosticResponse;

export const domainsDiagnosticMock = [
  domainDiagnosticMock,
] as DiagnosticResponse[];
