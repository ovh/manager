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
// → React: BaseLayout + Datagrid with header actions

// 2. Header Pattern Detection
// Look for in template.html:
<header class="oui-header">
  <h1 data-ng-bind="$ctrl.title"></h1>
  <button class="btn btn-icon" data-ng-click="$ctrl.edit()">
    <span class="oui-icon oui-icon-pen_concept"></span>
  </button>
</header>
// → React: BaseLayout with title + edit button in header

// 3. Topbar Actions Detection
// Look for in routing resolve:
topbarOptions: {
  cta: { type: 'button', label: 'Order' },
  actions: [
    { text: 'Roadmap', click: () => {} },
    { text: 'Guides', click: () => {} }
  ]
}
// → React: BaseLayout header.actions with multiple buttons

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
  '<oui-datagrid>': 'MUK Datagrid',
  '<oui-tile>': 'Custom div with Tailwind',
  '<oui-tile-definition>': 'Definition list (dl/dt/dd)',
  
  // Navigation
  '<oui-header>': 'BaseLayout header prop',
  '<oui-header-tabs>': 'Custom tabs or MUK Tabs',
  '<oui-breadcrumb>': 'Custom breadcrumb',
  
  // Actions
  '<oui-button>': 'MUK Button',
  '<oui-action-menu>': 'MUK ActionMenu or DropdownMenu',
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
  '<oui-spinner>': 'CSS spinner (MUK has no Spinner)',
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

### 🎯 Core AngularJS → React Mappings

#### 1. **Controller → Hook**
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

// React Hook
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
  if (loading) return <OsdsSpinner />;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <OsdsText size="l" weight="bold">{user.name}</OsdsText>
          <OsdsText>{user.email}</OsdsText>
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
      <OsdsFormField error={errors.name?.message}>
        <OsdsInput {...register('name')} />
      </OsdsFormField>
      <OsdsFormField error={errors.email?.message}>
        <OsdsInput {...register('email')} type="email" />
      </OsdsFormField>
      <OsdsButton type="submit">Submit</OsdsButton>
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
    <Datagrid
      columns={userColumns}
      items={users || []}
      isLoading={isLoading}
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
  
  if (isLoading) return <OsdsSpinner />;
  if (!user) return <OsdsMessage>User not found</OsdsMessage>;
  
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
      <OsdsFormField error={errors.name?.message}>
        <OsdsInput {...register('name')} />
      </OsdsFormField>
      <OsdsFormField error={errors.email?.message}>
        <OsdsInput {...register('email')} type="email" />
      </OsdsFormField>
      <OsdsButton type="submit">Create User</OsdsButton>
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
```typescript
// Data fetching
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
}

// Mutations
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => apiClient.v6.post('/api/users', userData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
}

// Error handling
export function useUsers() {
  const { addError } = useNotifications();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data),
    onError: (error) => {
      addError('Failed to load users');
    }
  });
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

---

## ⚖️ The Migration's Moral

- **Incremental migration** reduces risks
- **100% parity** ensures user experience
- **Complete testing** prevents regressions
- **OVHcloud standards** ensure consistency

**👉 Good migration is invisible to users but transformative for developers.**
