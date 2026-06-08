# Zerto — Tâches d'implémentation

Référence : [zertoState.md](zertoState.md) · [zertoMap.md](zertoMap.md)  
Specs détaillées : [source/spec-shared.md](source/spec-shared.md) · [source/spec-tab-configuration.md](source/spec-tab-configuration.md) · [source/spec-tab-vra.md](source/spec-tab-vra.md) · [source/spec-tab-ltr.md](source/spec-tab-ltr.md)

---

## Tâche 1 — Mise en place de la structure à onglets

> Afficher les 3 onglets uniquement quand Zerto est actif (`formattedState === "delivered"` ou `"delivering"`). Tant que Zerto n'est pas activé, les wizards existants prennent le relais.

**Périmètre :**
- Créer le composant conteneur `drp/` avec la barre d'onglets (Configuration / VRA / LTR)
- Ajouter les états UI-Router `.drp`, `.drp.configuration`, `.drp.vra`, `.drp.ltr` dans les deux apps (`dedicatedCloud` et `managedBaremetal`)
- Conditionner la navigation : si `formattedState` ∈ `{delivered, delivering}` → `.drp` ; sinon → wizards existants (`.ovh`, `.onPremise`)
- L'onglet LTR est visible uniquement si le feature flag `DEDICATED_CLOUD_ZERTO_LTR` est actif (spec-tab-configuration.md §5)

**Statut :** [x] Fait

---

## Tâche 2 — Onglet Configuration

> Remplacer les vues `listing` et `summary` actuelles par un onglet Configuration unifié. Les composants `listing/` et `summary/` sont **réutilisés** à l'intérieur.

**Périmètre :**
- Vue OVH (`drpType === "ovh"`) : 4 cartes (type DRP, site principal, site secondaire, abonnement) + modale delete → réutilise `summary/` + `summary/delete/` (spec-tab-configuration.md §2 et §4)
- Vue OnPremise (`drpType === "onPremise"`) : 3 cartes + tableau des sites → réutilise `listing/`, `addSite/`, `listing/delete-site-modal/` (spec-tab-configuration.md §3)
- Cartes : distinguer `pccType` EPCC vs MBM pour les libellés (spec-shared.md §2)
- Badge statut abonnement (`serviceInfos.status`) : ok → success, expired → critical, autre → warning (spec-tab-configuration.md §7)
- Bouton delete : règles de désactivation selon `formattedState`, `vpnStatus`, `remoteSiteInformation.state` (spec-tab-configuration.md §2)
- Notifications au montage : delivering info, vpnStatus warning, delivered success (spec-tab-configuration.md §6)
- Endpoints : `GET /dedicatedCloud/{svc}/datacenter/{dcId}`, `GET /dedicatedCloud/{svc}/serviceInfos`, `GET zertoSingle/remoteSites` (spec-tab-configuration.md §2 et §3)
- Delete API : `POST zerto/disable` (OVH) ou `POST zertoSingle/disable` (OnPremise) (spec-tab-configuration.md §4)

**Statut :** [ ] À faire

---

## Tâche 3 — Onglet LTR (Long-Term Retention)

> Gérer les buckets Object Storage pour la rétention longue durée. Derrière le feature flag `DEDICATED_CLOUD_ZERTO_LTR`.

**Périmètre :**
- Tableau des buckets : colonnes Nom, Nombre de jours (N/A si 0 + tooltip), Endpoint, Actions (spec-tab-ltr.md §2)
- État vide : icône + lien externe création bucket OVHcloud + bouton ajout (spec-tab-ltr.md §2)
- Ligne pending en fin de tableau pendant l'ajout en cours (spec-tab-ltr.md §2)
- Modale ajout : formulaire complet avec toggle immutabilité + champs conditionnels (spec-tab-ltr.md §3)
- Modale édition : pré-remplissage + règle clés access/secret omises si non modifiées (spec-tab-ltr.md §4)
- Modale suppression : mise à jour optimiste du cache (spec-tab-ltr.md §5)
- Gestion localStorage `ltr-pending-add-{svc}-{dcId}` + polling 30s (spec-shared.md §6, spec-tab-ltr.md §1)
- Endpoints : `GET/POST/PUT/DELETE /disasterRecovery/{base}/extendedJournal` où `base` = `zerto` ou `zertoSingle` (spec-tab-ltr.md §1, §3, §4, §5)
- Validation URL endpoint regex `/^https:\/\/s3\.[a-z]+(?:-[a-z]+)*\.(io|perf)\.cloud\.ovh\.net$/i` (spec-shared.md §4)

**Statut :** [ ] À faire

---

## Tâche 4 — Onglet VRA (Virtual Replication Appliance)

> Consulter et redimensionner les VRA d'un datacenter. Asynchrone via localStorage + polling.

**Périmètre :**
- Tableau VRA : colonnes Nom, VMId, Ressources (`{cpu} vCPU · {memory} GiB RAM`) trié par `vmId` croissant (spec-tab-vra.md §2)
- État pending par ligne : spinner + "Redimensionnement vers …" ou texte erreur rouge si `isPendingError` (spec-tab-vra.md §2)
- Sélection multiple par checkbox + dropdown profil cible (XS/S/L/XL) désactivé sans sélection (spec-tab-vra.md §2)
- Modale confirmation : liste des VRA + avertissement impact VPG (spec-tab-vra.md §3)
- API une fois par VRA sélectionnée en parallèle : `POST /disasterRecovery/{base}/vraResources` (spec-tab-vra.md §3)
- Gestion localStorage `vra-pending-resize-{svc}-{dcId}` + polling 60s (spec-shared.md §6, spec-tab-vra.md §4)
- Timeout 10 min : supprimer pending + toast erreur (spec-tab-vra.md §4)
- Abandon après 3 erreurs API consécutives (spec-tab-vra.md §4)
- Profils : XS (1 CPU, 2 GiB), S (2 CPU, 6 GiB), L (4 CPU, 12 GiB), XL (4 CPU, 16 GiB) (spec-shared.md §2)

**Statut :** [ ] À faire
