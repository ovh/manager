---
title: Migration Patterns & Examples
last_update: 2025-01-27
tags: [migration, patterns, examples, angularjs, react, ovhcloud, manager]
ai: true
---

# Migration Patterns & Examples

## 🧭 Purpose

This document provides **essential patterns and examples** for migrating AngularJS modules to React in the OVHcloud Manager ecosystem. It focuses on **practical implementation** with **copy-paste examples** and **quick reference tables**.

## ⚙️ Context

**Core Principle**: **Patterns and examples only** - no lengthy explanations, just what you need to implement migration successfully.

## 🔗 References

- [Migration Guide](./migration-guide.md) - **Strategy and process**
- [User Story Migration Guide](./user-story-migration-guide.md) - **US-centric approach**
- [Parity Validation Guide](./parity-validation-guide.md) - **Validation framework**
- [Development Standards](../30-best-practices/development-standards.md)
- [React Patterns](../30-best-practices/frontend-react-patterns.md)

## 📘 Migration Patterns

### 🔍 Source Code Analysis Patterns

Before mapping AngularJS to React, analyze the source to detect UI/UX patterns:

#### Pattern Detection in Templates

```typescript
// 1. Full Page Layout Detection
// Look for in routing.js resolve:
{
  component: 'managerListLayout',
  resolve: {
    columnConfig: /* ... */,
    topbarOptions: { /* CTA buttons, actions */ }
  }
}
// → React: MUK Layout + Table with header actions

// 2. Header Pattern Detection
// Look for in template.html:
<header class="oui-header">
  <h1 data-ng-bind="$ctrl.title"></h1>
  <button class="btn btn-icon" data-ng-click="$ctrl.edit()">
    <span class="oui-icon oui-icon-pen_concept"></span>
  </button>
</header>
// → React: MUK Layout with title + edit button in header

// 3. Topbar Actions Detection
// Look for in routing resolve:
topbarOptions: {
  cta: { type: 'button', label: 'Order' },
  actions: [
    { text: 'Roadmap', click: () => {} },
    { text: 'Guides', click: () => {} }
  ]
}
// → React: MUK Layout header actions with multiple buttons

// 4. Features Detection Checklist
const detectedFeatures = {
  // Search in template:
  hasSearch: /<input.*ng-model=".*search"/i.test(template),
  
  // Filter button:
  hasFilter: /filter|filtrer/i.test(template),
  
  // Column customization:
  hasColumnCustomization: /customize-columns|column-visibility/i.test(template),
  
  // Pagination:
  hasPagination: /<oui-pagination|pagination-control/i.test(template),
  
  // Page size selector:
  hasPageSize: /items-per-page|page-size-selector/i.test(template),
  
  // Topbar CTA:
  hasTopbarCTA: /topbarOptions.*cta/i.test(routingFile),
  
  // Changelog button:
  hasChangelog: /<changelog-button/i.test(template),
  
  // Guides menu:
  hasGuides: /<oui-guide-menu/i.test(template),
};
```

#### OUI Component Detection Patterns

```typescript
// Scan template for these patterns:
const ouiComponents = {
  // Data display
  '<oui-datagrid>': 'MUK Table',
  '<oui-tile>': 'Custom div with Tailwind',
  '<oui-tile-definition>': 'Definition list (dl/dt/dd)',
  
  // Navigation
  '<oui-header>': 'MUK Layout header prop',
  '<oui-header-tabs>': 'MUK Tabs (or custom tabs if missing)',
  '<oui-breadcrumb>': 'MUK Breadcrumb (or custom if missing)',
  
  // Actions
  '<oui-button>': 'MUK Button',
  '<oui-action-menu>': 'MUK ActionMenu / DropdownMenu',
  '<changelog-button>': 'Custom Button with changelog link',
  '<oui-guide-menu>': 'Custom DropdownMenu with guides',
  
  // Forms
  '<oui-field>': 'MUK FormField',
  '<oui-input>': 'MUK Input',
  '<oui-select>': 'MUK Select',
  '<oui-checkbox>': 'MUK Checkbox',
  
  // Feedback
  '<oui-modal>': 'MUK Modal',
  '<oui-message>': 'MUK Message',
  '<oui-spinner>': 'MUK Loader/Spinner',
};
```

