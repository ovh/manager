import { ColumnSort, IamObject } from '@ovh-ux/manager-react-components';

export type OkmsServiceKeyOptions = {
  sorting: ColumnSort;
  okmsId: string;
};

/*
ALL SERVICE KEY TYPE
*/
export type OkmsServiceKey = {
  id: string;
  name?: string;
  state: OkmsServiceKeyState;
  type: OkmsKeyTypes;
  keys?: OkmsServiceKeyObject;
  iam: IamObject;
  createdAt: string;
  size?: OkmsServiceKeySize;
  curve?: OkmsServiceKeyCurve;
  operations: OkmsServiceKeyOperations[];
};

// A JSON Web Key (JWK) object
type OkmsServiceKeyObject = unknown[];

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

/* RSA */
export type OkmsServiceKeyTypeRSASize = 2048 | 3072 | 4096;

/* Size */
export type OkmsServiceKeySize =
  | OkmsServiceKeyTypeOctSize
  | OkmsServiceKeyTypeRSASize;

/* Elliptic Curve (EC) */
export type OkmsServiceKeyCurve = 'P-256' | 'P-384' | 'P-521';

/* Deactivation reasons */
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
  curve?: OkmsServiceKeyCurve;
  size?: OkmsServiceKeySize;
  operations: OkmsServiceKeyOperations[];
  type: OkmsKeyTypes;
};
