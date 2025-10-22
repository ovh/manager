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
   - [Architecture Cible](#️-architecture-cible)
   - [Contraintes de Qualité](#-contraintes-de-qualité)
3. [Detailed Migration Patterns (Spécificités OVH)](#-patterns-de-migration)
   - [Formulaires et Validation](#1-formulaires-et-validation)
   - [State Management et Services](#2-state-management-et-services)
   - [Directives vers Composants/Hooks](#3-directives-vers-composantshooks)
   - [Data Grid et Tables](#4-data-grid-et-tables)
   - [Tracking AT Internet](#5-tracking-at-internet)
   - [Gestion d'Erreurs](#6-gestion-derreurs)
   - [Lifecycle Hooks](#7-lifecycle-hooks)
   - [Performance](#8-performance)
   - [Accessibilité (A11Y)](#9-accessibilité-a11y)
   - [Debugging et DevTools](#10-debugging-et-devtools)
   - [Routing et Deep Linking](#11-routing-et-deep-linking)
   - [Patterns de Migration Complexes](#12-patterns-de-migration-complexes)
4. [Templates de Migration](#-templates-de-migration)
5. [Guidelines for AI Development](#-guidelines-for-ai-development)

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

## ⚙️ Context

AngularJS → React migration follows these principles:
- **Strangler Pattern** : progressive cohabitation of both technologies
- **Incremental migration** : route by route or screen by screen, no Big Bang
- **Complete functional parity** : identical UX and functionality
- **Continuous delivery** : each increment is tested and documented
- **OVHcloud standards** : respect for Manager conventions and ODS

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
| Forms                    | React Hook Form + Yup           | Typed validation |
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

### 2. Route-by-Route Breakdown
```typescript
// Route-by-route migration
const routes = [
  {
    path: '/legacy-route',
    component: LegacyAngularJSComponent // To migrate
  },
  {
    path: '/new-route',
    component: NewReactComponent // Migrated
  }
];
```

### 3. URL Conservation Strategy
**CRITICAL**: During migration, **URLs must remain identical** between AngularJS and React versions to ensure:
- **Zero breaking changes** for users and bookmarks
- **Seamless transition** without redirects
- **SEO preservation** and link integrity
- **API compatibility** maintained

```typescript
// ✅ CORRECT: Same URL paths
// AngularJS: /nasha/listing
// React: /bmc-nasha/listing (same path structure)

// ❌ WRONG: Different URL paths
// AngularJS: /nasha/listing
// React: /new-nasha/list (breaks user experience)
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

## 1. Formulaires et Validation

### Pattern OVH Standard : React Hook Form + Zod

**Pourquoi RHF + Zod ?** C'est le standard OVH utilisé dans toutes les applications React récentes.

```typescript
// Pattern standard OVH
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';

const schema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(1, 'Nom requis'),
});

type FormData = z.infer<typeof schema>;

export function UserForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OsdsFormField error={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <OsdsInput {...field} />}
        />
      </OsdsFormField>
    </form>
  );
}
```

### Migration AngularJS → React

| AngularJS | React Hook Form + Zod |
|-----------|----------------------|
| `ng-model` | `Controller` |
| `ng-required` | `z.string().min(1)` |
| `ng-pattern` | `z.string().regex()` |
| `$error` | `formState.errors` |
| `ng-submit` | `handleSubmit` |

### Références

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [ODS Form Components](../20-dependencies/ods-components.md)
- [MRC Notifications](../20-dependencies/mrc-components.md)

## 2. State Management et Services

### Pattern OVH Standard : React Query + Hooks

**Services AngularJS → Hooks React** avec React Query pour le cache et la synchronisation.

```typescript
// Pattern standard OVH
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
    mutationFn: (userData: CreateUserData) => 
      apiClient.v6.post('/api/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| Services stateless | Hooks + React Query |
| `$scope` | useState/useReducer |
| `$rootScope.$broadcast` | Context + useReducer |
| Factories | Hooks custom |

### Services avec État

```typescript
// Pattern OVH : Hook avec useReducer pour état complexe
import { useReducer, useCallback } from 'react';

type CartState = { items: CartItem[]; total: number };
type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItems = [...state.items, action.payload];
      return { items: newItems, total: newItems.reduce((sum, item) => sum + item.price, 0) };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return { items: filteredItems, total: filteredItems.reduce((sum, item) => sum + item.price, 0) };
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);
  
  return { items: state.items, total: state.total, addItem };
}
```

### Services avec Injection

```typescript
// Pattern OVH : Context + MRC Notifications
import { createContext, useContext } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';

const NotificationContext = createContext<NotificationService | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { addSuccess, addError } = useNotifications();
  
  return (
    <NotificationContext.Provider value={{ addSuccess, addError }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationService() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationService must be used within NotificationProvider');
  return context;
}
```

### Communication Globale

```typescript
// Pattern OVH : Context + useReducer pour communication globale
import { createContext, useContext, useReducer } from 'react';

type UserEvent = 
  | { type: 'USER_CREATED'; payload: User }
  | { type: 'USER_DELETED'; payload: string };

const UserContext = createContext<UserContextType | null>(null);

function userReducer(state: User[], action: UserEvent): User[] {
  switch (action.type) {
    case 'USER_CREATED': return [...state, action.payload];
    case 'USER_DELETED': return state.filter(user => user.id !== action.payload);
    default: return state;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, dispatch] = useReducer(userReducer, []);
  return (
    <UserContext.Provider value={{ users, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
```

### Migration `$scope` → useState

```typescript
// Pattern OVH : Hook avec React Query
export function useProductController() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: () => ProductService.getProducts(selectedCategory, searchTerm),
  });
  
  return {
    products,
    loading,
    selectedCategory,
    searchTerm,
    setCategory: setSelectedCategory,
    setSearchTerm: setSearchTerm
  };
}
```

### Migration Factories

```typescript
// Pattern OVH : Hook pour logique réutilisable
import { useFormatDate } from '@ovh-ux/manager-react-components';

export function useDateFormatter() {
  const { formatDate } = useFormatDate();
  
  return {
    formatDate,
    formatRelative: (date: Date) => formatDate(date, 'relative'),
    isValidDate: (date: Date) => !isNaN(date.getTime())
  };
}
```

### Migration Providers

```typescript
// Pattern OVH : Context pour configuration globale
import { createContext, useContext } from 'react';

const ConfigContext = createContext<ConfigType | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(defaultConfig);
  
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
}
```

### Patterns de Migration

#### 1. Décision : Hook vs Fonction Utilitaire
```typescript
// ✅ CORRECT: Fonction utilitaire pour logique pure
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(cents / 100);
}

// ✅ CORRECT: Hook pour logique avec état React
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  return { preferences, setPreferences };
}
```

#### 2. Migration Progressive
```typescript
// Étape 1: Identifier le type de service
// - Stateless → Fonction utilitaire
// - Avec état → Hook custom
// - Avec injection → Context

// Étape 2: Migrer les dépendances
// - $http → apiClient
// - $q → Promises natives
// - $rootScope → Context
```

### Anti-Patterns à Éviter

```typescript
// ❌ WRONG: Hook pour logique pure
export function useFormatPrice() {
  return (cents: number) => formatPrice(cents);
}

// ✅ CORRECT: Fonction utilitaire
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(cents / 100);
}

// ❌ WRONG: Props drilling au lieu de Context
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} />; // Props drilling
}

// ✅ CORRECT: Context pour état global
function App() {
  return (
    <UserProvider>
      <Header />
    </UserProvider>
  );
}
```

## 3. Directives vers Composants/Hooks

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| Directives d'attribut | Hooks custom |
| Directives de composant | Composants React |
| `ng-transclude` | Props `children` |
| `ng-if` | `{condition && <Component />}` |
| `ng-show/ng-hide` | CSS classes ou conditionnels |
| `ng-click` | `onClick` |
| `ng-model` | `value` + `onChange` |

### Migration Directives d'Attribut

```typescript
// Pattern OVH : Hook pour logique réutilisable
export function useFocus() {
  const ref = useRef<HTMLElement>(null);
  
  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);
  
  const onFocus = useCallback((callback: () => void) => {
    const element = ref.current;
    if (element) {
      element.addEventListener('focus', callback);
      return () => element.removeEventListener('focus', callback);
    }
  }, []);
  
  return { ref, focus, onFocus };
}

// Utilisation
export function InputWithFocus() {
  const { ref, onFocus } = useFocus();
  
  useEffect(() => {
    const cleanup = onFocus(() => console.log('focused'));
    return cleanup;
  }, [onFocus]);
  
  return <input ref={ref} />;
}
```

### Migration Directives de Composant

```typescript
// Pattern OVH : Composant React avec ODS
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

type UserCardProps = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="user-card">
      <OsdsText size="l" weight="bold">{user.name}</OsdsText>
      <OsdsText>{user.email}</OsdsText>
      <OsdsButton onClick={() => onEdit(user)}>Edit</OsdsButton>
      <OsdsButton onClick={() => onDelete(user)}>Delete</OsdsButton>
    </div>
  );
}
```

### Migration Transclusion

```typescript
// Pattern OVH : Composant avec children
import { ReactNode } from 'react';
import { OsdsModal } from '@ovhcloud/ods-components/react';

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <OsdsModal onClose={onClose}>
      {children}
    </OsdsModal>
  );
}
```

### Migration Scope Isolé

```typescript
// Pattern OVH : Composant avec props typées
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

type ProductCardProps = {
  product: Product;
  quantity: string;
  onAddToCart: (product: Product, quantity: string) => void;
};

export function ProductCard({ product, quantity, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <OsdsText size="l" weight="bold">{product.name}</OsdsText>
      <OsdsText>Price: {formatPrice(product.price)}</OsdsText>
      <OsdsText>Quantity: {quantity}</OsdsText>
      <OsdsButton onClick={() => onAddToCart(product, quantity)}>
        Add to Cart
      </OsdsButton>
    </div>
  );
}
```

### Migration Directives de Contrôle

```typescript
// Pattern OVH : JSX avec ODS Components
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

export function App({ user, loading, error, isActive, isDisabled }: AppProps) {
  return (
    <div>
      {/* ng-if equivalent */}
      {user.isActive && (
        <OsdsText size="l" weight="bold">Welcome, {user.name}!</OsdsText>
      )}
      
      {/* ng-show equivalent */}
      {loading && <OsdsText>Loading...</OsdsText>}
      
      {/* ng-hide equivalent */}
      {!error && <OsdsText>No errors</OsdsText>}
      
      {/* ng-class equivalent */}
      <div className={`${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <OsdsButton onClick={handleClick} disabled={isDisabled}>
          Click me
        </OsdsButton>
      </div>
    </div>
  );
}
```

### Migration Directives d'Événements

```typescript
// Pattern OVH : Event handlers avec ODS
import { OsdsInput } from '@ovhcloud/ods-components/react';

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);
  
  return (
    <OsdsInput
      value={searchTerm}
      onChange={handleChange}
      onKeyUp={(e) => console.log('Key up:', e.key)}
      onFocus={() => console.log('focused')}
      placeholder="Search..."
    />
  );
}
```

### Migration Directives de Validation

```typescript
// Pattern OVH : React Hook Form + Zod + ODS
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OsdsInput, OsdsButton, OsdsFormField } from '@ovhcloud/ods-components/react';

const userSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format')
});

export function UserForm() {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(userSchema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OsdsFormField error={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <OsdsInput {...field} type="email" />}
        />
      </OsdsFormField>
      
      <OsdsButton type="submit" disabled={!isValid}>Submit</OsdsButton>
    </form>
  );
}
```

### Patterns de Migration

#### 1. Décision : Hook vs Composant
```typescript
// ✅ CORRECT: Hook pour logique réutilisable
export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);
  
  return ref;
}

// ✅ CORRECT: Composant pour UI réutilisable
export function ClickOutsideWrapper({ children, onClickOutside }: { children: ReactNode; onClickOutside: () => void; }) {
  const ref = useClickOutside(onClickOutside);
  return <div ref={ref}>{children}</div>;
}
```

#### 2. Migration Progressive
```typescript
// Étape 1: Identifier le type de directive
// - Attribut → Hook custom
// - Composant → Composant React
// - Transclusion → Props children

// Étape 2: Migrer la logique
// - Scope → Props typées
// - Link function → useEffect
// - Event handlers → Event handlers React
```

### Anti-Patterns à Éviter

```typescript
// ❌ WRONG: Hook pour logique pure
export function useFormatDate() {
  return (date: Date) => date.toLocaleDateString();
}

// ✅ CORRECT: Fonction utilitaire
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// ❌ WRONG: Props drilling au lieu de Context
function App() {
  const [theme, setTheme] = useState('light');
  return <Header theme={theme} />; // Props drilling
}

// ✅ CORRECT: Context pour état global
function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}
```


## 📋 Plan d'Exécution

### Étape 0 – Diagnostic & Plan
1. **Analyser le code AngularJS source**
2. **Lister les User Stories** avec mapping vers React
3. **Produire `/docs/PLAN.md`** avec mapping US → React

### Étape 1 – Setup Technique
1. **Configurer l'environnement** : TypeScript, ESLint, Vite, React Router, React Query
2. **Migrer les traductions** (clés identiques)
3. **Configurer i18next** avec les namespaces

### Étape 2 – Migration Progressive
1. **Implémenter les User Stories** une par une
2. **Migrer route par route** : Services → Hooks, Templates → JSX, Filtres → Helpers
3. **Tests unitaires** au fil de l'eau

### Étape 3 – Validation
1. **Parité fonctionnelle** : User journeys identiques
2. **Tests E2E** : Validation complète
3. **Performance** : Pas de dégradation
4. **Livraison** : Documentation + PR + Déploiement

## 📝 Migration des Traductions

### Principe
**Reprendre les clés AngularJS telles quelles** pour maintenir la cohérence OVHcloud.

### Structure
```
# AngularJS (Source)
/modules/<module>/src/translations/Messages_fr_FR.json

# React (Cible)  
/apps/<app>/public/translations/
├── listing/Messages_fr_FR.json
├── dashboard/Messages_fr_FR.json
└── onboarding/Messages_fr_FR.json
```

### Règles
- ✅ **Reprendre les clés telles quelles**
- ✅ **Conserver les valeurs** (validées par CMT)
- ❌ **Ne pas renommer** `nasha_*` en `bmc-nasha_*`
- ❌ **Ne pas retraduire** le contenu existant

## 🎨 Parité UI et Comportement

### Principe
**Parité UI non négociable** : chaque pixel, colonne, état doit être identique.

### Checklist
- [ ] **Colonnes** : Nombre, ordre, labels, visibilité identiques
- [ ] **Formatage** : Dates, tailles, énumérations identiques
- [ ] **Navigation** : Liens et boutons identiques
- [ ] **États** : Loading, empty, error identiques
- [ ] **Traductions** : Clés et valeurs identiques

### Règles
- ✅ **Reproduire chaque `format:` AngularJS** dans React
- ✅ **Tester visuellement** côte à côte
- ❌ **Ne pas simplifier** en se disant "c'est équivalent"
- ❌ **Ne pas sauter** des colonnes cachées

## ⚙️ Règles d'Itération

1. **Commencer par `/docs/PLAN.md`** : Analyser avant de coder
2. **Proposer l'arborescence avant le code** : Validation de l'approche
3. **Documenter les hypothèses** : Assumptions clairement énoncées
4. **Livrer code + tests + DoD** : Code fonctionnel, tests passants, parité validée

## 🎯 Qualité & Performance

### Standards
- **React Query** : Server state
- **React Hook Form + Zod** : Formulaires
- **ODS Components** : UI de base
- **MRC Components** : Logique métier + IAM
- **useMemo/useCallback** : Optimisations ciblées
- **ARIA attributes** : Accessibilité

---

# Part 2: Templates de Migration

## 📄 Template: PLAN.md

```markdown
# PLAN – <MODULE_CIBLE>

## 1. Contexte
- **Module source** : AngularJS 1.x - `<nom-du-module>`
- **Module cible** : React 18 + TypeScript
- **Objectif** : Migration sans perte fonctionnelle
- **Stratégie** : Strangler pattern, migration incrémentale

## 2. User Stories Identifiées
### User Stories par Route
- [ ] **US1** - [Description] - Route: `/path1`
- [ ] **US2** - [Description] - Route: `/path2`

### Mapping User Stories → React
| User Story | AngularJS Implémentation | React Hook | React Component | Status |
|------------|-------------------------|------------|-----------------|--------|
| US1 | Controller A + Template A | useFeatureA | FeatureAPage | ⏳ |
| US2 | Controller B + Template B | useFeatureB | FeatureBPage | ⏳ |

## 3. Routes/Écrans à Migrer
- [ ] `/path1` - Page de liste
- [ ] `/path2` - Page de détail

**⚠️ URL Conservation**: All routes must maintain **identical paths** between AngularJS and React versions.

## 4. Architecture Cible
```
/src
  /app
    /components
    /hooks
    /pages
    /types
```

## 5. Dépendances/Configuration
### Packages à Installer
- [ ] @ovh-ux/manager-react-components
- [ ] @ovhcloud/ods-components
- [ ] @tanstack/react-query
- [ ] react-hook-form
- [ ] zod

## 6. Critères d'Acceptation
- [ ] **Parité UX** : Interface identique à l'original
- [ ] **Parité fonctionnelle** : Toutes les fonctionnalités reproduites
- [ ] **Tests E2E** : User journeys validés
- [ ] **Coverage** : 90%+ tests unitaires
- [ ] **Performance** : Pas de dégradation LCP/INP/CLS
- [ ] **Accessibilité** : Validation axe/pa11y
- [ ] **TypeScript** : Strict mode, pas d'any
```

## 📄 Template: MIGRATION_NOTES.md

```markdown
# MIGRATION NOTES – <MODULE_CIBLE>

## 1. Vue d'ensemble
- **Module migré** : `<nom-du-module>`
- **Date de migration** : <date>
- **Version AngularJS** : 1.x
- **Version React** : 18.x

## 2. Mapping Détaillé
### Controllers → Hooks
| Controller AngularJS | Hook React | Status |
|---------------------|------------|--------|
| ListController | useListController | ✅ |
| DetailController | useDetailController | ✅ |

### Services → Hooks
| Service AngularJS | Hook React | Status |
|------------------|------------|--------|
| UserService | useUserService | ✅ |
| ProductService | useProductService | ✅ |

### Templates → Components
| Template AngularJS | Component React | Status |
|-------------------|-----------------|--------|
| list.html | ListPage | ✅ |
| detail.html | DetailPage | ✅ |

## 3. Changements de Comportement
### URL Conservation
- **Avant** : `/module/list`
- **Après** : `/module/list` (identique)

### State Management
- **Avant** : `$scope.items = data`
- **Après** : `const { data: items } = useQuery(['items'], fetchItems)`

## 4. Performance
### Métriques Avant/Après
| Métrique | AngularJS | React | Amélioration |
|----------|-----------|-------|--------------|
| LCP | 3.2s | 2.1s | +34% |
| INP | 280ms | 180ms | +36% |
| CLS | 0.15 | 0.05 | +67% |

## 5. Problèmes Rencontrés
### Problèmes Techniques
- **Problème 1** : Description
  - **Solution** : Description

### Problèmes UX
- **Problème 1** : Description
  - **Solution** : Description

## 6. Lessons Learned
### Ce qui a bien fonctionné
- **Stratégie** : Description
- **Outils** : Description

### Ce qui pourrait être amélioré
- **Stratégie** : Description
- **Outils** : Description
```

## 📄 Template: Definition of Done

```markdown
# Definition of Done - Migration <MODULE_CIBLE>

## ✅ Parité Fonctionnelle
- [ ] **UX identique** : Interface utilisateur identique à l'original
- [ ] **Fonctionnalités complètes** : Toutes les features AngularJS reproduites
- [ ] **URLs identiques** : Mêmes chemins de routing conservés
- [ ] **User journeys** : Navigation et interactions identiques

## ✅ Tests & Qualité
- [ ] **Tests unitaires** : Coverage 90%+ avec tests passants
- [ ] **Tests E2E** : User journeys critiques validés
- [ ] **Tests d'accessibilité** : Validation axe/pa11y
- [ ] **Tests de performance** : LCP/INP/CLS dans les seuils
- [ ] **Tests de régression** : Aucune régression identifiée

## ✅ Code & Standards
- [ ] **TypeScript strict** : Aucune erreur TypeScript, pas d'any
- [ ] **ESLint/Prettier** : Code formaté et sans erreurs
- [ ] **Conventions** : Respect des conventions OVHcloud
- [ ] **Architecture** : Structure respectant les patterns React

## ✅ Performance
- [ ] **LCP** : < 2.5s (Largest Contentful Paint)
- [ ] **INP** : < 200ms (Interaction to Next Paint)
- [ ] **CLS** : < 0.1 (Cumulative Layout Shift)
- [ ] **Bundle size** : Pas d'augmentation significative

## ✅ Accessibilité
- [ ] **Navigation clavier** : Tous les éléments accessibles au clavier
- [ ] **Screen readers** : Compatible avec les lecteurs d'écran
- [ ] **Contrastes** : Ratios de contraste respectés
- [ ] **ARIA** : Attributs ARIA corrects

## ✅ Documentation
- [ ] **PLAN.md** : Plan de migration complet
- [ ] **MIGRATION_NOTES.md** : Notes de migration détaillées
- [ ] **README.md** : Documentation d'utilisation

## ✅ Déploiement
- [ ] **Build production** : Build réussi sans erreurs
- [ ] **Environment config** : Configuration des environnements
- [ ] **Feature flags** : Flags de fonctionnalités configurés
- [ ] **Monitoring** : Monitoring et alertes configurés
- [ ] **Rollback plan** : Plan de retour arrière testé

## ✅ Équipe
- [ ] **Code review** : Review approuvée par l'équipe
- [ ] **Knowledge transfer** : Transfert de connaissances effectué
- [ ] **Training** : Équipe formée sur les nouveaux patterns
- [ ] **Support** : Plan de support post-déploiement
- [ ] **Feedback** : Retour utilisateurs collecté

---

**Validation finale** : ✅ Tous les critères sont remplis
**Date de validation** : <date>
**Validé par** : <nom>
```

---

# Part 3: Guidelines for AI Development

## 🤖 Règles de Migration AI

1. **User Stories d'abord** : Lister toutes les US AngularJS avant de coder
2. **PLAN.md obligatoire** : Analyser avant de coder
3. **Migration incrémentale** : Route par route, pas de Big Bang
4. **Parité fonctionnelle** : UX et features identiques
5. **Standards OVHcloud** : MRC + ODS + Manager conventions
6. **Tests complets** : Unit (90%+) + E2E
7. **TypeScript strict** : Pas d'any, interfaces propres
8. **Accessibilité** : ARIA, navigation clavier, contrastes
9. **Performance** : Pas de dégradation LCP/INP/CLS

## 🤖 Règles de Validation Parité

### Avant d'écrire React
1. **Lister toutes les User Stories** AngularJS
2. **Lire le code AngularJS** ligne par ligne
3. **Créer la checklist parité** : colonne, transformation, interaction
4. **Migrer les utilitaires d'abord** : `format.utils.ts` avant composants

### Pendant l'écriture React
1. **Colonnes identiques** : même id, label, hidden, format, sortable
2. **Transformations identiques** : même nom, types, étapes, traductions

### Après l'écriture React
1. **Validation visuelle** : comparer côte à côte
2. **Validation données** : colonnes, formatage, calculs identiques

### Anti-patterns à éviter
```typescript
// ❌ WRONG: Simplifier les colonnes
const columns = [{ id: 'serviceName' }]; // Manque 7 colonnes

// ✅ CORRECT: Toutes les colonnes
const columns = [
  { id: 'serviceName', ... },
  { id: 'canCreatePartition', ... },
  { id: 'monitored', isHidden: true, ... }
]; // Toutes les 8 colonnes

// ❌ WRONG: Changer les clés de traduction
t('listing:service_name') // Clé différente

// ✅ CORRECT: Même clé
t('listing:nasha_directory_columns_header_serviceName') // Identique
```

## ✅ Migration Checklist

- [ ] PLAN.md created and validated
- [ ] AngularJS code analyzed and mapped
- [ ] React components created with proper typing
- [ ] Services migrated to custom hooks
- [ ] Templates converted to JSX
- [ ] Filters converted to TypeScript helpers
- [ ] **Utilitaires de transformation créés** (`format.utils.ts`, `constants.ts`)
- [ ] **Toutes les colonnes AngularJS reproduites** (y compris celles cachées)
- [ ] **Formatages de données identiques** (dates, tailles, énumérations)
- [ ] **Calculs métier reproduits ligne par ligne**
- [ ] **Validation visuelle côte à côte** AngularJS vs React
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

## 4. Data Grid et Tables

### Pattern OVH Standard : MRC Datagrid

```typescript
// Pattern standard OVH
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

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `ng-repeat` | `Datagrid` component |
| `ng-table` | `useDatagrid` hook |
| Custom filters | `useDatagridSearchParams` |

### Références

- [MRC Datagrid](../20-dependencies/mrc-components.md)

## 5. Tracking AT Internet

### Pattern OVH Standard : useOvhTracking

```typescript
// Pattern standard OVH
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

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `at-internet` service | `useOvhTracking` hook |
| `trackPage()` | `trackPage()` |
| `trackClick()` | `trackClick()` |

### Références

- [React Tracking](../10-architecture/react-tracking.md)

## 6. Gestion d'Erreurs

### Pattern OVH Standard : ErrorBoundary + Notifications

```typescript
// Pattern standard OVH
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

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `$http` interceptors | `apiClient` auto-handling |
| `$exceptionHandler` | `ErrorBoundary` |
| `$rootScope.$broadcast` | `useNotifications` |

### Références

- [Manager Core API](../20-dependencies/manager-core-api.md)
- [React Best Practices](./react-best-practices.md)

## 7. Lifecycle Hooks

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `$onInit` | `useEffect(() => {}, [])` |
| `$onChanges` | `useEffect(() => {}, [deps])` |
| `$onDestroy` | `useEffect(() => () => cleanup, [])` |
| `$doCheck` | `useEffect(() => {}, [deps])` |

### Références

- [React Best Practices](./react-best-practices.md)

## 8. Performance

### Pattern OVH Standard : Lazy Loading

```typescript
// Pattern standard OVH
import { lazyRouteConfig } from '@ovh-ux/manager-vite-config';

const UserPage = lazy(() => import('./UserPage'));

export const routes = [
  {
    path: '/users',
    component: lazyRouteConfig(UserPage),
  },
];
```

### Références

- [Manager Vite Config](../20-dependencies/manager-vite-config.md)
- [React Best Practices](./react-best-practices.md)

## 9. Accessibilité (A11Y)

### Pattern OVH Standard : ODS Components + Tests

```typescript
// Pattern standard OVH
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

// Tests d'accessibilité
describe('AccessibleForm', () => {
  it('should be accessible', async () => {
    render(<AccessibleForm />);
    expect(await screen.findByRole('form')).toBeAccessible();
  });
});
```

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `ng-aria-label` | `aria-label` |
| `ng-aria-describedby` | `aria-describedby` |
| `ng-aria-invalid` | `aria-invalid` |
| `ng-role` | `role` |
| `ng-tabindex` | `tabIndex` |

### Références

- [HTML Accessibility Testing](./html-accessibility-testing.md)
- [ODS Components](../20-dependencies/ods-components.md)

## 10. Debugging et DevTools

### Pattern OVH Standard : useLogger + DevTools

```typescript
// Pattern standard OVH
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

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `$log.debug()` | `useLogger().debug()` |
| `$log.error()` | `useLogger().error()` |
| `$log.warn()` | `useLogger().warn()` |
| `$log.info()` | `useLogger().info()` |

### Références

- [React Best Practices](./react-best-practices.md)

## 11. Routing et Deep Linking

### Pattern OVH Standard : React Router + URL Conservation

```typescript
// Pattern standard OVH
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

// Navigation avec préservation des paramètres
const navigateToUser = (userId: string, tab?: string) => {
  const searchParams = new URLSearchParams();
  if (tab) searchParams.set('tab', tab);
  
  navigate(`/users/${userId}?${searchParams.toString()}`);
};
```

### Migration AngularJS → React

| AngularJS | React Equivalent |
|-----------|------------------|
| `$location.path()` | `useNavigate()` |
| `$location.search()` | `useSearchParams()` |
| `$location.hash()` | `useLocation().hash` |
| `$routeParams` | `useParams()` |

### Références

- [React Router DOM](../20-dependencies/react-router-dom.md)
- [Manager Vite Config](../20-dependencies/manager-vite-config.md)

## 12. Patterns de Migration Complexes

### Modales AngularJS → React

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

### Références

- [ODS Components](../20-dependencies/ods-components.md)
- [React Best Practices](./react-best-practices.md)

## 📋 Templates de Migration

Les templates détaillés sont disponibles dans le fichier séparé :

- **[Migration Templates](./migration-templates.md)** : Templates complets pour PLAN.md, MIGRATION_NOTES.md, et Definition of Done

### Utilisation des Templates

1. **Toujours utiliser les templates** : Commencer par PLAN.md, documenter avec MIGRATION_NOTES.md
2. **Compléter toutes les sections** : Ne pas ignorer les parties des templates
3. **Être spécifique** : Utiliser des exemples concrets et des mesures
4. **Mettre à jour régulièrement** : Garder la documentation à jour pendant la migration
5. **Valider contre DoD** : Vérifier tous les critères avant de considérer la migration terminée

---

## ⚖️ La Morale de la Migration

- **Migration incrémentale** réduit les risques et permet la livraison continue
- **Parité fonctionnelle** assure la cohérence de l'expérience utilisateur
- **Tests complets** préviennent les régressions et valident la qualité
- **Documentation appropriée** permet la collaboration d'équipe et le transfert de connaissances
- **Planification structurée** prévient l'expansion de portée et assure l'exhaustivité
- **Critères clairs** assurent une qualité cohérente à travers toutes les migrations

**👉 Une bonne migration est invisible aux utilisateurs mais transformative pour les développeurs.**
**👉 Les bons templates sont des documents vivants qui évoluent avec le projet.**
