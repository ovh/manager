---
title: AngularJS → React Mapping Guide (nasha → bmc-nasha)
last_update: 2025-01-27
tags: [migration, mapping, angularjs, react, nasha, examples]
ai: true
---

# AngularJS → React Mapping Guide (nasha → bmc-nasha)

## 🧭 Purpose

This guide provides **concrete, real-world mappings** from AngularJS to React based on the actual migration of `nasha` to `bmc-nasha`. Each mapping includes source code examples from both the AngularJS module and the React implementation.

## ⚙️ Context

**Core Principle**: **Real examples only** - all mappings are based on actual code from `packages/manager/modules/nasha` (AngularJS) and `packages/manager/apps/bmc-nasha` (React).

## 🔗 References

- [Migration Patterns](./migration-patterns.md) - **Pattern detection rules**
- [Automated Migration Guide](./automated-migration-guide.md) - **Step-by-step automation**
- [Code Templates](./code-templates.md) - **Ready-to-use templates**

## 📘 Routing Mappings

### State Provider → React Router

#### AngularJS: Basic State (nasha.routing.js)

```javascript
export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    template: `<div class="nasha"><div data-ui-view></div></div>`,
    redirectTo: (transition) => {
      // Conditional redirect logic
      return transition.injector()
        .get('iceberg')(NASHA_BASE_API_URL)
        .query()
        .expand('CachedObjectList-Pages')
        .limit(1)
        .execute(null, true)
        .$promise.then(({ data }) =>
          data.length ? 'nasha.directory' : 'nasha.onboarding',
        );
    },
    resolve: {
      baseApiUrl: () => NASHA_BASE_API_URL,
      breadcrumb: () => NASHA_TITLE,
      // ... other resolves
    },
  });
};
```

#### React: Routes (Routes.tsx)

```typescript
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/debug/ErrorBoundary.component';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const RootPage = React.lazy(() => import('@/pages/root/Root.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));

export default (
  <>
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={<ErrorBoundary />}
    >
      {/* Conditional redirect - checks for services */}
      <Route index Component={RootPage} />
      
      <Route path="onboarding" Component={OnboardingPage} />
      <Route path={urls.listing} Component={ListingPage} />
      
      {/* ... other routes */}
    </Route>
  </>
);
```

**Key Mappings:**
- `$stateProvider.state()` → `<Route>` component
- `url: '/nasha'` → `path={urls.root}` (computed via `getRoot()`)
- `template` → Layout component with `<Outlet />`
- `redirectTo` → Conditional logic in `RootPage` component
- `resolve` → React hooks in page components
- `errorElement` → ErrorBoundary component

### Conditional Redirect Pattern

#### AngularJS: redirectTo with Logic

```javascript
redirectTo: (transition) =>
  transition
    .injector()
    .get('iceberg')(NASHA_BASE_API_URL)
    .query()
    .expand('CachedObjectList-Pages')
    .limit(1)
    .execute(null, true)
    .$promise.then(({ data }) =>
      data.length ? 'nasha.directory' : 'nasha.onboarding',
    ),
```

#### React: RootPage with Conditional Navigation

```typescript
// Root.page.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';

export default function RootPage() {
  const navigate = useNavigate();
  const { data } = useNashaServices({ limit: 1 });

  useEffect(() => {
    if (data && data.length > 0) {
      navigate('listing', { replace: true });
    } else {
      navigate('onboarding', { replace: true });
    }
  }, [data, navigate]);

  return null; // Redirect only, no UI
}
```

**Key Mappings:**
- `redirectTo` function → `useEffect` with conditional `navigate()`
- `transition.injector().get('iceberg')` → `useNashaServices` hook
- Promise-based redirect → Effect-based redirect

### Nested States → Nested Routes

#### AngularJS: Nested States

