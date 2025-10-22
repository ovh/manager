---
title: AngularJS → React Migration Guide
last_update: 2025-01-27
tags: [migration, angularjs, react, patterns, strangler, templates, documentation]
ai: true
---

# AngularJS → React Migration Guide

## 📋 Table of Contents

1. [Purpose & Context](#-purpose)
2. [Migration Patterns](#-migration-patterns)
   - [AngularJS → React Mapping](#-angularjs--react-mapping)
   - [Strangler Pattern Strategy](#-strangler-pattern-strategy)
   - [Target Architecture](#️-target-architecture)
   - [Quality Constraints](#-quality-constraints)
3. [Detailed Migration Patterns (OVH Specifics)](#-migration-patterns)
   - [Forms and Validation](#1-forms-and-validation)
   - [State Management and Services](#2-state-management-and-services)
   - [Directives to Components/Hooks](#3-directives-to-componentshooks)
   - [Data Grid and Tables](#4-data-grid-and-tables)
   - [AT Internet Tracking](#5-at-internet-tracking)
   - [Error Handling](#6-error-handling)
   - [Lifecycle Hooks](#7-lifecycle-hooks)
   - [Performance](#8-performance)
   - [Accessibility (A11Y)](#9-accessibility-a11y)
   - [Debugging and DevTools](#10-debugging-and-devtools)
   - [Routing and Deep Linking](#11-routing-and-deep-linking)
   - [Complex Migration Patterns](#12-complex-migration-patterns)
4. [Pre-Migration Audit](#-pre-migration-audit)
5. [AI Migration Prompts](#-ai-migration-prompts)
6. [Migration Testing Strategy](#-migration-testing-strategy)
7. [Incremental Migration](#-incremental-migration)
8. [Feedback Loop](#-feedback-loop)
9. [Migration Templates](#-migration-templates)
10. [Guidelines for AI Development](#-guidelines-for-ai-development)

## 🧭 Purpose

This document provides a comprehensive guide for migrating AngularJS 1.x modules to React 18/TypeScript in the OVHcloud Manager ecosystem. It includes migration patterns, implementation strategies, and standardized templates for documenting and planning migrations.

## 🤖 AI Role & Mission

### AI Role
You are a **senior frontend migration expert** (AngularJS 1.x → React 18/TypeScript) and **industrial software engineering specialist**.

### Mission
Migrate an AngularJS 1.x module to React/TypeScript **without functional loss**, following the **strangler pattern**.

### Technical Context
See @.ai-doc/ for complete technical stack details, migration patterns, and quality standards.

### Required Inputs
- `/reference/legacy/<TARGET_MODULE>` : original AngularJS code
- Functional specifications and API contracts

### Expected Deliverables
1. `/docs/PLAN.md` : detailed migration plan (see templates below)
2. Migrated React/TypeScript code with tests
3. `/docs/MIGRATION_NOTES.md` : decision documentation
4. Functional/UX parity validation

### Conventions to Follow
See @.ai-doc/30-best-practices/ for development standards, React patterns, and quality conventions.

### Output Mode
Provide readable Git diff + installation commands + clear plan before code.

## 🎯 Cursor-Specific Instructions

### Execution Workflow
1. **Always start with audit**: Use `codebase_search` to analyze AngularJS code
2. **Create plan first**: Generate `/docs/PLAN.md` before any code
3. **Incremental migration**: One component/service at a time
4. **Test at each step**: Validate immediately after each migration
5. **Continuous documentation**: Update MIGRATION_NOTES.md at each step

### Recommended Cursor Commands
```bash
# 1. Initial audit
@codebase_search "AngularJS controllers in target module"

# 2. Create plan
@create_file "docs/PLAN.md" with provided template

# 3. Step-by-step migration
@create_file "src/hooks/useUserService.ts" 
@create_file "src/components/UserList.tsx"
@create_file "src/components/UserList.test.tsx"

# 4. Validation
@run_tests "npm test"
@run_lint "npm run lint"
```

### Optimal Cursor Workflow
1. **Explore** → `codebase_search` to understand AngularJS code
2. **Plan** → Create PLAN.md with detailed mapping
3. **Code** → Incremental migration with tests
4. **Test** → Parity validation at each step
5. **Document** → Update migration notes

### Validation Automation
```typescript
// Execute after each migration
describe('Parity Validation', () => {
  it('should maintain identical functionality', () => {
    expect(reactComponent).toHaveSameBehavior(angularJSComponent);
  });
  
  it('should maintain identical UI', () => {
    expect(reactComponent).toMatchVisualSnapshot(angularJSComponent);
  });
  
  it('should maintain identical performance', () => {
    expect(reactComponent).toHaveSamePerformance(angularJSComponent);
  });
});
```

### Error Management
```typescript
// Common errors and solutions
const commonErrors = {
  incompleteMigration: {
    error: "Missing functionality after migration",
    solution: "Check AngularJS → React mapping in PLAN.md",
    validation: "Run all parity tests"
  },
  
  performanceRegression: {
    error: "Performance degradation",
    solution: "Optimize with useMemo, useCallback, lazy loading",
    validation: "Measure LCP, INP, CLS"
  },
  
  visualRegression: {
    error: "Different interface",
    solution: "Check ODS components usage",
    validation: "Compare visually side by side"
  }
};
```

### Success Metrics
```typescript
const migrationKPIs = {
  functionalParity: "100% of functionalities reproduced",
  visualParity: "Interface identical pixel by pixel", 
  performanceParity: "Equivalent or better performance",
  testCoverage: "90%+ test coverage",
  lintingScore: "0 ESLint/TypeScript errors",
  accessibilityScore: "100% accessibility tests pass"
};
```

## ⚙️ Context

AngularJS → React migration follows these principles:
- **Strangler Pattern**: progressive cohabitation of both technologies
- **Incremental migration**: route by route or screen by screen, no Big Bang
- **Complete functional parity**: identical UX and functionality
- **Continuous delivery**: each increment is tested and documented
- **OVHcloud standards**: respect for Manager conventions and ODS

The templates provided in this document are used to:
- **Plan** module migration
- **Document** decisions and deviations
- **Structure** migration work
- **Validate** functional parity

## 🔗 References

- [Manager Architecture Overview](../10-architecture/api-overview.md)
- [Development Standards](./development-standards.md)
- [React Patterns](./frontend-react-patterns.md)
- [MRC Components](../20-dependencies/mrc-components.md)
- [ODS Components](../20-dependencies/ods-components.md)

---

# Part 1: Migration Patterns

## 📘 AngularJS → React Mapping

| AngularJS                | React/TS equivalent             | Notes |
| ------------------------ | ------------------------------- | ----- |
| Controller + $scope      | Hooks + functional components   | useState, useEffect, custom hooks |
| Templates ng-*           | JSX (map, conditionals)         | Pure React components |
| Services/factories       | TS modules / hooks / services   | API clients, custom hooks |
| $http/$resource          | fetch wrapper / axios           | @ovh-ux/manager-core-api |
| Directives               | Components or hooks             | Reusable components |
| Filters                  | Pure TS helpers                 | Utility functions |
| Routing                  | React Router v6                 | Declarative routes |
| $q                       | async/await                     | Native promises |
| $rootScope               | Event bus / context             | React Context, Zustand |
| Forms                    | React Hook Form + Zod           | Typed validation |
| i18n (angular-translate) | react-i18next                   | @ovh-ux/manager-common-translations |

## 🔄 Strangler Pattern Strategy

### 1. Progressive Cohabitation
```typescript
// During transition, both technologies coexist
// AngularJS legacy
angular.module('legacyModule', []);

// New React
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('react-root'));
```

### 2. Route-by-Route Migration
```typescript
// Route-by-route migration with URL conservation
const routes = [
  { path: '/legacy-route', component: LegacyAngularJSComponent },
  { path: '/new-route', component: NewReactComponent }
];
```

### 3. URL Conservation Strategy
**CRITICAL**: URLs must remain identical between AngularJS and React versions.

```typescript
// ✅ CORRECT: Same URL paths
// AngularJS: /nasha/listing → React: /bmc-nasha/listing

// ❌ WRONG: Different URL paths
// AngularJS: /nasha/listing → React: /new-nasha/list
```

**Implementation Rules**:
- **Path structure**: Keep identical routing paths
- **Query parameters**: Preserve all query parameter handling
- **Hash routing**: Maintain hash-based routing if used
- **Deep links**: Ensure all deep links continue to work
- **Bookmarks**: User bookmarks must remain functional

### 4. Continuous Delivery
- Each increment contains: React code + tests + documentation
- Parity validation before deployment
- Rollback possible at any time

### 5. Zero Big Bang
- Any major change must be justified and measured
- Progressive dependency migration
- Systematic regression testing

## 🏗️ Architecture Cible

```
/src
  /app
    /components          # Composants React réutilisables
      /common           # Composants partagés
      /feature          # Composants spécifiques
    /hooks              # Hooks personnalisés
      /api              # Hooks pour les appels API
      /ui               # Hooks pour l'interface
    /services           # Services et clients API
      /api              # Clients API
      /storage          # Gestion du stockage
    /pages              # Pages/écrans
      /listing          # Pages de liste
      /details          # Pages de détail
    /routes             # Configuration des routes
    /types              # Types TypeScript
    /utils              # Utilitaires
/docs
  PLAN.md               # Plan de migration
  MIGRATION_NOTES.md    # Notes de migration
/reference/legacy       # Code AngularJS d'origine
  /<module-cible>       # Module à migrer
```

## ✅ Contraintes de Qualité

### Parité Fonctionnelle
- [ ] Toutes les fonctionnalités AngularJS reproduites
- [ ] UX identique (navigation, interactions, feedback)
- [ ] **URLs identiques** : mêmes chemins de routing conservés
- [ ] Performance égale ou meilleure
- [ ] Tests E2E validant les user journeys

### Standards Techniques
- [ ] TypeScript strict activé
- [ ] ESLint/Prettier configurés et respectés
- [ ] Tests unitaires (coverage 90%+)
- [ ] Tests E2E pour les paths critiques
- [ ] Documentation à jour

### Accessibilité
- [ ] Labels et rôles ARIA corrects
- [ ] Gestion du focus et navigation clavier
- [ ] Contrastes respectés
- [ ] Validation axe/pa11y

### Sécurité
- [ ] Protection XSS (pas d'innerHTML non sécurisé)
- [ ] Gestion CSRF
- [ ] Intercepteurs 401/403
- [ ] Pas d'évaluation dynamique de code

### Performance
- [ ] LCP (Largest Contentful Paint) stable
- [ ] INP (Interaction to Next Paint) optimisé
- [ ] CLS (Cumulative Layout Shift) minimisé
- [ ] Bundle size optimisé

## 🔨 Patterns de Migration

### 1. Migration d'un Controller
```typescript
// AngularJS Controller
angular.module('app').controller('UserController', function($scope, UserService) {
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

// React Hook équivalent
import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/api/useUsers';

export function useUserController() {
  const { data: users, isLoading, refetch } = useUsers();

  return {
    users: users || [],
    loading: isLoading,
    loadUsers: refetch
  };
}
```

### 2. Migration d'un Service
```typescript
// AngularJS Service
angular.module('app').service('UserService', function($http) {
  this.getUsers = function() {
    return $http.get('/api/users').then(response => response.data);
  };
});

// React Hook équivalent
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@ovh-ux/manager-core-api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data)
  });
}
```

### 3. Migration d'un Template
```typescript
// AngularJS Template
<div ng-repeat="user in users" ng-if="!loading">
  <h3>{{user.name}}</h3>
  <p>{{user.email}}</p>
</div>

// React JSX équivalent
import { OsdsText } from '@ovhcloud/ods-components/react';

{!loading && users.map(user => (
  <div key={user.id}>
    <OsdsText size="l" weight="bold">{user.name}</OsdsText>
    <OsdsText>{user.email}</OsdsText>
  </div>
))}
```

### 4. Migration d'un Filtre
```typescript
// AngularJS Filter
angular.module('app').filter('capitalize', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
});

// TypeScript Helper équivalent
export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
```

## 1. Forms and Validation

### OVH Standard Pattern: React Hook Form + Zod

```typescript
// OVH standard pattern
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name required'),
});

export function UserForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OsdsFormField error={errors.email?.message}>
        <Controller name="email" control={control} render={({ field }) => <OsdsInput {...field} />} />
      </OsdsFormField>
    </form>
  );
}
```

### AngularJS → React Mapping

| AngularJS | React Hook Form + Zod |
|-----------|----------------------|
| `ng-model` | `Controller` |
| `ng-required` | `z.string().min(1)` |
| `$error` | `formState.errors` |
| `ng-submit` | `handleSubmit` |

### References
- [ODS Form Components](../20-dependencies/ods-components.md)

## 2. State Management and Services

### OVH Standard Pattern: React Query + Hooks

```typescript
// OVH standard pattern
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@ovh-ux/manager-core-api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users').then(res => res.data),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: CreateUserData) => apiClient.v6.post('/api/users', userData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| Services stateless | Hooks + React Query |
| `$scope` | useState/useReducer |
| `$rootScope.$broadcast` | Context + useReducer |
| Factories | Custom hooks |

### Stateful Services

```typescript
// OVH pattern: Hook with useReducer for complex state
import { useReducer, useCallback } from 'react';

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  return { items: state.items, total: state.total, addItem };
}
```

### Global Communication

```typescript
// OVH pattern: Context + useReducer
export function UserProvider({ children }: { children: ReactNode }) {
  const [users, dispatch] = useReducer(userReducer, []);
  return <UserContext.Provider value={{ users, dispatch }}>{children}</UserContext.Provider>;
}
```

### Migration Patterns

```typescript
// ✅ CORRECT: Utility function for pure logic
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

// ✅ CORRECT: Hook for React state logic
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  return { preferences, setPreferences };
}
```

### Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Hook for pure logic
export function useFormatPrice() {
  return (cents: number) => formatPrice(cents);
}

// ✅ CORRECT: Utility function
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
```

## 3. Directives to Components/Hooks

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| Attribute directives | Custom hooks |
| Component directives | React components |
| `ng-transclude` | Props `children` |
| `ng-if` | `{condition && <Component />}` |
| `ng-click` | `onClick` |
| `ng-model` | `value` + `onChange` |

### Attribute Directives Migration

```typescript
// OVH pattern: Custom hook for reusable logic
export function useFocus() {
  const ref = useRef<HTMLElement>(null);
  const focus = useCallback(() => ref.current?.focus(), []);
  return { ref, focus };
}
```

### Component Directives Migration

```typescript
// OVH pattern: React component with ODS
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="user-card">
      <OsdsText size="l" weight="bold">{user.name}</OsdsText>
      <OsdsButton onClick={() => onEdit(user)}>Edit</OsdsButton>
    </div>
  );
}
```

### Transclusion Migration

```typescript
// OVH pattern: Component with children
export function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  return <OsdsModal onClose={onClose}>{children}</OsdsModal>;
}
```

### Control Directives Migration

```typescript
// OVH pattern: JSX with ODS Components
export function App({ user, loading, error, isActive, isDisabled }: AppProps) {
  return (
    <div>
      {user.isActive && <OsdsText size="l" weight="bold">Welcome, {user.name}!</OsdsText>}
      {loading && <OsdsText>Loading...</OsdsText>}
      {!error && <OsdsText>No errors</OsdsText>}
      <div className={`${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <OsdsButton onClick={handleClick} disabled={isDisabled}>Click me</OsdsButton>
      </div>
    </div>
  );
}
```

### Event Directives Migration

```typescript
// OVH pattern: Event handlers with ODS
export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);
  
  return <OsdsInput value={searchTerm} onChange={handleChange} placeholder="Search..." />;
}
```

### Migration Patterns

```typescript
// ✅ CORRECT: Hook for reusable logic
export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);
  return ref;
}
```

### Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Hook for pure logic
export function useFormatDate() {
  return (date: Date) => date.toLocaleDateString();
}

// ✅ CORRECT: Utility function
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```


## 📋 Execution Plan

### Phase 0: Analysis & Planning
1. **Analyze AngularJS source code**
2. **List User Stories** with React mapping
3. **Produce `/docs/PLAN.md`** with US → React mapping

### Phase 1: Technical Setup
1. **Configure environment**: TypeScript, ESLint, Vite, React Router, React Query
2. **Migrate translations** (identical keys)
3. **Configure i18next** with namespaces

### Phase 2: Progressive Migration
1. **Implement User Stories** one by one
2. **Migrate route by route**: Services → Hooks, Templates → JSX, Filters → Helpers
3. **Unit tests** during development

### Phase 3: Validation
1. **Functional parity**: Identical user journeys
2. **E2E tests**: Complete validation
3. **Performance**: No degradation
4. **Delivery**: Documentation + PR + Deployment

## 📝 Translation Migration

### Principle
**Keep AngularJS keys as-is** to maintain OVHcloud consistency.

### Rules
- ✅ **Keep keys as-is**
- ✅ **Preserve values** (validated by CMT)
- ❌ **Don't rename** `nasha_*` to `bmc-nasha_*`
- ❌ **Don't retranslate** existing content

## 🎨 UI and Behavior Parity

### Principle
**Non-negotiable UI parity**: every pixel, column, state must be identical.

### Checklist
- [ ] **Columns**: Number, order, labels, visibility identical
- [ ] **Formatting**: Dates, sizes, enumerations identical
- [ ] **Navigation**: Links and buttons identical
- [ ] **States**: Loading, empty, error identical
- [ ] **Translations**: Keys and values identical

## 🎯 Quality & Performance Standards

- **React Query**: Server state
- **React Hook Form + Zod**: Forms
- **ODS Components**: Base UI
- **MRC Components**: Business logic + IAM
- **useMemo/useCallback**: Targeted optimizations
- **ARIA attributes**: Accessibility

---

# Part 2: Migration Templates

## 📄 Template: PLAN.md

```markdown
# PLAN – <TARGET_MODULE>

## 1. Context
- **Source module**: AngularJS 1.x - `<module-name>`
- **Target module**: React 18 + TypeScript
- **Objective**: Migration without functional loss
- **Strategy**: Strangler pattern, incremental migration

## 2. User Stories Identified
### User Stories by Route
- [ ] **US1** - [Description] - Route: `/path1`
- [ ] **US2** - [Description] - Route: `/path2`

### User Stories → React Mapping
| User Story | AngularJS Implementation | React Hook | React Component | Status |
|------------|-------------------------|------------|-----------------|--------|
| US1 | Controller A + Template A | useFeatureA | FeatureAPage | ⏳ |
| US2 | Controller B + Template B | useFeatureB | FeatureBPage | ⏳ |

## 3. Routes/Screens to Migrate
- [ ] `/path1` - List page
- [ ] `/path2` - Detail page

**⚠️ URL Conservation**: All routes must maintain **identical paths** between AngularJS and React versions.

## 4. Target Architecture
```
/src
  /app
    /components
    /hooks
    /pages
    /types
```

## 5. Dependencies/Configuration
### Packages to Install
- [ ] @ovh-ux/manager-react-components
- [ ] @ovhcloud/ods-components
- [ ] @tanstack/react-query
- [ ] react-hook-form
- [ ] zod

## 6. Acceptance Criteria
- [ ] **UX Parity**: Interface identical to original
- [ ] **Functional parity**: All functionalities reproduced
- [ ] **E2E tests**: User journeys validated
- [ ] **Coverage**: 90%+ unit tests
- [ ] **Performance**: No LCP/INP/CLS degradation
- [ ] **Accessibility**: axe/pa11y validation
- [ ] **TypeScript**: Strict mode, no any
```

## 📄 Template: MIGRATION_NOTES.md

```markdown
# MIGRATION NOTES – <TARGET_MODULE>

## 1. Overview
- **Migrated module**: `<module-name>`
- **Migration date**: <date>
- **AngularJS version**: 1.x
- **React version**: 18.x

## 2. Detailed Mapping
### Controllers → Hooks
| AngularJS Controller | React Hook | Status |
|---------------------|------------|--------|
| ListController | useListController | ✅ |
| DetailController | useDetailController | ✅ |

### Services → Hooks
| AngularJS Service | React Hook | Status |
|------------------|------------|--------|
| UserService | useUserService | ✅ |
| ProductService | useProductService | ✅ |

### Templates → Components
| AngularJS Template | React Component | Status |
|-------------------|-----------------|--------|
| list.html | ListPage | ✅ |
| detail.html | DetailPage | ✅ |

## 3. Behavior Changes
### URL Conservation
- **Before**: `/module/list`
- **After**: `/module/list` (identical)

### State Management
- **Before**: `$scope.items = data`
- **After**: `const { data: items } = useQuery(['items'], fetchItems)`

## 4. Performance
### Before/After Metrics
| Metric | AngularJS | React | Improvement |
|----------|-----------|-------|--------------|
| LCP | 3.2s | 2.1s | +34% |
| INP | 280ms | 180ms | +36% |
| CLS | 0.15 | 0.05 | +67% |

## 5. Issues Encountered
### Technical Issues
- **Issue 1**: Description
  - **Solution**: Description

### UX Issues
- **Issue 1**: Description
  - **Solution**: Description

## 6. Lessons Learned
### What Worked Well
- **Strategy**: Description
- **Tools**: Description

### What Could Be Improved
- **Strategy**: Description
- **Tools**: Description
```

## 📄 Template: Definition of Done

```markdown
# Definition of Done - Migration <TARGET_MODULE>

## ✅ Functional Parity
- [ ] **Identical UX**: User interface identical to original
- [ ] **Complete features**: All AngularJS features reproduced
- [ ] **Identical URLs**: Same routing paths preserved
- [ ] **User journeys**: Navigation and interactions identical

## ✅ Tests & Quality
- [ ] **Unit tests**: 90%+ coverage with passing tests
- [ ] **E2E tests**: Critical user journeys validated
- [ ] **Accessibility tests**: axe/pa11y validation
- [ ] **Performance tests**: LCP/INP/CLS within thresholds
- [ ] **Regression tests**: No regression identified

## ✅ Code & Standards
- [ ] **TypeScript strict**: No TypeScript errors, no any
- [ ] **ESLint/Prettier**: Code formatted and error-free
- [ ] **Conventions**: OVHcloud conventions respected
- [ ] **Architecture**: Structure following React patterns

## ✅ Performance
- [ ] **LCP**: < 2.5s (Largest Contentful Paint)
- [ ] **INP**: < 200ms (Interaction to Next Paint)
- [ ] **CLS**: < 0.1 (Cumulative Layout Shift)
- [ ] **Bundle size**: No significant increase

## ✅ Accessibility
- [ ] **Keyboard navigation**: All elements keyboard accessible
- [ ] **Screen readers**: Compatible with screen readers
- [ ] **Contrasts**: Contrast ratios respected
- [ ] **ARIA**: Correct ARIA attributes

## ✅ Documentation
- [ ] **PLAN.md**: Complete migration plan
- [ ] **MIGRATION_NOTES.md**: Detailed migration notes
- [ ] **README.md**: Usage documentation

## ✅ Deployment
- [ ] **Production build**: Build successful without errors
- [ ] **Environment config**: Environment configuration
- [ ] **Feature flags**: Feature flags configured
- [ ] **Monitoring**: Monitoring and alerts configured
- [ ] **Rollback plan**: Tested rollback plan

## ✅ Team
- [ ] **Code review**: Review approved by team
- [ ] **Knowledge transfer**: Knowledge transfer completed
- [ ] **Training**: Team trained on new patterns
- [ ] **Support**: Post-deployment support plan
- [ ] **Feedback**: User feedback collected

---

**Final validation**: ✅ All criteria met
**Validation date**: <date>
**Validated by**: <name>
```

---

# Part 3: Guidelines for AI Development

## 🤖 AI Migration Rules

1. **User Stories first**: List all AngularJS US before coding
2. **PLAN.md mandatory**: Analyze before coding
3. **Incremental migration**: Route by route, no Big Bang
4. **Functional parity**: Identical UX and features
5. **OVHcloud standards**: MRC + ODS + Manager conventions
6. **Complete tests**: Unit (90%+) + E2E
7. **TypeScript strict**: No any, clean interfaces
8. **Accessibility**: ARIA, keyboard navigation, contrasts
9. **Performance**: No LCP/INP/CLS degradation

## 🤖 Parity Validation Rules

### Before Writing React
1. **List all AngularJS User Stories**
2. **Read AngularJS code** line by line
3. **Create parity checklist**: column, transformation, interaction
4. **Migrate utilities first**: `format.utils.ts` before components

### During React Writing
1. **Identical columns**: same id, label, hidden, format, sortable
2. **Identical transformations**: same name, types, steps, translations

### After React Writing
1. **Visual validation**: compare side by side
2. **Data validation**: columns, formatting, calculations identical

### Anti-patterns to Avoid
```typescript
// ❌ WRONG: Simplify columns
const columns = [{ id: 'serviceName' }]; // Missing 7 columns

// ✅ CORRECT: All columns
const columns = [
  { id: 'serviceName', ... },
  { id: 'canCreatePartition', ... },
  { id: 'monitored', isHidden: true, ... }
]; // All 8 columns

// ❌ WRONG: Change translation keys
t('listing:service_name') // Different key

// ✅ CORRECT: Same key
t('listing:nasha_directory_columns_header_serviceName') // Identical
```

## ✅ Migration Checklist

- [ ] PLAN.md created and validated
- [ ] AngularJS code analyzed and mapped
- [ ] React components created with proper typing
- [ ] Services migrated to custom hooks
- [ ] Templates converted to JSX
- [ ] Filters converted to TypeScript helpers
- [ ] **Transformation utilities created** (`format.utils.ts`, `constants.ts`)
- [ ] **All AngularJS columns reproduced** (including hidden ones)
- [ ] **Identical data formatting** (dates, sizes, enumerations)
- [ ] **Business calculations reproduced line by line**
- [ ] **Visual validation side by side** AngularJS vs React
- [ ] Unit tests written and passing
- [ ] E2E tests validating user journeys
- [ ] Functional parity validated
- [ ] Performance benchmarks met
- [ ] Accessibility validated
- [ ] MIGRATION_NOTES.md updated
- [ ] Code review completed
- [ ] Documentation updated

## 🚫 Common Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Big Bang migration
// Migrating entire module at once

// ✅ CORRECT: Incremental migration
// Route by route, component by component

// ❌ WRONG: Losing functionality
// Not reproducing all AngularJS features

// ✅ CORRECT: Complete functional parity
// All features and UX preserved

// ❌ WRONG: Ignoring OVHcloud standards
// Using generic React patterns

// ✅ CORRECT: Following Manager conventions
// Using MRC components, ODS design system
```

## ✅ Recommended Patterns

```typescript
// ✅ CORRECT: Proper service migration
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users')
  });
}

// ✅ CORRECT: Proper component migration
export function UserListing() {
  const { data: users, isLoading } = useUsers();

  return (
    <Datagrid
      columns={userColumns}
      items={users || []}
      isLoading={isLoading}
    />
  );
}

// ✅ CORRECT: Proper form migration
export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OsdsFormField label="Name" hasError={!!errors.name}>
        <OsdsInput {...register('name')} />
      </OsdsFormField>
    </form>
  );
}
```

## 4. Data Grid and Tables

### OVH Standard Pattern: MRC Datagrid

```typescript
// OVH standard pattern
import { Datagrid, useDatagrid } from '@ovh-ux/manager-react-components';

export function UsersListing() {
  const { data: users, isLoading } = useUsers();
  
  const columns = useDatagrid({
    columns: [
      { id: 'name', label: 'Name', sortable: true },
      { id: 'email', label: 'Email', sortable: true },
    ],
    items: users || [],
  });

  return (
    <Datagrid
      columns={columns}
      items={users || []}
      isLoading={isLoading}
    />
  );
}
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `ng-repeat` | `Datagrid` component |
| `ng-table` | `useDatagrid` hook |
| Custom filters | `useDatagridSearchParams` |

### References
- [MRC Datagrid](../20-dependencies/mrc-components.md)

## 5. AT Internet Tracking

### OVH Standard Pattern: useOvhTracking

```typescript
// OVH standard pattern
import { useOvhTracking } from '@ovh-ux/manager-react-components';

export function UserPage() {
  const { trackPage, trackClick } = useOvhTracking();
  
  useEffect(() => {
    trackPage('user::listing::page');
  }, [trackPage]);
  
  const handleCreateUser = () => {
    trackClick('user::listing::create-button');
    // ... logic
  };
}
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `at-internet` service | `useOvhTracking` hook |
| `trackPage()` | `trackPage()` |
| `trackClick()` | `trackClick()` |

### References
- [React Tracking](../10-architecture/react-tracking.md)

## 6. Error Handling

### OVH Standard Pattern: ErrorBoundary + Notifications

```typescript
// OVH standard pattern
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { useNotifications } from '@ovh-ux/manager-react-components';

export function App() {
  return (
    <ErrorBoundary>
      <UserPage />
    </ErrorBoundary>
  );
}

export function useUsers() {
  const { addError } = useNotifications();
  
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.v6.get('/api/users'),
    onError: (error) => {
      addError('Failed to load users');
    },
  });
}
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `$http` interceptors | `apiClient` auto-handling |
| `$exceptionHandler` | `ErrorBoundary` |
| `$rootScope.$broadcast` | `useNotifications` |

### References
- [Manager Core API](../20-dependencies/manager-core-api.md)
- [React Best Practices](./react-best-practices.md)

## 7. Lifecycle Hooks

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `$onInit` | `useEffect(() => {}, [])` |
| `$onChanges` | `useEffect(() => {}, [deps])` |
| `$onDestroy` | `useEffect(() => () => cleanup, [])` |
| `$doCheck` | `useEffect(() => {}, [deps])` |

### References
- [React Best Practices](./react-best-practices.md)

## 8. Performance

### OVH Standard Pattern: Lazy Loading

```typescript
// OVH standard pattern
import { lazyRouteConfig } from '@ovh-ux/manager-vite-config';

const UserPage = lazy(() => import('./UserPage'));

export const routes = [
  {
    path: '/users',
    component: lazyRouteConfig(UserPage),
  },
];
```

### References
- [Manager Vite Config](../20-dependencies/manager-vite-config.md)
- [React Best Practices](./react-best-practices.md)

## 9. Accessibility (A11Y)

### OVH Standard Pattern: ODS Components + Tests

```typescript
// OVH standard pattern
import { OsdsButton, OsdsInput, OsdsFormField } from '@ovhcloud/ods-components/react';
import { toBeAccessible } from '@testing-library/jest-dom/matchers';

export function AccessibleForm() {
  return (
    <form role="form" aria-labelledby="form-title">
      <h2 id="form-title">User Information</h2>
      
      <OsdsFormField 
        label="Name" 
        hasError={!!errors.name}
        errorMessage={errors.name?.message}
      >
        <OsdsInput
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
      </OsdsFormField>
      
      <OsdsButton 
        type="submit"
        aria-label="Submit user information"
      >
        Submit
      </OsdsButton>
    </form>
  );
}

// Accessibility tests
describe('AccessibleForm', () => {
  it('should be accessible', async () => {
    render(<AccessibleForm />);
    expect(await screen.findByRole('form')).toBeAccessible();
  });
});
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `ng-aria-label` | `aria-label` |
| `ng-aria-describedby` | `aria-describedby` |
| `ng-aria-invalid` | `aria-invalid` |
| `ng-role` | `role` |
| `ng-tabindex` | `tabIndex` |

### References
- [HTML Accessibility Testing](./html-accessibility-testing.md)
- [ODS Components](../20-dependencies/ods-components.md)

## 10. Debugging and DevTools

### OVH Standard Pattern: useLogger + DevTools

```typescript
// OVH standard pattern
import { useLogger } from '@ovh-ux/manager-react-components';

export function useDebugging() {
  const logger = useLogger('ComponentName');
  
  const debugAction = (action: string, data: any) => {
    logger.debug(`${action}:`, data);
  };
  
  const logError = (error: Error, context: string) => {
    logger.error(`Error in ${context}:`, error);
  };
  
  return { debugAction, logError };
}
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `$log.debug()` | `useLogger().debug()` |
| `$log.error()` | `useLogger().error()` |
| `$log.warn()` | `useLogger().warn()` |
| `$log.info()` | `useLogger().info()` |

### References
- [React Best Practices](./react-best-practices.md)

## 11. Routing and Deep Linking

### OVH Standard Pattern: React Router + URL Conservation

```typescript
// OVH standard pattern
import { createBrowserRouter } from 'react-router-dom';
import { lazyRouteConfig } from '@ovh-ux/manager-vite-config';

export const router = createBrowserRouter([
  {
    path: '/users',
    ...lazyRouteConfig(() => import('@/pages/users/Users.page')),
  },
  {
    path: '/users/:id',
    ...lazyRouteConfig(() => import('@/pages/users/UserDetail.page')),
  }
]);

// Navigation with parameter preservation
const navigateToUser = (userId: string, tab?: string) => {
  const searchParams = new URLSearchParams();
  if (tab) searchParams.set('tab', tab);
  
  navigate(`/users/${userId}?${searchParams.toString()}`);
};
```

### AngularJS → React Mapping

| AngularJS | React Equivalent |
|-----------|------------------|
| `$location.path()` | `useNavigate()` |
| `$location.search()` | `useSearchParams()` |
| `$location.hash()` | `useLocation().hash` |
| `$routeParams` | `useParams()` |

### References
- [React Router DOM](../20-dependencies/react-router-dom.md)
- [Manager Vite Config](../20-dependencies/manager-vite-config.md)

## 12. Complex Migration Patterns

### AngularJS Modals → React

```typescript
// AngularJS
$scope.openModal = function() {
  $uibModal.open({
    template: 'modal-template.html',
    controller: 'ModalController'
  });
};

// React
import { OsdsModal } from '@ovhcloud/ods-components/react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return { isOpen, openModal, closeModal };
}
```

### Wizards/Steppers

```typescript
// AngularJS
$scope.currentStep = 1;
$scope.nextStep = function() {
  if ($scope.isStepValid($scope.currentStep)) {
    $scope.currentStep++;
  }
};

// React
export function useWizard(steps: string[]) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);
  
  return { currentStep, nextStep, isLastStep: currentStep === steps.length - 1 };
}
```

### References
- [ODS Components](../20-dependencies/ods-components.md)
- [React Best Practices](./react-best-practices.md)

## 🔍 Pre-Migration Audit

### Legacy Audit Checklist

**CRITICAL**: Before any migration, perform a complete audit of AngularJS code.

#### 1. Dependency Analysis
- [ ] **Map all AngularJS modules**: List controllers, services, directives, filters
- [ ] **Identify strong/weak couplings**: Dependencies between modules
- [ ] **List shared services**: Services used by multiple modules
- [ ] **Document custom directives**: Non-standard AngularJS directives

#### 2. Identified AngularJS Patterns
- [ ] **Controllers with business logic**: Business logic in controllers
- [ ] **Services with global state**: Services that maintain state
- [ ] **Custom directives**: Custom directives with complex logic
- [ ] **Complex filters**: Filters with business logic
- [ ] **Templates with logic**: Templates containing JavaScript logic

#### 3. Migration Risks
- [ ] **Critical modules** (high priority): Modules with high business impact
- [ ] **Low-risk modules** (pilot migration): Simple modules for testing
- [ ] **External dependencies**: APIs, third-party services, integrations
- [ ] **Complex API integrations**: API calls with business logic

#### 4. Complexity Assessment
```typescript
// Complexity audit example
const moduleComplexity = {
  controllers: 5,        // Number of controllers
  services: 3,          // Number of services
  directives: 2,       // Number of custom directives
  templates: 8,        // Number of templates
  apiCalls: 12,        // Number of API calls
  riskLevel: 'HIGH'    // LOW, MEDIUM, HIGH
};
```

## 🤖 AI Migration Prompts

### Controller Migration Template

```
You are an AngularJS → React migration expert. 
Migrate this AngularJS controller to React TypeScript component:

CONTROLLER_ANGULARJS:
{code}

OVH RULES:
- Use React Hook Form + Zod for forms
- Use ODS Components (@ovhcloud/ods-components/react)
- Use TanStack Query for data
- Use MRC Components (@ovh-ux/manager-react-components)
- Follow OVH patterns (useQuery, useMutation, ErrorBoundary)
- Add unit tests with RTL
- Keep identical URLs
- Maintain functional parity

GENERATE:
1. React TypeScript component
2. Custom hook for logic
3. Unit tests with RTL
4. TypeScript types
5. Zod validation if needed
```

### Service Migration Template

```
Migrate this AngularJS service to React hook:

SERVICE_ANGULARJS:
{code}

OVH RULES:
- Use TanStack Query for cache and synchronization
- Use OVH apiClient (@ovh-ux/manager-core-api)
- Handle errors with ErrorBoundary
- Use useNotifications for notifications
- Add tests with mocks

GENERATE:
1. Custom React hook
2. TypeScript types
3. Tests with mocks
4. Error handling
5. JSDoc documentation
```

### Directive Migration Template

```
Migrate this AngularJS directive to React component:

DIRECTIVE_ANGULARJS:
{code}

OVH RULES:
- Use ODS Components for UI
- Use MRC Components for business logic
- Follow React patterns (hooks, props, children)
- Add accessibility tests
- Maintain visual parity

GENERATE:
1. React TypeScript component
2. Typed props
3. Accessibility tests
4. Usage documentation
```

### Template Migration Template

```
Migrate this AngularJS template to React JSX:

TEMPLATE_ANGULARJS:
{code}

OVH RULES:
- Use ODS Components for UI
- Use MRC Components for business logic
- Follow React patterns (JSX, props, events)
- Maintain pixel-perfect visual parity
- Add rendering tests

GENERATE:
1. React JSX component
2. Typed props
3. Rendering tests
4. Visual parity validation
```

## 🧪 Migration Testing Strategy

### Migration Validation Tests

#### 1. Baseline Tests (AngularJS)
```typescript
// Capture existing AngularJS behavior
describe('AngularJS Baseline', () => {
  it('should render user list correctly', () => {
    // Existing AngularJS test
    expect(element.find('.user-list').length).toBe(5);
    expect(element.find('.user-name').first().text()).toBe('John Doe');
  });
  
  it('should handle user interactions', () => {
    element.find('.edit-button').click();
    expect(element.find('.edit-form').length).toBe(1);
  });
});
```

#### 2. Parity Tests (React)
```typescript
// Verify React produces the same result
describe('React Parity', () => {
  it('should render user list identically', () => {
    render(<UserList />);
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('should handle user interactions identically', () => {
    render(<UserList />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
  });
});
```

#### 3. Performance Tests
```typescript
// Verify performance is equivalent
describe('Performance Parity', () => {
  it('should have similar LCP', async () => {
    const { container } = render(<UserList />);
    const lcp = await getLCP(container);
    expect(lcp).toBeLessThan(2.5); // Same threshold as AngularJS
  });
  
  it('should have similar INP', async () => {
    const { container } = render(<UserList />);
    const inp = await getINP(container);
    expect(inp).toBeLessThan(200); // Same threshold as AngularJS
  });
});
```

#### 4. Visual Tests
```typescript
// Compare visual renders
describe('Visual Parity', () => {
  it('should match AngularJS visual', () => {
    render(<UserList />);
    expect(screen.getByTestId('user-list')).toMatchSnapshot();
  });
  
  it('should have identical styling', () => {
    render(<UserList />);
    const userCard = screen.getByTestId('user-card');
    expect(userCard).toHaveStyle({
      display: 'flex',
      flexDirection: 'column'
    });
  });
});
```

#### 5. Regression Tests
```typescript
// Regression tests to avoid regressions
describe('Regression Tests', () => {
  it('should not break existing functionality', () => {
    // Test that must pass before and after migration
    render(<UserList />);
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });
});
```

### References
- [Migration Testing Strategy](./migration-testing-strategy.md)

## 🔄 Incremental Migration

### Strategy
1. **Pilot**: 2-3 low-risk modules with complete validation
2. **Progressive**: Module-by-module with AngularJS/React coexistence
3. **Finalization**: AngularJS cleanup after complete validation

### References
- [Incremental Migration Guide](./incremental-migration-guide.md)

## 🔄 Feedback Loop

### Success Metrics
- **Technical**: Post-migration bugs, test coverage (90%+), performance (LCP, INP, CLS)
- **Quality**: Functional parity (100%), visual parity, accessibility parity
- **Process**: Development time, success rate, team satisfaction

### AI Learning
- **Effective prompts**: Document templates that work well
- **Common errors**: Track and avoid frequent mistakes
- **Continuous improvement**: Update prompts and validation rules

### References
- [Migration Feedback Loop](./migration-feedback-loop.md)

## 📋 Migration Templates

Detailed templates are available in the separate file:

- **[Migration Templates](./migration-templates.md)**: Complete templates for PLAN.md, MIGRATION_NOTES.md, and Definition of Done

### Template Usage
1. **Always use templates**: Start with PLAN.md, document with MIGRATION_NOTES.md
2. **Complete all sections**: Don't ignore template parts
3. **Validate against DoD**: Check all criteria before considering migration complete

---

## 🏆 Golden Rules for ISO Migration

### 🎯 Guarantee ISO Migration Every Time

1. **MANDATORY Pre-Migration Audit**: Map all modules, dependencies, risks
2. **Standardized AI Prompts**: Use consistent templates for all migrations
3. **Multi-Level Validation Tests**: Baseline, parity, performance, visual, regression
4. **Incremental Migration with Rollback**: Module by module with rollback plan
5. **Continuous Feedback Loop**: Metrics, learning, documentation

### 🚨 Anti-Patterns to Avoid ABSOLUTELY
- ❌ NEVER do Big Bang migration
- ❌ NEVER ignore pre-migration audit
- ❌ NEVER skip parity tests
- ❌ NEVER migrate without rollback plan

### ✅ ISO Success Criteria
- **Functional parity**: 100% of functionalities reproduced
- **Visual parity**: Interface identical pixel by pixel
- **Performance parity**: Equivalent or better performance
- **Accessibility parity**: Same accessibility level
- **Test coverage**: 90%+ test coverage
- **Complete documentation**: PLAN.md, MIGRATION_NOTES.md, DoD

## ⚖️ The Migration's Moral

- **Incremental migration** reduces risks and enables continuous delivery
- **Functional parity** ensures consistent user experience
- **Comprehensive tests** prevent regressions and validate quality
- **Pre-migration audit** guarantees complete understanding of legacy code
- **Standardized AI prompts** ensure consistent and predictable migration

**👉 A good migration is invisible to users but transformative for developers.**
**👉 An ISO migration guarantees 100% functional, visual and performance parity.**