#### Translation Keys Pattern Analysis

```typescript
// From Messages_*.json files:
// 1. Identify key prefixes to understand structure
const translationKeyPatterns = {
  // Pattern: module_page_element_detail
  listing: 'nasha_listing_*',        // Listing page keys
  onboarding: 'nasha_onboarding_*',  // Onboarding keys
  dashboard: 'nasha_dashboard_*',    // Dashboard keys
  common: 'nasha_common_*',          // Shared keys
  
  // Column headers pattern:
  columns: 'nasha_listing_serviceName',  // Use same keys in React
  
  // Action buttons pattern:
  actions: 'nasha_listing_order',        // Button labels
  
  // Enumerations pattern:
  enums: 'nasha_listing_canCreatePartition_true',  // Boolean/enum values
};
```

### 🈺 i18n Migration Rules and Patterns

#### Core Rule
- **Translation values must be preserved verbatim** from AngularJS to React. Only the keys/namespaces may be changed to rationalize the nomenclature.

#### Allowed
- Renaming keys to align with new module structure/namespaces.
- Grouping/scoping keys under clearer namespaces.

#### Not Allowed
- Changing translation values (texts) during migration.
- “Improving” wording, punctuation, or casing.

#### Recommended Process
1. Extract legacy `Messages_*.json` and build a key→value map.
2. Define the new key schema/namespaces for the React µapp.
3. Generate a legacy→new key mapping that keeps values identical.
4. Implement translations in React using the new keys and the same values.
5. Document the mapping in `MIGRATION_NOTES.md`.

#### Example: Key Rationalization (Values Unchanged)
```json
// Legacy (AngularJS)
{
  "nasha_listing_serviceName": "Service name",
  "nasha_listing_order": "Order"
}

// New (React) — keys renamed, values identical
{
  "nasha.listing.columns.serviceName": "Service name",
  "nasha.listing.actions.order": "Order"
}
```

#### React Usage Example
```typescript
// Old: t('nasha_listing_order')
// New: keys changed, values preserved
const { t } = useTranslation('nasha');
<Button>{t('listing.actions.order')}</Button>
```

#### Validation Pattern
```typescript
// Validate rendered texts match legacy values exactly
expect(screen.getByText('Service name')).toBeInTheDocument();
expect(screen.getByText('Order')).toBeInTheDocument();
// Do not assert on key names; only assert on visible text
```

### 🖼️ Image/Asset Migration Rules and Patterns

#### Core Rule
- **Image assets must be preserved verbatim**: reuse the exact same image files (pixels/content) from AngularJS in React when those images are used.

#### Allowed
- Reorganizing images in a new folder structure and renaming files.
- Converting import paths (e.g., relative paths to bundler imports) without changing the image itself.

#### Not Allowed
- Changing the image content, dimensions, or visual appearance during migration.
- Replacing with different assets unless explicitly required by design and documented.

#### Recommended Process
1. Inventory legacy images (usage-based): scan templates for `<img>`, background images, icons.
2. Copy only used images into the React project (same files/bytes).
3. Define the new assets structure (e.g., `src/assets/images/...`).
4. Create a legacy→new path mapping table and store it in `MIGRATION_NOTES.md`.
5. Update components to load images via the bundler/import while preserving the asset file unchanged.

#### Examples
```html
<!-- Legacy (AngularJS template) -->
<img src="assets/images/nasha/logo.png" alt="NAS-HA" />
```

```typescript
// New (React component)
import nashaLogo from '@/assets/images/nasha/logo.png';

export function NashaHeaderLogo() {
  return <img src={nashaLogo} alt="NAS-HA" />;
}
```

#### Validation Pattern (Visual)
```typescript
// Validate that the expected image is rendered
const img = screen.getByAltText('NAS-HA');
expect(img).toBeInTheDocument();
// Optionally, ensure the src ends with expected filename (path may differ by bundler)
expect(img.getAttribute('src')).toContain('logo');
```
### 🎯 Core AngularJS → React Mappings

#### 1. **Controller → Hook (Advanced React Query Patterns)**

