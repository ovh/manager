---
title: AngularJS → React Migration Guide
last_update: 2025-01-27
tags: [migration, angularjs, react, patterns, strangler, templates, documentation]
ai: true
---

# AngularJS → React Migration Guide

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

- [Manager Architecture](../10-architecture/manager-architecture.md)
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

## 📋 Plan d'Exécution

### Étape 0 – Diagnostic & Plan
1. Analyser le code AngularJS source
2. Identifier les dépendances et intégrations
3. Produire `/docs/PLAN.md` avec :
   - Arborescence cible
   - Mapping des composants
   - Cas d'usage métier
   - Risques et mitigations
   - Sous-tâches détaillées

### Étape 1 – Setup Technique
1. Configurer TypeScript strict
2. Installer et configurer ESLint/Prettier
3. Configurer Vite, React Router, React Query
4. Créer les intercepteurs API (401/403)
5. Configurer i18next avec les traductions

### Étape 2 – Migration Progressive
1. Migrer les routes une par une
2. Porter les services en hooks
3. Convertir les templates en JSX
4. Migrer les filtres en helpers
5. Écrire les tests unitaires au fil de l'eau

### Étape 3 – Parité et Tests E2E
1. Reproduire les user journeys legacy
2. Valider la parité fonctionnelle
3. Ajuster jusqu'à parité complète
4. Optimiser les performances

### Étape 4 – Livraison
1. Mettre à jour MIGRATION_NOTES.md
2. Préparer la PR avec Conventional Commits
3. Valider tous les critères DoD
4. Déployer en production

## 📝 Conventions de Commits

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

## ⚙️ Règles d'Itération

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

## 🎯 Qualité & Performance

### Optimisations React
```typescript
// useMemo/useCallback ciblés, pas systématiques
const expensiveValue = useMemo(() =>
  computeExpensiveValue(data), [data]
);

const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

### UI et Design System
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

### Gestion d'État
```typescript
// React Query pour le server state
import { useQuery, useMutation } from '@tanstack/react-query';

// Zustand pour le client state si nécessaire
import { create } from 'zustand';
```

### Formulaires
```typescript
// React Hook Form + Yup pour la validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

### Accessibilité
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

# Part 2: Templates de Migration

## 📄 Template: PLAN.md

```markdown
# PLAN – <MODULE_CIBLE>

## 1. Contexte
- **Module source** : AngularJS 1.x - `<nom-du-module>`
- **Module cible** : React 18 + TypeScript
- **Objectif** : Migration sans perte fonctionnelle
- **Stratégie** : Strangler pattern, migration incrémentale
- **Timeline** : <estimation>

## 2. Analyse du Code Legacy
### Structure AngularJS
```
<module-angularjs>/
├── controllers/
├── services/
├── templates/
├── directives/
└── filters/
```

### Dépendances Identifiées
- [ ] Service A (à migrer)
- [ ] Service B (à migrer)
- [ ] Directive C (à migrer)
- [ ] Filtre D (à migrer)

### Intégrations Externes
- [ ] API endpoints
- [ ] WebSocket connections
- [ ] Third-party libraries
- [ ] Manager shell integration

## 3. Routes/Écrans à Migrer
- [ ] `/path1` - Page de liste
- [ ] `/path2` - Page de détail
- [ ] `/path3` - Formulaire de création
- [ ] `/path4` - Formulaire d'édition

**⚠️ URL Conservation**: All routes must maintain **identical paths** between AngularJS and React versions to ensure zero breaking changes for users, bookmarks, and deep links.

## 4. Mapping AngularJS → React
| AngularJS | React/TS | Status |
|-----------|----------|--------|
| Controller A | Hook useControllerA | ⏳ |
| Service B | Hook useServiceB | ⏳ |
| Template C | Component C | ⏳ |
| Directive D | Component D | ⏳ |
| Filtre E | Helper E | ⏳ |

## 5. Architecture Cible
```
/src
  /app
    /components
      /<module-cible>/
        /listing/
        /details/
        /forms/
    /hooks
      /api/
        /<module-cible>/
    /services
      /<module-cible>/
    /pages
      /<module-cible>/
    /types
      /<module-cible>/
