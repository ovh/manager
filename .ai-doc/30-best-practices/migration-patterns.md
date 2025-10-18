---
title: Patterns de Migration AngularJS → React
last_update: 2025-01-27
tags: [migration, angularjs, react, patterns, strangler]
ai: true
---

# Patterns de Migration AngularJS → React

## 🧭 Purpose

Ce document définit les patterns et stratégies pour migrer des modules AngularJS 1.x vers React 18/TypeScript dans l'écosystème OVHcloud Manager, en suivant le strangler pattern pour une migration incrémentale sans perte fonctionnelle.

## 🤖 AI Role & Mission

### Rôle de l'IA
Tu es un **expert senior en migration front-end** (AngularJS 1.x → React 18/TypeScript) et en **génie logiciel industriel**.

### Mission
Migrer un module AngularJS 1.x vers React/TypeScript **sans perte fonctionnelle**, selon le **strangler pattern**.

### Contexte Technique
Voir @.ai-doc/ pour les détails complets du stack technique, patterns de migration, et standards de qualité.

### Inputs Requis
- `/reference/legacy/<MODULE_CIBLE>` : code AngularJS d'origine
- Spécifications fonctionnelles et contrats API

### Délivrables Attendus
1. `/docs/PLAN.md` : plan de migration détaillé (template @.ai-doc/30-best-practices/migration-templates.md)
2. Code React/TypeScript migré avec tests
3. `/docs/MIGRATION_NOTES.md` : documentation des décisions
4. Validation de parité fonctionnelle/UX

### Conventions à Respecter
Voir @.ai-doc/30-best-practices/ pour les standards de développement, patterns React, et conventions de qualité.

### Mode de Sortie
Fournir le diff Git lisible + commandes d'installation + plan clair avant le code.

## ⚙️ Context

La migration AngularJS → React suit ces principes :
- **Strangler Pattern** : cohabitation progressive des deux technologies
- **Migration incrémentale** : par route ou écran, pas de Big Bang
- **Parité fonctionnelle totale** : UX et fonctionnalités identiques
- **Livraison continue** : chaque incrément est testé et documenté
- **Standards OVHcloud** : respect des conventions Manager et ODS

## 🔗 References

- [Architecture Manager](../10-architecture/manager-architecture.md)
- [Standards de Développement](./development-standards.md)
- [Patterns React](./frontend-react-patterns.md)
- [Composants MRC](../20-dependencies/mrc-components.md)
- [Composants ODS](../20-dependencies/ods-components.md)

## 📘 Guidelines / Implementation

### Mapping AngularJS → React

| AngularJS                | React/TS équivalent             | Notes |
| ------------------------ | ------------------------------- | ----- |
| Controller + $scope      | Hooks + composants fonctionnels | useState, useEffect, custom hooks |
| Templates ng-*           | JSX (map, conditionnels)        | Composants React purs |
| Services/factories       | Modules TS / hooks / services   | API clients, custom hooks |
| $http/$resource          | fetch wrapper / axios           | @ovh-ux/manager-core-api |
| Directives               | Composants ou hooks             | Composants réutilisables |
| Filtres                  | Helpers TS purs                 | Fonctions utilitaires |
| Routing                  | React Router v6                 | Routes déclaratives |
| $q                       | async/await                     | Promises natives |
| $rootScope               | Event bus / contexte            | React Context, Zustand |
| Formulaires              | React Hook Form + Yup           | Validation typée |
| i18n (angular-translate) | react-i18next                   | @ovh-ux/manager-common-translations |

### Stratégie Strangler Pattern

#### 1. Cohabitation Progressive
```typescript
// Pendant la transition, les deux technologies coexistent
// AngularJS legacy
angular.module('legacyModule', []);

// React nouveau
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('react-root'));
```

#### 2. Découpage par Route
```typescript
// Migration route par route
const routes = [
  {
    path: '/legacy-route',
    component: LegacyAngularJSComponent // À migrer
  },
  {
    path: '/new-route', 
    component: NewReactComponent // Migré
  }
];
```

#### 3. Livraison Continue
- Chaque incrément contient : code React + tests + documentation
- Validation de parité avant déploiement
- Rollback possible à tout moment

#### 4. Zéro Big Bang
- Tout changement majeur doit être justifié et mesuré
- Migration progressive des dépendances
- Tests de non-régression systématiques

### Architecture Cible

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

### Contraintes de Qualité

#### Parité Fonctionnelle
- [ ] Toutes les fonctionnalités AngularJS reproduites
- [ ] UX identique (navigation, interactions, feedback)
- [ ] Performance égale ou meilleure
- [ ] Tests E2E validant les user journeys

#### Standards Techniques
- [ ] TypeScript strict activé
- [ ] ESLint/Prettier configurés et respectés
- [ ] Tests unitaires (coverage 90%+)
- [ ] Tests E2E pour les paths critiques
- [ ] Documentation à jour

#### Accessibilité
- [ ] Labels et rôles ARIA corrects
- [ ] Gestion du focus et navigation clavier
- [ ] Contrastes respectés
- [ ] Validation axe/pa11y

