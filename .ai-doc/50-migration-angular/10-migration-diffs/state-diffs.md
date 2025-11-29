# State Management Migration Diffs

Side-by-side comparisons for controllers, services, and state management patterns.

---

## Controller → Custom Hook

### AngularJS

```javascript
angular.module('app').controller('NashaCtrl', function(
  $scope,
  $stateParams,
  $translate,
  OvhApiDedicatedNasha,
  Alerter
) {
  const self = this;

  self.loading = true;
  self.nasha = null;
  self.error = null;

  self.loadNasha = function() {
    self.loading = true;
    self.error = null;

    OvhApiDedicatedNasha.Aapi()
      .get({ serviceName: $stateParams.serviceName })
      .$promise
      .then((data) => {
        self.nasha = prepareNasha(data, $translate);
      })
      .catch((error) => {
        self.error = error;
        Alerter.error($translate.instant('nasha_load_error'));
      })
      .finally(() => {
        self.loading = false;
      });
  };

  self.refresh = function() {
    OvhApiDedicatedNasha.Aapi().resetCache();
    self.loadNasha();
  };

  // Initialize
  self.loadNasha();
});
```

### React Equivalent

```typescript
// hooks/useNasha.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { aapi } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';

export const useNasha = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('nasha');
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['nasha', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return prepareNasha(data, t);
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['nasha', serviceName] });
  };

  return {
    nasha: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refresh,
  };
};

// pages/NashaPage.tsx
const NashaPage = () => {
  const { nasha, isLoading, isError, refresh } = useNasha();
  const { t } = useTranslation('nasha');

  if (isLoading) return <Loading />;
  if (isError) return <ErrorBanner message={t('nasha_load_error')} />;

  return (
    <Dashboard nasha={nasha}>
      <RefreshButton onClick={refresh} />
    </Dashboard>
  );
};
```

### Transformation Rules

1. Controller class → Custom hook function
2. `$scope` / `self` properties → Hook return values
3. `$stateParams` → `useParams()`
4. `$translate` → `useTranslation()`
5. Manual loading/error state → `useQuery` provides them
6. `.resetCache()` → `invalidateQueries()`
7. Init in controller → `useQuery` auto-fetches

---

## $scope Variables → useState

### AngularJS

```javascript
$scope.isEditing = false;
$scope.selectedItems = [];
$scope.searchTerm = '';

$scope.toggleEdit = function() {
  $scope.isEditing = !$scope.isEditing;
};

$scope.selectItem = function(item) {
  if ($scope.selectedItems.includes(item)) {
    $scope.selectedItems = $scope.selectedItems.filter(i => i !== item);
  } else {
    $scope.selectedItems = [...$scope.selectedItems, item];
  }
};

$scope.onSearch = function(term) {
  $scope.searchTerm = term;
};
```

### React Equivalent

```typescript
const [isEditing, setIsEditing] = useState(false);
const [selectedItems, setSelectedItems] = useState<Item[]>([]);
const [searchTerm, setSearchTerm] = useState('');

const toggleEdit = () => {
  setIsEditing((prev) => !prev);
};

const selectItem = (item: Item) => {
  setSelectedItems((prev) =>
    prev.includes(item)
      ? prev.filter((i) => i !== item)
      : [...prev, item]
  );
};

const onSearch = (term: string) => {
  setSearchTerm(term);
};
```

### Transformation Rules

1. `$scope.x = value` → `const [x, setX] = useState(value)`
2. `$scope.x = newValue` → `setX(newValue)`
3. Mutating based on current → `setX((prev) => ...)`
4. Add TypeScript types to state

---

## $scope.$watch → useEffect

### AngularJS

```javascript
$scope.$watch('searchTerm', function(newValue, oldValue) {
  if (newValue !== oldValue) {
    $scope.filteredItems = filterItems($scope.items, newValue);
  }
});

$scope.$watch('selectedItems.length', function(count) {
  $scope.hasSelection = count > 0;
});

$scope.$watchCollection('items', function(items) {
  $scope.itemCount = items.length;
});
```

### React Equivalent

```typescript
// Derived state - no useEffect needed!
const filteredItems = useMemo(
  () => filterItems(items, searchTerm),
  [items, searchTerm]
);

const hasSelection = selectedItems.length > 0;
const itemCount = items.length;

// Only use useEffect for side effects
useEffect(() => {
  // Example: Analytics tracking when selection changes
  if (hasSelection) {
    trackEvent('items_selected', { count: selectedItems.length });
  }
}, [hasSelection, selectedItems.length]);
```

### Transformation Rules

1. `$watch` for derived data → `useMemo` or inline calculation
2. `$watch` for side effects → `useEffect`
3. `$watchCollection` → `useEffect` with array in deps
4. Avoid useEffect for computed values (use useMemo or derive inline)

---

## Service → Utility Module

### AngularJS

```javascript
angular.module('app').service('NashaService', function($http, $translate) {
  const self = this;

  self.formatSize = function(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  self.getStatusLabel = function(status) {
    return $translate.instant(`nasha_status_${status}`);
  };

  self.calculateUsage = function(used, total) {
    return Math.round((used / total) * 100);
  };
});
```

### React Equivalent

```typescript
// utils/nasha.utils.ts (pure functions)
export const formatSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
};

export const calculateUsage = (used: number, total: number): number => {
  return Math.round((used / total) * 100);
};

// hooks/useNashaLabels.ts (needs translation)
import { useTranslation } from 'react-i18next';

export const useNashaLabels = () => {
  const { t } = useTranslation('nasha');

  const getStatusLabel = (status: string): string => {
    return t(`nasha_status_${status}`);
  };

  return { getStatusLabel };
};

// Usage in component
import { formatSize, calculateUsage } from '../utils/nasha.utils';
import { useNashaLabels } from '../hooks/useNashaLabels';

const NashaInfo = ({ nasha }) => {
  const { getStatusLabel } = useNashaLabels();

  return (
    <div>
      <span>{formatSize(nasha.size)}</span>
      <span>{getStatusLabel(nasha.status)}</span>
      <span>{calculateUsage(nasha.used, nasha.total)}%</span>
    </div>
  );
};
```

