import { AliasType } from '@/api/alias';
import { ResourceStatus } from '../api.type';

export const aliasesMock: AliasType[] = [
  {
    id: 'bf333af7-585d-4fb3-b81c-06be10df4828',
    resourceStatus: ResourceStatus.READY,
    checksum: '',
    targetSpec: {
      targetId: '1bb958c9-cc20-465b-bf35-04b7f0d91276',
      alias: 'test@alias.com',
    },
    currentState: {
      alias: {
        domainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'test@domain.fr',
        organizationId: '1903b491-4d10-4000-8763-1f9a992bbf01',
        organizationLabel: 'test',
      },
      target: {
        domainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        id: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        type: 'ACCOUNT',
      },
    },
    currentTasks: [],
  },
];
