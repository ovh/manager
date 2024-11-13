import { ColumnSort, IamObject } from '@ovh-ux/manager-react-components';

export type OkmsServiceKeyOptions = {
  sorting: ColumnSort;
  okmsId: string;
};

/*
ALL SERVICE KEY TYPE
*/
export type OkmsAllServiceKeys = OkmsServiceKeyBase & {
  size?: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
  curve?: OkmsServiceKeyTypeECCurve;
  operations: OkmsServiceKeyOperations[];
};

/*
 * SERVICE KEYS BASE
 */
export type OkmsServiceKeyBase = {
  createdAt: string;
  id: string;
  name?: string;
  state: OkmsServiceKeyState;
  type: OkmsKeyTypes;
  keys?: any[];
  iam: IamObject;
};

/*
KEY STATE
*/
export enum OkmsServiceKeyState {
  active = 'ACTIVE',
  compromised = 'COMPROMISED',
  deactivated = 'DEACTIVATED',
  destroyed = 'DESTROYED',
  destroyed_compromised = 'DESTROYED_COMPROMISED',
  pre_active = 'PRE_ACTIVE',
}

/*
KEY OPERATIONS
*/
export enum OkmsServiceKeyOperations {
  encrypt = 'encrypt',
  decrypt = 'decrypt',
  sign = 'sign',
  verify = 'verify',
  wrapKey = 'wrapKey',
  unwrapKey = 'unwrapKey',
}

/*
KEY TYPES
*/
export enum OkmsKeyTypes {
  oct = 'oct',
  RSA = 'RSA',
  EC = 'EC',
}

/* oct (AES) */

export type OkmsServiceKeyTypeOctSize = 128 | 192 | 256;

export type OkmsOctServiceKey = OkmsServiceKeyBase & {
  size: OkmsKeyTypes.oct;
  operations:
    | [OkmsServiceKeyOperations.encrypt, OkmsServiceKeyOperations.decrypt]
    | [OkmsServiceKeyOperations.wrapKey, OkmsServiceKeyOperations.unwrapKey];
};

/* RSA */

export type OkmsServiceKeyTypeRSASize = 2048 | 3072 | 4096;

export type OkmsRSAServiceKey = OkmsServiceKeyBase & {
  size: OkmsKeyTypes.RSA;
  operations: [OkmsServiceKeyOperations.sign, OkmsServiceKeyOperations.verify];
};

/* Elliptic Curve (EC) */

export type OkmsServiceKeyTypeECCurve = 'P-256' | 'P-384' | 'P-521';

export type OkmsServiceECKey = OkmsServiceKeyBase & {
  curve: OkmsKeyTypes.EC;
  operations: [OkmsServiceKeyOperations.sign, OkmsServiceKeyOperations.verify];
};

export const OkmsServiceKeyDeactivationReasonTypes = [
  'AFFILIATION_CHANGED',
  'CA_COMPROMISE',
  'CESSATION_OF_OPERATION',
  'KEY_COMPROMISE',
  'PRIVILEGE_WITHDRAWN',
  'SUPERSEDED',
  'UNSPECIFIED',
] as const;

export type OkmsServiceKeyDeactivationReason = typeof OkmsServiceKeyDeactivationReasonTypes[number];

/*
PUT SERVICE KEY
*/

export type OkmsServiceKeyPutState =
  | OkmsServiceKeyState.active
  | OkmsServiceKeyState.compromised
  | OkmsServiceKeyState.deactivated;

export type OkmsServiceKeyPutPayload = {
  deactivationReason?: OkmsServiceKeyDeactivationReason;
  name?: string;
  state?: OkmsServiceKeyPutState;
};

/*
POST SERVICE KEY
*/
export type OkmsServiceKeyPostPayload = {
  name: string;
  context: string;
  curve?: OkmsServiceKeyTypeECCurve;
  size?: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
  operations: OkmsServiceKeyOperations[];
  type: OkmsKeyTypes;
};
