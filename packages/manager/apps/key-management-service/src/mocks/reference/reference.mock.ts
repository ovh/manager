import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
} from '@/types/okmsServiceKey.type';
import OkmsServiceKeyReference, {
  OkmsServiceKeyReferenceSize,
} from '@/types/okmsServiceKeyReference.type';

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
        value: [
          OkmsServiceKeyOperations.encrypt,
          OkmsServiceKeyOperations.decrypt,
        ],
        default: true,
      },
      {
        value: [
          OkmsServiceKeyOperations.wrapKey,
          OkmsServiceKeyOperations.unwrapKey,
        ],
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
        value: [OkmsServiceKeyOperations.sign, OkmsServiceKeyOperations.verify],
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
