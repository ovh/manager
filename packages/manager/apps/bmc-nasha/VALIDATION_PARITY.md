# Validation de Parité - Dashboard Nasha

Ce document liste les points à valider pour assurer la parité visuelle, fonctionnelle et technique entre l'implémentation AngularJS (`@nasha`) et l'implémentation React (`@bmc-nasha`).

## ✅ Tests Automatisés

Tous les tests unitaires ont été créés pour :
- ✅ Hooks dashboard (useNasha, useServiceInfo, usePartitionAllocatedSize, useFeatureAvailability, useDashboardData)
- ✅ Composants dashboard (SpaceMeter, EolBanner, EditNameModal, DashboardHeader, DashboardTabs, InformationTile, ConfigurationTile, BillingTile)
- ✅ Page Dashboard

## 📋 Checklist de Validation Manuelle

### 1. Parité Visuelle

#### Header
- [ ] Le titre affiche le `customName` ou `serviceName` si `customName` est vide
- [ ] Le bouton d'édition du nom est présent à côté du titre
- [ ] Le serviceName est affiché sous le titre
- [ ] Le bouton "Guides" est présent dans le header
- [ ] Le bouton "Changelog" est présent (si disponible)

#### EOL Banner
- [ ] Le banner EOL s'affiche uniquement pour les services legacy (rbx/sbg/bhs + hdd)
- [ ] Le banner contient le message d'avertissement
- [ ] Le lien vers la documentation est présent et fonctionnel
- [ ] Le banner est dismissible

#### Tabs
- [ ] Les onglets "Informations générales" et "Partitions" sont présents
- [ ] L'onglet actif est correctement mis en évidence
- [ ] La navigation entre les onglets fonctionne

#### Information Tile
- [ ] Le nom du service est affiché
- [ ] L'ID du service est affiché
- [ ] Le datacenter localisé est affiché
- [ ] Le type de disque est affiché
- [ ] La taille du disque est affichée
- [ ] Le bouton d'édition du nom est présent dans le menu d'actions

#### Configuration Tile
- [ ] Le space-meter affiche correctement l'utilisation
- [ ] La légende du space-meter est affichée (si `legend={true}`)
- [ ] Le bouton "Créer une partition" est présent
- [ ] Le bouton est désactivé quand `canCreatePartitions` est `false`

#### Billing Tile
- [ ] Les informations de facturation sont affichées
- [ ] Le tile billing-subscription est intégré correctement
- [ ] Les données d'engagement sont affichées si disponibles

### 2. Parité Fonctionnelle

#### Navigation
- [ ] La navigation vers l'édition du nom fonctionne
- [ ] La navigation vers la création de partition fonctionne
- [ ] Les URLs sont correctes selon la structure de routing

#### Édition du Nom
- [ ] Le modal s'ouvre au clic sur le bouton d'édition
- [ ] Le champ contient la valeur actuelle du `customName`
- [ ] La validation rejette les caractères `<` et `>`
- [ ] La validation rejette si le nom est identique au `serviceName`
- [ ] L'envoi du formulaire met à jour le nom via l'API
- [ ] Un message de succès s'affiche après la mise à jour
- [ ] Les erreurs API sont gérées et affichées

#### Affichage des Données
- [ ] Les données Nasha sont chargées et affichées
- [ ] Les données ServiceInfo sont chargées et affichées
- [ ] Le calcul de `partitionAllocatedSize` est correct
- [ ] Le calcul de `canCreatePartitions` est correct
- [ ] Le calcul de `shouldReengage` est correct
- [ ] Le calcul de `isNashaEolServiceBannerAvailable` est correct

#### Feature Flipping
- [ ] `isCommitmentAvailable` est basé sur le feature flag `billing:commitment`
- [ ] `isNashaLegacyServicesPeriod` est basé sur le feature flag `dedicated-nasha:eol-lv1-lv2`

#### États de Chargement
- [ ] Un spinner s'affiche pendant le chargement initial
- [ ] Les erreurs de chargement sont affichées correctement

### 3. Parité Technique

#### API Calls
- [ ] `GET /dedicated/nasha/{serviceName}` (AAPI) pour les données Nasha
- [ ] `GET /dedicated/nasha/{serviceName}/serviceInfos` (V6) pour les serviceInfos
- [ ] `GET /dedicated/nasha/{serviceName}/partition` (Iceberg) pour les partitions
- [ ] `PUT /dedicated/nasha/{serviceName}` (V6) pour la mise à jour du nom
- [ ] `GET /feature/{featureList}/availability` (AAPI) pour les feature flags

#### Transformations de Données
- [ ] `prepareNasha` transforme correctement les données brutes
- [ ] Les traductions des datacenters sont appliquées
- [ ] Les traductions des unités sont appliquées
- [ ] Les traductions des types d'utilisation sont appliquées

#### Calculs Métier
- [ ] `canCreatePartitions` : `partitionAllocatedSize <= zpoolSize - SIZE_MIN`
- [ ] `shouldReengage` : `engagedUpTo` est dans moins de 3 mois
- [ ] `isNashaLegacyService` : datacenter dans ['rbx', 'sbg', 'bhs'] ET diskType === 'hdd'

#### Traductions
- [ ] Toutes les clés de traduction sont présentes
- [ ] Les valeurs de traduction correspondent à l'AngularJS
- [ ] Les traductions legacy (`nasha_use_type_*`, `nasha_datacenter_*`, etc.) sont accessibles

#### Routing
- [ ] La route `/bmc-nasha/:serviceName` charge la page Dashboard
- [ ] Le paramètre `serviceName` est extrait correctement
- [ ] La navigation vers les sous-routes fonctionne

### 4. Points d'Attention Spécifiques

#### Composants MUK vs OUI
- [ ] Les composants MUK ont le même rendu visuel que les composants OUI AngularJS
- [ ] Les interactions (clics, hover, etc.) fonctionnent de la même manière
- [ ] Les styles CSS sont appliqués correctement

#### Performance
- [ ] Le chargement initial est aussi rapide (ou plus rapide) que l'AngularJS
- [ ] Les requêtes API sont optimisées (pas de doublons)
- [ ] Le cache TanStack Query fonctionne correctement

#### Accessibilité
- [ ] Les labels ARIA sont présents
- [ ] La navigation au clavier fonctionne
- [ ] Les contrastes de couleurs sont respectés

## 🔍 Comment Valider

1. **Comparaison Côte à Côte**
   - Ouvrir l'application AngularJS dans un onglet
   - Ouvrir l'application React dans un autre onglet
   - Comparer visuellement chaque section

2. **Tests Fonctionnels**
   - Tester chaque action (édition, navigation, etc.)
   - Vérifier que les résultats sont identiques

3. **Vérification des Réseaux**
   - Ouvrir les DevTools
   - Comparer les appels API entre les deux implémentations
   - Vérifier que les mêmes endpoints sont appelés avec les mêmes paramètres

4. **Vérification des Données**
   - Comparer les données affichées
   - Vérifier que les calculs produisent les mêmes résultats

## 📝 Notes

- La validation de parité est une étape manuelle qui nécessite un testeur
- Tous les tests automatisés doivent passer avant de commencer la validation
- Documenter toute différence intentionnelle ou non intentionnelle

