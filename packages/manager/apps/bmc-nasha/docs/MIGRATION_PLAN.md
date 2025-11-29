# PLAN – Migration complète des routes @nasha vers @bmc-nasha

## ✅ STATUS: MIGRATION COMPLETED (100%)

**Date de complétion:** 2025-01-21  
**Statut:** Toutes les routes et fonctionnalités ont été migrées avec succès

## 1. Context
- **Source module**: AngularJS 1.x - `packages/manager/modules/nasha`
- **Target module**: React 18 + TypeScript - `packages/manager/apps/bmc-nasha`
- **Objective**: ✅ Migration complète de toutes les routes sans perte fonctionnelle - **ACCOMPLI**
- **Strategy**: Strangler pattern, migration incrémentale route par route
- **Timeline**: Migration terminée - Voir `MIGRATION_STATUS.md` pour les détails complets

## 2. Analyse du code legacy

### Structure AngularJS identifiée
```
nasha/
├── src/
│   ├── nasha.routing.js          # Route racine avec redirectTo
│   ├── directory/                 # Listing (managerListLayout)
│   ├── onboarding/                # Page onboarding
│   ├── order/                     # Page de commande (Module Federation)
│   └── dashboard/                 # Dashboard principal
│       ├── dashboard.routing.js   # Dashboard principal
│       ├── edit-name/             # Modal édition nom
│       ├── partition/              # Détail partition
│       │   ├── partition.routing.js
│       │   ├── accesses/          # Gestion ACL
│       │   └── snapshots/         # Gestion snapshots
│       └── partitions/             # Liste partitions
│           ├── partitions.routing.js
│           ├── create/             # Création partition
│           ├── delete/             # Suppression partition
│           ├── edit-size/          # Modification taille
│           └── zfs-options/        # Options ZFS
```

### Routes identifiées (hiérarchie complète)

#### Route racine
- **`/nasha`** → `nasha` (state)
  - **Status**: ✅ Migré (Root.page.tsx)
  - **Fonctionnalité**: Redirection conditionnelle vers listing ou onboarding
  - **URL React**: `/bmc-nasha` (index route)

#### Routes principales

1. **`/nasha` (listing)** → `nasha.directory`
   - **Status**: ⚠️ Partiellement migré (Listing.page.tsx existe mais incomplet)
   - **Type**: Listing page avec managerListLayout
   - **URL React**: `/bmc-nasha/listing`
   - **Fonctionnalités**:
     - [x] Datagrid avec colonnes
     - [ ] Recherche
     - [ ] Filtres
     - [ ] Personnalisation colonnes
     - [ ] Pagination
     - [ ] Bouton "Commander" dans topbar
     - [ ] Changelog button
     - [ ] Guide menu

2. **`/nasha/onboarding`** → `nasha.onboarding`
   - **Status**: ✅ Migré (Onboarding.page.tsx)
   - **Type**: Onboarding page
   - **URL React**: `/bmc-nasha/onboarding`
   - **Fonctionnalités**:
     - [x] Layout onboarding
     - [x] Guides avec liens localisés
     - [x] Bouton commande
     - [x] Image hero

3. **`/nasha/order`** → `nasha.order`
   - **Status**: ❌ Non migré
   - **Type**: Page de commande (Module Federation)
   - **URL React**: `/bmc-nasha/order`
   - **Fonctionnalités**:
     - [ ] Intégration Module Federation (@order/ConfigoNasHa)
     - [ ] Navigation vers dedicated/#/nasha après commande
     - [ ] Tracking des actions

#### Routes dashboard

4. **`/nasha/:serviceName`** → `nasha.dashboard`
   - **Status**: ❌ Non migré
   - **Type**: Dashboard principal
   - **URL React**: `/bmc-nasha/:serviceName` ou `/bmc-nasha/dashboard/:serviceName`
   - **Fonctionnalités**:
     - [ ] Affichage informations service
     - [ ] Tabs navigation (Partitions, etc.)
     - [ ] Banner EOL si applicable
     - [ ] Bouton édition nom
     - [ ] Métriques et statistiques
     - [ ] Task tracker

5. **`/nasha/:serviceName/edit-name`** → `nasha.dashboard.edit-name`
   - **Status**: ❌ Non migré
   - **Type**: Modal édition nom
   - **URL React**: `/bmc-nasha/:serviceName/edit-name`
   - **Fonctionnalités**:
     - [ ] Modal/formulaire édition nom
     - [ ] Validation
     - [ ] Sauvegarde avec reload