**Basic Pattern:**
```typescript
// AngularJS Controller
angular.controller('UserController', function($scope, UserService) {
  $scope.users = [];
  $scope.loading = false;
  
  $scope.loadUsers = function() {
    $scope.loading = true;
    UserService.getUsers().then(function(users) {
      $scope.users = users;
      $scope.loading = false;
    });
  };
});

// React Hook (Basic)
export function useUserController() {
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
  
  return {
    users: users || [],
    loading: isLoading,
    loadUsers: refetch
  };
}
```

**Advanced Pattern (with InfiniteQuery, Selectors, and Cache Management):**
```typescript
// React Hook (Advanced - following PCI project patterns)
import { InfiniteData, keepPreviousData, QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { usersSelector } from './selectors/users.selector';
import { usersQueryKey } from './utils/queryKeys';

export function useUsers(params: {
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: Filter[];
}) {
  const queryClient = useQueryClient();
  
  // Structured query keys
  const queryKey = useMemo(
    () => usersQueryKey(['list', 'sort', params.sort, params.sortOrder]),
    [params.sort, params.sortOrder]
  );

  // Cache invalidation helper
  const invalidateQuery = useCallback(
    async (queryKeyToInvalidate: QueryKey) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeyToInvalidate,
        exact: true,
      });
    },
    [queryClient],
  );

  // Refresh function
  const refresh = useCallback(() => {
    void invalidateQuery(queryKey);
  }, [invalidateQuery, queryKey]);

  // InfiniteQuery with selector for data transformation
  const { data, ...rest } = useInfiniteQuery({
    queryKey,
    retry: false,
    initialPageParam: 0,
    refetchOnWindowFocus: 'always',
    queryFn: ({ pageParam }) => fetchUsers({
      limit: params.limit,
      offset: pageParam * params.limit,
      sort: params.sort,
      sortOrder: params.sortOrder,
      filters: params.filters,
    }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length > params.limit ? lastPageParam + 1 : null,
    // Selector separates fetch logic from transformation
    select: useCallback(
      (rawData: InfiniteData<UserDto[], number>) =>
        usersSelector(rawData, params.limit),
      [params.limit],
    ),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    refresh,
    ...rest,
  };
}
```

#### 2. **Service → Hook**
```typescript
// AngularJS Service
angular.service('UserService', function($http) {
  this.getUsers = function() {
    return $http.get('/api/users').then(response => response.data);
  };
});

// React Hook
export function useUserService() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
}
```

#### 3. **Template → Component**
```typescript
// AngularJS Template
<div ng-repeat="user in users" ng-if="!loading">
  <h3>{{user.name}}</h3>
  <p>{{user.email}}</p>
</div>

// React Component
export function UserList({ users, loading }: { users: User[], loading: boolean }) {
  if (loading) return <Loader />;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <Text size="l" weight="bold">{user.name}</Text>
          <Text>{user.email}</Text>
        </div>
      ))}
    </div>
  );
}
```

#### 4. **Form → React Hook Form**
```typescript
// AngularJS Form
<form ng-submit="submit()">
  <input ng-model="user.name" required />
  <input ng-model="user.email" type="email" required />
  <button type="submit">Submit</button>
</form>

// React Form
export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField error={errors.name?.message}>
        <Input {...register('name')} />
      </FormField>
      <FormField error={errors.email?.message}>
        <Input {...register('email')} type="email" />
      </FormField>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### 🏗️ Essential Page Patterns

#### Pattern 1: List Page
```typescript
// AngularJS List Controller
angular.controller('UserListController', function($scope, UserService) {
  $scope.users = [];
  $scope.loading = false;
  
  $scope.loadUsers = function() {
    $scope.loading = true;
    UserService.getUsers().then(function(users) {
      $scope.users = users;
      $scope.loading = false;
    });
  };
});

// React List Page
export function UserListPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
  
  return (
    <Table
      columns={userColumns}
      data={users || []}
      loading={isLoading}
    />
  );
}
```

#### Pattern 2: Detail Page
```typescript
// AngularJS Detail Controller
angular.controller('UserDetailController', function($scope, $routeParams, UserService) {
  $scope.user = null;
  $scope.loading = false;
  
  $scope.loadUser = function() {
    $scope.loading = true;
    UserService.getUser($routeParams.id).then(function(user) {
      $scope.user = user;
      $scope.loading = false;
    });
  };
});

