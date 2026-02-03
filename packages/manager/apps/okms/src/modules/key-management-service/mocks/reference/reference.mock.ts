import { OkmsKeyTypes } from '@key-management-service/types/okmsServiceKey.type';
import {
  OkmsServiceKeyReference,
  OkmsServiceKeyReferenceSize,
} from '@key-management-service/types/okmsServiceKeyReference.type';

export const referenceServiceKeyMock: OkmsServiceKeyReference[] = [
  {
    sizes: [
      { value: 128, default: false },
      { value: 192, default: false },
      { value: 256, default: true },
    ] as OkmsServiceKeyReferenceSize[],
    type: OkmsKeyTypes.oct,
    default: true,
    operations: [
      {
        value: ['encrypt', 'decrypt'],
        default: true,
      },
      {
        value: ['wrapKey', 'unwrapKey'],
        default: false,
      },
    ],
    curves: [],
  },
  {
    sizes: [],
    type: OkmsKeyTypes.EC,
    default: false,
    operations: [
      {
        value: ['sign', 'verify'],
        default: true,
      },
    ],
    curves: [
      { default: true, value: 'P-256' },
      { default: false, value: 'P-384' },
      { default: false, value: 'P-521' },
    ],
  },
];
