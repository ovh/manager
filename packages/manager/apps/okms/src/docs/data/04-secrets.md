# Secrets Data

This document covers all data fetching and mutation related to secrets, secret versions, and secret configuration within an OKMS instance.

**Module:** Secret Manager (`src/modules/secret-manager/data/`)

---

## Endpoints (API v2)

### Secrets

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource/{okmsId}/secret` | Iceberg pagination via `useDataApi` | paginated `Secret[]` |
| GET | `okms/resource/{okmsId}/secret/{path}` | `getSecret(okmsId, secretPath)` | `Secret` |
| GET | `okms/resource/{okmsId}/secret/{path}?includeData=true` | `getSecretWithData(okmsId, secretPath)` | `SecretWithData` |
| POST | `okms/resource/{okmsId}/secret` | `createSecret({ okmsId, data })` | `CreateSecretResponse` |
| PUT | `okms/resource/{okmsId}/secret/{path}?cas={cas}` | `updateSecret({ okmsId, path, cas?, data })` | `UpdateSecretResponse` |
| DELETE | `okms/resource/{okmsId}/secret/{path}` | `deleteSecret({ okmsId, secretPath })` | `void` |

Secret paths are URL-encoded with `encodeURIComponent()` in all requests.

The `cas` (Check-And-Set) query parameter is optional and enables optimistic concurrency control.

**Source:** `data/api/secrets.ts`

### Secret Versions

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource/{okmsId}/secret/{path}/version` | Iceberg pagination via `useDataApi` | paginated `SecretVersion[]` |
| GET | `okms/resource/{okmsId}/secret/{path}/version/{id}?includeData=true` | `getSecretVersionWithData(okmsId, path, versionId)` | `SecretVersionWithData` |
| POST | `okms/resource/{okmsId}/secret/{path}/version?cas={cas}` | `createSecretVersion({ okmsId, path, data, cas? })` | `SecretVersion` |
| PUT | `okms/resource/{okmsId}/secret/{path}/version/{version}` | `updateSecretVersion({ okmsId, path, version, state })` | `SecretVersion` |

**Source:** `data/api/secretVersions.ts`

### Secret Configuration

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource/{okmsId}/secretConfig` | `getSecretConfigOkms(okmsId)` | `SecretConfig` |
| PUT | `okms/resource/{okmsId}/secretConfig` | `updateSecretConfigOkms({ okmsId, secretConfig })` | `SecretConfig` |

**Source:** `data/api/secretConfigOkms.ts`

### Reference Configuration

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `/okms/reference/secretConfig?region={regionId}` | `getSecretConfigReference(regionId)` | `SecretConfigReference` |

Returns default configuration constraints for a given region.

**Source:** `data/api/secretReference.ts`

---

## React Query Hooks

### Queries

| Hook | Parameters | Query Key | Returns | Notes |
|------|------------|-----------|---------|-------|
| `useSecretList` | `{ okmsId, pageSize? }` | `['secret', okmsId]` | paginated `Secret[]` | Iceberg pagination via `useDataApi` |
| `useSecret` | `okmsId, secretPath` | `['secret', okmsId, secretPath]` | `Secret` | Metadata only |
| `useSecretWithData` | `okmsId, secretPath` | `['secret', okmsId, secretPath, 'with-data']` | `SecretWithData` | `gcTime: 0` — not cached |
| `useSecretVersionList` | `{ okmsId, path, pageSize? }` | `['secret', okmsId, path, 'versions']` | paginated `SecretVersion[]` | Iceberg, `disableCache: true` |
| `useSecretVersionWithData` | `{ okmsId, secretPath, version }` | `['secret', okmsId, path, 'versions', versionId]` | `SecretVersionWithData` | `gcTime: 0`, uses `skipToken` when `version` is undefined |
| `useSecretConfigOkms` | `okmsId` | `['secret', okmsId, 'config']` | `SecretConfig` | |
| `useSecretConfigReference` | `regionId?` | `['secret', 'config', 'reference', regionId]` | `SecretConfigReference` | Uses `skipToken` when `regionId` is undefined |

**Sources:** `data/hooks/useSecretList.ts`, `data/hooks/useSecret.ts`, `data/hooks/useSecretVersion.ts`, `data/hooks/useSecretVersionList.ts`, `data/hooks/useSecretConfigOkms.ts`, `data/hooks/useSecretConfigReference.ts`

### Mutations

| Hook | Parameters | Operation | Cache Invalidation |
|------|------------|-----------|-------------------|
| `useCreateSecret` | `options?` | POST create secret | — |
| `useUpdateSecret` | — | PUT update secret | Invalidates detail query |
| `useDeleteSecret` | — | DELETE secret | Removes detail, detailWithData, and versions queries; invalidates list; shows success notification |
| `useCreateSecretVersion` | — | POST create version | Invalidates list, detail, and versions queries |
| `useUpdateSecretVersion` | — | PUT update version state | Invalidates versions list |
| `useUpdateSecretConfigOkms` | — | PUT update secret config | Invalidates config query |

**Sources:** `data/hooks/useCreateSecret.ts`, `data/hooks/useUpdateSecret.ts`, `data/hooks/useDeleteSecret.ts`, `data/hooks/useCreateSecretVersion.ts`, `data/hooks/useUpdateSecretVersion.ts`, `data/hooks/useUpdateSecretConfigOkms.ts`

---

## Query Keys

```typescript
// Secrets
secretQueryKeys.list(okmsId)
  // ['secret', okmsId]