```javascript
$stateProvider.state('nasha.dashboard', {
  url: '/:serviceName',
  component: 'nashaDashboard',
  resolve: { /* ... */ }
});

$stateProvider.state('nasha.dashboard.partitions', {
  url: '/partitions',
  component: 'nashaDashboardPartitions',
  resolve: { /* ... */ }
});
```

#### React: Nested Routes

```typescript
<Route path=":serviceName/*" Component={DashboardPage}>
  <Route path="partitions" Component={PartitionsPage} />
  <Route path="partition/:partitionName/*" Component={PartitionPage}>
    <Route path="snapshots" Component={SnapshotsPage} />
    <Route path="accesses" Component={AccessesPage} />
  </Route>
</Route>
```

**Key Mappings:**
- `nasha.dashboard` → `<Route path=":serviceName/*">`
- `nasha.dashboard.partitions` → Nested `<Route path="partitions">`
- `component` → `Component` prop
- `resolve` → Hooks in component

## 📘 Resolve Functions → React Hooks

### Simple Data Fetching

#### AngularJS: Resolve with AAPI

```javascript
resolve: {
  nasha: /* @ngInject */ (
    OvhApiDedicatedNasha,
    serviceName,
    prepareNasha,
  ) => {
    const aapi = OvhApiDedicatedNasha.Aapi();
    aapi.resetCache();
    return aapi.get({ serviceName }).$promise.then(prepareNasha);
  },
}
```

#### React: useQuery Hook