// React Detail Page
export function UserDetailPage() {
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => apiClient.v6.get(`/api/users/${id}`).then(res => res.data)
  });
  
  if (isLoading) return <Loader />;
  if (!user) return <Message>User not found</Message>;
  
  return <UserDetail user={user} />;
}
```

#### Pattern 3: Form Page
```typescript
// AngularJS Form Controller
angular.controller('UserFormController', function($scope, UserService) {
  $scope.user = { name: '', email: '' };
  $scope.errors = {};
  
  $scope.submit = function() {
    if ($scope.validate()) {
      UserService.createUser($scope.user);
    }
  };
});

// React Form Page
export function UserFormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });
  
  const { mutate: createUser } = useMutation({
    mutationFn: (userData) => apiClient.v6.post('/api/users', userData)
  });
  
  return (
    <form onSubmit={handleSubmit(createUser)}>
      <FormField error={errors.name?.message}>
        <Input {...register('name')} />
      </FormField>
      <FormField error={errors.email?.message}>
        <Input {...register('email')} type="email" />
      </FormField>
      <Button type="submit">Create User</Button>
    </form>
  );
}
```

### 🎯 Quick Reference Tables

#### AngularJS → React Mapping
| AngularJS | React | Notes |
|----------|-------|-------|
| `Controller` | `Hook` | `use<ControllerName>` |
| `Service` | `Hook` | `use<ServiceName>` |
| `Template` | `Component` | `<ComponentName>` |
| `Filter` | `Utility` | `<filterName>` |
| `Directive` | `Component` | `<DirectiveName>` |
| `$scope` | `useState` | `const [state, setState] = useState()` |
| `$http` | `apiClient` | `apiClient.v6.get()` |
| `$q` | `async/await` | Native promises |
| `ng-repeat` | `map()` | `items.map(item => <Item key={item.id} />)` |
| `ng-if` | `{condition && <Component />}` | Conditional rendering |
| `ng-click` | `onClick` | Event handlers |
| `ng-model` | `value + onChange` | Controlled inputs |

#### Essential OVH Patterns

**Basic Data Fetching:**
```typescript
// Data fetching
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
}
```

**Advanced Data Fetching (PCI Project Patterns):**
```typescript
// QueryClient Configuration (src/QueryClient.ts)
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false, // No automatic retry (handled by components)
      refetchOnWindowFocus: false, // Avoid unnecessary refetch
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys Factory (src/data/api/hooks/utils/queryKeys.ts)
export function usersQueryKey(parts: string[]): QueryKey {
  return ['users', ...parts];
}

// Selector for Data Transformation (src/data/api/hooks/selectors/users.selector.ts)
export function usersSelector(
  { pages }: InfiniteData<UserDto[], number>,
  limit: number,
): User[] {
  return pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((userDto) => ({
      ...userDto,
      status: getUserStatus(userDto.status),
      // Transform DTOs to application entities
    }));
}

// Advanced Hook with Selectors
export function useUsers(params: UseUsersParams) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => usersQueryKey(['list']), []);

  const { data, ...rest } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchUsers({ ...params, offset: pageParam }),
    select: useCallback(
      (rawData) => usersSelector(rawData, params.limit),
      [params.limit],
    ),
    placeholderData: keepPreviousData,
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { data, refresh, ...rest };
}
```

**Mutations:**
```typescript
// Mutations
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => apiClient.v6.post('/api/users', userData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
}
```

**Error Handling with ErrorBoundary:**
```typescript
// Error Boundary (src/components/debug/ErrorBoundary.component.tsx)
import { Error } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useRouteError } from 'react-router-dom';
import { useContext } from 'react';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const { navigation } = useContext(ShellContext).shell;
  const errorBannerError = mapUnknownErrorToBannerError(error);

  const navigateToHomePage = () => {
    navigation.navigateTo('redirection-app', '', {});
  };

  const reloadPage = () => {
    navigation.reload();
  };

  return (
    <Error
      onReloadPage={reloadPage}
      onRedirectHome={navigateToHomePage}
      error={errorBannerError}
    />
  );
};