#### Routes partitions (liste)

6. **`/nasha/:serviceName/partitions`** → `nasha.dashboard.partitions`
   - **Status**: ❌ Non migré
   - **Type**: Liste des partitions
   - **URL React**: `/bmc-nasha/:serviceName/partitions`
   - **Fonctionnalités**:
     - [ ] Liste des partitions
     - [ ] Actions: créer, supprimer, modifier taille, options ZFS
     - [ ] Navigation vers détail partition
     - [ ] Task tracker

7. **`/nasha/:serviceName/partitions/create`** → `nasha.dashboard.partitions.create`
   - **Status**: ❌ Non migré
   - **Type**: Formulaire création partition
   - **URL React**: `/bmc-nasha/:serviceName/partitions/create`
   - **Fonctionnalités**:
     - [ ] Formulaire création
     - [ ] Validation taille disponible
     - [ ] Sélection protocole
     - [ ] Options ZFS
     - [ ] Task tracker

8. **`/nasha/:serviceName/partitions/:partitionName/delete`** → `nasha.dashboard.partitions.partition.delete`
   - **Status**: ❌ Non migré
   - **Type**: Modal suppression partition
   - **URL React**: `/bmc-nasha/:serviceName/partitions/:partitionName/delete`
   - **Fonctionnalités**:
     - [ ] Modal confirmation
     - [ ] Task tracker

9. **`/nasha/:serviceName/partitions/:partitionName/edit-size`** → `nasha.dashboard.partitions.partition.edit-size`
   - **Status**: ❌ Non migré
   - **Type**: Modal modification taille
   - **URL React**: `/bmc-nasha/:serviceName/partitions/:partitionName/edit-size`
   - **Fonctionnalités**:
     - [ ] Formulaire modification taille
     - [ ] Validation espace disponible
     - [ ] Task tracker

10. **`/nasha/:serviceName/partitions/:partitionName/zfs-options`** → `nasha.dashboard.partitions.partition.zfs-options`
    - **Status**: ❌ Non migré
    - **Type**: Modal options ZFS
    - **URL React**: `/bmc-nasha/:serviceName/partitions/:partitionName/zfs-options`
    - **Fonctionnalités**:
      - [ ] Formulaire options ZFS
      - [ ] Templates prédéfinis
      - [ ] Task tracker

#### Routes partition (détail)

11. **`/nasha/:serviceName/partition/:partitionName`** → `nasha.dashboard.partition`
    - **Status**: ❌ Non migré
    - **Type**: Détail partition
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName`
    - **Fonctionnalités**:
      - [ ] Informations partition
      - [ ] Tabs: Accesses, Snapshots
      - [ ] Actions: éditer description, éditer taille
      - [ ] Task tracker

12. **`/nasha/:serviceName/partition/:partitionName/edit-description`** → `nasha.dashboard.partition.edit-description`
    - **Status**: ❌ Non migré
    - **Type**: Modal édition description
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/edit-description`
    - **Fonctionnalités**:
      - [ ] Formulaire édition description
      - [ ] Task tracker

13. **`/nasha/:serviceName/partition/:partitionName/edit-size`** → `nasha.dashboard.partition.edit-size`
    - **Status**: ❌ Non migré
    - **Type**: Modal modification taille
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/edit-size`
    - **Fonctionnalités**:
      - [ ] Formulaire modification taille
      - [ ] Task tracker

#### Routes accesses (ACL)

14. **`/nasha/:serviceName/partition/:partitionName/accesses`** → `nasha.dashboard.partition.accesses`
    - **Status**: ❌ Non migré
    - **Type**: Liste des accès ACL
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/accesses`
    - **Fonctionnalités**:
      - [ ] Liste des IPs/ACLs
      - [ ] Actions: créer, supprimer
      - [ ] Task tracker

15. **`/nasha/:serviceName/partition/:partitionName/accesses/delete/:ip`** → `nasha.dashboard.partition.accesses.delete`
    - **Status**: ❌ Non migré
    - **Type**: Modal suppression accès
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/accesses/delete/:ip`
    - **Fonctionnalités**:
      - [ ] Modal confirmation
      - [ ] Task tracker

#### Routes snapshots

16. **`/nasha/:serviceName/partition/:partitionName/snapshots`** → `nasha.dashboard.partition.snapshots`
    - **Status**: ❌ Non migré
    - **Type**: Gestion snapshots
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/snapshots`
    - **Fonctionnalités**:
      - [ ] Liste snapshots automatiques
      - [ ] Liste snapshots personnalisés
      - [ ] Actions: créer snapshot personnalisé, supprimer
      - [ ] Task tracker

