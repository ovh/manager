---
title: React µApp Blueprint (pci-project-level)
last_update: 2025-10-20
tags: [react, blueprint, routing, tracking, iceberg, i18n, query, testing]
ai: true
---

## Goal
End-to-end blueprint to build a production-grade Manager React µApp matching the quality level of pci-project: routing + tracking, data layer (V6 + Iceberg), i18n, Query Client, MUK usage, testing, linting, and structure.

## Folder Structure (Enforced)
```
src/
  App.tsx               # MUK theme import + providers wiring
  main.tsx              # Shell init + RouterProvider
  i18n.ts               # i18next setup (namespaces)
  queryClient.ts        # React Query client factory
  routes/
    Routes.tsx          # Route objects + tracking handle
    Routes.constants.ts # url builders
    Routes.utils.ts     # getRoot(), lazyRouteConfig
  data/
    api/
      commons/Client.api.ts     # v6 + Iceberg facades
    hooks/
      use<Domain>.ts            # Query hooks, keys co-located
  components/            # Reusable UI blocks (by feature)
  pages/
    onboarding/
    listing/
    dashboard/
      <tabs>/
  types/                 # Domain types
  utils/                 # Formatting, adapters
public/translations/     # Namespaces
```

## Providers Wiring
```typescript
// App.tsx
import '@ovh-ux/muk/dist/style.css';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { initShellContext } from '@ovh-ux/manager-react-shell-client';
import { queryClient } from './queryClient';
import { router } from './routes/Routes';
import './i18n';

export default function App() {
  // Shell context is created in main.tsx and injected via Router
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

```typescript
// queryClient.ts
import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});
```

## Routing + Tracking

### Configuration of Routes

```typescript
// routes/Routes.tsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/muk';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));

export default (
  <>
    {/* Redirect container "/" → flavor-specific root */}
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Default landing → main listing page */}
      <Route
        index
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Alternative listing route */}
      <Route
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Other routes... */}
    </Route>
  </>
);
```

### Configuration of Constants

```typescript
// App.constants.ts
export const APP_FEATURES = {
  // ... other configs
  appSlug: '', // ⚠️ IMPORTANT: Leave empty to avoid double slug
  // ... other configs
} as const;

// Routes.constants.ts
export const urls = {
  root: getRoot(), // Returns /app-name
  listing: 'listing', // Relative route
} as const;
```

### Common Routing Issues

#### ❌ Double Slug in URL
**Problem**: URL becomes `/app-name/app-name/listing` instead of `/app-name/listing`

**Solution**:
```typescript
// App.constants.ts
export const APP_FEATURES = {
  appSlug: '', // ⚠️ Leave empty, not appName
  // ...
} as const;
```

#### ❌ Absolute vs Relative Navigation
**Problem**: `navigate('/listing')` doesn't work in a nested context

**Solution**:
```typescript
// ✅ Good: Relative navigation
navigate('listing', { replace: true });

// ❌ Avoid: Absolute navigation
navigate('/listing', { replace: true });
```

#### ❌ Complex SmartRedirect
**Problem**: Complex conditional redirection

**Solution**: Use listing page as home page with empty state handling

```typescript
// ✅ Good: Listing page as home
<Route index Component={ListingPage} />

// ❌ Avoid: Complex SmartRedirect
<Route index element={<SmartRedirectPage />} />
```

### Tracking Context
- Define level2/universe/subUniverse in app constants (see react-tracking.md).
- Use `useOvhTracking().trackCurrentPage()` in layout on location change.

## Data Layer Pattern (V6 + Iceberg)
Principles:
- Use `fetchIcebergV6` for listings: pagination, sorting, filters via headers.
- Use `v6.get/post/put/delete` for resource CRUD.
- API facades return a unified shape:
```ts
type ApiResult<T> = { data: T; status: 'success'|'error'; totalCount?: number; message?: string };
```

Example listing facade:
```typescript
import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export async function getServices(params: { page?: number; pageSize?: number; sortBy?: string; sortDesc?: boolean; }) {
  const { page = 1, pageSize = 20, sortBy, sortDesc } = params || {};
  const res = await fetchIcebergV6({ route: '/product/services', page, pageSize, sortBy, sortReverse: !!sortDesc });
  return { data: res.data, totalCount: res.totalCount, status: 'success' as const };
}
```

React Query hook:
```typescript
import { useQuery } from '@tanstack/react-query';

