import { OrganizationType } from '@/api/organization';
import { ResourceStatus } from '../api.type';

export const organizationDetailMock: OrganizationType = {
  checksum: 'string',
  currentState: {
    accountsStatistics: [
      {
        configuredAccountsCount: 0,
        offer: 'BUSINESS',
        availableAccountsCount: 4,
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
  resourceStatus: ResourceStatus.CREATING,
  targetSpec: {
    description: 'description',
    label: 'label',
    name: 'name',
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
          availableAccountsCount: 4,
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
    resourceStatus: ResourceStatus.CREATING,
    targetSpec: {
      description: 'description',
      label: 'label',
      name: 'name',
    },
  },
  {
    checksum: 'string',
    currentState: {
      accountsStatistics: [
        {
          configuredAccountsCount: 3,
          offer: 'READY',
          availableAccountsCount: 4,
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
    resourceStatus: ResourceStatus.READY,
    targetSpec: {
      description: 'description2',
      label: 'label2',
      name: 'name2',
    },
  },
];