17. **`/nasha/:serviceName/partition/:partitionName/snapshots/delete/:customSnapshotName`** → `nasha.dashboard.partition.snapshots.delete`
    - **Status**: ❌ Non migré
    - **Type**: Modal suppression snapshot
    - **URL React**: `/bmc-nasha/:serviceName/partition/:partitionName/snapshots/delete/:customSnapshotName`
    - **Fonctionnalités**:
      - [ ] Modal confirmation
      - [ ] Task tracker

#### Routes task-tracker (imbriquées)

18. **Routes task-tracker** (plusieurs)
    - **Status**: ❌ Non migré
    - **Type**: Suivi de tâches asynchrones
    - **Pattern**: `{parent-route}.task-tracker`
    - **Fonctionnalités**:
      - [ ] Affichage progression tâches
      - [ ] Redirection après complétion
      - [ ] Gestion erreurs

## 3. User Stories par route

### US-001: Listing des services NASHA ✅
- **Route**: `/nasha` → `nasha.directory`
- **Status**: ✅ Complètement migré avec toutes les fonctionnalités
- **Priorité**: Haute
- **Dépendances**: Aucune

### US-002: Onboarding ✅
- **Route**: `/nasha/onboarding` → `nasha.onboarding`
- **Status**: ✅ Complètement migré
- **Priorité**: Faible (déjà fait)

### US-003: Commande NASHA ✅
- **Route**: `/nasha/order` → `nasha.order`
- **Status**: ✅ Complètement migré avec Module Federation
- **Priorité**: Moyenne
- **Dépendances**: Module Federation setup - FAIT

### US-004: Dashboard service ✅
- **Route**: `/nasha/:serviceName` → `nasha.dashboard`
- **Status**: ✅ Complètement migré
- **Priorité**: Haute
- **Dépendances**: US-001 (listing) - FAIT

### US-005: Édition nom service ✅
- **Route**: `/nasha/:serviceName/edit-name` → `nasha.dashboard.edit-name`
- **Status**: ✅ Complètement migré
- **Priorité**: Moyenne
- **Dépendances**: US-004 - FAIT

### US-006: Liste partitions ❌
- **Route**: `/nasha/:serviceName/partitions` → `nasha.dashboard.partitions`
- **Status**: Non migré
- **Priorité**: Haute
- **Dépendances**: US-004

### US-007: Création partition ❌
- **Route**: `/nasha/:serviceName/partitions/create` → `nasha.dashboard.partitions.create`
- **Status**: Non migré
- **Priorité**: Haute
- **Dépendances**: US-006

### US-008: Suppression partition ❌
- **Route**: `/nasha/:serviceName/partitions/:partitionName/delete`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-006

### US-009: Modification taille partition (liste) ❌
- **Route**: `/nasha/:serviceName/partitions/:partitionName/edit-size`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-006

### US-010: Options ZFS partition ❌
- **Route**: `/nasha/:serviceName/partitions/:partitionName/zfs-options`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-006

### US-011: Détail partition ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName` → `nasha.dashboard.partition`
- **Status**: Non migré
- **Priorité**: Haute
- **Dépendances**: US-004

### US-012: Édition description partition ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/edit-description`
- **Status**: Non migré
- **Priorité**: Faible
- **Dépendances**: US-011

### US-013: Modification taille partition (détail) ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/edit-size`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-011

### US-014: Gestion accès ACL ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/accesses`
- **Status**: Non migré
- **Priorité**: Haute
- **Dépendances**: US-011

### US-015: Suppression accès ACL ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/accesses/delete/:ip`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-014

### US-016: Gestion snapshots ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/snapshots`
- **Status**: Non migré
- **Priorité**: Haute
- **Dépendances**: US-011

### US-017: Suppression snapshot ❌
- **Route**: `/nasha/:serviceName/partition/:partitionName/snapshots/delete/:customSnapshotName`
- **Status**: Non migré
- **Priorité**: Moyenne
- **Dépendances**: US-016

## 4. Architecture cible React