```

## 6. Cas d'Usage/Tests
### User Journeys à Reproduire
- [ ] **UC1** : Lister les éléments
- [ ] **UC2** : Créer un nouvel élément
- [ ] **UC3** : Modifier un élément existant
- [ ] **UC4** : Supprimer un élément
- [ ] **UC5** : Filtrer/rechercher

### Tests E2E Requis
- [ ] Test de navigation
- [ ] Test de création
- [ ] Test de modification
- [ ] Test de suppression
- [ ] Test de validation

### Tests Unitaires
- [ ] Hooks API
- [ ] Composants UI
- [ ] Helpers/utilitaires
- [ ] Services

## 7. Dépendances/Configuration
### Packages à Installer
- [ ] @ovh-ux/manager-react-components
- [ ] @ovhcloud/ods-components
- [ ] @ovhcloud/ods-themes
- [ ] @tanstack/react-query
- [ ] react-hook-form
- [ ] yup

### Configuration Requise
- [ ] TypeScript strict
- [ ] ESLint/Prettier
- [ ] Vite config
- [ ] React Router setup
- [ ] i18next config
- [ ] API interceptors

## 8. Risques/Mitigations
### Risques Identifiés
- **R1** : Perte de fonctionnalité
  - *Mitigation* : Tests E2E exhaustifs
- **R2** : Performance dégradée
  - *Mitigation* : Benchmarks et monitoring
- **R3** : Problèmes d'accessibilité
  - *Mitigation* : Validation axe/pa11y

### Dépendances Critiques
- [ ] API endpoints stables
- [ ] Design system à jour
- [ ] Traductions disponibles

## 9. Sous-tâches (Branches/Commits)
### Phase 1 : Setup
- [ ] **feat(setup)** : Configuration TypeScript strict
- [ ] **feat(setup)** : Installation des dépendances
- [ ] **feat(setup)** : Configuration des outils

### Phase 2 : Migration Services
- [ ] **feat(api)** : Migration service A
- [ ] **feat(api)** : Migration service B
- [ ] **test(api)** : Tests des hooks API

### Phase 3 : Migration UI
- [ ] **feat(ui)** : Migration page de liste
- [ ] **feat(ui)** : Migration page de détail
- [ ] **feat(ui)** : Migration formulaires
- [ ] **test(ui)** : Tests des composants

### Phase 4 : Tests & Validation
- [ ] **test(e2e)** : Tests E2E user journeys
- [ ] **feat(parity)** : Validation parité fonctionnelle
- [ ] **docs(migration)** : Documentation finale

## 10. Critères d'Acceptation
- [ ] **Parité UX** : Interface identique à l'original
- [ ] **Parité fonctionnelle** : Toutes les fonctionnalités reproduites
- [ ] **Tests E2E** : User journeys validés
- [ ] **Coverage** : 90%+ tests unitaires
- [ ] **Performance** : Pas de dégradation LCP/INP/CLS
- [ ] **Accessibilité** : Validation axe/pa11y
- [ ] **TypeScript** : Strict mode, pas d'any
- [ ] **Documentation** : MIGRATION_NOTES.md à jour

## 11. Plan de Déploiement
### Environnements
- [ ] **Development** : Tests de développement
- [ ] **Staging** : Validation parité
- [ ] **Production** : Déploiement progressif

### Rollback Plan
- [ ] Sauvegarde du code AngularJS
- [ ] Tests de rollback
- [ ] Procédure de retour arrière

## 12. Métriques de Succès
- [ ] **Fonctionnel** : 100% des features reproduites
- [ ] **Performance** : LCP < 2.5s, INP < 200ms
- [ ] **Qualité** : 0 erreur ESLint, 90%+ coverage
- [ ] **UX** : Aucune régression utilisateur
```

## 📄 Template: MIGRATION_NOTES.md

```markdown
# MIGRATION NOTES – <MODULE_CIBLE>

## 📋 Informations Générales
- **Date de migration** : <date>
- **Développeur** : <nom>
- **Version source** : AngularJS 1.x
- **Version cible** : React 18 + TypeScript
- **Durée** : <estimation vs réalité>

## 🎯 Décisions & Justifications

### Choix Techniques
- **React Query** : Choix pour la gestion du server state
  - *Raison* : Cache automatique, synchronisation, optimisations
- **React Hook Form** : Choix pour les formulaires
  - *Raison* : Performance, validation intégrée, DX
- **ODS Components** : Choix pour l'UI
  - *Raison* : Design system OVHcloud, accessibilité, cohérence

### Alternatives Considérées
<A_REMPLIR>

## 🔄 Écarts Fonctionnels/UX
<A_REMPLIR>

### Améliorations Apportées
<A_REMPLIR>

### Limitations Temporaires
<A_REMPLIR>

Exemple :
- **Feature X** : Non migrée (à faire dans v2)
  - *Raison* : Complexité élevée, faible usage
- **Integration Y** : Simplifiée
  - *Raison* : API legacy non optimale

### Comportements Différents
<A_REMPLIR>

Exemple :
- **Validation** : Plus stricte qu'avant
  - *Impact* : Meilleure UX, moins d'erreurs
- **Navigation** : Plus fluide
  - *Impact* : Meilleure performance perçue

## ⚠️ Problèmes Ouverts & Dettes
<A_REMPLIR>

### Issues Non Résolues
<A_REMPLIR>

### Dettes Techniques
<A_REMPLIR>

### Dépendances Externes
<A_REMPLIR>

## 🚀 Améliorations Futures

### Optimisations Possibles
<A_REMPLIR>

## 📊 Métriques & Performance

### Avant Migration (AngularJS)
<A_REMPLIR>

Exemple :
- **LCP** : 3.2s
- **INP** : 250ms
- **CLS** : 0.15
- **Bundle Size** : 2.1MB

### Après Migration (React)
<A_REMPLIR>

Exemple :
- **LCP** : 2.1s (-34%)
- **INP** : 180ms (-28%)
- **CLS** : 0.08 (-47%)
- **Bundle Size** : 1.8MB (-14%)

### Tests Coverage
<A_REMPLIR>

Exemple :
- **Unit Tests** : 92%
- **E2E Tests** : 100% user journeys
- **Accessibility** : 95% axe score

## 🔧 Configuration & Setup

## ✅ Checklist de Validation

### Fonctionnelle
- [ ] Toutes les features AngularJS reproduites
- [ ] User journeys identiques
- [ ] Validation des formulaires
- [ ] Gestion des erreurs
- [ ] États de chargement

### Technique
- [ ] TypeScript strict sans erreurs
- [ ] ESLint/Prettier clean
- [ ] Tests unitaires passants
- [ ] Tests E2E passants
- [ ] Build de production réussi

### Qualité
- [ ] Accessibilité validée
- [ ] Performance optimisée
- [ ] Bundle size acceptable
- [ ] Documentation à jour
- [ ] Code review approuvé

### Déploiement
- [ ] Tests staging passants
- [ ] Rollback plan testé
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Équipe formée

---

## 📝 Notes Finales

<A_REMPLIR>

## 📄 Template: Definition of Done

```markdown
# Definition of Done - Migration <MODULE_CIBLE>