// Error Utils (src/utils/error.utils.ts)
export function mapUnknownErrorToBannerError(error: unknown): ErrorBannerError {
  if (error instanceof ApiError) {
    return {
      data: { message: error.response?.data?.message || error.message },
      headers: error.response?.headers || {},
    };
  }
  return {
    data: { message: error instanceof Error ? error.message : 'Unknown error' },
    headers: {},
  };
}
```

**Hooks Extraction Pattern:**
```typescript
// useHidePreloader (src/hooks/useHidePreloader.ts)
import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export function useHidePreloader() {
  const { shell } = useContext(ShellContext);
  useEffect(() => {
    shell?.ux.hidePreloader();
  }, [shell]);
}

// useShellRoutingSync (src/hooks/useShellRoutingSync.ts)
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

export function useShellRoutingSync() {
  useRouteSynchro();
  return null;
}
```

### 🚫 Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Big Bang migration
// Don't migrate entire module at once

// ✅ CORRECT: Incremental migration
// One component at a time

// ❌ WRONG: Skipping tests
// Don't migrate without tests

// ✅ CORRECT: Tests first
// Write tests before migration

// ❌ WRONG: Changing business logic
// Don't "improve" during migration

// ✅ CORRECT: Identical logic
// Reproduce exactly
```

### ✅ Best Practices

```typescript
// ✅ CORRECT: Use OVH patterns
// MUK + Manager conventions

// ✅ CORRECT: TypeScript strict
// No any, clean interfaces

// ✅ CORRECT: Complete parity
// Visual, functional, technical

// ✅ CORRECT: Incremental validation
// Validate each step
```

### 🚀 Quick Migration Workflow

#### Step 1: Analyze
```bash
# 1. Identify AngularJS components
@codebase_search "AngularJS controllers in target module"

# 2. Map to React
@create_file "docs/mapping.md"
```

#### Step 2: Migrate
```bash
# 3. Create React hook
@create_file "src/hooks/use<Component>.ts"

# 4. Create React component
@create_file "src/components/<Component>.tsx"

# 5. Create tests
@create_file "src/components/<Component>.test.tsx"
```

#### Step 3: Validate
```bash
# 6. Run tests
@run_tests "npm test"

# 7. Check parity
@run_parity_test "npm run test:parity"
```

### 📋 Migration Checklist

#### Pre-Migration
- [ ] AngularJS code analyzed
- [ ] Dependencies identified
- [ ] Migration plan created

#### During Migration
- [ ] React hook created
- [ ] React component created
- [ ] Tests written
- [ ] MUK components used

#### Post-Migration
- [ ] Visual parity validated
- [ ] Functional parity validated
- [ ] Performance validated
- [ ] Accessibility validated
- [ ] Documentation updated

---

## 🤖 AI Development Guidelines

### Essential Migration Rules for AI Code Generation

1. **Incremental migration**: One component at a time
2. **100% parity**: Visual, functional, technical
3. **OVHcloud standards**: MUK + Manager conventions
4. **TypeScript strict**: No any, clean interfaces
5. **Complete tests**: Unit tests + E2E tests
6. **Accessibility**: Maintain accessibility level
7. **Performance**: No regression
8. **Documentation**: Update migration notes

### Migration Checklist

- [ ] AngularJS code analyzed
- [ ] React hook created
- [ ] React component created
- [ ] Tests written and passing
- [ ] Visual parity validated
- [ ] Functional parity validated
- [ ] Performance parity validated
- [ ] Documentation updated
- [ ] Ready for next component

## 🔍 Pattern Detection Rules (Automated)

### Route Detection Patterns

```typescript
// Pattern: $stateProvider.state('name', { ... })
const statePattern = /\$stateProvider\.state\(['"]([^'"]+)['"]\s*,\s*\{/g;

// Extract:
// - State name: 'module.submodule'
// - URL pattern: url: '/path/:param'
// - Component: component: 'componentName'
// - Resolves: resolve: { ... }
// - RedirectTo: redirectTo: (transition) => ...

// Example detection:
const states = [
  {
    name: 'nasha.dashboard',
    url: '/:serviceName',
    component: 'nashaDashboard',
    hasResolves: true,
    hasRedirectTo: false,
  },
];
```

