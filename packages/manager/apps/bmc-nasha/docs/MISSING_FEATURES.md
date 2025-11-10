# Fonctionnalités Non Implémentées

**Date**: 2025-01-27  
**Status**: Fonctionnalités critiques migrées, fonctionnalités avancées/optionnelles manquantes

---

## ❌ Fonctionnalités Complètement Manquantes

### 1. ZFS Options (Priorité: Moyenne)

**Route**: `/dashboard/:serviceName/partitions/:partitionName/zfs-options`

**Description**: Configuration des options ZFS avancées pour une partition.

**Fonctionnalités**:
- ✅ **Route définie** dans `Routes.constants.ts` mais pas implémentée
- ❌ **Page manquante**: `ZfsOptions.page.tsx`
- ❌ **Hook manquant**: `useZfsOptions.ts`
- ❌ **Composant manquant**: Formulaire de configuration ZFS

**Ce qui doit être implémenté**:

1. **Page ZfsOptions** (`/src/pages/dashboard/partitions/zfs-options/ZfsOptions.page.tsx`)
   - Formulaire avec sélection de template ou configuration personnalisée
   - Templates disponibles:
     - `File Systems (big files)`
     - `Virtual machines`
     - `Databases`
     - `Default`
     - `Custom`
   - Champs configurables:
     - `atime` (on/off)
     - `recordsize` (128K, 16K, 8K, etc.)
     - `sync` (standard, always, disabled)
   - Validation et sauvegarde
   - Navigation vers TaskTracker après sauvegarde

2. **Hook useZfsOptions** (`/src/hooks/partitions/useZfsOptions.ts`)
   - `useGetZfsOptions` - Récupération options actuelles
   - `useUpdateZfsOptions` - Mise à jour options
   - Utilisation de `prepareZfsOptions` depuis `nasha.utils.js`

3. **Route dans Routes.tsx**
   ```tsx
   <Route
     path="zfs-options"
     Component={ZfsOptionsPage}
     handle={{
       tracking: {
         pageName: 'zfs-options',
         pageType: PageType.dashboard,
       },
     }}
   />
   ```

**Référence AngularJS**:
- `packages/manager/modules/nasha/src/components/partition/zfs-options/`
- `packages/manager/modules/nasha/src/nasha.utils.js` (fonction `prepareZfsOptions`)

**Impact**: Fonctionnalité avancée pour optimisation performance, non critique pour usage de base.

---

### 2. Order Page (Priorité: Basse)

**Route**: `/order`

**Description**: Page de commande d'un nouveau service NAS-HA.

**Fonctionnalités**:
- ❌ **Route manquante**
- ❌ **Page manquante**: `Order.page.tsx`
- ❌ **Intégration Module Federation manquante**

**Ce qui doit être implémenté**:

1. **Page Order** (`/src/pages/order/Order.page.tsx`)
   - Intégration Module Federation avec `@order/ConfigoNasHa`
   - Chargement du remote entry depuis `https://www.ovhcloud.com/order/configos/assets/remoteEntry.js`
   - Navigation vers `dedicated/#/nasha` après commande

2. **Route dans Routes.tsx**
   ```tsx
   <Route
     path={urls.order}
     Component={OrderPage}
     handle={{
       tracking: {
         pageName: 'order',
         pageType: PageType.order,
       },
     }}
   />
   ```

**Référence AngularJS**:
- `packages/manager/modules/nasha/src/order/`

**Impact**: Fonctionnalité de commande, peut être gérée via l'ancienne application AngularJS.

---

## ⚠️ Fonctionnalités Partiellement Implémentées

### 3. Update Snapshot Types (Priorité: Basse)

**Localisation**: Dans la page Snapshots (`/dashboard/:serviceName/partition/:partitionName/snapshots`)

**Description**: Modification des types de snapshots automatiques activés pour une partition.

**État actuel**:
- ✅ Affichage des types de snapshots (lecture seule)
- ❌ Modification des types activés (non implémentée)

**Ce qui manque**:

1. **Interface de modification dans Snapshots.page.tsx**
   - Dropdown/Checkbox pour activer/désactiver chaque type
   - Boutons "Valider" et "Annuler"
   - Indicateur de chargement pendant la mise à jour

2. **Hook useUpdateSnapshotTypes** (`/src/hooks/partitions/useUpdateSnapshotTypes.ts`)
   - Comparaison état actuel vs nouveau
   - Appels API:
     - `POST /partition/{partitionName}/snapshot` pour activer
     - `DELETE /partition/{partitionName}/snapshot/{type}` pour désactiver
   - Gestion de plusieurs tâches simultanées
   - Navigation vers TaskTracker

**Référence AngularJS**:
- `packages/manager/modules/nasha/src/dashboard/partition/snapshots/snapshots.controller.js`
  - Méthode `updateSnapshotTypes()`
  - Méthode `resetSnapshotTypes()`
  - Propriété `canUpdateSnapshotTypes`

**Impact**: Fonctionnalité avancée, les snapshots personnalisés fonctionnent sans cela.

---

### 4. Billing Tile Avancé (Priorité: Basse)

**Localisation**: Dashboard (`/dashboard/:serviceName`)

**Description**: Gestion complète de la facturation incluant les engagements.

