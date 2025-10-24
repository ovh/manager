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
