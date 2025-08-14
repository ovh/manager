# strip-version-test — OVHcloud Manager Application

> Flavor: **generic**  
> Universe: **Manager / Manager**

> Generated via OVHcloud Manager App Generator — flavor-aware template for PCI, Hub, Web, Zimbra, and more.

## Overview

This application is a single-page React app integrated into the OVHcloud Manager ecosystem.  
It is fully **flavor-driven**, meaning routing, tracking, and API configuration are all centralized in [`src/App.constants.ts`](src/App.constants.ts).  
The same codebase supports multiple product universes (PCI, Hub, Web, Zimbra) by changing only constants.

---

## 📂 Folder Structure

```
src/
 ├─ App.constants.ts       # Flavor config: routing, tracking, API settings
 ├─ routes/                # Main and sub-route definitions
 ├─ pages/                 # Page components (Dashboard, Onboarding, Settings, etc.)
 ├─ components/            # Shared UI components
 ├─ client/                # API client (mock/live, v2, v6Iceberg)
 ├─ assets/                # Public assets (images, translations, etc.)
 ├─ types/                 # TypeScript type definitions
 └─ index.tsx              # App bootstrap
```

---

## ⚙ Configuration

### `App.constants.ts`

Single source of truth for all app-specific values:

```ts
export const appName = 'pci-full-demo';

export const APP_FEATURES = {
  isPci: true,
  routeFlavor: 'pci',
  onboardingApi: 'v2',
  listingApi: 'v6Iceberg',
  tracking: {
    level2ByRegion: {
      EU: { level2: '120' },
      CA: { level2: '120' },
      US: { level2: '120' },
    },
    universe: 'Public_Cloud',
    subUniverse: 'Compute',
    appNameForTracking: 'pci-full-demo',
  },
};
```

Changing these values updates:
- **Routing root path** (`/pci/projects/:projectId/${appName}` or equivalent)
- **Tracking constants** (`LEVEL2`, `UNIVERSE`, `SUB_UNIVERSE`, `APP_NAME`)
- **API mode** for onboarding and listing

---

## 📍 Routing

Routes are defined in [`src/routes/`](src/routes).  
The root path is computed from `APP_FEATURES.routeFlavor`:

- **PCI** → `/pci/projects/:projectId/${appName}`
- **Platform Param** → `/${platformId}`
- **Default** → `/${appName}`

**Example tabs in Dashboard:**
```ts
export const subRoutes = {
  overview: '',
  settings: 'settings',
  quota: 'quota', // PCI only
};
```

**Dashboard tab config** is centralized to avoid circular imports.

---

## 📊 Tracking Constants

Defined in [`src/tracking.playbook-constants.ts`](src/tracking.constants.ts):

```ts
export const LEVEL2 = {
  EU: { config: { level2: APP_FEATURES.tracking.level2ByRegion.EU.level2 } },
  CA: { config: { level2: APP_FEATURES.tracking.level2ByRegion.CA.level2 } },
  US: { config: { level2: APP_FEATURES.tracking.level2ByRegion.US.level2 } },
};

export const UNIVERSE = APP_FEATURES.tracking.universe;
export const SUB_UNIVERSE = APP_FEATURES.tracking.subUniverse;
export const APP_NAME = APP_FEATURES.tracking.appNameForTracking ?? appName;
```

These values are injected dynamically from `App.constants.ts`.

---

## 🔌 API Client

Implemented in [`src/client/index.ts`](src/client/index.ts).

Supports **mock** and **live** modes:
- **mock** → returns static payloads (for local dev)
- **live** → placeholder for real API calls (`v2`, `v6Iceberg`)

Example **V6 Iceberg live** usage:
```ts
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
const { data, status, totalCount } = await fetchIcebergV6<MyType>({
  route: '/cloud/project/...',
  page: 1,
  pageSize: 50,
});
```

Example **V2 live** usage:
```ts
import { v2 } from '@ovh-ux/manager-core-api';
const { data } = await v2.get<MyType>('/onboarding/config');
```

---

## 🚀 Development

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Build for production
yarn build

# Lint
yarn lint:modern

# Test
yarn test
```

The app runs at:
```
http://localhost:9000/#/<rootPath>
```
Example for PCI:
```
http://localhost:9000/#/public-cloud/pci/projects/:projectId/${appName}
```

---

## 📚 Useful Links

- [Manager React Shell Client](https://github.com/ovh/manager)
- [React Router Docs](https://reactrouter.com/)
- [Iceberg API Guide](https://github.com/ovh/manager-core-api)
- [OVHcloud Public API Explorer](https://api.ovh.com/)

---

**Generated with ❤️ by OVHcloud Manager App Generator**
