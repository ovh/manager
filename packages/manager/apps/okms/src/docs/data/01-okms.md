# OKMS Instance Data

This document covers all data fetching and mutation related to OKMS instances, locations, regions, and the order catalog.

Data is split between:
- **Common** (`src/common/data/`) — locations, reference regions, order catalog
- **KMS module** (`src/modules/key-management-service/data/`) — OKMS resource CRUD, service info

---

## Endpoints

### OKMS Resources (API v2)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/resource` | `getOkmsList()` | `OKMS[]` |
| GET | `okms/resource/{okmsId}` | `getOkms(okmsId)` | `OKMS` |
| GET | `okms/resource/{okmsId}?publicCA=true` | `getOkmsPublicCa(okmsId)` | `OkmsPublicCa` |

**Source:** `src/modules/key-management-service/data/api/okms.ts`

### Service Management (API v6)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `/services?resourceName={okmsId}` | `getOkmsServiceId(okmsId)` | `number[]` |
| GET | `/services/{serviceId}` | `getServiceInfos(okmsId)` | `ServiceDetails` |
| PUT | `/services/{serviceId}` | `updateOkmsName({ serviceId, displayName })` | `ServiceDetails` |

`getServiceInfos` is a composed call: it first resolves the `serviceId` via `getOkmsServiceId`, then fetches the service details.

**Source:** `src/modules/key-management-service/data/api/okmsService.ts`

### Locations (API v2)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `location` | `getLocations()` | `Location[]` |

**Source:** `src/common/data/api/location.ts`

### Reference Regions (API v2)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `okms/reference/regions` | `getReferenceRegions()` | `ReferenceRegion[]` |

**Source:** `src/common/data/api/referenceRegions.ts`

### Order Catalog (API v6)

| Method | Endpoint | Function | Returns |
|--------|----------|----------|---------|
| GET | `/order/catalog/public/okms?ovhSubsidiary={sub}` | `getOrderCatalogOkms(ovhSubsidiary)` | `OkmsCatalog` |

**Source:** `src/common/data/api/orderCatalogOkms.ts`

---

## React Query Hooks

### Queries

| Hook | Parameters | Query Key | Returns | Source |
|------|------------|-----------|---------|--------|
| `useOkmsById` | `okmsId: string` | `['okms', okmsId]` | `OKMS` | KMS `hooks/useOkms.ts` |
| `useOkmsList` | `options?` | `['okms']` | `OKMS[]` | KMS `hooks/useOkms.ts` |
| `useOkmsDatagridList` | `{ pageSize? }` | `['okms', 'datagrid']` | paginated `OKMS[]` | KMS `hooks/useOkms.ts` |
| `useLocations` | — | `['location']` | `Location[]` | Common `hooks/useLocation.ts` |
| `useReferenceRegions` | — | `['okms', 'reference', 'regions']` | `ReferenceRegion[]` | Common `hooks/useReferenceRegions.ts` |
| `useOrderCatalogOkms` | — | `['order/catalog/public/okms', ovhSubsidiary]` | `OkmsCatalog` | Common `hooks/useOrderCatalogOkms.ts` |

`useOrderCatalogOkms` automatically reads `ovhSubsidiary` from the shell context. It uses `retry: false` and `keepPreviousData: true`.

`useOkmsDatagridList` uses `useDataApi` for Iceberg-based server-side pagination.

### Mutations

| Hook | Parameters | Mutates | Invalidates | Source |
|------|------------|---------|-------------|--------|
| `useUpdateOkmsName` | `{ okms, onSuccess, onError }` | PUT `/services/{serviceId}` | OKMS detail query (with optimistic update + delayed invalidation) | KMS `hooks/useUpdateOkmsName.ts` |

---

## Query Keys

```typescript
// OKMS resources
okmsQueryKeys.list           // ['okms']
okmsQueryKeys.listDatagrid   // ['okms', 'datagrid']
okmsQueryKeys.detail(okmsId) // ['okms', okmsId]

// Locations
locationQueryKeys.list       // ['location']

// Reference regions
referenceRegionsQueryKey     // ['okms', 'reference', 'regions']

// Service management
updateOkmsNameQueryKey()        // ['put/services/displayName']
getOkmsServiceIdQueryKey(okmsId) // ['get/okms/services', okmsId]
```

---

## Types

### `OKMS`

```typescript
type OKMS = {
  iam: IAM;
  id: string;
  kmipEndpoint: string;
  kmipObjectCount: number;
  kmipRsaEndpoint: string;
  region: string;
  restEndpoint: string;
  secretCount: number;
  secretVersionCount: number;
  serviceKeyCount: number;
  swaggerEndpoint: string;
};
```

**Source:** `src/modules/key-management-service/types/okms.type.ts`

### `OkmsPublicCa`

```typescript
type OkmsPublicCa = {
  publicCA: string;
  publicRsaCA: string;
};
```

**Source:** `src/modules/key-management-service/types/okms.type.ts`

### `OkmsServiceState`

```typescript
type OkmsServiceState = 'EXPIRED' | 'IN_CREATION' | 'OK' | 'SUSPENDED';
```

**Source:** `src/modules/key-management-service/types/okms.type.ts`

### `IAM`

```typescript
type IAM = {
  displayName: string;
  id: string;
  urn: string;
  tags?: Record<string, string>;
  state?: OkmsServiceState;
};
```

**Source:** `src/modules/key-management-service/types/okms.type.ts`

### `Location`

```typescript
type Location = {
  availabilityZones: string[];
  cardinalPoint: CardinalPoint;
  cityCode: string;
  cityLatitude: number;
  cityLongitude: number;
  cityName: string;
  code: string;
  countryCode: string;
  countryName: string;
  geographyCode: GeographyCode;
  geographyName: string;
  location: string;
  name: string;
  openingYear: number;
  specificType: SpecificType;
  type: LocationType;
};

type CardinalPoint =
  | 'CENTRAL' | 'EAST' | 'NORTH' | 'NORTHEAST' | 'NORTHWEST'
  | 'SOUTH' | 'SOUTHEAST' | 'SOUTHWEST' | 'WEST';

type SpecificType = 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
type LocationType = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
type GeographyCode = string;
```

**Source:** `src/common/types/location.type.ts`

### `ReferenceRegion`

```typescript
type ReferenceRegion = {
  certifications: string[];
  id: string;
  kmipEndpoint: string;
  restEndpoint: string;
  type: LocationType;
};
```

**Source:** `src/common/types/referenceRegions.type.ts`

### `OkmsCatalog`

```typescript
type OkmsCatalog = {
  plans: OkmsCatalogPlan[];
  addons: OkmsCatalogAddon[];
};

type OkmsCatalogPlan = {
  planCode: string;
  configurations: OkmsCatalogPlanConfiguration[];
  pricings: CatalogPricing[];
};

type OkmsCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type OkmsCatalogAddon = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  pricings: CatalogPricing[];
};

type CatalogPricing = {
  price: number;
  tax: number;
  phase: number;
  interval: number;
  intervalUnit: IntervalUnit; // from @ovh-ux/muk
};
```

**Source:** `src/common/types/orderCatalogOkms.type.ts`

### `ErrorResponse`

Shared error type used by all React Query hooks:

```typescript
type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};
```

**Source:** `src/common/types/api.type.ts`

### `ServiceDetails`

Imported from `@ovh-ux/manager-module-common-api`. Represents the v6 `/services/{id}` response.

### `UpdateOkmsNameParams`

```typescript
type UpdateOkmsNameParams = {
  serviceId: number;
  displayName: string;
};
```

**Source:** `src/modules/key-management-service/data/api/okmsService.ts`
