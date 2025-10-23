import { RedirectionType } from './type';

export const redirectionsMock: RedirectionType[] = [
  {
    id: 'bf333af7-585d-4fb3-b81c-06be10df4828',
    resourceStatus: 'READY',
    checksum: '',
    targetSpec: {
      source: 'source@email.com',
      destination: 'destination@email.com',
    },
    currentState: {
      source: 'source@email.com',
      destination: 'destination@email.com',
      createdAt: '2025-10-23T12:51:45.619Z',
      domainId: '19a11201-1530-4000-81ee-86fb8d5a3e01',
      organizationId: '19a11201-1530-4000-80cc-5574700d8b01',
      updatedAt: '2025-10-23T12:51:45.619Z',
    },
    currentTasks: [],
  },
];