#### Sécurité
- [ ] Protection XSS (pas d'innerHTML non sécurisé)
- [ ] Gestion CSRF
- [ ] Intercepteurs 401/403
- [ ] Pas d'évaluation dynamique de code

#### Performance
- [ ] LCP (Largest Contentful Paint) stable
- [ ] INP (Interaction to Next Paint) optimisé
- [ ] CLS (Cumulative Layout Shift) minimisé
- [ ] Bundle size optimisé

### Patterns de Migration

#### 1. Migration d'un Controller
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

#### 2. Migration d'un Service
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

#### 3. Migration d'un Template
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

#### 4. Migration d'un Filtre
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

### Plan d'Exécution

#### Étape 0 – Diagnostic & Plan
1. Analyser le code AngularJS source
2. Identifier les dépendances et intégrations
3. Produire `/docs/PLAN.md` avec :
   - Arborescence cible
   - Mapping des composants
   - Cas d'usage métier
   - Risques et mitigations
   - Sous-tâches détaillées

#### Étape 1 – Setup Technique
1. Configurer TypeScript strict
2. Installer et configurer ESLint/Prettier
3. Configurer Vite, React Router, React Query
4. Créer les intercepteurs API (401/403)
5. Configurer i18next avec les traductions

#### Étape 2 – Migration Progressive
1. Migrer les routes une par une
2. Porter les services en hooks
3. Convertir les templates en JSX
4. Migrer les filtres en helpers
5. Écrire les tests unitaires au fil de l'eau

#### Étape 3 – Parité et Tests E2E
1. Reproduire les user journeys legacy
2. Valider la parité fonctionnelle
3. Ajuster jusqu'à parité complète
4. Optimiser les performances

#### Étape 4 – Livraison
1. Mettre à jour MIGRATION_NOTES.md
2. Préparer la PR avec Conventional Commits
3. Valider tous les critères DoD
4. Déployer en production

### Conventions de Commits

```bash
# Nouvelles fonctionnalités migrées
feat(<scope>): migrate user listing page from AngularJS

# Corrections de parité ou bugs
fix(<scope>): fix user creation form validation parity

# Tests ajoutés ou mis à jour
test(<scope>): add E2E tests for user management flow

# Améliorations de code
refactor(<scope>): extract user service to custom hook

# Documentation mise à jour
docs(<scope>): update migration plan with new findings
```

### Règles d'Itération

1. **Toujours commencer par `/docs/PLAN.md`**
   - Analyser avant de coder
   - Documenter les décisions
   - Identifier les risques

2. **Proposer l'arborescence et les diffs avant le code**
   - Validation de l'approche
   - Ajustements si nécessaire
   - Consensus sur la structure

3. **Documenter les hypothèses si une info manque**
   - Assumptions clairement énoncées
   - Plan de validation
   - Risques identifiés

4. **Livrer code + tests + checklist DoD cochée**
   - Code fonctionnel
   - Tests passants
   - Documentation à jour
   - Validation de parité

### Qualité & Performance

#### Optimisations React
```typescript
// useMemo/useCallback ciblés, pas systématiques
const expensiveValue = useMemo(() => 
  computeExpensiveValue(data), [data]
);

const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

#### UI et Design System
```typescript
// Composants headless + DS officiel
import { OsdsButton, OsdsModal } from '@ovhcloud/ods-components/react';
import { ManagerButton } from '@ovh-ux/manager-react-components';

// ODS pour l'UI de base
<OsdsButton color="primary">Action</OsdsButton>

// MRC pour la logique métier + IAM
<ManagerButton
  id="delete-user"
  label="Delete"
  iamActions={['user:delete']}
  urn={`urn:v1:eu:user:${userId}`}
/>
```

#### Gestion d'État
```typescript
// React Query pour le server state
import { useQuery, useMutation } from '@tanstack/react-query';

// Zustand pour le client state si nécessaire
import { create } from 'zustand';
```

#### Formulaires
```typescript
// React Hook Form + Yup pour la validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

#### Accessibilité
```typescript
// ARIA attributes, focus, tab-order correct
<button
  aria-label="Delete user"
  onClick={handleDelete}
  onKeyDown={handleKeyDown}
>
  <OsdsIcon name="trash" />
</button>
```

---

## 🤖 AI Development Guidelines

### Essential Migration Rules for AI Code Generation

1. **Always start with PLAN.md**: Analyze before coding, document decisions
2. **Follow strangler pattern**: Incremental migration, no Big Bang
3. **Maintain functional parity**: UX and features must be identical
4. **Use OVHcloud standards**: MRC components, ODS design system, Manager conventions
5. **Implement comprehensive testing**: Unit tests (90%+ coverage) + E2E tests
6. **Document everything**: Migration notes, decisions, assumptions
7. **Follow TypeScript strict**: No any types, proper interfaces
8. **Ensure accessibility**: ARIA attributes, keyboard navigation, contrast
9. **Optimize performance**: No degradation of LCP/INP/CLS
10. **Use proper commit conventions**: Conventional Commits format

### Migration Checklist

- [ ] PLAN.md created and validated
- [ ] AngularJS code analyzed and mapped
- [ ] React components created with proper typing
- [ ] Services migrated to custom hooks
- [ ] Templates converted to JSX
- [ ] Filters converted to TypeScript helpers
- [ ] Unit tests written and passing
- [ ] E2E tests validating user journeys
- [ ] Functional parity validated
- [ ] Performance benchmarks met
- [ ] Accessibility validated
- [ ] MIGRATION_NOTES.md updated
- [ ] Code review completed
- [ ] Documentation updated

### Common Anti-Patterns to Avoid

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

### Recommended Patterns

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
    resolver: yupResolver(userSchema)
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

---

## ⚖️ The Migration's Moral

- **Incremental migration** reduces risk and enables continuous delivery
- **Functional parity** ensures user experience consistency
- **Comprehensive testing** prevents regressions and validates quality
- **Proper documentation** enables team collaboration and knowledge transfer

**👉 Good migration is invisible to users but transformative for developers.**
