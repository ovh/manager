# Routing Migration Diffs

Side-by-side comparisons for routing patterns.

---

## State Definition → Route

### AngularJS

```javascript
$stateProvider.state('nasha.dashboard', {
  url: '/:serviceName',
  component: 'nashaDashboardComponent',
  resolve: {
    serviceName: /* @ngInject */ ($stateParams) => $stateParams.serviceName,
    nasha: /* @ngInject */ (OvhApiDedicatedNasha, serviceName) =>
      OvhApiDedicatedNasha.Aapi()
        .get({ serviceName })
        .$promise.then((data) => prepareNasha(data)),
  },
});
```

### React Equivalent

```typescript
// routes.tsx
import { Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';

export const routes = (
  <Route path=":serviceName" element={<DashboardPage />} />
);

// pages/DashboardPage.tsx
import { useParams } from 'react-router-dom';
import { useNasha } from '../hooks/useNasha';

export const DashboardPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { data: nasha, isLoading, isError } = useNasha(serviceName);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage />;

  return <Dashboard nasha={nasha} />;
};

// hooks/useNasha.ts
import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';

export const useNasha = (serviceName: string) => {
  return useQuery({
    queryKey: ['nasha', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return prepareNasha(data);
    },
  });
};
```

### Transformation Rules

1. `url: '/:serviceName'` → `path=":serviceName"` (remove leading `/`)
2. `component: 'name'` → `element={<Component />}`
3. `resolve.serviceName` → `useParams()` hook
4. `resolve.nasha` → custom hook with `useQuery`
5. `$promise.then()` → async/await in queryFn
6. Data available immediately in AngularJS → Check `isLoading` in React

---

## Redirect State → Navigate

### AngularJS

```javascript
$stateProvider.state('nasha', {
  url: '/nasha',
  redirectTo: 'nasha.directory',
});
```

### React Equivalent

```typescript
// Option 1: Navigate component
import { Navigate, Route } from 'react-router-dom';

<Route path="/nasha" element={<Navigate to="/nasha/directory" replace />} />

// Option 2: Index route redirect
<Route path="/nasha">
  <Route index element={<Navigate to="directory" replace />} />
  <Route path="directory" element={<DirectoryPage />} />
</Route>
```

### Transformation Rules

1. `redirectTo: 'state.name'` → `<Navigate to="path" replace />`
2. Use `replace` to avoid redirect in history
3. Convert state name to actual path

---

## URL Parameters

### AngularJS

```javascript
// Route definition
url: '/:serviceName/partition/:partitionName'

// In controller
$stateParams.serviceName
$stateParams.partitionName
```

### React Equivalent

```typescript
// Route definition
<Route path=":serviceName/partition/:partitionName" element={<PartitionPage />} />

// In component
import { useParams } from 'react-router-dom';

const PartitionPage = () => {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();

  // Use params...
};
```

### Transformation Rules

1. `:param` syntax is the same
2. `$stateParams.x` → `useParams().x`
3. Add TypeScript typing for params

---

## Query Parameters

### AngularJS

```javascript
// Route definition
url: '/listing?page&sort'

// Access
$stateParams.page
$stateParams.sort

// Navigate with params
$state.go('nasha.directory', { page: 2 });
```

### React Equivalent

```typescript
// No route definition needed for query params

// Access
import { useSearchParams } from 'react-router-dom';

const ListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort');

  // Navigate with params
  const goToPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };
};
```

### Transformation Rules

1. Query params don't need route definition in React Router
2. `$stateParams.x` → `searchParams.get('x')`
3. `$state.go(state, params)` → `setSearchParams(params)`

---

## Nested Routes

### AngularJS

```javascript
$stateProvider
  .state('nasha', {
    url: '/nasha',
    component: 'nashaComponent',
  })
  .state('nasha.dashboard', {
    url: '/:serviceName',
    component: 'nashaDashboardComponent',
  })
  .state('nasha.dashboard.partitions', {
    url: '/partitions',
    component: 'nashaPartitionsComponent',
  });
```

### React Equivalent

```typescript
<Route path="/nasha" element={<NashaLayout />}>
  <Route path=":serviceName" element={<DashboardLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="partitions" element={<PartitionsPage />} />
  </Route>
</Route>

// NashaLayout.tsx
import { Outlet } from 'react-router-dom';

const NashaLayout = () => (
  <BaseLayout>
    <Outlet />  {/* Child routes render here */}
  </BaseLayout>
);
```

### Transformation Rules

1. Nested states → Nested `<Route>` elements
2. Parent component with `<ui-view>` → Layout with `<Outlet>`
3. Child URL is relative (no leading `/`)

---

## onEnter / onExit Hooks

### AngularJS

```javascript
$stateProvider.state('nasha.edit', {
  url: '/edit',
  component: 'nashaEditComponent',
  onEnter: /* @ngInject */ (atInternet) => {
    atInternet.trackPage({ name: 'nasha::edit' });
  },
  onExit: /* @ngInject */ ($rootScope) => {
    $rootScope.$emit('nasha.edit.exit');
  },
});
```

### React Equivalent

```typescript
// EditPage.tsx
import { useEffect } from 'react';
import { usePageTracking } from '@ovh-ux/manager-react-shell-client';

const EditPage = () => {
  // onEnter equivalent
  usePageTracking('nasha::edit');

  // onExit equivalent
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      console.log('Exiting edit page');
    };
  }, []);

  return <EditForm />;
};
```

### Transformation Rules

1. `onEnter` → `useEffect` with empty deps or custom hook
2. `onExit` → `useEffect` cleanup function (return)
3. Tracking → `usePageTracking` hook

---

## Resolve with Multiple Dependencies

### AngularJS

```javascript
resolve: {
  services: /* @ngInject */ (iceberg) =>
    iceberg('/dedicated/nasha')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise,

  serviceDetails: /* @ngInject */ (services, $q, OvhApiDedicatedNasha) =>
    $q.all(
      services.data.map((service) =>
        OvhApiDedicatedNasha.v6().get({ serviceName: service.serviceName }).$promise
      )
    ),
}
```

### React Equivalent

```typescript
// hooks/useNashaServices.ts
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export const useNashaServices = () => {
  // First query: get service list
  const servicesQuery = useQuery({
    queryKey: ['nasha', 'services'],
    queryFn: async () => {
      const { data } = await fetchIcebergV6('/dedicated/nasha');
      return data;
    },
  });

  // Second query: get details for each service (depends on first)
  const detailsQueries = useQueries({
    queries: (servicesQuery.data ?? []).map((service) => ({
      queryKey: ['nasha', service.serviceName, 'details'],
      queryFn: () => v6.get(`/dedicated/nasha/${service.serviceName}`),
      enabled: !!servicesQuery.data,
    })),
  });

  return {
    services: servicesQuery.data,
    details: detailsQueries.map((q) => q.data),
    isLoading: servicesQuery.isLoading || detailsQueries.some((q) => q.isLoading),
    isError: servicesQuery.isError || detailsQueries.some((q) => q.isError),
  };
};
```

### Transformation Rules

1. Sequential resolves → `enabled` option in dependent query
2. `$q.all()` → `useQueries` for parallel queries
3. Chain of `.then()` → async/await or `select` option
4. Dependencies between resolves → React Query's `enabled` flag
