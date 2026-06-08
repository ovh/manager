# Carte des nœuds Zerto

## Deux couches distinctes

```
COUCHE ROUTES (spécifique par app)            COUCHE COMPOSANTS (partagée)
─────────────────────────────────────         ──────────────────────────────────
apps/dedicated/.../dedicatedCloud/            components/.../zerto/
  datacenter/zerto/                             ├── index.js  (module Angular)
    *.routing.js  ← resolvers + goBack          ├── *.component.js / .controller.js / .html
    *.module.js                                 ├── *.service.js  ← cerveau central
    index.js                                    └── *.constants.js
                                              
apps/dedicated/.../managedBaremetal/
  datacenter/zerto/
    (structure miroir, préfixes d'état différents)
```

Les routes **injectent** les dépendances dans les composants via les resolvers.
Les composants **ne s'importent pas** les routes — liaison unidirectionnelle routes → composants.

---

## Nœuds principaux et leur rôle

| Nœud | Fichier clé | Rôle |
|---|---|---|
| **Service** | `*.service.js` | Hub central : toutes les API calls, toute la logique métier |
| **Constantes** | `*.constants.js` | STATUTS, OPTIONS, RÔLES, regex IP — importées partout |
| **Root component** | `*.component.js` + `.controller.js` | Choix du type DRP (OVH / OnPremise) au démarrage |
| **Alerts** | `alerts/` | Bandeau contextuel, cible `dedicatedCloudDatacenterZertoAlert` |
| **Listing** | `listing/` | Liste des sites — mode OnPremise uniquement |
| **Summary** | `summary/` | Tableau de bord — mode OVH uniquement |
| **AddSite** | `addSite/` | Modal ajout de site OnPremise |
| **Config OVH** | `configuration/ovh/` | Wizard 2 étapes pour DRP OVH-to-OVH |
| **Config OnPremise** | `configuration/onPremise/` | Wizard 2 étapes pour DRP OVH ↔ client |
| **mainPcc** | `configuration/common/mainPcc/` | Étape 1 **partagée** par OVH et OnPremise |
| **stateBadge** | `stateBadge/` | Badge couleur état Zerto global |
| **siteStateBadge** | `siteStateBadge/` | Badge agrégé multi-sites (compteur par état) |

---

## Connexions clés

```
constants.js ──────────────────────────────────────────► tous les fichiers .js

service.js ◄── injecté dans les routing.js (resolvers)
           ◄── injecté dans les controllers via $inject

Root controller
  ├── lit  currentZerto.state  (injecté depuis route resolver)
  ├── si OVH        → goToConfiguration('ovh.mainPccStep')
  └── si OnPremise  → goToConfiguration('onPremise.ovhPccStep')

configuration/common/mainPcc/   ← utilisé par OVH (étape 1) ET OnPremise (étape 1)

listing/
  ├── ouvre modal → addSite/
  └── ouvre modal → listing/delete-site-modal/

summary/
  └── ouvre modal → summary/delete/
```

---

## Où modifier quoi

| Besoin | Fichier(s) à toucher |
|---|---|
| Appel API Zerto | `*.service.js` |
| Nouvel état / statut | `*.constants.js` → puis les badges et `service.js` |
| Nouvelle colonne listing | `listing/*.html` + `listing/*.controller.js` |
| Champ formulaire addSite | `addSite/*.html` + `addSite/*.controller.js` |
| Info affiché dans le summary | `summary/*.html` + `summary/*.controller.js` |
| Nouvelle route | `dedicatedCloud/datacenter/zerto/*.routing.js` **et** `managedBaremetal/datacenter/zerto/*.routing.js` |
| Resolver / goBack | Fichiers `.routing.js` de la couche routes |
| Traductions | `translations/Messages_*.json` dans le sous-dossier concerné |