```typescript
// useNashaDetail.ts
import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePrepareNasha } from '@/utils/nasha.utils';

export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();

  return useQuery({
    queryKey: ['nasha-detail', serviceName],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<NashaApiData>(
        `${NASHA_BASE_API_URL}/${serviceName}`
      );
      return prepareNasha(data) as NashaPrepared;
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

**Key Mappings:**
- `resolve.nasha` → `useNashaDetail(serviceName)` hook
- `OvhApiDedicatedNasha.Aapi()` → `aapi` from `@ovh-ux/manager-core-api`
- `aapi.resetCache()` → Not needed (React Query handles cache)
- `$promise.then(prepareNasha)` → `queryFn` with `prepareNasha` call
- `prepareNasha` from resolve → `usePrepareNasha()` hook

### Complex Resolve with Calculations

#### AngularJS: Calculated Resolve

```javascript
resolve: {
  partitionAllocatedSize: /* @ngInject */ (iceberg, nashaApiUrl) =>
    iceberg(`${nashaApiUrl}/partition`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.reduce(
          (totalSize, partition) => totalSize + partition.size,
          0,
        ),
      ),
  canCreatePartitions: /* @ngInject */ (partitionAllocatedSize, nasha) =>
    partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN,
}
```

#### React: Multiple Hooks with Derived State

```typescript
// useNashaDetail.ts
export function usePartitionAllocatedSize(serviceName: string) {
  return useQuery({
    queryKey: ['nasha-partition-allocated-size', serviceName],
    queryFn: async () => {
      const { fetchIcebergV6 } = await import('@ovh-ux/manager-core-api');
      const result = await fetchIcebergV6<{ size: number }>({
        route: `${NASHA_BASE_API_URL}/${serviceName}/partition`,
        page: 1,
        pageSize: 1000,
      });
      return result.data.reduce(
        (totalSize: number, partition: { size: number }) => 
          totalSize + partition.size,
        0,
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCanCreatePartitions(
  serviceName: string, 
  nashaZpoolSize?: number
) {
  const { data: allocatedSize } = usePartitionAllocatedSize(serviceName);
  const SIZE_MIN_BYTES = 10 * 1024 * 1024 * 1024;

  return {
    canCreatePartitions:
      allocatedSize !== undefined &&
      nashaZpoolSize !== undefined &&
      nashaZpoolSize > 0 &&
      allocatedSize <= nashaZpoolSize - SIZE_MIN_BYTES,
    allocatedSize,
  };
}
```

**Key Mappings:**
- `iceberg().query().expand().execute()` → `fetchIcebergV6` with pagination
- Multiple resolves → Multiple hooks
- Calculated resolve → Hook that uses other hooks
- `$promise.then()` → `queryFn` async function

### Navigation Functions

#### AngularJS: Navigation Resolves

```javascript
resolve: {
  goBack: /* @ngInject */ (
    $state,
    serviceName,
    alertSuccess,
    alertError,
  ) => ({ success, error, stateName, reload } = {}) => {
    const name = stateName || '^';
    const prms = { serviceName };
    const opts = {
      reload: reload === true || (Boolean(success) && reload !== false),
    };
    return $state.go(name, prms, opts).then((result) => {
      if (success) {
        alertSuccess(success);
      }
      if (error) {
        alertError(error);
      }
      return result;
    });
  },
  goToPartitionsCreate: /* @ngInject */ ($state, serviceName) => () =>
    $state.go(`${dashboardStateName}.partitions.create`, { serviceName }),
}
```

#### React: Navigation Hooks

```typescript
// In Dashboard.page.tsx
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const handleGoToPartitionsCreate = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'create-partition'] });
    navigate(`/${serviceName}/partitions/create`);
  };

  // goBack equivalent - navigate with replace
  const handleGoBack = (options?: { 
    success?: string; 
    error?: Error;
  }) => {
    if (options?.success) {
      // Show success message (via notification system)
    }
    if (options?.error) {
      // Show error message (via error boundary or notification)
    }
    navigate(`/${serviceName}`, { replace: true });
  };

  // ... rest of component
}
```

**Key Mappings:**
- `$state.go()` → `navigate()`
- `$state.go('^')` → `navigate(-1)` or `navigate(path, { replace: true })`
- Navigation functions in resolve → Handler functions in component
- `alertSuccess` / `alertError` → Notification system or error handling

## 📘 managerListLayout → MUK BaseLayout + Datagrid

### AngularJS: managerListLayout

#### Routing (directory.routing.js)

```javascript
$stateProvider.state('nasha.directory', {
  url: `?${ListLayoutHelper.urlQueryParams}`,
  component: 'managerListLayout',
  params: ListLayoutHelper.stateParams,
  resolve: {
    ...ListLayoutHelper.stateResolves,
    apiPath: /* @ngInject */ (baseApiUrl) => baseApiUrl,
    dataModel: () => 'dedicated.nasha.Storage',
    defaultFilterColumn: () => 'serviceName',
    header: () => NASHA_TITLE,
    changelog: () => 'nasha',
    customizableColumns: () => true,
    columnConfig: /* @ngInject */ ($translate) => ({
      data: [
        {
          label: $translate.instant('nasha_directory_columns_header_serviceName'),
          property: 'serviceName',
          serviceLink: true,
          hidden: false,
        },
        // ... more columns
      ],
    }),
    topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
      cta: {
        type: 'button',
        displayed: true,
        disabled: false,
        label: $translate.instant('nasha_directory_order_label'),
        value: $translate.instant('nasha_directory_order_value'),
        onClick: () => {
          atInternet.trackClick({
            name: 'nasha::directory::add',
            type: 'action',
          });
          return $state.go('nasha.order');
        },
      },
    }),
    hideBreadcrumb: () => true,
  },
});
```

### React: BaseLayout + Datagrid

#### Listing Page (Listing.page.tsx)

```typescript
import { BaseLayout, Button, Datagrid, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNashaServices } from '@/data/api/hooks/useNashaServices';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();

  const { data, isLoading, totalCount } = useNashaServices({
    limit: pageSize,
    sortBy,
    sortDesc,
    filters: apiFilters,
  });

  const handleOrderClick = () => {
    trackClick({ actions: ['listing::add'] });
    window.open('https://www.ovhcloud.com/en/bare-metal-cloud/nas-ha/', '_blank');
  };

  const columns: DatagridColumn<NashaService>[] = [
    {
      id: 'serviceName',
      accessorKey: 'serviceName',
      header: t('nasha_directory_columns_header_serviceName'),
      cell: ({ row }) => (
        <Link
          to={`../${row.original.serviceName}`}
          onClick={() => trackClick({ actions: ['listing::service-link'] })}
        >
          {row.original.serviceName}
        </Link>
      ),
      enableHiding: false,
      isSortable: true,
    },
    // ... more columns
  ];

  return (
    <BaseLayout
      header={{
        title: t('nasha_listing_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />,
        guideMenu: <GuideMenu items={guideItems} />,
      }}
    >
      <div className="mb-4 flex justify-end">
        <Button variant="default" onClick={handleOrderClick}>
          {t('nasha_listing_order')}
        </Button>
      </div>
      <Datagrid
        columns={columns}
        data={data || []}
        totalCount={totalCount ?? data?.length}
        isLoading={isLoading}
        sorting={{ sorting, setSorting }}
        search={{ searchInput, setSearchInput, onSearch: handleSearch }}
        filters={{ filters: columnFilters, add: handleAddFilter, remove: handleRemoveFilter }}
        columnVisibility={{ columnVisibility, setColumnVisibility }}
      />
    </BaseLayout>
  );
}
```

**Key Mappings:**
- `component: 'managerListLayout'` → `<BaseLayout>` with `<Datagrid>`
- `columnConfig.data` → `columns` array with `DatagridColumn` type
- `topbarOptions.cta` → `<Button>` in header area
- `header` → `BaseLayout` `header.title` prop
- `changelog` → `<ChangelogMenu>` in header
- `serviceLink: true` → Custom `cell` renderer with `<Link>`
- `ListLayoutHelper.stateResolves` → Custom hooks for pagination, sorting, filtering

## 📘 Template Mappings

### OUI Components → MUK Components

#### AngularJS Template

```html
<!-- dashboard.template.html -->
<header class="oui-header">
  <h1 data-ng-bind="$ctrl.name"></h1>
  <button class="btn btn-icon" data-ng-click="$ctrl.editName()">
    <span class="oui-icon oui-icon-pen_concept"></span>
  </button>
