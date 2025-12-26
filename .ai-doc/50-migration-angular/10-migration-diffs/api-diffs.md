# API Migration Diffs

Side-by-side comparisons for API and data fetching patterns.

---

## AAPI Get

### AngularJS

```javascript
// Service injection
angular.module('app').controller('NashaCtrl', function(OvhApiDedicatedNasha) {

  // Single resource fetch
  OvhApiDedicatedNasha.Aapi()
    .get({ serviceName: serviceName })
    .$promise
    .then((data) => {
      $scope.nasha = prepareNasha(data);
    })
    .catch((error) => {
      Alerter.error($translate.instant('nasha_error'));
    });
});
```

### React Equivalent

```typescript
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

// Component usage
const DashboardPage = () => {
  const { serviceName } = useParams();
  const { data: nasha, isLoading, isError } = useNasha(serviceName);
  const { t } = useTranslation('nasha');

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBanner message={t('nasha_error')} />;

  return <Dashboard nasha={nasha} />;
};
```

### Transformation Rules

1. `OvhApiX.Aapi().get()` → `aapi.get()` from manager-core-api
2. `$promise.then()` → `useQuery` with async queryFn
3. `.catch()` → `isError` state + error UI
4. `$scope.x = data` → hook returns data directly
5. Manual loading state → `isLoading` from useQuery

---

## Iceberg List Query

### AngularJS

```javascript
// In resolve or controller
iceberg('/dedicated/nasha')
  .query()
  .expand('CachedObjectList-Pages')
  .execute()
  .$promise
  .then((response) => {
    $scope.services = response.data;
  });
```

### React Equivalent

```typescript
// hooks/useNashaList.ts
import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export const useNashaList = () => {
  return useQuery({
    queryKey: ['nasha', 'list'],
    queryFn: async () => {
      const { data } = await fetchIcebergV6({
        route: '/dedicated/nasha',
      });
      return data;
    },
  });
};

// Component
const ListingPage = () => {
  const { data: services, isLoading } = useNashaList();

  if (isLoading) return <Loading />;
  return <Datagrid data={services} />;
};
```

### Transformation Rules

1. `iceberg(route).query().expand().execute()` → `fetchIcebergV6({ route })`
2. Response structure: `response.data` → destructured `data`
3. Pagination handled automatically by fetchIcebergV6

---

## V6 HTTP Calls

### AngularJS

```javascript
// GET
$http.get('/dedicated/nasha/' + serviceName)
  .then((response) => {
    $scope.data = response.data;
  });

// POST
$http.post('/dedicated/nasha/' + serviceName + '/partition', {
  partitionName: name,
  size: size,
}).then((response) => {
  Alerter.success($translate.instant('partition_create_success'));
  $state.go('nasha.partitions');
});

// PUT
$http.put('/dedicated/nasha/' + serviceName, {
  customName: newName,
});

// DELETE
$http.delete('/dedicated/nasha/' + serviceName + '/partition/' + partitionName);
```

### React Equivalent

```typescript
import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET → useQuery
export const useNashaDetails = (serviceName: string) => {
  return useQuery({
    queryKey: ['nasha', serviceName, 'details'],
    queryFn: async () => {
      const { data } = await v6.get(`/dedicated/nasha/${serviceName}`);
      return data;
    },
  });
};

// POST → useMutation
export const useCreatePartition = (serviceName: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation('nasha');
  const { addSuccess } = useNotifications();

  return useMutation({
    mutationFn: async ({ name, size }: { name: string; size: number }) => {
      const { data } = await v6.post(
        `/dedicated/nasha/${serviceName}/partition`,
        { partitionName: name, size }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha', serviceName] });
      addSuccess(t('partition_create_success'));
      navigate('../partitions');
    },
  });
};

// PUT → useMutation
export const useUpdateNasha = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customName }: { customName: string }) => {
      const { data } = await v6.put(`/dedicated/nasha/${serviceName}`, {
        customName,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha', serviceName] });
    },
  });
};

// DELETE → useMutation
export const useDeletePartition = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partitionName: string) => {
      await v6.delete(
        `/dedicated/nasha/${serviceName}/partition/${partitionName}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha', serviceName] });
    },
  });
};
```

### Transformation Rules

1. `$http.get()` → `useQuery` + `v6.get()`
2. `$http.post/put/delete()` → `useMutation` + `v6.method()`
3. `.then()` success → `onSuccess` callback
4. String concatenation → Template literals
5. Always `invalidateQueries` after mutations
6. `Alerter.success()` → `addSuccess()` from notifications
7. `$state.go()` → `navigate()` from react-router

---

## Cache Reset

### AngularJS

```javascript
// After mutation, reset cache
OvhApiDedicatedNasha.Aapi().resetCache();
OvhApiDedicatedNasha.v6().resetQueryCache();

