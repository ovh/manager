import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from './okmsServiceKey.type';

export type OkmsServiceKeyReferenceSize = {
  default: boolean;
  value: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
};

export type OkmsServiceKeyReferenceCurve = {
  default: boolean;
  value: OkmsServiceKeyTypeECCurve;
};

export type OkmsServiceKeyReferenceOperations = {
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
