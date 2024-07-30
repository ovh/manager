import { OrganizationType } from '@/api/organization';

export const organizationDetailMock: OrganizationType = {
  checksum: 'string',
  currentState: {
    accountsStatistics: [
      {
        configuredAccountsCount: 0,
        offer: 'BUSINESS',
      },
    ],
    createdAt: '2024-06-21T14:52:43.601Z',
    description: 'description',
    label: 'label',
    name: 'name',
    storageConsumed: 0,
    updatedAt: '2024-06-21T14:52:43.601Z',
  },
  currentTasks: [
    {
      id: '1903b491-4d10-4000-8763-1f9a992bbf01',
      link: 'string',
      status: 'ERROR',
      type: 'string',
    },
  ],
  id: '1903b491-4d10-4000-8b70-f474d1abe601',
  resourceStatus: 'CREATING',
  targetSpec: {
    accountsStatistics: [
      {
        configuredAccountsCount: 0,
        offer: 'BUSINESS',
      },
    ],
    createdAt: '2024-06-21T14:52:43.601Z',
    description: 'description',
    label: 'label',
    name: 'name',
    storageConsumed: 0,
    updatedAt: '2024-06-21T14:52:43.601Z',
  },
};

export const organizationListMock: OrganizationType[] = [
  {
    checksum: 'string',
    currentState: {
      accountsStatistics: [
        {
          configuredAccountsCount: 0,
          offer: 'BUSINESS',
        },
      ],
      createdAt: '2024-06-21T14:52:43.601Z',
      description: 'description',
      label: 'label',
      name: 'name',
      storageConsumed: 0,
      updatedAt: '2024-06-21T14:52:43.601Z',
    },
    currentTasks: [
      {
        id: '1903b491-4d10-4000-8763-1f9a992bbf01',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
    id: '1903b491-4d10-4000-8b70-f474d1abe601',
    resourceStatus: 'CREATING',
    targetSpec: {
      accountsStatistics: [
        {
          configuredAccountsCount: 0,
          offer: 'BUSINESS',
        },
      ],
      createdAt: '2024-06-21T14:52:43.601Z',
      description: 'description',
      label: 'label',
      name: 'name',
      storageConsumed: 0,
      updatedAt: '2024-06-21T14:52:43.601Z',
    },
  },
  {
    checksum: 'string',
    currentState: {
      accountsStatistics: [
        {
          configuredAccountsCount: 3,
          offer: 'READY',
        },
      ],
      createdAt: '2024-06-01T14:52:43.601Z',
      description: 'description2',
      label: 'label2',
      name: 'name2',
      storageConsumed: 0,
      updatedAt: '2024-06-02T14:52:43.601Z',
    },
    currentTasks: [],
    id: '1903b491-4d10-4000-8b70-f474d1abe602',
    resourceStatus: 'READY',
    targetSpec: {
      accountsStatistics: [
        {
          configuredAccountsCount: 3,
          offer: 'STARTER',
        },
      ],
      createdAt: '2024-06-01T14:52:43.601Z',
      description: 'description2',
      label: 'label2',
      name: 'name2',
      storageConsumed: 0,
      updatedAt: '2024-06-02T14:52:43.601Z',
    },
  },
];
