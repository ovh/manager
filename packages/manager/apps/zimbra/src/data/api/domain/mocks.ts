import { DomainDiagnosisResponse, DomainType } from './type';

export const domainMock: DomainType = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  resourceStatus: 'READY',
  checksum: 'string',
  targetSpec: {
    organizationId: '00000000-0000-0000-0000-000000000000',
  },
  currentState: {
    organizationId: '00000000-0000-0000-0000-000000000000',
    name: 'domain.fr',
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
      spf: 'string',
      dkim: {
        cnames: [
          {
            name: 'string',
            value: 'string',
          },
        ],
      },
      mx: [
        {
          priority: 0,
          target: 'string',
        },
      ],
      ownership: {
        cname: 'test',
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
  domainMock,
  {
    id: '3fa91f64-0000-4562-b3fc-000000000000',
    resourceStatus: 'READY',
    checksum: 'string',
    targetSpec: {
      organizationId: '00000000-0000-0000-0000-000000000000',
    },
    currentState: {
      organizationId: '00000000-0000-0000-0000-000000000000',
      name: 'domain.com',
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
        dkim: {
          cnames: [
            {
              name: 'string',
              value: 'string',
            },
          ],
        },
        mx: [
          {
            priority: 0,
            target: 'string',
          },
        ],
        ownership: {
          cname: 'string',
        },
        spf: 'string',
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
    resourceStatus: 'READY',
    checksum: 'string',
    targetSpec: {
      organizationId: '00000000-0000-0000-0000-000000000001',
    },
    currentState: {
      organizationId: '00000000-0000-0000-0000-000000000001',
      name: 'domain.io',
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
        dkim: {
          cnames: [
            {
              name: 'string',
              value: 'string',
            },
          ],
        },
        mx: [
          {
            priority: 0,
            target: 'string',
          },
        ],
        ownership: {
          cname: 'string',
        },
        spf: 'string',
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
  domainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  domainName: 'zimbra.fr',
  error: {
    code: 'BAD_CONFIGURATION',
    message: 'string',
  },
  recommendations: {
    expectedDNSConfig: {
      dkim: {
        cnames: [
          {
            name: 'string',
            value: 'string',
          },
        ],
      },
      mx: [
        {
          priority: 0,
          target: 'string',
        },
      ],
      ownership: {
        cname: 'string',
      },
      spf: 'string',
    },
  },
  result: {
    dkim: {
      errors: [
        {
          code: 'INCORRECT_CNAME_RECORD',
          message: 'The CNAME setup on your DNS records is incorrect.',
        },
      ],
      recordsFound: ['string'],
      status: 'ERROR',
    },
    mx: {
      errors: [
        {
          code: 'EXTERNAL_MX_RECORD',
          message: 'string',
        },
      ],
      recordsFound: [
        {
          priority: 0,
          target: 'string',
        },
      ],
      status: 'WARNING',
    },
    spf: {
      errors: [
        {
          code: 'DANGEROUS_SPF_POLICY',
          message: 'string',
        },
      ],
      recordsFound: ['string'],
      status: 'ERROR',
    },
  },
  status: 'ERROR',
};

export const domainsDiagnosticMock = [domainDiagnosticMock] as DomainDiagnosisResponse[];
