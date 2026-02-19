# OKMS App — Data Layer Documentation

This directory documents all API endpoints, React Query hooks, and TypeScript types used in the OKMS application's data layer.

The app follows a **two-tier data architecture**: API functions (`data/api/`) make raw HTTP calls via `@ovh-ux/manager-core-api`, and React Query hooks (`data/hooks/`) wrap those calls for component consumption.

---

## Data Sources

| Layer | Location | Description |
|-------|----------|-------------|
| Common | `src/common/data/` | Shared data used by both KMS and Secret Manager modules |
| KMS | `src/modules/key-management-service/data/` | OKMS instances, service keys, credentials, identity, ordering |
| Secret Manager | `src/modules/secret-manager/data/` | Secrets, secret versions, secret configuration |

---

## Table of Contents

| File | Scope | Description |
|------|-------|-------------|
| [01-okms.md](./01-okms.md) | Common + KMS | OKMS instances, locations, regions, catalog, and service management |
| [02-service-keys.md](./02-service-keys.md) | KMS | Cryptographic service keys — CRUD, reference data, and key formats |
| [03-credentials.md](./03-credentials.md) | KMS | KMIP credentials — CRUD and certificate management |
| [04-secrets.md](./04-secrets.md) | Secret Manager | Secrets and versions — CRUD, versioning, and configuration |
| [05-identity.md](./05-identity.md) | KMS | IAM identity resolution — users, groups, and service accounts |
| [06-ordering.md](./06-ordering.md) | KMS | OKMS instance ordering — cart creation and checkout |

---

## API Client

All API calls use `@ovh-ux/manager-core-api` which exposes two base clients:

- **`apiClient.v2`** — OVHcloud API v2 (used for OKMS resource endpoints)
- **`apiClient.v6`** — OVHcloud API v6 (used for legacy service, identity, and catalog endpoints)

---

## Endpoint Summary

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| GET | `/okms/resource` | KMS | List all OKMS instances |
| GET | `/okms/resource/{okmsId}` | KMS | Get OKMS instance |
| GET | `/okms/resource/{okmsId}?publicCA=true` | KMS | Get OKMS public CA certificates |
| GET | `/okms/resource/{okmsId}/serviceKey` | KMS | List service keys |
| GET | `/okms/resource/{okmsId}/serviceKey/{keyId}` | KMS | Get service key |
| POST | `/okms/resource/{okmsId}/serviceKey` | KMS | Create service key |
| PUT | `/okms/resource/{okmsId}/serviceKey/{keyId}` | KMS | Update service key |
| DELETE | `/okms/resource/{okmsId}/serviceKey/{keyId}` | KMS | Delete service key |
| GET | `/okms/resource/{okmsId}/credential` | KMS | List credentials |
| GET | `/okms/resource/{okmsId}/credential/{credentialId}` | KMS | Get credential |
| POST | `/okms/resource/{okmsId}/credential` | KMS | Create credential |
| DELETE | `/okms/resource/{okmsId}/credential/{credentialId}` | KMS | Delete credential |
| GET | `/okms/resource/{okmsId}/secret/{path}` | Secret Manager | Get secret |
| GET | `/okms/resource/{okmsId}/secret/{path}?includeData=true` | Secret Manager | Get secret with data |
| POST | `/okms/resource/{okmsId}/secret` | Secret Manager | Create secret |
| PUT | `/okms/resource/{okmsId}/secret/{path}` | Secret Manager | Update secret |
| DELETE | `/okms/resource/{okmsId}/secret/{path}` | Secret Manager | Delete secret |
| GET | `/okms/resource/{okmsId}/secret/{path}/version/{id}` | Secret Manager | Get secret version |
| POST | `/okms/resource/{okmsId}/secret/{path}/version` | Secret Manager | Create secret version |
| PUT | `/okms/resource/{okmsId}/secret/{path}/version/{id}` | Secret Manager | Update secret version state |
| GET | `/okms/resource/{okmsId}/secretConfig` | Secret Manager | Get secret config |
| PUT | `/okms/resource/{okmsId}/secretConfig` | Secret Manager | Update secret config |
| GET | `/okms/reference/regions` | Common | List reference regions |
| GET | `/okms/reference/serviceKey` | KMS | Get service key reference |
| GET | `/okms/reference/secretConfig` | Secret Manager | Get secret config reference |
| GET | `/location` | Common | List locations |
| GET | `/order/catalog/public/okms` | Common | Get OKMS order catalog |
| GET | `/services` | KMS | Get service IDs |
| GET | `/services/{serviceId}` | KMS | Get service details |
| PUT | `/services/{serviceId}` | KMS | Update service display name |
| GET | `/me/identity/user` | KMS | List IAM user IDs |
| GET | `/me/identity/user/{userId}` | KMS | Get IAM user |
| GET | `/me/identity/group` | KMS | List IAM group IDs |
| GET | `/me/identity/group/{groupId}` | KMS | Get IAM group |
| GET | `/me/api/oauth2/client` | KMS | List OAuth2 service account IDs |
| GET | `/me/api/oauth2/client/{id}` | KMS | Get OAuth2 service account |
