import { AccountType } from '@/api/account';
import { ResourceStatus } from '@/api/api.type';

export const accountMock: AccountType[] = [
  {
    checksum: 'string',
    currentState: {
      contactInformation: {
        city: 'string',
        company: 'string',
        country: 'string',
        faxNumber: 'string',
        mobileNumber: 'string',
        office: 'string',
        phoneNumber: 'string',
        postcode: 'string',
        profession: 'string',
        service: 'string',
        street: 'string',
      },
      createdAt: '2024-07-09T13:27:12.775Z',
      description: 'string',
      detailedStatus: [
        {
          details: 'string',
          link: 'string',
          status: 'BLOCKEDFORSPAM',
        },
      ],
      displayName: 'string',
      domainId: '19097ad4-2870-4000-8bb0-470f414b0301',
      email: 'string',
      firstName: 'string',
      hideInGal: false,
      lastConnectionAt: '2024-07-09T13:27:12.775Z',
      lastName: 'string',
      offer: 'BUSINESS',
      organizationId: '19097ad4-2870-4000-82b3-b71a147bc580',
      organizationLabel: 'string',
      quota: {
        available: 0,
        used: 0,
      },
      updatedAt: '2024-07-09T13:27:12.775Z',
    },
    currentTasks: [
      {
        id: '19097ad4-2870-4000-8bed-ecab3a061780',
        link: 'string',
        status: 'ERROR',
        type: 'string',
      },
    ],
    id: '19097ad4-2880-4000-8b03-9d110f0b8f80',
    resourceStatus: ResourceStatus.CREATING,
    targetSpec: {
      contactInformation: {
        city: 'string',
        company: 'string',
        country: 'string',
        faxNumber: 'string',
        mobileNumber: 'string',
        office: 'string',
        phoneNumber: 'string',
        postcode: 'string',
        profession: 'string',
        service: 'string',
        street: 'string',
      },
      description: 'string',
      displayName: 'string',
      email: 'string',
      firstName: 'string',
      hideInGal: false,
      lastName: 'string',
      quota: {
        available: 0,
        used: 0,
      },
    },
  },
];