</header>

<oui-tile>
  <oui-tile-definition term="Name" description="{{ $ctrl.nasha.customName }}"></oui-tile-definition>
  <oui-tile-definition term="ID" description="{{ $ctrl.nasha.serviceName }}"></oui-tile-definition>
</oui-tile>

<oui-button data-ng-click="$ctrl.goToPartitionsCreate()">
  Create partition
</oui-button>
```

#### React JSX

```typescript
// Dashboard.page.tsx
import { Tile, Button, Icon, ICON_NAME } from '@ovh-ux/muk';

export default function DashboardPage() {
  const handleEditName = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'edit-name'] });
    navigate(`/${serviceName}/edit-name`);
  };

  return (
    <NashaHeader
      title={name}
      subtitle={serviceName}
    >
      <Tile.Root title="Information">
        <Tile.Item.Root>
          <Tile.Item.Term
            label="Name"
            actions={
              <ActionMenu
                items={[{
                  id: 1,
                  label: 'Edit',
                  onClick: handleEditName,
                }]}
              />
            }
          />
          <Tile.Item.Description>{nasha.customName}</Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="ID" />
          <Tile.Item.Description>{nasha.serviceName}</Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>

      <Button variant="default" onClick={handleGoToPartitionsCreate}>
        Create partition
      </Button>
    </NashaHeader>
  );
}
```

**Key Mappings:**
- `<header class="oui-header">` → `<NashaHeader>` or `BaseLayout` header prop
- `<oui-tile>` → `<Tile.Root>`
- `<oui-tile-definition>` → `<Tile.Item.Root>` with `<Tile.Item.Term>` and `<Tile.Item.Description>`
- `<oui-button>` → `<Button>`
- `data-ng-click` → `onClick` prop
- `data-ng-bind` → JSX expression `{value}`

## 📘 API Mappings

### AAPI Endpoints

#### AngularJS: OvhApiDedicatedNashaAapi

```javascript
// In controller or service
this.OvhApiDedicatedNashaAapi.resetCache();
this.OvhApiDedicatedNashaAapi.partitions({ serviceName })
  .$promise
  .then((partitions) => partitions.map(this.preparePartition));