## ✅ Parité Fonctionnelle
- [ ] **UX identique** : Interface utilisateur identique à l'original
- [ ] **Fonctionnalités complètes** : Toutes les features AngularJS reproduites
- [ ] **URLs identiques** : Mêmes chemins de routing conservés
- [ ] **User journeys** : Navigation et interactions identiques
- [ ] **Validation** : Comportement de validation identique
- [ ] **Gestion d'erreurs** : Messages et comportements identiques

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
- [ ] **Documentation** : Code documenté et commenté

## ✅ Performance
- [ ] **LCP** : < 2.5s (Largest Contentful Paint)
- [ ] **INP** : < 200ms (Interaction to Next Paint)
- [ ] **CLS** : < 0.1 (Cumulative Layout Shift)
- [ ] **Bundle size** : Pas d'augmentation significative
- [ ] **Memory usage** : Pas de fuites mémoire

## ✅ Accessibilité
- [ ] **Navigation clavier** : Tous les éléments accessibles au clavier
- [ ] **Screen readers** : Compatible avec les lecteurs d'écran
- [ ] **Contrastes** : Ratios de contraste respectés
- [ ] **ARIA** : Attributs ARIA corrects
- [ ] **Focus management** : Gestion du focus appropriée

## ✅ Sécurité
- [ ] **XSS** : Protection contre les attaques XSS
- [ ] **CSRF** : Protection CSRF en place
- [ ] **Authentication** : Gestion 401/403 correcte
- [ ] **Input validation** : Validation côté client et serveur
- [ ] **No eval** : Aucune évaluation dynamique de code

## ✅ Internationalisation
- [ ] **Traductions** : Toutes les chaînes externalisées
- [ ] **i18next** : Configuration correcte
- [ ] **Pluralization** : Gestion des pluriels
- [ ] **RTL** : Support des langues RTL si nécessaire
- [ ] **Date/Number** : Formatage localisé

## ✅ Documentation
- [ ] **PLAN.md** : Plan de migration complet
- [ ] **MIGRATION_NOTES.md** : Notes de migration détaillées
- [ ] **README.md** : Documentation d'utilisation
- [ ] **API docs** : Documentation des hooks/services
- [ ] **Changelog** : Historique des changements

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

## 🤖 Essential Migration Rules for AI Code Generation

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

## ✅ Migration Checklist

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

## 📋 Template Usage Guidelines

1. **Always use templates** : Start with PLAN.md, document with MIGRATION_NOTES.md
2. **Complete all sections** : Don't skip any part of the templates
3. **Be specific** : Use concrete examples and measurements
4. **Update regularly** : Keep documentation current throughout migration
5. **Validate against DoD** : Check all criteria before considering migration complete

### Template Usage Checklist

- [ ] PLAN.md created with all sections filled
- [ ] MIGRATION_NOTES.md updated with decisions and findings
- [ ] Definition of Done checklist completed
- [ ] All templates reviewed and approved
- [ ] Documentation linked and accessible

---

## ⚖️ The Migration's Moral

- **Incremental migration** reduces risk and enables continuous delivery
- **Functional parity** ensures user experience consistency
- **Comprehensive testing** prevents regressions and validates quality
- **Proper documentation** enables team collaboration and knowledge transfer
- **Structured planning** prevents scope creep and ensures completeness
- **Clear criteria** ensure consistent quality across all migrations

**👉 Good migration is invisible to users but transformative for developers.**
**👉 Good templates are living documents that evolve with the project.**