### Resolve Function Detection

```typescript
// Pattern: name: /* @ngInject */ (...) => ...
const resolvePattern = /(\w+):\s*\/\*\s*@ngInject\s*\*\/\s*\(([^)]*)\)\s*=>/g;

// Extract:
// - Resolve name
// - Dependencies (injections)
// - Function body
// - Return type (promise, value, function)

// Example detection:
const resolves = [
  {
    name: 'nasha',
    dependencies: ['OvhApiDedicatedNasha', 'serviceName', 'prepareNasha'],
    usesAAPI: true,
    usesIceberg: false,
    usesHttp: false,
    returnsPromise: true,
  },
];
```

### OUI Component Detection

```typescript
// Patterns in templates
const ouiPatterns = {
  datagrid: /<oui-datagrid[^>]*>/i,
  tile: /<oui-tile[^>]*>/i,
  tileDefinition: /<oui-tile-definition[^>]*>/i,
  button: /<oui-button[^>]*>/i,
  modal: /<oui-modal[^>]*>/i,
  header: /<header[^>]*class="oui-header"/i,
  tabs: /<oui-header-tabs[^>]*>/i,
  actionMenu: /<oui-action-menu[^>]*>/i,
  message: /<oui-message[^>]*>/i,
  managerListLayout: /<manager-list-layout[^>]*>/i,
  changelogButton: /<changelog-button[^>]*>/i,
  guideMenu: /<oui-guide-menu[^>]*>/i,
};

// Example detection:
const detectedComponents = {
  hasDatagrid: true,
  hasTiles: true,
  hasButtons: 3,
  hasModals: 1,
  hasManagerListLayout: true,
};
```

### API Endpoint Detection

```typescript
// Patterns in controllers/services
const apiPatterns = {
  aapi: /OvhApi\w+\.Aapi\(\)/g,
  iceberg: /iceberg\([^)]+\)/g,
  http: /\$http\.(get|post|put|delete)\(['"]([^'"]+)['"]/g,
  v6: /v6\.(get|post|put|delete)\(['"]([^'"]+)['"]/g,
};

// Example detection:
const apiEndpoints = [
  {
    type: 'aapi',
    method: 'get',
    endpoint: '/dedicated/nasha/{serviceName}',
    location: 'resolve.nasha',
  },
  {
    type: 'iceberg',
    method: 'query',
    endpoint: '/dedicated/nasha/{serviceName}/partition',
    location: 'resolve.partitionAllocatedSize',
  },
];
```

## 🎯 Resolve Function Mapping Patterns

### Pattern 1: Simple Data Fetching (AAPI)

**AngularJS:**
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

