# Case Study: Nasha Migration

> @ai-purpose: Real-world migration example with challenges, solutions, and lessons learned

## Overview

| Attribute | Value |
|-----------|-------|
| **Module** | Nasha (NAS-HA Storage) |
| **Source** | `packages/manager/modules/nasha/` |
| **Target** | `packages/manager/apps/bmc-nasha/` |
| **Complexity** | Medium |
| **Duration** | ~2 weeks |

## Scope Analysis

### AngularJS Source Structure

```
packages/manager/modules/nasha/
├── src/
│   ├── index.js                    # Module definition
│   ├── nasha.routing.js            # Main routing
│   ├── dashboard/
│   │   ├── nasha-dashboard.component.js
│   │   ├── nasha-dashboard.controller.js
│   │   ├── nasha-dashboard.html
│   │   └── nasha-dashboard.routing.js
│   ├── partition/
│   │   ├── add/
│   │   ├── edit/
│   │   ├── delete/
│   │   └── partition.routing.js
│   ├── snapshot/
│   │   ├── add/
│   │   ├── delete/
│   │   └── snapshot.routing.js
│   └── access/
│       ├── add/
│       ├── delete/
│       └── access.routing.js
```

### Feature Inventory

| Feature | AngularJS States | Components | API Calls |
|---------|-----------------|------------|-----------|
| Dashboard | 1 | 2 | 3 (AAPI) |
| Partitions | 4 | 6 | 5 |
| Snapshots | 2 | 3 | 3 |
| Access | 2 | 3 | 3 |
| **Total** | **9** | **14** | **14** |

---

## Challenge 1: AAPI vs v6 API Confusion

### Problem

The AngularJS code used both AAPI and v6 endpoints:

```javascript
// AAPI call (aggregated data)
OvhApiDedicatedNasha.Aapi().get({ serviceName }).$promise

// v6 call (simple data)
OvhApiDedicatedNasha.Partition().v6().query({ serviceName }).$promise
```

Initially, all API calls were migrated using `v6`, causing data structure mismatches.

### Wrong Approach

```typescript
// ❌ WRONG: Using v6 for what was AAPI
const { data } = await v6.get(`/dedicated/nasha/${serviceName}`);
// Returns different structure than AAPI!
```

### Correct Solution

```typescript
// ✅ CORRECT: Match API client to original
import { aapi, v6 } from '@ovh-ux/manager-core-api';

// For AAPI calls
const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);

// For v6 calls
const { data } = await v6.get(`/dedicated/nasha/${serviceName}/partition`);
```

### Lesson Learned

> **Always check whether AngularJS used `.Aapi()` or `.v6()` and match the client.**

---

## Challenge 2: Data Transformation Functions

### Problem

AngularJS had `prepareNasha` function that transformed API data:

```javascript
// AngularJS service
function prepareNasha(nasha) {
  return {
    ...nasha,
    displayName: nasha.customName || nasha.serviceName,
    usedPercent: Math.round((nasha.zpoolSize - nasha.zpoolFree) / nasha.zpoolSize * 100),
    formattedSize: bytesToGb(nasha.zpoolSize),
  };
}
```

This was injected via `resolve` and applied automatically.

### Wrong Approach

```typescript
// ❌ WRONG: No transformation
export function useNashaDetail(serviceName: string) {
  return useQuery({
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return data; // Raw data, missing computed fields!
    },
  });
}
```

### Correct Solution

```typescript
// ✅ CORRECT: Create equivalent transformation hook
export function usePrepareNasha() {
  const { t } = useTranslation('nasha');

  return useCallback((nasha: NashaApiData): NashaData => ({
    ...nasha,
    displayName: nasha.customName || nasha.serviceName,
    usedPercent: Math.round((nasha.zpoolSize - nasha.zpoolFree) / nasha.zpoolSize * 100),
    formattedSize: bytesToGb(nasha.zpoolSize),
  }), [t]);
}

export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();

  return useQuery({
    queryFn: async () => {
      const { data } = await aapi.get(`/dedicated/nasha/${serviceName}`);
      return prepareNasha(data);
    },
  });
}
```

### Lesson Learned

> **Migrate ALL prepare* functions. They contain business logic!**

---

## Challenge 3: Nested Resolves

### Problem

AngularJS had nested state resolves that depended on each other:

```javascript
resolve: {
  serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,

  // This depends on serviceName
  nasha: /* @ngInject */ (OvhApiDedicatedNasha, serviceName) =>
    OvhApiDedicatedNasha.Aapi().get({ serviceName }).$promise,

  // This depends on nasha
  partitions: /* @ngInject */ (OvhApiDedicatedNasha, nasha) =>
    OvhApiDedicatedNasha.Partition().v6()
      .query({ serviceName: nasha.serviceName }).$promise,
}
```

### Wrong Approach

```typescript
// ❌ WRONG: Separate hooks without dependency
const { data: nasha } = useNashaDetail(serviceName);
const { data: partitions } = usePartitionList(serviceName);
// Works, but doesn't express dependency
```

