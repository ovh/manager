import {
  OkmsAllServiceKeys,
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';

export const serviceKeyMock: OkmsAllServiceKeys[] = [
  {
    createdAt: '2024-10-23T15:24:23Z',
    id: '8f8a75b0-3bde-4b8d-a8c0-928ba2ceb8ed',
    operations: [
      OkmsServiceKeyOperations.sign,
      OkmsServiceKeyOperations.verify,
    ],
    state: OkmsServiceKeyState.active,
    type: OkmsKeyTypes.EC,
    curve: 'P-256',
  },
];
