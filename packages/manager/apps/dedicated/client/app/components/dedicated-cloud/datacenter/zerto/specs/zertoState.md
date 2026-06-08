# Spec — Fonctionnalité Zerto (DRP/PRA)

## Vue d'ensemble

La fonctionnalité Zerto gère le **Plan de Reprise d'Activité (PRA/DRP)** pour les services VMware OVHcloud. Elle est exposée via deux applications distinctes qui partagent les mêmes composants :

| Application | État racine UI-Router |
|---|---|
| `dedicatedCloud` | `app.dedicatedCloud.details.datacenter.details.zerto` |
| `managedBaremetal` | `app.managedBaremetal.details.datacenters.datacenter.zerto` |

Les composants visuels et la logique métier sont centralisés dans :
`packages/manager/apps/dedicated/client/app/components/dedicated-cloud/datacenter/zerto/`

---

## Architecture des dossiers

```
components/dedicated-cloud/datacenter/zerto/
├── index.js                                  # Point d'entrée module Angular
├── dedicatedCloud-datacenter-zerto.component.js
├── dedicatedCloud-datacenter-zerto.controller.js
├── dedicatedCloud-datacenter-zerto.html      # Choix du type DRP (OVH / OnPremise)
├── dedicatedCloud-datacenter-zerto.constants.js
├── dedicatedCloud-datacenter-zerto.service.js  # Service central (~860 lignes)
├── alerts/                                   # Bandeau d'alertes contextuel
├── listing/                                  # Liste des sites (OnPremise uniquement)
│   └── delete-site-modal/
├── summary/                                  # Tableau de bord (OVH uniquement)
│   └── delete/
├── addSite/                                  # Modal ajout de site
├── stateBadge/                               # Badge coloré d'état Zerto
├── siteStateBadge/                           # Badge d'état multi-sites
└── configuration/
    ├── common/
    │   └── mainPcc/                          # Étape 1 commune (sélection PCC principal)
    ├── ovh/                                  # Config OVH-to-OVH
    │   └── secondPcc/                        # Étape 2 OVH (PCC secondaire)
    └── onPremise/                            # Config site client
        ├── ovhPcc/                           # Étape 1 OnPremise (PCC OVH)
        └── onPremisePcc/                     # Étape 2 OnPremise (infos site client)
```

Les routes (modules Angular séparés) sont dans les apps respectives :
- `apps/dedicated/client/app/dedicatedCloud/datacenter/zerto/`
- `apps/dedicated/client/app/managedBaremetal/datacenter/zerto/`

---

## Flux de navigation (UI-Router)

```
État racine: zerto
    ↓ résolutions : zertoState, zertoInformations, datacenterHosts, datacenterList
    ↓
    [si onPremise] → .listing
        ↓
        .listing.addSite          (modal — formulaire d'ajout de site)
        .listing.deleteSite/:id   (modal — confirmation suppression site)

    [si OVH]       → .summary
        ↓
        .summary.delete           (modal — confirmation suppression DRP)

    [si pas encore configuré] →
        .ovh (abstract)
            .ovh.mainPccStep     (étape 1 : PCC principal + datacenter + IP)
            .ovh.secondPccStep   (étape 2 : PCC secondaire + datacenter + IP)
        .onPremise (abstract)
            .onPremise.ovhPccStep      (étape 1 : PCC OVH + IP)
            .onPremise.onPremisePccStep (étape 2 : infos site client)
```

---

## Composants détaillés

### Composant racine — Choix du type DRP
**Fichiers :** `dedicatedCloud-datacenter-zerto.{component,controller,html}.js`

- Affiche deux tuiles visuelles : **OVH** (DRP entre deux PCC OVH) ou **OnPremise** (PCC OVH ↔ site client)
- Le controller gère la transition vers la configuration correspondante via `setupConfiguration()`

### Alerts
**Dossier :** `alerts/`

- Bandeau affiché en haut de page
- Affiche des messages selon l'état : livraison en cours, attente VPN, succès
- Cible d'alerte : `dedicatedCloudDatacenterZertoAlert`

### Listing (OnPremise uniquement)
**Dossier :** `listing/`

- Datagrid des sites Zerto configurés
- Colonnes : label, status, IP publique, VRA, ZVM
- Actions disponibles : ajouter un site / supprimer un site
- Redirige vers `summary` si le mode n'est pas OnPremise

