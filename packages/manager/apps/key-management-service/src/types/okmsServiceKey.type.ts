import { ColumnSort } from '@ovhcloud/manager-components';

// export type OkmsServiceKey = {
//   id: string;
//   createdAt: string;
//   curve: string | null;
//   keys: [];
//   name: string;
//   operations: string[];
//   size: number | null;
//   state: string;
//   type: string;
// };

export type OkmsServiceKeyOptions = {
  sorting: ColumnSort;
  okmsId: string;
};

/*
ALL SEERVICE KEY TYPE
*/

export type OkmsAllServiceKeys = OkmsServiceKeyBase & {
  size?: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
  curve?: OkmsServiceKeyTypeECCurve;
  operations: OkmsServiceKeyAllOperations[];
};

/*
 * SERVICE KEYS BASE
 */
export type OkmsServiceKeyBase = {
  createdAt: string;
  id: string;
  name?: string;
  state: OkmsServiceKeyState;
  type: OkmsServiceKeyTypeOCT | OkmsServiceKeyTypeEC | OkmsServiceKeyTypeRSA;
};

/*
KEY STATE
*/
export type OkmsServiceKeyState =
  | 'ACTIVE'
  | 'COMPROMISED'
  | 'DEACTIVATED'
  | 'DESTROYED'
  | 'DESTROYED_COMPROMISED'
  | 'PRE_ACTIVE';

/*
KEY OPERATIONS
*/

/* ENCRYPT / DECRYPT */
export type OkmsServiceKeyOperationEncrypt = 'encrypt';
export type OkmsServiceKeyOperationDecrypt = 'decrypt';
export type OkmsServiceKeyOperationEncryptDecrypt = [
  OkmsServiceKeyOperationEncrypt,
  OkmsServiceKeyOperationDecrypt,
];

/* SIGN / VERIFY */
export type OkmsServiceKeyOperationSign = 'sign';
export type OkmsServiceKeyOperationVerify = 'verify';
export type OkmsServiceKeyOperationSignVerify = [
  OkmsServiceKeyOperationSign,
  OkmsServiceKeyOperationVerify,
];

/* WRAP / UNWRAP */
export type OkmsServiceKeyOperationWrap = 'wrapKey';
export type OkmsServiceKeyOperationUnwrap = 'unwrapKey';
export type OkmsServiceKeyOperationWrapUnwrap = [
  OkmsServiceKeyOperationWrap,
  OkmsServiceKeyOperationUnwrap,
];

export type OkmsServiceKeyAllOperations =
  | OkmsServiceKeyOperationDecrypt
  | OkmsServiceKeyOperationEncrypt
  | OkmsServiceKeyOperationSign
  | OkmsServiceKeyOperationVerify
  | OkmsServiceKeyOperationWrap
  | OkmsServiceKeyOperationUnwrap;

/*
KEY TYPES
*/

/* oct (AES) */
export type OkmsServiceKeyTypeOCT = 'oct';

export type OkmsServiceKeyTypeOctSize = 128 | 192 | 256;

export type OkmsOctServiceKey = OkmsServiceKeyBase & {
  size: OkmsServiceKeyTypeOctSize;
  operations:
    | OkmsServiceKeyOperationEncryptDecrypt
    | OkmsServiceKeyOperationWrapUnwrap;
};

/* RSA */
export type OkmsServiceKeyTypeRSA = 'RSA';

export type OkmsServiceKeyTypeRSASize = 2048 | 3072 | 4096;

export type OkmsRSAServiceKey = OkmsServiceKeyBase & {
  size: OkmsServiceKeyTypeRSASize;
  operations: OkmsServiceKeyOperationSignVerify;
};

/* Elliptic Curve (EC) */
export type OkmsServiceKeyTypeEC = 'EC';

export type OkmsServiceKeyTypeECCurve = 'P-256' | 'P-384' | 'P-521';

export type OkmsServiceECKey = OkmsServiceKeyBase & {
  curve: OkmsServiceKeyTypeECCurve;
  operations: OkmsServiceKeyOperationSignVerify;
};

export type OkmsKeyTypes =
  | OkmsServiceKeyTypeOCT
  | OkmsServiceKeyTypeRSA
  | OkmsServiceKeyTypeEC;

/*
PUT SERVICE KEY
*/

export type OkmsServiceKeyPutPayload = {
  deactivationReason?:
    | 'AFFILIATION_CHANGED'
    | 'CA_COMPROMISE'
    | 'CESSATION_OF_OPERATION'
    | 'KEY_COMPROMISE'
    | 'PRIVILEGE_WITHDRAWN'
    | 'SUPERSEDED'
    | 'UNSPECIFIED';
  name?: string;
  state?: 'ACTIVE' | 'DEACTIVATED';
};
