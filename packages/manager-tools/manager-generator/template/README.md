# {{appNameKebab}} — OVHcloud Manager Application

> Universe: **{{trackingUniverse}} / {{trackingSubUniverse}}**

## Overview

This application is a single-page React app integrated into the OVHcloud Manager ecosystem.  
It is fully **flavor-driven**, meaning routing, tracking, and API configuration are centralized in [`src/App.constants.ts`](src/App.constants.ts).  
The same codebase supports multiple product universes (PCI, Hub, Web, Zimbra) by changing only constants.

---

## ⚙ Configuration

### `src/App.constants.ts`

Single source of truth for app identity, API strategy, feature flags, and tracking. Tokens like `app-gen-test` and `Hub` are filled by the generator.

```ts
export const appName = '{{appNameKebab}}';

export const APP_FEATURES = {
  // API strategies
  listingApi: '{{listingApi}}' as ListingApi,      // 'v6Iceberg' | 'v2' | 'v6'
  dashboardApi: '{{dashboardApi}}' as DashboardApi, // 'v6' | 'v2'

  // Flavor + routing
  isPci: '{{isPci}}',
  routeFlavor: '{{routeFlavor}}' as const,         // 'pci' | 'generic' | 'platformParam'
  basePrefix: '',                                  // optional shell prefix
  serviceParam: 'id',                    // service route param (no ':' in final URL)
  platformParam: 'id',                    // platform route param
  appSlug: appName,                                // for PCI, use short slug (e.g. "billing")

  // Tracking
  tracking: {
    level2ByRegion: {
      EU: { level2: '{{trackingLevel2}}' },
      CA: { level2: '{{trackingLevel2}}' },
      US: { level2: '{{trackingLevel2}}' },
    },
    universe: '{{trackingUniverse}}',
    subUniverse: '{{trackingSubUniverse}}',
    appNameForTracking: appName,
  },
} as const;
```

Changing these values updates:
- **Root route** computation (see Routing below)
- **Tracking constants** (`LEVEL2`, `UNIVERSE`, `SUB_UNIVERSE`, `APP_NAME`)
- **API strategy** for onboarding and listing

---

## 📍 Routing

Route helpers and constants live in [`src/routes/Routes.utils.ts`](src/routes/Routes.utils.ts).  
The **root path** is computed from `APP_FEATURES.routeFlavor` (optional `basePrefix` is prepended):

- **'pci'** → `/[basePrefix]/pci/projects/:projectId/{appSlug}`
- **'generic'** (default) → `/[basePrefix]/{appSlug}`

High-level routes (relative to the root) are exposed via `urls`:
```ts
export const urls = {
  root: getRoot(),                    // flavor-aware root
  dashboard: `dashboard/:serviceName?`,
  onboarding: 'onboarding',
} as const;
```

**Dashboard subroutes** are centralized to avoid circular imports:
```ts
export const subRoutes = {
  overview: '',           // default tab
  settings: 'settings',
  ...(isPci ? { quota: 'quota' } : {}),
} as const;
```

The route tree is defined in [`src/routes/Routes.tsx`](src/routes/Routes.tsx) using `React.lazy` and integrates the Manager `ErrorBoundary` (with `redirectionApp` from `Routes.utils.ts`).

---

## 📊 Tracking Constants

Defined in [`src/Tracking.constants.ts`](src/Tracking.constants.ts) and **resolved from `App.constants.ts`**:

```ts
export const LEVEL2 = {
  EU: { config: { level2: APP_FEATURES.tracking.level2ByRegion.EU.level2 } },
  CA: { config: { level2: APP_FEATURES.tracking.level2ByRegion.CA.level2 } },
  US: { config: { level2: APP_FEATURES.tracking.level2ByRegion.US.level2 } },
} as const;

export const UNIVERSE = APP_FEATURES.tracking.universe;
export const SUB_UNIVERSE = APP_FEATURES.tracking.subUniverse;
export const APP_NAME = APP_FEATURES.tracking.appNameForTracking ?? appName;
```

These values are injected into the shell from `src/index.tsx`.

---

## 🔌 API Layer (Facade)

**Where:** `src/data/api/commons` and `src/data/api/hooks`

- `Client.api.ts` — typed facade over `@ovh-ux/manager-core-api` (v2/v6, Iceberg helpers)
- `Client.utils.ts` — route interpolation & normalization (e.g., `resolveListingRoute()`)
- `useResources.ts` — hook facade that selects the right listing strategy based on `APP_FEATURES.listingApi`

**Examples**

Listing (one page via Iceberg v6 / v2 / plain v6 — chosen by `APP_FEATURES.listingApi`):
```ts
import { getListingPage } from '@/data/api/commons/Client.api';

const { data, totalCount, status } = await getListingPage<MyType>({
  page: 1,
  pageSize: 50,
  sortBy: 'creationDate',
  sortDesc: true,
  // optional: route override, filters, cursor (for v2), etc.
});
```

Onboarding (with mock fallback when `API_DATA_MODE === 'mock'`):
```ts
import { getOnboardingConfig } from '@/data/api/commons/Client.api';

const config = await getOnboardingConfig();
```

If you need to work directly with Iceberg helpers:
```ts
import { fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
```

---

## 🚀 Development

From the root:

```bash
# Install dependencies
yarn install

# Start dev server (Vite)
yarn start

# Build for production
yarn build

# Lint
yarn lint:modern
yarn lint:modern:fix

# Test
yarn test
yarn test:coverage
```

The app uses **hash-based routing**. Open the dev server URL printed by Vite (default `http://localhost:5173/`) and navigate under:
```
#/[flavor-aware root from Routes.utils.ts]
```
For example (PCI flavor):
```
#/pci/projects/:projectId/app-gen-test
```

---

## 📚 Useful Links

- Manager React Shell Client: https://github.com/ovh/manager
- React Router Docs: https://reactrouter.com/
- Iceberg API Guide: https://github.com/ovh/manager-core-api
- OVHcloud Public API Explorer: https://api.ovh.com/

---

**Generated with ❤️ by OVHcloud Manager App Generator**