### Transformation Rules

1. Pure functions → Export from utils module
2. Functions needing `$translate` → Custom hook with `useTranslation`
3. Functions needing `$http` → Custom hook with `useQuery`/`useMutation`
4. Stateful services → Context or Zustand store (rare)

---

## Service with API Calls → Custom Hook

### AngularJS

```javascript
angular.module('app').service('PartitionService', function(
  $http,
  $q,
  OvhApiDedicatedNasha
) {
  const self = this;

  self.getPartitions = function(serviceName) {
    return OvhApiDedicatedNasha.Partition().v6()
      .query({ serviceName })
      .$promise;
  };

  self.createPartition = function(serviceName, data) {
    return $http.post(
      `/dedicated/nasha/${serviceName}/partition`,
      data
    ).then((response) => {
      OvhApiDedicatedNasha.Partition().v6().resetQueryCache();
      return response.data;
    });
  };

  self.deletePartition = function(serviceName, partitionName) {
    return $http.delete(
      `/dedicated/nasha/${serviceName}/partition/${partitionName}`
    ).then(() => {
      OvhApiDedicatedNasha.Partition().v6().resetQueryCache();
    });
  };
});
```

### React Equivalent

```typescript
// hooks/usePartitions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

// Query hook
export const usePartitions = (serviceName: string) => {
  return useQuery({
    queryKey: ['nasha', serviceName, 'partitions'],
    queryFn: async () => {
      const { data } = await v6.get(
        `/dedicated/nasha/${serviceName}/partition`
      );
      return data;
    },
  });
};

// Mutation hooks
export const useCreatePartition = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePartitionData) => {
      const { data: result } = await v6.post(
        `/dedicated/nasha/${serviceName}/partition`,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['nasha', serviceName, 'partitions'],
      });
    },
  });
};

export const useDeletePartition = (serviceName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partitionName: string) => {
      await v6.delete(
        `/dedicated/nasha/${serviceName}/partition/${partitionName}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['nasha', serviceName, 'partitions'],
      });
    },
  });
};

// Usage
const PartitionsPage = () => {
  const { serviceName } = useParams();
  const { data: partitions, isLoading } = usePartitions(serviceName);
  const createMutation = useCreatePartition(serviceName);
  const deleteMutation = useDeletePartition(serviceName);

  const handleCreate = (data) => createMutation.mutate(data);
  const handleDelete = (name) => deleteMutation.mutate(name);

  // ...
};
```

### Transformation Rules

1. Service → Multiple specialized hooks
2. GET methods → `useQuery` hooks
3. POST/PUT/DELETE → `useMutation` hooks
4. `.resetQueryCache()` → `invalidateQueries()`
5. Return promise → Return mutation object
6. Each hook is self-contained with its dependencies

---

## $rootScope Events → Context or Custom Events

### AngularJS

```javascript
// Emit event
$rootScope.$emit('nasha:updated', { serviceName: serviceName });

// Listen to event
const unsubscribe = $rootScope.$on('nasha:updated', function(event, data) {
  $scope.refresh();
});

// Cleanup
$scope.$on('$destroy', function() {
  unsubscribe();
});
```

### React Equivalent

```typescript
// Option 1: React Query invalidation (preferred for data)
// No events needed - just invalidate queries
queryClient.invalidateQueries({ queryKey: ['nasha'] });

// Option 2: Context for global state
const NashaContext = createContext<NashaContextType | null>(null);

export const NashaProvider = ({ children }) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const notifyUpdate = (serviceName: string) => {
    setLastUpdated(new Date());
    // Optionally trigger other actions
  };

  return (
    <NashaContext.Provider value={{ lastUpdated, notifyUpdate }}>
      {children}
    </NashaContext.Provider>
  );
};

// Option 3: Custom event emitter (rare, for non-React integration)
import mitt from 'mitt';

const emitter = mitt();

// Emit
emitter.emit('nasha:updated', { serviceName });

// Listen
useEffect(() => {
  const handler = (data) => refresh();
  emitter.on('nasha:updated', handler);
  return () => emitter.off('nasha:updated', handler);
}, []);
```

### Transformation Rules

1. Data sync events → Use React Query invalidation
2. Global state → React Context
3. Complex event systems → Consider Zustand or event library
4. Always cleanup in useEffect return

---

## $scope.$apply / $timeout → Not Needed

### AngularJS

```javascript
// Force digest cycle after external callback
externalLibrary.onData(function(data) {
  $scope.$apply(function() {
    $scope.data = data;
  });
});

// Defer to next digest
$timeout(function() {
  $scope.ready = true;
});
```

### React Equivalent

```typescript
// React automatically batches state updates
// No $apply equivalent needed

externalLibrary.onData((data) => {
  setData(data); // React handles the re-render
});

// Defer to next render (rare, usually not needed)
useEffect(() => {
  setReady(true);
}, []);

// For truly async operations
const processData = async () => {
  await someAsyncOperation();
  setData(result); // React handles this fine
};
```

### Transformation Rules

1. `$scope.$apply()` → Just call setState (React batches automatically)
2. `$timeout` for digest → Usually `useEffect` or just direct setState
3. `$timeout` for delay → `setTimeout` with cleanup in useEffect
4. React 18+ batches all state updates automatically