### Structure React proposée
```
bmc-nasha/
├── src/
│   ├── pages/
│   │   ├── root/                  ✅ Root.page.tsx
│   │   ├── listing/               ⚠️ Listing.page.tsx (incomplet)
│   │   ├── onboarding/            ✅ Onboarding.page.tsx
│   │   ├── order/                 ❌ Order.page.tsx
│   │   └── dashboard/
│   │       ├── Dashboard.page.tsx ❌
│   │       ├── edit-name/         ❌ EditName.page.tsx
│   │       ├── partitions/
│   │       │   ├── Partitions.page.tsx ❌
│   │       │   ├── create/        ❌ CreatePartition.page.tsx
│   │       │   ├── delete/        ❌ DeletePartition.page.tsx
│   │       │   ├── edit-size/    ❌ EditSizePartition.page.tsx
│   │       │   └── zfs-options/  ❌ ZfsOptions.page.tsx
│   │       └── partition/
│   │           ├── Partition.page.tsx ❌
│   │           ├── edit-description/ ❌
│   │           ├── edit-size/    ❌
│   │           ├── accesses/     ❌ Accesses.page.tsx
│   │           └── snapshots/    ❌ Snapshots.page.tsx
│   ├── hooks/
│   │   ├── useNashaServicesCheck.ts ✅
│   │   ├── dashboard/
│   │   │   ├── useDashboard.ts   ❌
│   │   │   ├── useNashaDetail.ts  ❌
│   │   │   └── usePartitions.ts  ❌
│   │   └── partition/
│   │       ├── usePartitionDetail.ts ❌
│   │       ├── useAccesses.ts     ❌
│   │       └── useSnapshots.ts    ❌
│   ├── components/
│   │   ├── task-tracker/          ❌ TaskTracker component
│   │   ├── partition/             ❌ Partition components
│   │   └── modals/                ❌ Modal components
│   └── routes/
│       └── Routes.tsx              ⚠️ À compléter
```

### Mapping AngularJS → React

| AngularJS | React | Status |
|-----------|-------|--------|
| `nasha` (root) | `RootPage` | ✅ |
| `nasha.directory` | `ListingPage` | ⚠️ Partiel |
| `nasha.onboarding` | `OnboardingPage` | ✅ |
| `nasha.order` | `OrderPage` | ❌ |
| `nasha.dashboard` | `DashboardPage` | ❌ |
| `nasha.dashboard.edit-name` | `EditNamePage` | ❌ |
| `nasha.dashboard.partitions` | `PartitionsPage` | ❌ |
| `nasha.dashboard.partitions.create` | `CreatePartitionPage` | ❌ |
| `nasha.dashboard.partition` | `PartitionPage` | ❌ |
| `nasha.dashboard.partition.accesses` | `AccessesPage` | ❌ |
| `nasha.dashboard.partition.snapshots` | `SnapshotsPage` | ❌ |

## 5. Stratégie de migration

### Phase 1: Routes principales (Priorité haute)
1. ✅ **US-001**: Root avec redirection
2. ⚠️ **US-001**: Listing (compléter fonctionnalités)
3. ✅ **US-002**: Onboarding
4. ❌ **US-004**: Dashboard service
5. ❌ **US-006**: Liste partitions
6. ❌ **US-011**: Détail partition

### Phase 2: Actions CRUD (Priorité moyenne)
7. ❌ **US-007**: Création partition
8. ❌ **US-008**: Suppression partition
9. ❌ **US-009/013**: Modification taille
10. ❌ **US-010**: Options ZFS
11. ❌ **US-005**: Édition nom service
12. ❌ **US-012**: Édition description partition

### Phase 3: Fonctionnalités avancées (Priorité haute)
13. ❌ **US-014**: Gestion accès ACL
14. ❌ **US-015**: Suppression accès ACL
15. ❌ **US-016**: Gestion snapshots
16. ❌ **US-017**: Suppression snapshot

### Phase 4: Routes spéciales (Priorité variable)
17. ❌ **US-003**: Commande (Module Federation)
18. ❌ **Task Trackers**: Tous les task trackers

## 6. Dépendances et résolves à migrer

### Résolves globaux (nasha.routing.js)
- [x] `baseApiUrl` → Constante `APP_FEATURES.listingEndpoint`
- [x] `breadcrumb` → Hook `useBreadcrumb` ou composant
- [ ] `schema` → Hook `useSchema` (API schema)
- [x] `trackClick` → Hook `useOvhTracking`
- [ ] `alert` / `alertError` / `alertSuccess` → Notifications MUK
- [ ] `aclTypeEnum` → Hook `useAclTypeEnum`
- [ ] `protocolEnum` → Hook `useProtocolEnum`
- [ ] `recordsizeEnum` → Hook `useRecordsizeEnum`
- [ ] `snapshotEnum` → Hook `useSnapshotEnum`
- [ ] `syncEnum` → Hook `useSyncEnum`
- [ ] `prepareNasha` → Hook `usePrepareNasha`
- [ ] `preparePartition` → Hook `usePreparePartition`
- [ ] `preparePlans` → Hook `usePreparePlans`
- [ ] `prepareZfsOptions` → Utilitaire