secretQueryKeys.detail(okmsId, secretPath)
  // ['secret', okmsId, secretPath]
secretQueryKeys.detailWithData(okmsId, secretPath)
  // ['secret', okmsId, secretPath, 'with-data']

// Secret Versions
secretVersionsQueryKeys.list(okmsId, path)
  // ['secret', okmsId, path, 'versions']
secretVersionsQueryKeys.detailWithData(okmsId, path, versionId)
  // ['secret', okmsId, path, 'versions', versionId]

// Secret Config
secretConfigOkmsQueryKey(okmsId)
  // ['secret', okmsId, 'config']
secretReferenceQueryKeys.config(regionId)
  // ['secret', 'config', 'reference', regionId]
```

---

## Cache Strategy

- **`useSecretWithData`** and **`useSecretVersionWithData`** use `gcTime: 0` to prevent caching sensitive secret data in memory.
- **`useSecretVersionList`** uses `disableCache: true` to always fetch fresh version lists.
- **Conditional queries** use `skipToken` to skip execution when required parameters are not yet available.
- **CAS support**: `updateSecret` and `createSecretVersion` accept an optional `cas` parameter for optimistic concurrency control via query string.

---

## Types

### `Secret`

```typescript
type Secret = {
  path: string;
  version?: SecretVersion;
  metadata: SecretMetadata;
  iam: IAM;
};
```

**Source:** `types/secret.type.ts`

### `SecretWithData`

```typescript
type SecretWithData = Omit<Secret, 'version'> & {
  version?: SecretVersionWithData;
};
```

### `SecretMetadata`

```typescript
type SecretMetadata = {
  casRequired: boolean;
  createdAt: string;
  currentVersion?: number;
  customMetadata?: Record<string, string>;
  deactivateVersionAfter: string;
  maxVersions: number;
  oldestVersion: number;
  updatedAt?: string;
};
```

### `SecretVersion`

```typescript
type SecretVersion = {
  id: number;
  state: SecretVersionState;
  createdAt: string;
  deactivatedAt?: string;
};
```

### `SecretVersionWithData`

```typescript
type SecretVersionWithData = SecretVersion & SecretVersionDataField;

type SecretVersionDataField = {
  data: SecretData;
};

type SecretData = unknown;
```

`SecretData` is typed as `unknown` because the API schema defines it as `Any`. In practice it holds JSON key-value pairs.

### `SecretVersionState`

```typescript
type SecretVersionState = 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
```

### `SecretConfig`

Instance-level default configuration for secrets:

```typescript
type SecretConfig = {
  casRequired: boolean;
  deactivateVersionAfter: string;
  maxVersions: number;
};
```

### `SecretConfigReference`

Region-level configuration constraints:

```typescript
type SecretConfigReference = {
  casRequired: boolean;
  maxVersions: number;
};
```

### API Params and Payloads

#### Create Secret

```typescript
type createSecretMetadata = Partial<
  Pick<SecretMetadata, 'casRequired' | 'customMetadata' | 'deactivateVersionAfter' | 'maxVersions'>
>;

type CreateSecretBody = {
  path: string;
  version: SecretVersionDataField;
  metadata?: createSecretMetadata;
};

type CreateSecretResponse = Pick<Secret, 'path' | 'metadata'>;

type CreateSecretParams = {
  okmsId: string;
  data: CreateSecretBody;
};
```

#### Update Secret

```typescript
type UpdateSecretBody = {
  metadata?: Partial<
    Pick<SecretMetadata, 'casRequired' | 'customMetadata' | 'deactivateVersionAfter' | 'maxVersions'>
  >;
  version?: SecretVersionDataField;
};

type UpdateSecretResponse = Pick<Secret, 'path' | 'metadata'>;

type UpdateSecretParams = {
  okmsId: string;
  path: string;
  cas?: number;
  data: UpdateSecretBody;
};
```

#### Delete Secret

```typescript
type DeleteSecretParams = {
  okmsId: string;
  secretPath: string;
};
```

#### Create Secret Version

```typescript
type CreateSecretVersionBody = SecretVersionDataField;
type CreateSecretVersionResponse = SecretVersion;

type CreateSecretVersionParams = {
  okmsId: string;
  path: string;
  data: CreateSecretVersionBody;
  cas?: number;
};
```

#### Update Secret Version

```typescript
type UpdateSecretVersionBody = SecretVersion['state']; // SecretVersionState
type UpdateSecretVersionResponse = SecretVersion;

type UpdateSecretVersionParams = {
  okmsId: string;
  path: string;
  version: number;
  state: UpdateSecretVersionBody;
};
```

#### Secret Config

```typescript
type SecretConfigParams = {
  okmsId: string;
  secretConfig: Partial<SecretConfig>;
};

type SecretConfigResponse = SecretConfig;
```
