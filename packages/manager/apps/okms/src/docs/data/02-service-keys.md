# Service Keys Data

This document covers all data fetching and mutation related to cryptographic service keys within an OKMS instance.

**Module:** Key Management Service (`src/modules/key-management-service/data/`)

---

## Endpoints (API v2)

### CRUD

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource/{okmsId}/serviceKey` | `getListingOkmsServiceKey(okmsId)` | `OkmsServiceKey[]` |
| GET | `okms/resource/{okmsId}/serviceKey/{keyId}` | `getOkmsServiceKeyResource({ okmsId, keyId })` | `OkmsServiceKeyWithData` |
| GET | `okms/resource/{okmsId}/serviceKey/{keyId}?format={JWK\|PEM}` | `getOkmsServiceKeyResource({ okmsId, keyId, format })` | `OkmsServiceKeyWithData` |
| POST | `okms/resource/{okmsId}/serviceKey` | `createOkmsServiceKeyResource({ okmsId, data })` | `OkmsServiceKey` |
| PUT | `okms/resource/{okmsId}/serviceKey/{keyId}` | `updateOkmsServiceKeyResource({ okmsId, keyId, data })` | `void` |
| DELETE | `okms/resource/{okmsId}/serviceKey/{keyId}` | `deleteOkmsServiceKeyResource({ okmsId, keyId })` | `void` |

**Source:** `data/api/okmsServiceKey.ts`

### Reference

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/reference/serviceKey?region={okmsRegion}` | `getServiceKeyReference(okmsRegion)` | `OkmsServiceKeyReference[]` |

Returns available key types, sizes, curves, and operations for a given region.

**Source:** `data/api/okmsReference.ts`

---

## React Query Hooks

### Queries

| Hook | Parameters | Query Key | Returns |
|------|------------|-----------|---------|
| `useAllOkmsServiceKeys` | `okmsId: string` | `['get/okms/resource/{okmsId}/serviceKey']` | `OkmsServiceKey[]` |
| `useOkmsServiceKeys` | `{ okmsId }` | Same as above (alias) | `OkmsServiceKey[]` |
| `useOkmsServiceKeyById` | `{ okmsId, keyId, format?, enabled? }` | `['get/okms/resource/{okmsId}/serviceKey/{keyId}']` | `OkmsServiceKeyWithData` |
| `useOkmsServiceKeyReference` | `okmsRegion: string` | `['get/resource/serviceKey/{okmsRegion}']` | `OkmsServiceKeyReference[]` |

**Sources:** `data/hooks/useOkmsServiceKeys.ts`, `data/hooks/useOkmsReferenceServiceKey.ts`

### Mutations

| Hook | Parameters | Operation | Invalidates |
|------|------------|-----------|-------------|
| `useCreateOkmsServiceKey` | `{ okmsId }` | POST create service key | Service key list |
| `useUpdateOkmsServiceKey` | `{ okmsId, keyId, onSuccess, onError }` | PUT update service key | Service key detail |
| `useDeleteOkmsServiceKey` | `{ okmsId, keyId, onSuccess, onError }` | DELETE service key | Service key list |

`useCreateOkmsServiceKey` exposes `mutateAsync` for awaiting the result (used in creation flows).

**Sources:** `data/hooks/useCreateOkmsServiceKey.ts`, `data/hooks/useUpdateOkmsServiceKey.ts`, `data/hooks/useDeleteOkmsServiceKey.ts`

---

## Query Keys

```typescript
getOkmsServiceKeyResourceListQueryKey(okmsId)
  // ['get/okms/resource/{okmsId}/serviceKey']

getOkmsServiceKeyResourceQueryKey({ okmsId, keyId, format? })
  // ['get/okms/resource/{okmsId}/serviceKey/{keyId}']
  // ['get/okms/resource/{okmsId}/serviceKey/{keyId}?format=JWK']

updateOkmsServiceKeyResourceQueryKey({ okmsId, keyId })
  // ['put/okms/resource/{okmsId}/serviceKey/{keyId}/editName']

deleteOkmsServiceKeyResourceQueryKey({ okmsId, keyId })
  // ['okms/resource/{okmsId}/serviceKey/{keyId}/delete']

createOkmsServiceKeyResourceQueryKey({ okmsId })
  // ['put/okms/resource/{okmsId}/serviceKey/create']

getOkmsServiceKeyReferenceQueryKey(okmsRegion)
  // ['get/resource/serviceKey/{okmsRegion}']
```

---

## Types

### `OkmsServiceKey`

