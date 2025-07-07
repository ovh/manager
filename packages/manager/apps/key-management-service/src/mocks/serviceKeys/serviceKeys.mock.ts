import {
  OkmsServiceKey,
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';

export const serviceKeyMock: OkmsServiceKey[] = [
  {
    name: 'ServiceKeyTest',
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
      id: '8f8a75b0-3bde-4b8d-a8c0-928ba2ceb8ed',
      urn:
        'urn:v1:eu:resource:okms:7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c/serviceKey/8f8a75b0-3bde-4b8d-a8c0-928ba2ceb8ed',
      displayName: 'ServiceKeyTest',
    },
  },
];

export const createdKeyMock: OkmsServiceKey = {
  name: 'New Key',
  createdAt: '2024-10-23T15:24:23Z',
  id: '4575b0-3bde-4b8d-a8c0-928ba2ceb8ed',
  operations: [OkmsServiceKeyOperations.sign, OkmsServiceKeyOperations.verify],
  state: OkmsServiceKeyState.active,
  type: OkmsKeyTypes.EC,
  curve: 'P-256',
  iam: {
    id: '4575b0-3bde-4b8d-a8c0-928ba2ceb8ed',
    urn:
      'urn:v1:eu:resource:okms:7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c/serviceKey/4575b0-3bde-4b8d-a8c0-928ba2ceb8ed',
    displayName: 'New Key',
  },
};
