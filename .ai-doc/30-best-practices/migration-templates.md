---
title: Templates de Migration
last_update: 2025-01-27
tags: [migration, templates, documentation, planning]
ai: true
---

# Templates de Migration

## 🧭 Purpose

Ce document fournit les templates standardisés pour documenter et planifier les migrations AngularJS → React dans l'écosystème OVHcloud Manager.

## ⚙️ Context

Les templates suivants sont utilisés pour :
- **Planifier** la migration d'un module
- **Documenter** les décisions et écarts
- **Structurer** le travail de migration
- **Valider** la parité fonctionnelle

## 📘 Templates

### PLAN.md Template

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

### MIGRATION_NOTES.md Template

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
- **Redux vs Zustand** : Zustand choisi pour sa simplicité
- **Styled Components vs CSS Modules** : CSS Modules pour la performance
- **Jest vs Vitest** : Vitest pour la vitesse et compatibilité Vite

## 🔄 Écarts Fonctionnels/UX

### Améliorations Apportées
- **Performance** : Lazy loading des composants
- **Accessibilité** : Meilleure navigation clavier
- **UX** : Loading states plus fluides

### Limitations Temporaires
- **Feature X** : Non migrée (à faire dans v2)
  - *Raison* : Complexité élevée, faible usage
- **Integration Y** : Simplifiée
  - *Raison* : API legacy non optimale

### Comportements Différents
- **Validation** : Plus stricte qu'avant
  - *Impact* : Meilleure UX, moins d'erreurs
- **Navigation** : Plus fluide
  - *Impact* : Meilleure performance perçue

## ⚠️ Problèmes Ouverts & Dettes

### Issues Non Résolues
- **Issue #123** : Performance sur mobile
  - *Status* : En cours d'investigation
  - *Priorité* : Moyenne
- **Issue #124** : Accessibilité sur certains navigateurs
  - *Status* : En attente de fix ODS
  - *Priorité* : Haute

### Dettes Techniques
- **Refactoring** : Extraction de hooks communs
  - *Effort* : 2 jours
  - *Priorité* : Faible
- **Tests** : Amélioration coverage edge cases
  - *Effort* : 1 jour
  - *Priorité* : Moyenne

### Dépendances Externes
- **ODS Components** : Mise à jour v19 prévue
  - *Impact* : Améliorations accessibilité
  - *Timeline* : Q2 2025

## 🚀 Améliorations Futures

### Optimisations Possibles
- **Bundle splitting** : Code splitting par route
- **Caching** : Service Worker pour les données statiques
- **PWA** : Transformation en Progressive Web App

### Évolutions Prévues
- **v2.0** : Migration des features manquantes
- **v2.1** : Optimisations performance
- **v2.2** : Nouvelles fonctionnalités

### Intégrations Futures
- **Analytics** : Tracking amélioré
- **Monitoring** : Error tracking détaillé
- **A/B Testing** : Framework d'expérimentation

## 📊 Métriques & Performance

### Avant Migration (AngularJS)
- **LCP** : 3.2s
- **INP** : 250ms
- **CLS** : 0.15
- **Bundle Size** : 2.1MB

### Après Migration (React)
- **LCP** : 2.1s (-34%)
- **INP** : 180ms (-28%)
- **CLS** : 0.08 (-47%)
- **Bundle Size** : 1.8MB (-14%)

### Tests Coverage
- **Unit Tests** : 92%
- **E2E Tests** : 100% user journeys
- **Accessibility** : 95% axe score

## 🔧 Configuration & Setup

### Variables d'Environnement
```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.ovh.com
REACT_APP_API_VERSION=v6

# Feature Flags
REACT_APP_ENABLE_NEW_FEATURE=true
REACT_APP_DEBUG_MODE=false
```

### Scripts Disponibles
```bash
# Development
npm run dev          # Serveur de développement
npm run test         # Tests unitaires
npm run test:e2e     # Tests E2E
npm run lint         # Linting
npm run type-check   # Vérification TypeScript

# Build
npm run build        # Build de production
npm run build:analyze # Analyse du bundle
```

## 📚 Ressources & Documentation

### Documentation Technique
- [Plan de Migration](./PLAN.md)
- [Architecture React](./ARCHITECTURE.md)
- [Guide de Tests](./TESTING.md)

### Liens Utiles
- [ODS Storybook](https://ovh.github.io/design-system/)
- [Manager React Components](https://github.com/ovh/manager/tree/master/packages/manager-react-components)
- [React Query Docs](https://tanstack.com/query/latest)

### Formation Équipe
- [Workshop React](https://internal.ovh.com/react-workshop)
- [ODS Training](https://internal.ovh.com/ods-training)
- [Testing Best Practices](https://internal.ovh.com/testing-guide)

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

Cette migration représente une étape importante dans la modernisation de l'application. Les améliorations apportées en termes de performance, accessibilité et maintenabilité justifient l'investissement.

**Prochaines étapes** : Planifier la migration des modules connexes et continuer l'amélioration continue de la qualité du code.
```

### Definition of Done Template

```markdown
# Definition of Done - Migration <MODULE_CIBLE>

## ✅ Parité Fonctionnelle
- [ ] **UX identique** : Interface utilisateur identique à l'original
- [ ] **Fonctionnalités complètes** : Toutes les features AngularJS reproduites
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

## 🤖 AI Development Guidelines

### Essential Template Rules for AI Code Generation

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

## ⚖️ The Template's Moral

- **Structured planning** prevents scope creep and ensures completeness
- **Comprehensive documentation** enables knowledge transfer and maintenance
- **Clear criteria** ensure consistent quality across all migrations
- **Regular updates** keep documentation relevant and useful

**👉 Good templates are living documents that evolve with the project.**
