# Credentials Data

This document covers all data fetching and mutation related to KMIP credentials (mTLS certificates) within an OKMS instance.

**Module:** Key Management Service (`src/modules/key-management-service/data/`)

---

## Endpoints (API v2)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource/{okmsId}/credential` | `getOkmsCredentials(okmsId)` | `OkmsCredential[]` |
| GET | `okms/resource/{okmsId}/credential/{credentialId}` | `getOkmsCredential({ okmsId, credentialId })` | `OkmsCredential` |
| POST | `okms/resource/{okmsId}/credential` | `createOkmsCredential({ okmsId, data })` | `OkmsCredential` |
| DELETE | `okms/resource/{okmsId}/credential/{credentialId}` | `deleteOkmsCredential({ okmsId, credentialId })` | `OkmsCredential` |

**Source:** `data/api/okmsCredential.ts`

---

## React Query Hooks

### Queries

| Hook | Parameters | Query Key | Returns |
|------|------------|-----------|---------|
| `useOkmsCredentials` | `{ okmsId, deletingCredentialId? }` | `['get/okms/resource/{okmsId}/credential']` | `OkmsCredential[]` |
| `useOkmsCredentialById` | `{ okmsId, credentialId }` | `['get/okms/resource/{okmsId}/credential/{credentialId}']` | `OkmsCredential` |

`useOkmsCredentials` supports a `deletingCredentialId` parameter. When provided, it enables a refetch interval to poll the credential list while a deletion is in progress (credential status transitions through `DELETING`).

**Source:** `data/hooks/useOkmsCredential.ts`

### Mutations

| Hook | Parameters | Operation | Invalidates |
|------|------------|-----------|-------------|
| `useCreateOkmsCredential` | `{ okmsId, onSuccess, onError }` | POST create credential | Credential list |
| `useDeleteOkmsCredential` | `{ onSuccess, onError }` | DELETE credential | Credential list |

**Sources:** `data/hooks/useCreateOkmsCredential.ts`, `data/hooks/useDeleteOkmsCredential.ts`

---

## Query Keys

```typescript
getOkmsCredentialsQueryKey(okmsId)
  // ['get/okms/resource/{okmsId}/credential']

getOkmsCredentialQueryKey({ okmsId, credentialId })
  // ['get/okms/resource/{okmsId}/credential/{credentialId}']

createOkmsCredentialQueryKey({ okmsId })
  // ['post/okms/resource/{okmsId}/credential/create']
```

---

## Types

### `OkmsCredential`

```typescript
type OkmsCredential = {
  createdAt: string;
  id: string;
  name: string;
  certificatePEM?: string;
  description?: string;
  expiredAt: string;
  fromCSR: boolean;
  identityURNs: string[];
  status: OkmsCredentialStatus;
  privateKeyPEM?: string;
  certificateType: CertificateType;
};
```

`certificatePEM` and `privateKeyPEM` are only present immediately after creation. They are not returned on subsequent GET requests.

**Source:** `types/okmsCredential.type.ts`

### `OkmsCredentialStatus`

```typescript
enum OkmsCredentialStatus {
  creating = 'CREATING',
  deleting = 'DELETING',
  error = 'ERROR',
  expired = 'EXPIRED',
  ready = 'READY',
}
```

### `CertificateType`

```typescript
type CertificateType = 'ECDSA' | 'RSA';
```

### `OkmsCredentialCreation`

POST payload for creating a new credential:

```typescript
type OkmsCredentialCreation = {
  name: string;
  identityURNs: string[];
  description?: string | null;
  validity?: number;
  csr?: string;
  certificateType?: CertificateType;
};
```

When `csr` is provided, the certificate is generated from the user's Certificate Signing Request. When omitted, the server generates both the certificate and private key.

If `certificateType` is omitted, the server defaults based on whether a CSR was provided.

### `DeleteOkmsCredentialParams`

```typescript
type DeleteOkmsCredentialParams = {
  okmsId: string;
  credentialId: string;
};
```

**Source:** `data/api/okmsCredential.ts`