```

#### React: aapi from manager-core-api

```typescript
// usePartitions.ts
import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePreparePartition } from '@/utils/nasha.utils';

export function usePartitions(serviceName: string) {
  const preparePartition = usePreparePartition();

  return useQuery({
    queryKey: ['nasha-partitions', serviceName],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<PartitionApiData[]>(
        `${NASHA_BASE_API_URL}/${serviceName}/partition`
      );
      const prepared = data.map((partition) => preparePartition(partition));
      return {
        data: prepared,
        meta: { totalCount: prepared.length },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

**Key Mappings:**
- `OvhApiDedicatedNashaAapi` → `aapi` from `@ovh-ux/manager-core-api`
- `.resetCache()` → Not needed (React Query handles cache)
- `.$promise.then()` → `queryFn` async function
- Service method → Custom hook with `useQuery`

### Iceberg Endpoints

#### AngularJS: Iceberg Query

```javascript
iceberg(`${nashaApiUrl}/partition`)
  .query()
  .expand('CachedObjectList-Pages')
  .execute()
  .$promise
  .then(({ data }) => data.reduce(/* ... */));
```

#### React: fetchIcebergV6

```typescript
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

const result = await fetchIcebergV6<{ size: number }>({
  route: `${NASHA_BASE_API_URL}/${serviceName}/partition`,
  page: 1,
  pageSize: 1000,
});
return result.data.reduce(
  (totalSize: number, partition: { size: number }) => 
    totalSize + partition.size,
  0,
);
```

**Key Mappings:**
- `iceberg().query().expand().execute()` → `fetchIcebergV6` with options
- `expand('CachedObjectList-Pages')` → `pageSize: 1000` (fetch all pages)
- `.$promise` → `await` in async function

## 📘 Utility Functions → Hooks

### Data Preparation with i18n

#### AngularJS: prepareNasha

```javascript
// nasha.utils.js
export const prepareNasha = ({ use, ...nasha }, $translate) => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(use, $translate),
    localeDatacenter: $translate.instant(
      `nasha_datacenter_${nasha.datacenter.toLowerCase()}`,
    ),
    diskSize: `${useSize.value} ${$translate.instant(
      `nasha_use_unit_${useSize.unit}`,
    )}`,
  };
};
```

#### React: usePrepareNasha Hook

```typescript
// nasha.utils.ts
import { useTranslation } from 'react-i18next';

export const prepareNasha = (
  { use, ...nasha }: NashaApiData,
  t: (key: string) => string,
): NashaPrepared => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(use, t),
    localeDatacenter: t(`nasha_datacenter_${nasha.datacenter.toLowerCase()}`),
    diskSize: `${useSize.value} ${t(`nasha_use_unit_${useSize.unit}`)}`,
  };
};

export const usePrepareNasha = () => {
  const { t } = useTranslation();
  return (nasha: NashaApiData) => prepareNasha(nasha, t);
};
```

**Key Mappings:**
- `$translate.instant()` → `t()` from `useTranslation()`
- Utility function with `$translate` → Hook that returns function with `t`
- `prepareNasha(nasha, $translate)` → `usePrepareNasha()(nasha)`

## 📘 Error Handling Mappings

### AngularJS: Alert System

```javascript
resolve: {
  alertError: /* @ngInject */ (alert, $translate) => (error) => {
    const message =
      error.data?.message || error.message || error.toString();
    alert('error', $translate.instant('nasha_error', { message }));
  },
}
```

#### React: ErrorBoundary + Error Utils

```typescript
// error.utils.ts
import type { ApiError } from '@ovh-ux/manager-core-api';

export type ErrorBannerError = {
  data: { message?: string };
  headers?: Record<string, unknown>;
};

export function mapUnknownErrorToBannerError(
  error: unknown,
): ErrorBannerError {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    'message' in error
  ) {
    const apiError = error as ApiError;
    return {
      data: {
        message:
          apiError.response?.data?.message || apiError.message || 'Unknown error',
      },
      headers: apiError.response?.headers || {},
    };
  }

  if (error instanceof Error) {
    return {
      data: { message: error.message },
      headers: {},
    };
  }

  return {
    data: { message: 'An unexpected error occurred' },
    headers: {},
  };
}

// ErrorBoundary.component.tsx
import { Error } from '@ovh-ux/muk';
import { useRouteError } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const errorBannerError = mapUnknownErrorToBannerError(error);

  return (
    <Error
      onReloadPage={() => navigation.reload()}
      onRedirectHome={() => navigation.navigateTo(redirectionApp, '', {})}
      error={errorBannerError}
    />
  );
};
```

**Key Mappings:**
- `alert('error', message)` → `ErrorBoundary` with `Error` component
- `$translate.instant('nasha_error')` → Error message in `ErrorBannerError`
- Route-level error handling → `errorElement={<ErrorBoundary />}` in route

## 📋 Quick Reference Table

| AngularJS | React | Example Location |
|-----------|-------|------------------|
| `$stateProvider.state()` | `<Route>` | `nasha.routing.js` → `Routes.tsx` |
| `redirectTo` | `useEffect` + `navigate()` | `Root.page.tsx` |
| `resolve.nasha` | `useNashaDetail()` | `dashboard.routing.js` → `useNashaDetail.ts` |
| `OvhApiDedicatedNashaAapi` | `aapi` from `manager-core-api` | `usePartitions.ts` |
| `iceberg().query()` | `fetchIcebergV6()` | `usePartitionAllocatedSize.ts` |
| `$state.go()` | `navigate()` | `Dashboard.page.tsx` |
| `component: 'managerListLayout'` | `<BaseLayout>` + `<Datagrid>` | `directory.routing.js` → `Listing.page.tsx` |
| `<oui-tile>` | `<Tile.Root>` | `Dashboard.page.tsx` |
| `<oui-button>` | `<Button>` | `Dashboard.page.tsx` |
| `prepareNasha(nasha, $translate)` | `usePrepareNasha()(nasha)` | `nasha.utils.js` → `nasha.utils.ts` |
| `alert('error')` | `<ErrorBoundary>` | `ErrorBoundary.component.tsx` |

---

## 🤖 AI Development Guidelines

### Essential Mapping Rules for AI Code Generation

1. **Always use real examples**: Reference actual code from nasha → bmc-nasha
2. **Map resolve functions to hooks**: Each resolve becomes a custom hook
3. **Map navigation to handlers**: Navigation functions become component handlers
4. **Preserve data preparation logic**: Keep `prepareNasha` / `preparePartition` patterns
5. **Use AAPI for compatibility**: When AngularJS uses AAPI, use `aapi` in React
6. **Map templates systematically**: OUI → MUK component by component
7. **Handle errors at route level**: Use ErrorBoundary for route errors

### Mapping Checklist

- [ ] All routes mapped from `$stateProvider` to `<Route>`
- [ ] All resolve functions converted to hooks
- [ ] All navigation functions converted to handlers
- [ ] All OUI components mapped to MUK components
- [ ] All API calls mapped (AAPI, Iceberg, v6)
- [ ] All utility functions converted to hooks
- [ ] Error handling mapped to ErrorBoundary
- [ ] Tracking calls preserved with `useOvhTracking`

---

## ⚖️ The Mapping's Moral

- **Real examples** ensure accurate migration
- **Systematic mapping** prevents missing features
- **Pattern preservation** maintains functionality
- **Hook-based architecture** improves testability

**👉 Good mapping is the foundation of successful migration.**