**React Hook:**
```typescript
export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();
  return useQuery({
    queryKey: ['nasha-detail', serviceName],
    queryFn: async () => {
      const { data } = await aapi.get(`${BASE_API_URL}/${serviceName}`);
      return prepareNasha(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

**Detection Rule:**
- Contains `OvhApi*.Aapi()`
- Contains `.resetCache()`
- Returns `.$promise.then(prepareFunction)`
- → Map to `useQuery` with `aapi` and preparation hook

### Pattern 2: Iceberg Query

**AngularJS:**
```javascript
resolve: {
  partitionAllocatedSize: /* @ngInject */ (iceberg, nashaApiUrl) =>
    iceberg(`${nashaApiUrl}/partition`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data.reduce(/* ... */)),
}
```

**React Hook:**
```typescript
export function usePartitionAllocatedSize(serviceName: string) {
  return useQuery({
    queryKey: ['nasha-partition-allocated-size', serviceName],
    queryFn: async () => {
      const { fetchIcebergV6 } = await import('@ovh-ux/manager-core-api');
      const result = await fetchIcebergV6({
        route: `${BASE_API_URL}/${serviceName}/partition`,
        page: 1,
        pageSize: 1000,
      });
      return result.data.reduce(/* ... */);
    },
  });
}
```

**Detection Rule:**
- Contains `iceberg().query()`
- Contains `.expand('CachedObjectList-Pages')`
- → Map to `fetchIcebergV6` with `pageSize: 1000`

### Pattern 3: Calculated Resolve

**AngularJS:**
```javascript
resolve: {
  canCreatePartitions: /* @ngInject */ (partitionAllocatedSize, nasha) =>
    partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN,
}
```

**React Hook:**
```typescript
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
      allocatedSize <= nashaZpoolSize - SIZE_MIN_BYTES,
    allocatedSize,
  };
}
```

**Detection Rule:**
- Depends on other resolves
- Contains calculation logic
- → Map to hook that uses other hooks

### Pattern 4: Navigation Function

**AngularJS:**
```javascript
resolve: {
  goToPartitionsCreate: /* @ngInject */ ($state, serviceName) => () =>
    $state.go(`${dashboardStateName}.partitions.create`, { serviceName }),
}
```

**React Handler:**
```typescript
const handleGoToPartitionsCreate = () => {
  trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'create-partition'] });
  navigate(`/${serviceName}/partitions/create`);
};
```

**Detection Rule:**
- Returns a function
- Contains `$state.go()`
- → Map to component handler with `navigate()`

## 🚨 Edge Cases & Special Patterns

### Edge Case 1: Conditional Redirect (redirectTo)

**AngularJS (nasha.routing.js):**
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

**React (Root.page.tsx):**
```typescript
export default function RootPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useNashaServicesCheck();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.hasServices) {
        navigate('listing', { replace: true });
      } else {
        navigate('onboarding', { replace: true });
      }
    }
  }, [data, isLoading, navigate]);

  return null; // Redirect only
}
```

**Mapping Strategy:**
1. Create `RootPage` component
2. Create hook to check if services exist (equivalent to redirectTo logic)
3. Use `useEffect` to navigate based on result
4. Return `null` or loading spinner

### Edge Case 2: AAPI with resetCache

**AngularJS:**
```javascript
resolve: {
  nasha: /* @ngInject */ (
    OvhApiDedicatedNasha,
    serviceName,
    prepareNasha,
  ) => {
    const aapi = OvhApiDedicatedNasha.Aapi();
    aapi.resetCache(); // Important: clears cache
    return aapi.get({ serviceName }).$promise.then(prepareNasha);
  },
}
```

**React:**
```typescript
export function useNashaDetail(serviceName: string) {
  const prepareNasha = usePrepareNasha();
  return useQuery({
    queryKey: ['nasha-detail', serviceName],
    queryFn: async () => {
      // Note: React Query handles cache, resetCache not needed
      // But if needed, use queryClient.invalidateQueries before fetch
      const { data } = await aapi.get(`${BASE_API_URL}/${serviceName}`);
      return prepareNasha(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

**Mapping Strategy:**
- `resetCache()` is not needed in React Query (cache is managed automatically)
- If cache invalidation is needed, use `queryClient.invalidateQueries()` before fetch
- Or use `refetch()` to force refresh

### Edge Case 3: Complex Resolve Functions

**AngularJS:**
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
}
```

**React:**
```typescript
// In component
const handleGoBack = (options?: {
  success?: string;
  error?: Error;
  reload?: boolean;
}) => {
  if (options?.success) {
    // Show success notification
    showNotification({ type: 'success', message: options.success });
  }
  if (options?.error) {
    // Show error notification
    showNotification({ type: 'error', message: options.error.message });
  }
  
  if (options?.reload) {
    // Invalidate queries to reload data
    queryClient.invalidateQueries({ queryKey: ['nasha-detail', serviceName] });
  }
  
  navigate(`/${serviceName}`, { replace: true });
};
```

**Mapping Strategy:**
- Navigation functions become component handlers
- Alert system becomes notification system
- Reload logic becomes cache invalidation
- Promise-based becomes callback-based

### Edge Case 4: managerListLayout Mapping

**AngularJS (directory.routing.js):**
```javascript
component: 'managerListLayout',
resolve: {
  columnConfig: /* @ngInject */ ($translate) => ({
    data: [
      {
        label: $translate.instant('key'),
        property: 'field',
        serviceLink: true,
        hidden: false,
        format: (row) => formatValue(row.field),
      }
    ],
  }),
  topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
    cta: {
      type: 'button',
      label: $translate.instant('order_label'),
      onClick: () => $state.go('nasha.order'),
    },
  }),
}
```

**React (Listing.page.tsx):**
```typescript
<BaseLayout
  header={{
    title: t('listing_title'),
    changelogButton: <ChangelogMenu />,
    guideMenu: <GuideMenu />,
  }}
>
  <Button onClick={handleOrderClick}>
    {t('order_label')}
  </Button>
  <Datagrid
    columns={columns}
    data={data}
    // ... other props
  />
</BaseLayout>
```

**Mapping Strategy:**
1. `component: 'managerListLayout'` → `<BaseLayout>` + `<Datagrid>`
2. `columnConfig.data` → `columns` array with `DatagridColumn` type
3. `topbarOptions.cta` → `<Button>` in header area
4. `serviceLink: true` → Custom `cell` renderer with `<Link>`
5. `format` function → Custom `cell` renderer
6. `ListLayoutHelper.stateResolves` → Custom hooks for pagination, sorting, filtering

## 🔗 AAPI Integration Pattern

### When to Use AAPI

Use AAPI when AngularJS code uses:
- `OvhApi*.Aapi()`
- `.resetCache()` (though not needed in React)
- AAPI-specific endpoints

### Pattern Template

```typescript
import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { usePrepareData } from '@/utils/{module}.utils';

export function useDataDetail(id: string) {
  const prepareData = usePrepareData();
  
  return useQuery({
    queryKey: ['{module}-detail', id],
    queryFn: async () => {
      // Use AAPI endpoint like AngularJS does
      const { data } = await aapi.get<DataApiType>(
        `${BASE_API_URL}/${id}`
      );
      return prepareData(data) as DataPrepared;
    },
    staleTime: 2 * 60 * 1000,
  });
}
```

## 🔗 Iceberg Integration Pattern

### When to Use Iceberg

Use Iceberg when AngularJS code uses:
- `iceberg().query()`
- `.expand('CachedObjectList-Pages')`
- Pagination with Iceberg

### Pattern Template

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export function useDataList(params: {
  page?: number;
  pageSize?: number;
  filters?: Filter[];
}) {
  return useQuery({
    queryKey: ['{module}-list', params],
    queryFn: async () => {
      const result = await fetchIcebergV6<DataType>({
        route: BASE_API_URL,
        page: params.page || 1,
        pageSize: params.pageSize || 50,
        filters: params.filters,
      });
      return {
        data: result.data,
        totalCount: result.totalCount,
      };
    },
  });
}
```

## 📋 Template Component Mapping (OUI → MUK)

| OUI Component | MUK Component | Notes |
|---------------|---------------|-------|
| `<oui-datagrid>` | `<Datagrid>` | Full feature parity |
| `<oui-tile>` | `<Tile.Root>` | With `<Tile.Item.Root>` |
| `<oui-tile-definition>` | `<Tile.Item.Term>` + `<Tile.Item.Description>` | Nested in `<Tile.Item.Root>` |
| `<oui-button>` | `<Button>` | Variants: default, ghost, primary |
| `<oui-modal>` | `<Modal>` | From MUK |
| `<oui-header>` | `BaseLayout` header prop | Or custom header component |
| `<oui-header-tabs>` | Custom tabs with `NavLink` | Or MUK Tabs if available |
| `<oui-action-menu>` | `<ActionMenu>` | Full feature parity |
| `<oui-message>` | `<Message>` | From MUK |
| `<manager-list-layout>` | `<BaseLayout>` + `<Datagrid>` | Complete layout |
| `<changelog-button>` | `<ChangelogMenu>` | From MUK |
| `<oui-guide-menu>` | `<GuideMenu>` | From MUK |

---

## ⚖️ The Migration's Moral

- **Incremental migration** reduces risks
- **100% parity** ensures user experience
- **Complete testing** prevents regressions
- **OVHcloud standards** ensure consistency
- **Pattern detection** automates repetitive tasks
- **Edge case handling** ensures completeness

**👉 Good migration is invisible to users but transformative for developers.**
