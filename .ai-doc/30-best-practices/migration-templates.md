---
title: Migration Templates
last_update: 2025-01-27
tags: [templates, migration, angularjs, react, planning, documentation]
ai: true
---

# Migration Templates

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

## 3. User Stories Identifiées
### User Stories par Route
- [ ] **US1** - [Description] - Route: `/path1`
- [ ] **US2** - [Description] - Route: `/path2`
- [ ] **US3** - [Description] - Route: `/path3`
- [ ] **US4** - [Description] - Route: `/path4`

### Mapping User Stories → React
| User Story | AngularJS Implémentation | React Hook | React Component | Status |
|------------|-------------------------|------------|-----------------|--------|
| US1 | Controller A + Template A | useFeatureA | FeatureAPage | ⏳ |
| US2 | Controller B + Template B | useFeatureB | FeatureBPage | ⏳ |
| US3 | Service C + Directive C | useFeatureC | FeatureCModal | ⏳ |
| US4 | Filter D + Template D | useFeatureD | FeatureDForm | ⏳ |

## 4. Routes/Écrans à Migrer
- [ ] `/path1` - Page de liste
- [ ] `/path2` - Page de détail
- [ ] `/path3` - Formulaire de création
- [ ] `/path4` - Formulaire d'édition

**⚠️ URL Conservation**: All routes must maintain **identical paths** between AngularJS and React versions to ensure zero breaking changes for users, bookmarks, and deep links.

## 5. Mapping AngularJS → React
| AngularJS | React/TS | Status |
|-----------|----------|--------|
| Controller A | Hook useControllerA | ⏳ |
| Service B | Hook useServiceB | ⏳ |
| Template C | Component C | ⏳ |
| Directive D | Component D | ⏳ |
| Filtre E | Helper E | ⏳ |

## 6. Architecture Cible
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

## 7. Cas d'Usage/Tests
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

## 8. Dépendances/Configuration
### Packages à Installer
- [ ] @ovh-ux/manager-react-components
- [ ] @ovhcloud/ods-components
- [ ] @ovhcloud/ods-themes
- [ ] @tanstack/react-query
- [ ] react-hook-form
- [ ] zod

### Configuration Requise
- [ ] TypeScript strict
- [ ] ESLint/Prettier
- [ ] Vite config
- [ ] React Router setup
- [ ] i18next config
- [ ] API interceptors

## 9. Risques/Mitigations
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

## 10. Sous-tâches (Branches/Commits)
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

## 11. Critères d'Acceptation
- [ ] **Parité UX** : Interface identique à l'original
- [ ] **Parité fonctionnelle** : Toutes les fonctionnalités reproduites
- [ ] **Tests E2E** : User journeys validés
- [ ] **Coverage** : 90%+ tests unitaires
- [ ] **Performance** : Pas de dégradation LCP/INP/CLS
- [ ] **Accessibilité** : Validation axe/pa11y
- [ ] **TypeScript** : Strict mode, pas d'any
- [ ] **Documentation** : MIGRATION_NOTES.md à jour

## 12. Plan de Déploiement
### Environnements
- [ ] **Development** : Tests de développement
- [ ] **Staging** : Validation parité
- [ ] **Production** : Déploiement progressif

### Rollback Plan
- [ ] Sauvegarde du code AngularJS
- [ ] Tests de rollback
- [ ] Procédure de retour arrière

## 13. Métriques de Succès
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
```

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

## 🤖 Guidelines for AI Development

### Règles de Migration AI

1. **User Stories d'abord** : Lister toutes les US AngularJS avant de coder
2. **PLAN.md obligatoire** : Analyser avant de coder
3. **Migration incrémentale** : Route par route, pas de Big Bang
4. **Parité fonctionnelle** : UX et features identiques
5. **Standards OVHcloud** : MRC + ODS + Manager conventions
6. **Tests complets** : Unit (90%+) + E2E
7. **TypeScript strict** : Pas d'any, interfaces propres
8. **Accessibilité** : ARIA, navigation clavier, contrastes
9. **Performance** : Pas de dégradation LCP/INP/CLS

### Règles de Validation Parité

#### Avant d'écrire React
1. **Lister toutes les User Stories** AngularJS
2. **Lire le code AngularJS** ligne par ligne
3. **Créer la checklist parité** : colonne, transformation, interaction
4. **Migrer les utilitaires d'abord** : `format.utils.ts` avant composants

#### Pendant l'écriture React
1. **Colonnes identiques** : même id, label, hidden, format, sortable
2. **Transformations identiques** : même nom, types, étapes, traductions

#### Après l'écriture React
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
