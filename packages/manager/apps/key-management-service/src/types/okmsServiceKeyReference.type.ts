import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from './okmsServiceKey.type';

type OkmsServiceKeyReferenceSize = {
  default: boolean;
  value: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
};

type OkmsServiceKeyReferenceCurve = {
  default: boolean;
  value: OkmsServiceKeyTypeECCurve;
};

type OkmsServiceKeyReferenceOperations = {
  default: boolean;
  value: OkmsServiceKeyOperations[];
};

export type OkmsServiceKeyReference = {
  sizes: OkmsServiceKeyReferenceSize[];
  default: boolean;
  type: OkmsKeyTypes;
  curves: OkmsServiceKeyReferenceCurve[];
  operations: OkmsServiceKeyReferenceOperations[];
};

export default OkmsServiceKeyReference;