// Then refetch
$state.reload();
```

### React Equivalent

```typescript
// React Query handles this automatically
const queryClient = useQueryClient();

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['nasha'] });

// Invalidate and refetch immediately
queryClient.invalidateQueries({
  queryKey: ['nasha', serviceName],
  refetchType: 'active',
});

// No need for full page reload!
```

### Transformation Rules

1. `.resetCache()` → `invalidateQueries()`
2. `$state.reload()` → Not needed, React Query refetches automatically
3. Granular invalidation with queryKey matching

---

## Polling / Auto-refresh

### AngularJS

```javascript
// Manual polling
const pollInterval = $interval(() => {
  fetchData();
}, 30000);

// Cleanup
$scope.$on('$destroy', () => {
  $interval.cancel(pollInterval);
});
```

### React Equivalent

```typescript
// Automatic with React Query
const { data } = useQuery({
  queryKey: ['nasha', serviceName, 'tasks'],
  queryFn: fetchTasks,
  refetchInterval: 30000, // 30 seconds
  refetchIntervalInBackground: false, // Only when tab is focused
});

// Conditional polling (e.g., only when task is pending)
const { data } = useQuery({
  queryKey: ['nasha', serviceName, 'task', taskId],
  queryFn: () => fetchTask(taskId),
  refetchInterval: (query) =>
    query.state.data?.status === 'pending' ? 5000 : false,
});
```

### Transformation Rules

1. `$interval` → `refetchInterval` option
2. Manual cleanup → Automatic (React Query handles it)
3. Conditional polling → Function for `refetchInterval`

---

## Error Handling

### AngularJS

```javascript
apiCall()
  .$promise
  .then((data) => {
    $scope.data = data;
  })
  .catch((error) => {
    if (error.status === 404) {
      Alerter.error($translate.instant('not_found'));
    } else if (error.status === 403) {
      Alerter.error($translate.instant('forbidden'));
    } else {
      Alerter.error($translate.instant('generic_error'));
    }
  })
  .finally(() => {
    $scope.loading = false;
  });
```

### React Equivalent

```typescript
// In hook
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['nasha', serviceName],
  queryFn: fetchNasha,
  retry: (failureCount, error) => {
    // Don't retry on 404 or 403
    if (error.response?.status === 404 || error.response?.status === 403) {
      return false;
    }
    return failureCount < 3;
  },
});

// In component
const { t } = useTranslation('nasha');

if (isLoading) return <Loading />;

if (isError) {
  const status = error.response?.status;
  if (status === 404) {
    return <ErrorBanner message={t('not_found')} />;
  }
  if (status === 403) {
    return <ErrorBanner message={t('forbidden')} />;
  }
  return <ErrorBanner message={t('generic_error')} />;
}

return <Component data={data} />;
```

### Transformation Rules

1. `.catch()` → `isError` + `error` from useQuery
2. `.finally()` → Not needed, `isLoading` handles this
3. Error status → `error.response?.status`
4. `Alerter.error()` → Error component or notification

---

## Parallel API Calls

### AngularJS

```javascript
$q.all([
  OvhApiDedicatedNasha.Aapi().get({ serviceName }).$promise,
  OvhApiMe.v6().get().$promise,
  OvhApiServices.Aapi().get({ serviceName }).$promise,
]).then(([nasha, me, services]) => {
  $scope.nasha = nasha;
  $scope.me = me;
  $scope.services = services;
});
```

### React Equivalent

```typescript
// Option 1: Multiple hooks (recommended)
const DashboardPage = () => {
  const nashaQuery = useNasha(serviceName);
  const meQuery = useMe();
  const servicesQuery = useServices(serviceName);

  const isLoading = nashaQuery.isLoading || meQuery.isLoading || servicesQuery.isLoading;
  const isError = nashaQuery.isError || meQuery.isError || servicesQuery.isError;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBanner />;

  return (
    <Dashboard
      nasha={nashaQuery.data}
      me={meQuery.data}
      services={servicesQuery.data}
    />
  );
};

// Option 2: useQueries for dynamic list
const queries = useQueries({
  queries: [
    { queryKey: ['nasha', serviceName], queryFn: () => fetchNasha(serviceName) },
    { queryKey: ['me'], queryFn: fetchMe },
    { queryKey: ['services', serviceName], queryFn: () => fetchServices(serviceName) },
  ],
});

const [nasha, me, services] = queries.map((q) => q.data);
const isLoading = queries.some((q) => q.isLoading);
```

### Transformation Rules

1. `$q.all([...])` → Multiple `useQuery` hooks (parallel by default)
2. Or use `useQueries` for array of queries
3. Destructure results from each query
4. Combine loading/error states
