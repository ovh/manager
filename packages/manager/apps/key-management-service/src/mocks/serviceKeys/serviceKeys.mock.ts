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
    iam: {
      id: '8f8a75b0-3bde-4b8d-a8c0-928basvced',
      urn:
        'urn:v1:eu:resource:okms:8f8a75b0-b57d-45fc-8d4f-256664DFE/serviceKey/dqd63-5688-409c-234-125e24538f34',
      displayName: 'ServiceKeyTest',
    },
  },
];
