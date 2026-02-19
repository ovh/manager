# Identity Data

This document covers all data fetching related to IAM identities — users, groups, and service accounts (OAuth2 clients). These are used in the credential creation flow to associate identity URNs with KMIP credentials.

**Module:** Key Management Service (`src/modules/key-management-service/data/`)

---

## Endpoints (API v6)

### Users

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `me/identity/user` | `getIdentityUsersIds()` | `string[]` |
| GET | `me/identity/user/{userId}` | `getIdentityUser(userId)` | `IdentityUser` |

### Groups

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `me/identity/group` | `getIdentityGroupsIds()` | `string[]` |
| GET | `me/identity/group/{groupId}` | `getIdentityGroup(groupId)` | `IdentityGroup` |

### Service Accounts (OAuth2 Clients)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `me/api/oauth2/client` | `getIdentityServiceAccountsIds()` | `string[]` |
| GET | `me/api/oauth2/client/{serviceAccountId}` | `getIdentityServiceAccount(serviceAccountId)` | `IdentityOauthClient` |

All identity endpoints follow a two-step pattern: first fetch a list of IDs, then fetch each entity by ID.

**Source:** `data/api/identity.ts`

---

## React Query Hooks

### Queries

| Hook | Returns | Description |
|------|---------|-------------|
| `useIdentityUserList()` | `{ combinedData, isLoading, isError, error, identitiesInError }` | Fetches all user IDs then resolves each user's details |
| `useIdentityGroupList()` | `{ combinedData, isLoading, isError, error, identitiesInError }` | Fetches all group IDs then resolves each group's details |
| `useIdentityServiceAccountList()` | `{ combinedData, isLoading, isError, error, identitiesInError }` | Fetches all OAuth2 client IDs then resolves each client's details |

All three hooks follow the same pattern:
1. Fetch the list of IDs (e.g., `getIdentityUsersIds()`)
2. For each ID, fetch the full entity (e.g., `getIdentityUser(userId)`)
3. Combine all results, tracking any individual fetch failures in `identitiesInError`

**Source:** `data/hooks/useIdentity.ts`

---

## Query Keys

```typescript
getIdentityUsersIdsQueryKey()
  // ['get/me/identity/user']

getIdentityUserQueryKey(userId)
  // ['get/me/identity/user/', userId]

getIdentityGroupsIdsQueryKey()
  // ['get/me/identity/group']

getIdentityGroupQueryKey(groupId)
  // ['get/me/identity/group/', groupId]

getIdentityServiceAccountsIdsQueryKey()
  // ['get/me/api/oauth2/client']

getIdentityServiceAccountQueryKey(serviceAccountId)
  // ['get/me/identity/service-account/', serviceAccountId]
```

---

## Types

### `IdentityUser`

```typescript
type IdentityUser = {
  creation: string;
  description: string;
  email: string;
  group: string;
  lastUpdate: string;
  login: string;
  passwordLastUpdate: string;
  status: IdentityStatus;
  urn: string;
};
```

**Source:** `types/identity.type.ts`

### `IdentityGroup`

```typescript
type IdentityGroup = {
  creation: string;
  defaultGroup: boolean;
  description: string | null;
  lastUpdate: string;
  name: string;
  role: IdentityGroupRole;
  urn: string;
};
```

### `IdentityOauthClient`

```typescript
type IdentityOauthClient = {
  callbackUrls: string[];
  clientId: string;
  createdAt: string;
  description: string;
  flow: IdentityOauthClientFlow;
  identity: string | null;
  name: string;
};
```

### `IdentityStatus`

```typescript
enum IdentityStatus {
  disabled = 'DISABLED',
  ok = 'OK',
  password_change_required = 'PASSWORD_CHANGE_REQUIRED',
}
```

### `IdentityGroupRole`

```typescript
enum IdentityGroupRole {
  admin = 'ADMIN',
  none = 'NONE',
  regular = 'REGULAR',
  unprivileged = 'UNPRIVILEGED',
}
```

### `IdentityOauthClientFlow`

```typescript
enum IdentityOauthClientFlow {
  authorization_code = 'AUTHORIZATION_CODE',
  client_credentials = 'CLIENT_CREDENTIALS',
}
```

### Shared Types

```typescript
type IdentityType = 'user' | 'account' | 'group' | 'credential';
type IdentityRegion = 'eu' | 'ca' | 'us' | 'labeu';
type IdentityEntity = 'identity';

type IdentityObject = {
  version: number;
  region: IdentityRegion;
  entity: IdentityEntity;
  type: IdentityType;
  account: string;
  id: string | undefined;
  urn: string;
};

type IdentitiesType = IdentityUser | IdentityGroup | IdentityOauthClient;
```