```typescript
type OkmsServiceKey = {
  id: string;
  name?: string;
  state: OkmsServiceKeyState;
  type: OkmsKeyTypes;
  iam: IamObject;
  createdAt: string;
  size?: OkmsServiceKeySize;
  curve?: OkmsServiceKeyCurve;
  operations: OkmsServiceKeyOperations[];
};
```

**Source:** `types/okmsServiceKey.type.ts`

### `OkmsServiceKeyWithData`

Union type that includes optional key material in JWK or PEM format:

```typescript
type OkmsServiceKeyWithData =
  | OkmsServiceKey
  | OkmsServiceKeyWithJwkData
  | OkmsServiceKeyWithPemData;

type OkmsServiceKeyWithJwkData = OkmsServiceKey & {
  keys: unknown[];      // JWK key objects
  keysPEM?: never;
};

type OkmsServiceKeyWithPemData = OkmsServiceKey & {
  keys?: never;
  keysPEM: { pem: string }[];
};
```

### `OkmsServiceKeyState`

```typescript
enum OkmsServiceKeyState {
  active = 'ACTIVE',
  compromised = 'COMPROMISED',
  deactivated = 'DEACTIVATED',
  destroyed = 'DESTROYED',
  destroyed_compromised = 'DESTROYED_COMPROMISED',
  pre_active = 'PRE_ACTIVE',
}
```

### `OkmsKeyTypes`

```typescript
enum OkmsKeyTypes {
  oct = 'oct',   // AES (symmetric)
  RSA = 'RSA',   // RSA (asymmetric)
  EC = 'EC',     // Elliptic Curve (asymmetric)
}
```

### Key Sizes and Curves

```typescript
// AES key sizes
type OkmsServiceKeyTypeOctSize = 128 | 192 | 256;

// RSA key sizes
type OkmsServiceKeyTypeRSASize = 2048 | 3072 | 4096;

// Combined size type
type OkmsServiceKeySize = OkmsServiceKeyTypeOctSize | OkmsServiceKeyTypeRSASize;

// Elliptic curves
type OkmsServiceKeyCurve = 'P-256' | 'P-384' | 'P-521';
```

### `OkmsServiceKeyOperations`

Operations come in pairs representing complementary cryptographic functions:

```typescript
type OkmsServiceKeyOperations =
  | 'encrypt' | 'decrypt'
  | 'sign' | 'verify'
  | 'wrapKey' | 'unwrapKey';

// Usage pairs
type OkmsServiceKeyOperationUsage =
  | 'encrypt_decrypt'
  | 'sign_verify'
  | 'wrapKey_unwrapKey';
```

### Deactivation

```typescript
const OkmsServiceKeyDeactivationReasonTypes = [
  'AFFILIATION_CHANGED',
  'CA_COMPROMISE',
  'CESSATION_OF_OPERATION',
  'KEY_COMPROMISE',
  'PRIVILEGE_WITHDRAWN',
  'SUPERSEDED',
  'UNSPECIFIED',
] as const;

type OkmsServiceKeyDeactivationReason =
  (typeof OkmsServiceKeyDeactivationReasonTypes)[number];
```

### PUT Payload

```typescript
type OkmsServiceKeyPutState =
  | OkmsServiceKeyState.active
  | OkmsServiceKeyState.compromised
  | OkmsServiceKeyState.deactivated;

type OkmsServiceKeyPutPayload = {
  deactivationReason?: OkmsServiceKeyDeactivationReason;
  name?: string;
  state?: OkmsServiceKeyPutState;
};
```

### POST Payload

```typescript
type OkmsServiceKeyPostPayload = {
  name: string;
  context: string;
  curve?: OkmsServiceKeyCurve;
  size?: OkmsServiceKeySize;
  operations: OkmsServiceKeyOperations[];
  type: OkmsKeyTypes;
};
```

### `OkmsServiceKeyReference`

Reference data describing what key configurations are available for a region:

```typescript
type OkmsServiceKeyReference = {
  sizes: OkmsServiceKeyReferenceSize[];
  default: boolean;
  type: OkmsKeyTypes;
  curves: OkmsServiceKeyReferenceCurve[];
  operations: OkmsServiceKeyReferenceOperations[];
};

type OkmsServiceKeyReferenceSize = {
  default: boolean;
  value: OkmsServiceKeyTypeOctSize & OkmsServiceKeyTypeRSASize;
};

type OkmsServiceKeyReferenceCurve = {
  default: boolean;
  value: OkmsServiceKeyCurve;
};

type OkmsServiceKeyReferenceOperations = {
  default: boolean;
  value: OkmsServiceKeyOperations[];
};
```

**Source:** `types/okmsServiceKeyReference.type.ts`