### Add Site
**Dossier :** `addSite/`

- Formulaire modal d'ajout d'un site OnPremise
- Champs : label, PSK, IP publique, IP VRA, IP ZVM
- Validation IP côté client avant appel API

### Summary (OVH uniquement)
**Dossier :** `summary/`

- Tableau de bord de la configuration Zerto OVH
- Affiche les PCC configurés + formulaire de configuration VPN (IP locale/distante, blocs CIDR)
- Bouton de suppression du DRP → ouvre `summary/delete`
- Redirige vers `listing` si le mode est OnPremise

### Configuration OVH — 2 étapes
**Dossier :** `configuration/ovh/`

- Barre de progression 2 étapes
- **Étape 1 (`mainPcc`)** : sélection du datacenter principal et de l'IP publique — partagée avec OnPremise
- **Étape 2 (`secondPcc`)** : sélection du PCC secondaire, datacenter secondaire et IP — filtre les PCC disponibles, vérifie la présence d'hôtes

### Configuration OnPremise — 2 étapes
**Dossier :** `configuration/onPremise/`

- Barre de progression 2 étapes
- **Étape 1 (`ovhPcc`)** : même composant `mainPcc` que OVH + champ VRA network
- **Étape 2 (`onPremisePcc`)** : saisie des infos du site client (VRA network, distance réseau)

### State Badge / Site State Badge
**Dossiers :** `stateBadge/`, `siteStateBadge/`

- Badges colorés selon l'état Zerto (livré, en cours, erreur…)
- `siteStateBadge` agrège les états de plusieurs sites et affiche un compteur par statut

---

## Service central

**Fichier :** `dedicatedCloud-datacenter-zerto.service.js` (~860 lignes)

Toute la logique métier Zerto est centralisée ici :

| Méthode | Rôle |
|---|---|
| `getZertoInformations()` | Récupère l'état et la configuration Zerto du datacenter |
| `activateZerto()` | Active Zerto sur le datacenter |
| `disableZerto()` | Désactive et supprime Zerto |
| `orderZertoOption()` | Commande l'option Zerto (legacy/Agora) |
| `configureVpn()` | Met à jour la configuration VPN |
| `addSite()` | Ajoute un site OnPremise |
| `deleteSite()` | Supprime un site OnPremise |
| `getAvailablePcc()` | Liste les PCC disponibles pour la configuration OVH |
| `storeZertoPreferences()` | Sauvegarde les préférences utilisateur |
| Méthodes statiques | Vérification d'état, formatage IP/CIDR |

---

## Différences entre dedicatedCloud et managedBaremetal

Les deux modules de routes ont une structure **strictement identique**. Les seules différences connues sont :

1. **Préfixe de l'état UI-Router** : `app.dedicatedCloud.…` vs `app.managedBaremetal.…`
2. **Bandeau d'information** : potentiellement un message différent selon le produit
3. **Imports de fonctions de retour/navigation** : les `goBack*` resolvers pointent vers les états parents respectifs de chaque app

---

## Constantes clés

**Fichier :** `dedicatedCloud-datacenter-zerto.constants.js`

- `ZERTO_STATUS` : états possibles (delivered, toDeliver, deleting…)
- `ZERTO_OPTION` : noms des options commandées
- `ZERTO_ROLES` : rôles possibles (onPremise, ovh)
- `ZERTO_ORDER_PRODUCTS` : références produits pour commande legacy et Agora
- Regex de validation IP / CIDR

---

## Points d'alerte pour la migration

- Les `resolvers` des routes injectent les dépendances dans les composants via bindings — toute adaptation doit tenir compte de cette injection depuis la route, pas depuis le composant lui-même.
- `dedicatedCloudZerto` (le service) est injecté dans les routes, pas dans les composants directement.
- Les noms des cibles d'alerte (`dedicatedCloudDatacenterZertoAlert`, `dedicatedCloudDatacenterZertoDashboard`) sont codés en dur dans les controllers et devront être adaptés si les noms changent.
- L'état d'arrivée par défaut (`listing` vs `summary`) dépend d'un appel API au chargement de l'état racine (`zertoInformations.isOnPremise`).