### Correct Solution

```typescript
// ✅ CORRECT: Express dependency in query
export function usePartitionList(serviceName: string) {
  // First get nasha to ensure it exists
  const { data: nasha, isLoading: isLoadingNasha } = useNashaDetail(serviceName);

  return useQuery({
    queryKey: ['nasha', serviceName, 'partitions'],
    queryFn: async () => {
      const { data } = await v6.get(`/dedicated/nasha/${serviceName}/partition`);
      return data;
    },
    // Only fetch partitions after nasha is loaded
    enabled: !!nasha && !isLoadingNasha,
  });
}
```

### Lesson Learned

> **Use `enabled` option to express query dependencies.**

---

## Challenge 4: Bytes Filter

### Problem

AngularJS used a `| bytes` filter for formatting:

```html
<span>{{ $ctrl.nasha.zpoolSize | bytes }}</span>
```

This filter was provided by a shared module.

### Solution

```typescript
// src/utils/formatBytes.ts
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Usage in component
<span>{formatBytes(nasha.zpoolSize)}</span>
```

### Lesson Learned

> **Identify all filters/pipes and create utility functions.**

---

## Challenge 5: Alerter Service

### Problem

AngularJS used `Alerter` service for notifications:

```javascript
this.Alerter.success(
  this.$translate.instant('nasha_partition_add_success'),
  'nasha_alerts'
);

this.Alerter.error(
  this.$translate.instant('nasha_partition_add_error', { message: error.data?.message }),
  'nasha_alerts'
);
```

### Solution

```typescript
import { useNotifications } from '@ovh-ux/muk';

const { addSuccess, addError } = useNotifications();

// Success
addSuccess(t('nasha_partition_add_success'));

// Error with details
addError(t('nasha_partition_add_error', { message: error.message }));
```

### Lesson Learned

> **Map AngularJS services to React equivalents: Alerter → useNotifications**

---

## Challenge 6: Modal Parameters

### Problem

AngularJS passed data to modals via `resolve`:

```javascript
$uibModal.open({
  component: 'nashaPartitionDelete',
  resolve: {
    partition: () => this.selectedPartition,
    serviceName: () => this.serviceName,
  },
});
```

### Solution

```typescript
// Modal state
const [deletingPartition, setDeletingPartition] = useState<Partition | null>(null);

// Open modal with data
<ActionMenu.Item onClick={() => setDeletingPartition(row)}>
  {t('delete')}
</ActionMenu.Item>

// Modal receives data as props
{deletingPartition && (
  <DeletePartitionModal
    partition={deletingPartition}
    serviceName={serviceName}
    isOpen={!!deletingPartition}
    onClose={() => setDeletingPartition(null)}
  />
)}
```

### Lesson Learned

> **Use React state + conditional rendering instead of modal services.**

---

## Final Migration Metrics

### Code Comparison

| Metric | AngularJS | React | Change |
|--------|-----------|-------|--------|
| Files | 45 | 38 | -16% |
| Lines of Code | ~3,200 | ~2,800 | -13% |
| Components | 14 | 12 | -14% |
| API Hooks | N/A | 14 | N/A |
| Test Coverage | 45% | 78% | +33% |

### Parity Verification

| Category | Status | Notes |
|----------|--------|-------|
| Routes | ✅ 9/9 | All states migrated |
| API Calls | ✅ 14/14 | All endpoints preserved |
| Components | ✅ 14/14 | All UI elements present |
| Translations | ✅ | All keys migrated |
| Features | ✅ | All CRUD operations work |

---

## Key Takeaways

### Do's

1. ✅ **Analyze before coding** - Map all states, API calls, components first
2. ✅ **Match API clients** - AAPI → aapi, v6 → v6
3. ✅ **Migrate transformations** - prepare* functions contain business logic
4. ✅ **Use enabled for dependencies** - Express query dependencies
5. ✅ **Test early and often** - Catch parity issues early

### Don'ts

1. ❌ **Don't assume API structure** - AAPI and v6 return different shapes
2. ❌ **Don't skip data transformation** - Components expect computed fields
3. ❌ **Don't change page sizes** - Keep exact pagination config
4. ❌ **Don't forget notifications** - Users expect feedback
5. ❌ **Don't mix clients** - aapi for aggregated, v6 for REST

### Migration Checklist Template

```markdown
## Pre-Migration Analysis
- [ ] Count AngularJS states
- [ ] Count API calls (AAPI vs v6)
- [ ] List data transformations
- [ ] List UI components
- [ ] List notifications

## Implementation
- [ ] Routes.tsx created
- [ ] API hooks created
- [ ] Components migrated
- [ ] Modals migrated
- [ ] Translations added

## Verification
- [ ] All routes work
- [ ] All API calls work
- [ ] All CRUD operations work
- [ ] All notifications display
- [ ] TypeScript compiles
- [ ] Tests pass
```