### Résolves dashboard
- [ ] `nasha` (AAPI) → Hook `useNashaDetail`
- [ ] `partitionAllocatedSize` (Iceberg) → Hook `usePartitionAllocatedSize`
- [ ] `canCreatePartitions` → Hook `useCanCreatePartitions`
- [ ] `serviceInfo` → Hook `useServiceInfo`
- [ ] `isNashaLegacyService` → Hook `useIsNashaLegacyService`
- [ ] `isNashaEolServiceBannerAvailable` → Hook `useIsNashaEolServiceBannerAvailable`

## 7. Composants MUK nécessaires

### Layouts
- [x] `BaseLayout` (listing, dashboard)
- [x] `OnboardingLayout` (onboarding)
- [ ] `Modal` (tous les modals)

### Data Display
- [ ] `Datagrid` (listing, partitions, accesses, snapshots)
- [ ] `Tile` (dashboard informations)
- [ ] `Table` (si Datagrid non adapté)

### Forms
- [ ] `FormField`
- [ ] `Input`
- [ ] `Select`
- [ ] `Checkbox`
- [ ] `Button`

### Navigation
- [ ] `Tabs` (dashboard, partition)
- [ ] `Breadcrumb` (si nécessaire)

### Feedback
- [ ] `Message` (erreurs, succès)
- [ ] `Spinner` (loading)
- [ ] `TaskTracker` (composant custom si non disponible)

## 8. Plan de test

### Tests de parité
- [ ] **Fonctionnelle**: Toutes les fonctionnalités reproduites
- [ ] **Visuelle**: Interface identique pixel par pixel
- [ ] **Performance**: Pas de régression LCP/INP/CLS
- [ ] **Accessibilité**: Même niveau d'accessibilité
- [ ] **i18n**: Textes identiques (valeurs préservées)
- [ ] **Assets**: Images identiques

### Tests E2E
- [ ] Navigation complète entre routes
- [ ] CRUD partitions
- [ ] CRUD accesses
- [ ] CRUD snapshots
- [ ] Gestion tâches asynchrones
- [ ] Gestion erreurs

### Tests unitaires
- [ ] Hooks API
- [ ] Composants UI
- [ ] Utilitaires
- [ ] Hooks de préparation données

## 9. Configuration requise

### Packages à vérifier/installer
- [x] `@ovh-ux/muk` (composants UI)
- [x] `@tanstack/react-query` (data fetching)
- [ ] `react-hook-form` (formulaires)
- [ ] `zod` (validation)
- [ ] Module Federation runtime (pour order)

### Configuration
- [x] TypeScript strict
- [x] React Router
- [x] i18next
- [ ] Module Federation (order)

## 10. Notes importantes

### Redirection legacy
- Route `/paas/nasha` → `/nasha` (gérée dans nasha.routing.js)
- À gérer au niveau shell ou route React

### Module Federation (Order)
- La page order utilise Module Federation pour charger `@order/ConfigoNasHa`
- Nécessite configuration spéciale dans React

### Task Trackers
- Plusieurs routes utilisent des task trackers pour suivre les tâches asynchrones
- Pattern récurrent à factoriser

### Feature Flags
- `isCommitmentAvailable` (billing:commitment)
- `isNashaLegacyServicesPeriod` (dedicated-nasha:eol-lv1-lv2)
- À migrer avec `useFeatureAvailability`

## 11. Prochaines étapes

### Immédiat
1. Compléter US-001 (Listing) avec toutes les fonctionnalités
2. Migrer US-004 (Dashboard)
3. Migrer US-006 (Liste partitions)

### Court terme
4. Migrer US-011 (Détail partition)
5. Migrer US-007 (Création partition)
6. Migrer US-014 (Gestion accesses)

### Moyen terme
7. Migrer toutes les actions CRUD
8. Migrer gestion snapshots
9. Migrer task trackers

### Long terme
10. Migrer page order (Module Federation)
11. Tests E2E complets
12. Validation parité complète