export const queryKeys = { services: (p: unknown) => ['services', p] as const };

export function useServices(params: { page: number; pageSize: number; sortBy?: string; sortDesc?: boolean; }) {
  return useQuery({
    queryKey: queryKeys.services(params),
    queryFn: () => getServices(params),
    select: (r) => ({ items: r.data ?? [], total: r.totalCount ?? 0, error: r.message, status: r.status }),
    staleTime: 300_000,
  });
}
```

## Datagrid Pattern (MUK + Iceberg)
- Source of truth: `useDatagrid` for pagination/sorting state.
- On manual mode, pass `items`, `totalItems`, `pagination`, `sorting`, `onPaginationChange`, `onSortChange`.
- Use `useDataApi` for infinite mode when suitable.

Minimal example:
```typescript
import { Datagrid, useDataGrid, ColumnSort } from '@ovh-ux/muk';

const { pagination, sorting, onPaginationChange, onSortChange } = useDataGrid();
const { data, isLoading } = useServices({
  page: pagination.pageIndex + 1,
  pageSize: pagination.pageSize,
  sortBy: (sorting as ColumnSort | undefined)?.id,
  sortDesc: (sorting as ColumnSort | undefined)?.desc,
});

<Datagrid
  columns={[{ accessorKey: 'serviceName', header: 'Service' }, { accessorKey: 'datacenter', header: 'DC' }]}
  items={data?.items || []}
  totalItems={data?.total || 0}
  pagination={pagination}
  sorting={sorting}
  onPaginationChange={onPaginationChange}
  onSortChange={onSortChange}
  isLoading={isLoading}
/>
```

## i18n Setup
- Initialize `i18next` once in `src/i18n.ts`.
- Load namespaces from `public/translations/<ns>/Messages_<locale>.json`.
- Use common translations where possible (see common-translations.md).

## MUK Usage Rules
- Import MUK styles first.
- Use MUK components for all UI needs - base UI, IAM-aware, and Manager patterns.
- Use valid MUK props/events (see muk.md). MUK provides wrappers for all design system components with Manager-specific enhancements.

## Forms & Validation
- Use React Hook Form + Yup.
- Wrap inputs with `OsdsFormField` and display `error`.

## Testing & Tooling
- Vitest + Testing Library, jsdom env, `setupTests.ts` including a11y matcher (see html-accessibility-testing.md).
- Add `createTestWrapper(queryClient)` helper to provide QueryClient + Router in tests.
- Mock `@ovh-ux/muk` selectively; prefer integration through TestProvider when available.

## ESLint & TypeScript
- Local ESLint flat config per app allowed when root constraints block TS features. Keep rules aligned with standards; avoid disabling safety rules broadly.
- TypeScript should support `import type` and modern module resolution (`bundler` when needed for local tools).

## Tracking Checklist
- Route `handle.tracking` present for all pages.
- Use `useOvhTracking().trackCurrentPage()` in layout.
- Click tracking on primary actions with enums (see react-tracking.md).

## Parity & Migration Notes
- Follow [us-migration-guide.md](../50-migration-angular/us-migration-guide.md): functional parity, preserved URLs, strangler pattern, and DoD.

## ❌ Common Routing Mistakes

### Mistake 1: Complex SmartRedirect
**Don't**: Create a separate SmartRedirect component that checks API and redirects
**Do**: Use listing page as index with empty state handling OR simple redirect based on service check

### Mistake 2: Absolute navigation paths
**Don't**: `navigate('/bmc-nasha/listing')`
**Do**: `navigate('listing', { replace: true })`

### Mistake 3: Using non-existent MUK components
**Don't**: Import Spinner, Links, Title from MUK
**Do**: Check muk-components-reference.md first

### Mistake 4: Incorrect Datagrid props
**Don't**: Use `totalItems`, `pagination` object
**Do**: Use `totalCount`, `pageIndex`, `pageSize` separately

### Mistake 5: Wrong Button variants
**Don't**: Use `variant="primary"` (not available in MUK)
**Do**: Use `variant="default"`, `variant="ghost"`, or `variant="outline"`

### Mistake 6: Incorrect tracking calls
**Don't**: `trackClick('action-name')`
**Do**: `trackClick({ actions: ['action-name'] })`

## Copy-Paste Starters
- Use code snippets above as templates; adjust endpoints, columns, and namespaces per product.



