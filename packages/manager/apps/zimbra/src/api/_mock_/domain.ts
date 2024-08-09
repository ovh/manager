import { DomainType } from '@/api/domain';

export const domainMock: DomainType[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    resourceStatus: 'READY',
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
    id: '3fa91f64-0000-4562-b3fc-000000000000',
    resourceStatus: 'READY',
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
