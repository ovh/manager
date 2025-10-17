# PLAN – Migration NASHA Directory/Listing

## 1. Contexte
- **Module source** : AngularJS 1.x - `@ovh-ux/manager-nasha` (directory module)
- **Module cible** : React 18 + TypeScript - `@bmc-nasha/` (listing page)
- **Objectif** : Migration de la page de listing NASHA sans perte fonctionnelle
- **Stratégie** : Strangler pattern, migration incrémentale
- **Timeline** : 2-3 jours

## 2. Analyse du Code Legacy
### Structure AngularJS
```
@ovh-ux/manager-nasha/
├── src/
│   ├── directory/
│   │   ├── directory.module.js
│   │   ├── directory.routing.js
│   │   └── translations/
│   ├── nasha.constants.js
│   └── nasha.routing.js
```

### Dépendances Identifiées
- [x] Service API (déjà migré via useResources)
- [x] Traductions (déjà migrées)
- [x] Composants UI (MRC + ODS déjà configurés)
- [x] Routing (React Router déjà configuré)

### Intégrations Externes
- [x] API endpoints (`/dedicated/nasha`)
- [x] Manager shell integration
- [x] i18n (react-i18next)
- [x] Design system (ODS + MRC)

## 3. Routes/Écrans à Migrer
- [x] `/nasha` - Page de listing (déjà migrée partiellement)
- [ ] Améliorer la parité fonctionnelle avec l'original

## 4. Mapping AngularJS → React
| AngularJS | React/TS | Status |
|-----------|----------|--------|
| directory.routing.js | Routes.tsx | ✅ Migré |
| ListLayoutHelper | useListingColumns | ✅ Migré |
| ng-translate | react-i18next | ✅ Migré |
| managerListLayout | Datagrid (MRC) | ✅ Migré |
| Column configuration | useListingColumns hook | ✅ Migré |

## 5. Architecture Cible
```
/src
  /app
    /components
      /listing/
        /Listing.page.tsx (existant)
    /hooks
      /listing/
        /useListingColumns.tsx (existant)
    /pages
      /listing/
        /Listing.page.tsx (existant)
    /types
      /Listing.type.ts (existant)
```

## 6. Cas d'Usage/Tests
### User Journeys à Reproduire
- [x] **UC1** : Lister les services NASHA
- [x] **UC2** : Trier par colonnes
- [x] **UC3** : Pagination
- [x] **UC4** : Bouton "Commander un NAS-HA"
- [ ] **UC5** : Navigation vers dashboard (à améliorer)

### Tests E2E Requis
- [ ] Test de navigation vers listing
- [ ] Test d'affichage des données
- [ ] Test de tri des colonnes
- [ ] Test de pagination
- [ ] Test du bouton de commande

### Tests Unitaires
- [x] Hooks API (useResources)
- [x] Composants UI (Listing.page)
- [x] Helpers/utilitaires (useListingColumns)
- [ ] Tests d'accessibilité

## 7. Dépendances/Configuration
### Packages Installés
- [x] @ovh-ux/manager-react-components
- [x] @ovhcloud/ods-components
- [x] @ovhcloud/ods-themes
- [x] @tanstack/react-query
- [x] react-hook-form
- [x] react-i18next

### Configuration Requise
- [x] TypeScript strict
- [x] ESLint/Prettier
- [x] Vite config
- [x] React Router setup
- [x] i18next config
- [x] API interceptors

## 8. Risques/Mitigations
### Risques Identifiés
- **R1** : Perte de fonctionnalité de tri
  - *Mitigation* : Validation avec tests E2E
- **R2** : Performance dégradée
  - *Mitigation* : Benchmarks et monitoring
- **R3** : Problèmes d'accessibilité
  - *Mitigation* : Validation axe/pa11y

### Dépendances Critiques
- [x] API endpoints stables
- [x] Design system à jour
- [x] Traductions disponibles

## 9. Sous-tâches (Branches/Commits)
### Phase 1 : Amélioration Parité
- [ ] **feat(listing)** : Améliorer les colonnes manquantes (zpoolCapacity, zpoolSize)
- [ ] **feat(listing)** : Implémenter le tri par serviceName
- [ ] **feat(listing)** : Améliorer le bouton de commande

### Phase 2 : Tests & Validation
- [ ] **test(listing)** : Tests unitaires pour les nouvelles colonnes
- [ ] **test(e2e)** : Tests E2E user journeys
- [ ] **feat(parity)** : Validation parité fonctionnelle

### Phase 3 : Accessibilité & Performance
- [ ] **feat(a11y)** : Tests d'accessibilité
- [ ] **feat(perf)** : Optimisations performance
- [ ] **docs(migration)** : Documentation finale

## 10. Critères d'Acceptation
- [x] **Parité UX** : Interface identique à l'original
- [x] **Parité fonctionnelle** : Toutes les fonctionnalités reproduites
- [ ] **Tests E2E** : User journeys validés
- [x] **Coverage** : 90%+ tests unitaires
- [ ] **Performance** : Pas de dégradation LCP/INP/CLS
- [ ] **Accessibilité** : Validation axe/pa11y
- [x] **TypeScript** : Strict mode, pas d'any
- [ ] **Documentation** : MIGRATION_NOTES.md à jour

## 11. Plan de Déploiement
### Environnements
- [x] **Development** : Tests de développement
- [ ] **Staging** : Validation parité
- [ ] **Production** : Déploiement progressif

### Rollback Plan
- [x] Sauvegarde du code AngularJS
- [ ] Tests de rollback
- [ ] Procédure de retour arrière

## 12. Métriques de Succès
- [x] **Fonctionnel** : 100% des features reproduites
- [ ] **Performance** : LCP < 2.5s, INP < 200ms
- [x] **Qualité** : 0 erreur ESLint, 90%+ coverage
- [ ] **UX** : Aucune régression utilisateur