**État actuel**:
- ✅ Date de création
- ✅ Statut service
- ✅ Renouvellement automatique
- ✅ Date expiration
- ✅ Lien facturation
- ❌ Gestion engagement (manquant)
- ❌ Boutons engagement/renouvellement (manquant)
- ❌ Informations détaillées engagement (manquant)
- ❌ Gestion résiliation (manquant)

**Ce qui manque**:

1. **Gestion Engagement dans BillingTile.component.tsx**
   - Affichage état engagement (aucun, actif, expiré, en attente)
   - Bouton "S'engager" si pas d'engagement
   - Bouton "Renouveler engagement" si engagement actif
   - Bouton "Gérer engagement" pour modification
   - Lien vers page engagement

2. **Gestion Résiliation**
   - Bouton "Résilier" si conditions remplies
   - Lien vers page résiliation
   - Affichage date résiliation si en cours

3. **Hooks additionnels**
   - `useEngagement` - Récupération informations engagement
   - `usePendingEngagement` - Vérification engagement en attente
   - `useAvailableEngagements` - Liste engagements disponibles

**Référence AngularJS**:
- `packages/manager/modules/billing-components/src/components/subscription-tile/`
- Utilise `BillingService` et `ServiceInfos` de `@ovh-ux/manager-models`

**Impact**: Informations essentielles présentes, fonctionnalités avancées de gestion engagement manquantes.

---

### 5. Listing Features Avancées (Priorité: Faible)

**Localisation**: Listing (`/listing`)

**Description**: Fonctionnalités avancées de recherche, filtres et pagination.

**État actuel**:
- ✅ Affichage liste avec Datagrid
- ✅ Recherche basique (client-side via Datagrid)
- ✅ Filtres basiques (client-side via Datagrid)
- ✅ Pagination basique (client-side via Datagrid)
- ❌ Recherche serveur (manquant)
- ❌ Filtres personnalisés serveur (manquant)
- ❌ Pagination serveur (manquant)
- ❌ Personnalisation colonnes persistante (manquant)

**Ce qui manque**:

1. **Recherche Serveur**
   - Utilisation de `useDataApi` avec recherche serveur
   - Debounce sur recherche
   - Paramètres de recherche dans URL

2. **Filtres Avancés**
   - Filtres personnalisés par colonne
   - Filtres combinés
   - Sauvegarde filtres préférés

3. **Pagination Serveur**
   - Pagination avec `useDataApi` ou `fetchIcebergV6`
   - Gestion de grandes listes
   - Limite de résultats

4. **Personnalisation Colonnes**
   - Sauvegarde préférences utilisateur
   - Ordre colonnes personnalisé
   - Largeur colonnes personnalisée

**Référence AngularJS**:
- `packages/manager/modules/nasha/src/directory/directory.routing.js`
- Utilise `ListLayoutHelper` de `@ovh-ux/manager-ng-layout-helpers`

**Impact**: Fonctionnel pour usage normal, limitations pour très grandes listes (>1000 services).

---

## 📊 Résumé des Fonctionnalités Manquantes

| Fonctionnalité | Priorité | Complexité | Impact Utilisateur | Status |
|----------------|----------|------------|-------------------|--------|
| **ZFS Options** | Moyenne | Moyenne | Faible (avancé) | ❌ Manquant |
| **Order Page** | Basse | Haute | Faible (peut utiliser ancienne app) | ❌ Manquant |
| **Update Snapshot Types** | Basse | Faible | Faible (avancé) | ⚠️ Partiel |
| **Billing Tile Avancé** | Basse | Moyenne | Faible (avancé) | ⚠️ Partiel |
| **Listing Avancé** | Faible | Moyenne | Faible (grandes listes) | ⚠️ Partiel |

---

## 🎯 Recommandations

### Pour Production Immédiate
✅ **Prêt** - Toutes les fonctionnalités critiques sont implémentées.

### Pour Complétude Fonctionnelle
1. **ZFS Options** - Si demandé par utilisateurs avancés
2. **Update Snapshot Types** - Facile à implémenter, amélioration UX

### Pour Migration Complète
1. **Order Page** - Si nécessaire de migrer complètement
2. **Billing Tile Avancé** - Si gestion engagement requise
3. **Listing Avancé** - Si très grandes listes de services

---

## 📝 Notes Techniques

### ZFS Options
- Nécessite compréhension des options ZFS (atime, recordsize, sync)
- Templates prédéfinis disponibles dans `nasha.utils.js`
- API: `GET /partition/{partitionName}/options` et `POST /partition/{partitionName}/options`

### Order Page
- Nécessite Module Federation configuré
- Remote entry externe (OVHcloud CDN)
- Navigation post-commande vers ancienne app

### Update Snapshot Types
- API simple: POST/DELETE sur `/partition/{partitionName}/snapshot`
- Gestion de plusieurs tâches simultanées
- Comparaison état avant/après pour déterminer changements

### Billing Tile Avancé
- Utilise `BillingService` de `@ovh-ux/manager-models`
- Nécessite intégration avec système de facturation
- Gestion complexe des états d'engagement

### Listing Avancé
- Utilise `useDataApi` ou `fetchIcebergV6` pour pagination serveur
- Nécessite gestion état URL pour filtres/recherche
- Personnalisation nécessite stockage préférences utilisateur

