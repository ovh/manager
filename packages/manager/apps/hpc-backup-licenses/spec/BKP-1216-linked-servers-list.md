# BKP-1216 — Onglet « Linked servers » : liste des serveurs VBR

Jira: https://jira.ovhcloud.tools/browse/BKP-1216 (2.1, Epic BKP-1161, liée à BKP-1217 / BKP-1218)
Ticket voisin **BKP-1215** (1.1) : https://jira.ovhcloud.tools/browse/BKP-1215 — navigation par onglets de la page de service.
Ticket **BKP-1220** (2.5) : https://jira.ovhcloud.tools/browse/BKP-1220 — polling des opérations asynchrones,
rattaché à ce développement (décision du 27/07/2026 : purement technique, pas de PR séparée).
Contrat API : https://confluence.ovhcloud.tools/pages/viewpage.action?pageId=942871206
Assets tickets (XML JIRA 1215 + 1216) : `/home/mseme/Documents/Backup licences/Tickets/1216/`

> Ce document décrit la **cible** de la fonctionnalité et les décisions de conception, pas un historique.
> Amont du parcours : `BKP-1206-onboarding-page.md` (onboarding) puis `BKP-1208-order-funnel.md` (tunnel de commande).
> Cette page est la **destination** de ces deux parcours : elle remplace `stubRoutes.dashboard`.

Branche `feat/1216-servers-list`. État : **développé** (27/07/2026) — 146 tests / 23 fichiers passants sur le
module, `tsc --noEmit` et lint propres sur les fichiers du ticket. Écarts d'implémentation assumés en §17.

---

## 1. Objectif & périmètre

Après souscription, le client atterrit sur la **page de service Backup Licenses**. Cette page est un espace de
**gestion de licences** : une ligne = un serveur VBR (Veeam Backup & Replication) enregistré + la licence qui lui
est associée. Comme pour le tunnel (cf. §1 de la spec 1208), **aucune notion de workload protégé** n'apparaît ici :
le choix de ce qui est sauvegardé se fait dans la console Veeam, hors de cet outil.

**Dans le périmètre de ce développement :**

1. **Squelette de la page de service (BKP-1215)** : `BaseLayout` + barre des 4 onglets
   (`Linked servers` / `Vaults` / `Billing` / `General information`). Seul « Linked servers » est actif et
   navigable ; les onglets 2, 3 et 4 sont **affichés désactivés** (`OdsTab isDisabled`) jusqu'à leurs tickets
   1.2/1.3/1.4 — décision du 27/07/2026, cf. §12.
2. **Contenu complet de l'onglet « Linked servers » (BKP-1216)** : tableau 7 colonnes + menu d'actions,
   bouton « Ajouter un serveur », empty state, loader, gestion d'erreur avec réessai.
3. **Polling des opérations asynchrones (BKP-1220)** : rafraîchissement automatique toutes les 10 s tant qu'une
   ligne a une tâche en cours, spinner + actions désactivées sur cette ligne, arrêt sur `currentTasks[]` vide,
   avertissement au-delà de 5 min. Détail en §8.

**Hors périmètre. Règle générale : tout ce qui n'est pas encore développé est affiché mais désactivé — aucun
élément d'interface ne mène à une 404.** Il n'y a donc **aucune route stub** dans ce ticket (cf. §12).

| Ticket | Sujet | État dans l'UI |
|---|---|---|
| 2.2 | Modale/tunnel « Ajouter un serveur » | Bouton visible, **désactivé** |
| 2.3 | Modale d'édition d'un serveur | Entrée « Modifier » du menu ⋮ visible, **désactivée** |
| 2.4 | Modale de suppression | Entrée « Supprimer » du menu ⋮ visible, **désactivée** |
| 1.2 / 1.3 / 1.4 | Contenus des onglets Vaults / Billing / General information | Onglets visibles, **désactivés** |

---

## 2. Emplacement du code

**Toute la logique va dans le module partagé `packages/manager/modules/backup-licenses`
(`@ovh-ux/backup-licenses`).** L'app `packages/manager/apps/hpc-backup-licenses` reste une **coquille** :
elle ne fait que splicer `{BackupLicensesRoutes}` sous son `MainLayoutPage` et garder son catch-all `*` → 404.
Un 2ᵉ module (Bare Metal) sera accueilli par la même coquille → **aucune logique métier côté app**.
Seule la spec (ce fichier) vit côté app, dans `spec/`.

Aucune modification attendue dans l'app pour ce ticket (ni route, ni i18n : cf. §10).

---

## 3. Stack & contraintes techniques

- **`@ovh-ux/manager-react-components` (MRC) v2.43** est déjà en `devDependencies` + `peerDependencies` du
  module : c'est la source des composants de listing. Utilisés ici : `BaseLayout`, `Datagrid`,
  `DataGridTextCell`, `ActionMenu`/`ActionMenuItem`, `ErrorBanner`, `Notifications`, `Breadcrumb`.
- **ODS `@ovhcloud/ods-components` v18** (`OdsTabs`/`OdsTab`, `OdsBadge`, `OdsSpinner`, `OdsButton`,
  `OdsMessage`, `OdsText`). **Ne PAS importer `@ovhcloud/ods-react`** (dépendance fantôme hoistée, risque de
  mismatch React 18/19 — cf. mémoire `build-failures-types-react-v19-mismatch` et §3 de la spec 1208).
- **Référence d'implémentation dans le repo : `@ovh-ux/backup-agent`** (module frère, même famille de produit).
  À reproduire fidèlement plutôt qu'inventer :
  | Sujet | Fichier de référence |
  |---|---|
  | Layout à onglets | `src/pages/MainLayout.component.tsx` + `src/pages/_hooks/useDashboardTabs.tsx` |
  | Déclaration des onglets | `src/routes/routes.constants.ts` → `MAIN_LAYOUT_NAV_TABS` |
  | Page de listing + Datagrid | `src/pages/services/dashboard/agent/AgentsListing.page.tsx` |
  | Colonnes | `.../agent/_hooks/useAgentsListingColumns.hooks.tsx` |
  | Menu d'actions de ligne | `.../agent/_components/AgentActionsCell.component.tsx` |
  | Cascade de queries | `src/data/queries/agents.queries.ts` |
  | Mocks | `src/mocks/vaults/vaults.handler.ts` |
- **Conventions de code** (mémoire `react-coding-conventions`) : composants < 200 lignes, découpage
  list/item, 1 composant par fichier, utils externalisés, dossier par type + **sous-dossier par unité avec
  test colocalisé** (`utils/licenseStatus/licenseStatus.ts` + `.spec.ts`), pas de `__tests__/`.
  ⚠️ `backup-agent` utilise `_hooks/`/`_components/` et `__tests__/` : **ne pas copier cette partie**, garder
  la structure déjà en place dans `backup-licenses` (`src/hooks/<unit>/`, `src/components/<feature>/<Unit>/`).
- **Échelle d'espacement Tailwind non standard** : `@ovh-ux/manager-tailwind-config` redéfinit tout
  `theme.spacing` (`8`=1.5rem, `9`=2rem, `10`=2.5rem, `11`=3rem). Vérifier ce preset avant de choisir un
  `gap-*`/`p-*`.
- Design tokens ODS en variables CSS (`text-[var(--ods-color-information-500)]`…). Règle couleur du produit :
  accents = `primary`, succès = `success`, erreur = `critical`, en cours = `information`. Pas de violet.

---

## 4. Routing

**Décision : routes plates, `backupServicesId` jamais dans l'URL** (validée avec le PO côté front).
Le ticket écrit littéralement `Backup Licenses > {backupServicesId} > tab`, mais on suit le module frère
`backup-agent` : l'id de service et l'id de tenant VSPC sont **résolus en interne** par la cascade de queries
(§6). Le client n'a en pratique qu'un seul service Backup Licenses ; ça évite de propager un paramètre partout
et de gérer une redirection `/` → premier tenant.

`src/routes/routes.constants.ts` :

```ts
export const subRoutes = {
  onboarding: 'onboarding',
  order: 'order',
  linkedServers: 'linked-servers',
  vaults: 'vaults',
  billing: 'billing',
  generalInformation: 'general-information',
} as const;

export const routeUrls = { /* '/onboarding', '/order', '/linked-servers', '/vaults', … */ } as const;
```

Les slugs `vaults` / `billing` / `general-information` sont déclarés **dès maintenant** dans `subRoutes` : ils
servent aux libellés d'onglets et seront la cible des tickets 1.2/1.3/1.4. Mais **aucune route n'est créée pour
eux** dans ce ticket, puisque leurs onglets sont désactivés. Une URL tapée à la main (`/vaults`) tombe donc sur
le catch-all `*` de la coquille — cas volontairement non traité.

- `stubRoutes` **disparaît entièrement du module** : `stubRoutes.dashboard` est remplacé par
  `routeUrls.linkedServers` dans ses 2 usages (`OnboardingGuard.page.tsx` → `<Navigate>` quand un abonnement
  actif est détecté, et `Order.page.tsx::handlePrimary` → fin du tunnel), et aucune route stub n'est ajoutée
  pour 2.2/2.3/2.4 (leurs déclencheurs sont désactivés, cf. §8).
- `src/routes/routes.tsx` : l'onglet actif est enfant d'une **route de layout sans path** portant
  `ServiceLayoutPage`, pour que la barre d'onglets soit montée une seule fois et qu'ajouter les onglets
  1.2/1.3/1.4 ne consiste qu'à ajouter des enfants :

```tsx
<Route element={<ServiceLayoutPage />}>
  <Route path={subRoutes.linkedServers} Component={LinkedServersPage}
         handle={{ tracking: { pageName: 'linked-servers', pageType: PageType.listing } }} />
  {/* TODO(1.2/1.3/1.4) : routes vaults / billing / general-information */}
</Route>
```

- La redirection `/` → `/onboarding` reste côté app (`Routes.tsx`), inchangée : l'`OnboardingGuard` est le seul
  point d'entrée qui décide onboarding vs page de service.
- Conséquence à retenir : **plus aucun élément cliquable du module ne mène à une route inexistante.** C'est un
  changement de parti pris par rapport au tunnel 1208, qui assumait la 404 (cf. §12).

---

## 5. Domaine (`src/types/BackupServer.type.ts`)

> ⚠️ **Les noms de champs du tableau du ticket 1216 sont faux.** Un exemple de réponse réelle du `GET` a été
> fourni par le BE le 27/07/2026 (reproduit en §16) et fait référence. Écarts constatés :
> | Ticket | Réalité API |
> |---|---|
> | `currentState.backupServerExternalIp[0]` | `currentState.externalIps: string[]` (**notation CIDR**, ex. `203.0.113.10/32`) |
> | `currentState.backupServerPrivateIp[0]` | `currentState.privateIps: string[]` (idem CIDR) |
> | *(non mentionné)* | enveloppe : `status` (et **non** `resourceStatus`), `targetSpec`, `createdAt`, `updatedAt` |
> | *(non mentionné)* | `currentState.licenseTypeRequested`, `currentState.managementAgentStatus`, `currentState.id` |
> Les autres champs du ticket sont confirmés : `displayName`, `licenseType`, `licenseStatus`,
> `backupServerVersion`, `osType`.

```ts
export enum LicenseStatus {
  CREATING = 'CREATING',
  INSTALLED = 'INSTALLED',
  EXPIRED = 'EXPIRED',
  UPDATING = 'UPDATING',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

export type BackupServer = {
  id: string;                        // dupliqué avec l'id de la ressource, non utilisé
  displayName: string;
  externalIps?: string[];            // CIDR
  privateIps?: string[];             // CIDR
  licenseType?: LicenseApiValue;     // licence effectivement installée → colonne « Licence »
  licenseTypeRequested?: LicenseApiValue; // cible demandée, peut différer pendant un changement (cf. §11)
  licenseStatus?: LicenseStatus | null;
  backupServerVersion?: string;
  osType?: string;                   // enum majuscule : 'WINDOWS' | 'LINUX' | …
  managementAgentStatus?: string;    // non affiché
};

// Enveloppe de la ressource : `status` au lieu de `resourceStatus` (comme AgentResource de backup-agent).
// Définition exacte de BackupServerResource : cf. bloc suivant.
```

- **La ligne du tableau est un `BackupServerResource`** — toutes les colonnes lisent `currentState.*`, l'`id`
  **de la ressource** sert de clé et de paramètre des actions (pas `currentState.id`, redondant).
- **`src/types/Resource.type.ts` doit être complété** : le type actuel du module est une version minimale
  (`{ id, resourceStatus, currentState }`), or le polling (BKP-1220) s'arrête sur `currentTasks[]` vide.
  Aligner sur `backup-agent/src/types/Resource.type.ts` (même enveloppe v2) :

```ts
export type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

export type CurrentTask = { id: string; link: string; status: TaskStatus | null; type: string };

export type Resource<T> = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: T;
  currentTasks?: CurrentTask[];   // ← confirmé présent dans la réponse (§16)
  targetSpec?: Partial<T>;
  createdAt?: string;
  updatedAt?: string;
};
```

  ⚠️ `currentTasks` reste **optionnel sur le type générique** : 3 fichiers de test existants construisent des
  littéraux `Resource<T>` sans ce champ (`checkHasActiveBackupLicensesSubscription.spec.ts`,
  `hasBackupLicensesAddon.spec.ts`) et le rendre obligatoire les casserait sans bénéfice. Il est en revanche
  **resserré en obligatoire** sur le type de la ligne, où on en dépend vraiment :

```ts
export type BackupServerResource = Omit<Resource<BackupServer>, 'resourceStatus' | 'currentTasks'> & {
  status: string;
  currentTasks: CurrentTask[];
};
```

- **`currentTasks` est confirmé présent et renseigné** dans la réponse de liste (le 1er serveur de l'exemple porte
  une tâche `BACKUP_LICENSES_SERVER_LICENSE_CHANGE` en `SCHEDULED`, le 2ᵉ un tableau vide) : le polling peut donc
  bien s'appuyer sur la route de liste (§8), le point bloquant est levé.
- **`licenseType` réutilise `LicenseApiValue`** (`src/types/Order.type.ts`), dont les 4 valeurs correspondent
  exactement à celles du payload. Pas de second enum à créer.
- **`status` de la ressource** (`ENABLED` dans l'exemple) n'est affiché dans aucune colonne : le ticket ne demande
  que `licenseStatus`. Typé `string` volontairement, faute d'énumération connue.
- Tous les champs sauf `id`/`displayName` sont **optionnels** : un serveur en cours de création peut ne pas encore
  avoir d'IP, de version, d'OS ni de statut de licence. Chaque cellule doit gérer l'absence de valeur.

---

## 6. Chaîne API & queries

Trois appels, en cascade (le ticket les liste dans cet ordre) :

| # | Appel | État |
|---|---|---|
| 1 | `GET /v2/backupServices/tenant` → `backupServicesId` | **déjà codé** (`getBackupServicesTenants`) |
| 2 | `GET /v2/backupServices/tenant/{backupServicesId}/vspc` → `vspcTenantId` | **déjà codé** (`getVspcTenants`) |
| 3 | `GET /v2/backupServices/tenant/{backupServicesId}/vspc/{vspcTenantId}/backupLicenses/backupServer` | **à créer** |

- `src/utils/apiRoutes/apiRoutes.ts` : ajouter
  `getBackupServersRoute(backupServicesId, vspcTenantId)` =
  `` `${getVspcTenantsRoute(id)}/${vspcTenantId}/backupLicenses/backupServer` `` (+ cas de test dans le
  `apiRoutes.spec.ts` existant).
- `src/data/api/backupServers/backupServers.requests.ts` : `getBackupServers({ backupServicesId, vspcTenantId })`
  via `v2.get<Resource<BackupServer>[]>` (appel simple, **pas** `fetchIcebergV2` : la liste est courte et le
  support Iceberg de cette route n'est pas documenté — cf. §11).
- `src/data/queries/tenants.queries.ts` (nouveau) : `backupServicesId()` (1er tenant de la liste) et
  `vspcTenantId()`, sur le modèle de `services.queries.ts`/`tenants.queries.ts` de `backup-agent`, en réutilisant
  les requests déjà présentes. Ces queries servent aussi de source pour le **titre de page** (§7).
- `src/data/queries/backupServers.queries.ts` (nouveau) : `withClient(queryClient).list()` qui `await` les deux
  ids puis appelle `getBackupServers` — copie du pattern `agents.queries.ts`.
- `src/data/queries/queryKeys.ts` : ajouter `backupServices.tenants()`, `vspc.tenants(backupServicesId)`,
  `backupServers.all()`. Ne pas toucher à `subscription.active()` (utilisé par l'onboarding).
- **Mocks** (endpoint 3 pas encore déployé, cf. §11) : `src/mocks/backupServers/backupServers.mock.ts` — **partir
  de l'exemple de réponse réel du §16** (2 serveurs, dont un avec `currentTasks` non vide) et le compléter pour
  couvrir les 5 valeurs de `licenseStatus`, un `licenseStatus: null`, et un serveur sans IP/version/OS. Fichier
  compagnon
  `backupServers.handler.ts` (format `Handler[]` de `@ovh-ux/manager-core-test-utils`, comme
  `backup-agent/src/mocks/vaults/vaults.handler.ts`). Les tests unitaires du module restent sur `vi.mock` des
  requests (convention déjà en place, cf. `useHasActiveBackupLicensesSubscription.spec.tsx`).

---

## 7. Page de service & onglets (BKP-1215)

`src/pages/service/ServiceLayout.page.tsx` — sur le modèle de `MainLayout.component.tsx` de `backup-agent` :

- `BaseLayout` avec :
  - `header.title` = **libellé produit statique** : `LABELS.BACKUP_LICENSES = 'Backup Licenses'` dans
    `src/module.constants.ts` — **pas** le nom ni l'id du service (décision du 27/07/2026, même parti pris que
    `backup-agent` qui affiche `LABELS.BACKUP_AGENT`). Conséquence : le titre ne dépend d'aucune query, et
    l'identifiant du service sera exposé dans l'onglet « General information » (ticket 1.4), son emplacement
    naturel. Ne **pas** reprendre la graphie de la nav (« Veeam Backup Licenses ») ni celle de l'onboarding
    (« Backup Licences ») : les deux sont erronées, leur correction est hors périmètre (cf. §11).
  - `breadcrumb` = `<Breadcrumb appName={appName} rootLabel={appName} />`, avec
    `appName = environment.getApplicationName()` récupéré depuis `ShellContext`
    (`@ovh-ux/manager-react-shell-client`) — **pas** de contexte maison à créer côté module, contrairement à
    `backup-agent` qui passe par `BackupAgentContext` ;
  - `message` = `<Notifications />` (utile dès 2.2/2.3/2.4 pour les toasts de succès/erreur) ;
  - `tabs` = `<OdsTabs>` + `Outlet` en enfant dans un `Suspense`. Deux rendus selon l'onglet :
    - onglet **actif** → `<NavLink to={tab.to}><OdsTab isSelected={…}>` (comme `backup-agent`) ;
    - onglet **désactivé** → `<OdsTab isDisabled>` **sans** `NavLink` : `OdsTab` expose nativement
      `isDisabled` (vérifié dans les types ODS v18), donc rien à bricoler et l'accessibilité est gérée par le
      composant. Pas de `to`, pas de tracking.
- `src/routes/routes.constants.ts` : `SERVICE_NAV_TABS` (ordre imposé par le ticket) —
  `linked-servers`, `vaults`, `billing`, `general-information`, chacun avec `name`, `title` (clé i18n),
  `to`, `trackingActions: ['click::<name>-tab']`, et **`isDisabled: true` sur les 3 derniers** (un seul endroit
  à modifier quand 1.2/1.3/1.4 arrivent : retirer le flag et ajouter la route).
- `src/hooks/useServiceTabs/useServiceTabs.ts` : traduit les titres et calcule l'onglet actif
  (`pathname === tab.to`, avec matcher préfixe pour les futures sous-routes type `/linked-servers/add`).
  Un onglet désactivé n'est jamais actif.
- **Onglet par défaut** : `/linked-servers` est la cible de l'`OnboardingGuard` et de la fin du tunnel, donc
  atteint directement. **Pas de route index** dans le layout : la route de layout étant *pathless*, elle ne se
  rend qu'à travers l'un de ses 4 enfants — il n'existe aucune URL « layout sans onglet ». Et une route index y
  matcherait `/`, déjà pris par le `<Navigate to={urls.onboarding}>` déclaré en premier côté app : elle serait
  du code mort.
- **Erreur de résolution du service (AC 1215 : 404 sur `backupServicesId`)** : au niveau du layout, si la
  cascade échoue → `<ErrorBanner error={{ status, data }} />` (message d'erreur Manager standard, avec bouton
  de rechargement fourni par MRC). Voir §8 pour l'erreur *de la liste*, traitée différemment.
- **Pas de page placeholder** : les onglets désactivés n'étant pas navigables, il n'y a aucun contenu à rendre
  pour eux. Le `ComingSoon.page.tsx` d'une version antérieure de cette spec est abandonné.

---

## 8. Onglet « Linked servers » (BKP-1216)

`src/pages/linked-servers/LinkedServers.page.tsx` — orchestrateur, doit rester court :
récupère `useQuery(backupServersQueries.withClient(queryClient).list())`, les colonnes via
`useLinkedServersColumns()`, et arbitre **3 états mutuellement exclusifs** :

| État | Rendu |
|---|---|
| `isError` | `LinkedServersError` : `OdsMessage color=critical` + bouton « Réessayer » → `refetch()` |
| `isPending` | `Datagrid` avec `isLoading` (skeleton de lignes MRC) |
| sinon | `Datagrid` — liste remplie **ou vide** |

**La liste vide n'est pas un état de page à part** : le `Datagrid` MRC rend lui-même une ligne centrée avec
`noResultLabel` quand `rows.length === 0 && !isLoading` (vérifié dans le code du composant), et sa `topbar` est
rendue **inconditionnellement** au-dessus du tableau. Le CTA « Ajouter un serveur » demandé par l'AC de l'empty
state est donc **déjà** celui de la topbar — pas besoin d'un composant d'empty state maison. On passe simplement
`noResultLabel` = « Aucun serveur enregistré. Ajoutez votre premier serveur VBR pour commencer. ».

### Colonnes (ordre imposé par le ticket)

| # | Colonne (i18n) | Source (noms réels, cf. §5) | Cellule |
|---|---|---|---|
| 1 | Nom du serveur | `currentState.displayName` | `DataGridTextCell` |
| 2 | IP publique | `currentState.externalIps` | `ServerIpsCell` |
| 3 | IP privée | `currentState.privateIps` | `ServerIpsCell` |
| 4 | Licence | `currentState.licenseType` | `LicenseTypeCell` |
| 5 | Statut de la licence | `currentState.licenseStatus` | `LicenseStatusCell` |
| 6 | Version VBR | `currentState.backupServerVersion` | `DataGridTextCell` |
| 7 | OS | `currentState.osType` | `OsTypeCell` |
| 8 | *(sans libellé)* | `id` (de la ressource) | `BackupServerActionsCell` (menu ⋮) |

- `isSortable: false` sur **toutes** les colonnes : sans `sorting`/`onSortChange` passés au `Datagrid`, un
  en-tête cliquable ne trierait rien. Pas de pagination ni de filtres (liste de quelques serveurs).
- **IP** : le ticket écrit `[0]`, mais l'API renvoie des tableaux de **CIDR** (`203.0.113.10/32`).
  `formatIpList(ips)` externalisé dans `src/utils/formatIpList/` :
  1. retire le masque quand il désigne un hôte unique (`/32` en IPv4, `/128` en IPv6) — dans une colonne
     « IP publique », `/32` n'apporte aucune information et alourdit la lecture ; tout autre préfixe est **conservé**
     car il porte, lui, une information de plage ;
  2. joint les valeurs restantes par `, ` (comme `AgentIpsCell` de `backup-agent`) ;
  3. renvoie le placeholder `—` si vide/absent.
  On affiche donc **toutes** les IP et non la première : masquer une IP configurée serait un mensonge d'affichage,
  et le tunnel n'en crée de toute façon qu'une de chaque type.
- **OS** : `osType` est un enum majuscule (`WINDOWS`, `LINUX`). `OsTypeCell` affiche un libellé i18n
  (`os.windows`, `os.linux`), avec **retour à la valeur brute** si la valeur est inconnue — même parti pris
  défensif que pour `licenseType`. Ne pas se contenter d'afficher `WINDOWS` tel quel.
- **Version VBR** : `—` si absent (serveur en cours d'enregistrement).

### Colonne « Licence » : libellé et changement en cours

`src/utils/licenseLabel/licenseLabel.ts` → `getLicenseTypeI18nKey(licenseType)` :
`VEEAM_DATA_PLATFORM_FOUNDATION` → `Foundation`, `_ADVANCED` → `Advanced`, `_PREMIUM` → `Premium`,
`VEEAM_BACKUP_REPLICATION_ENTERPRISE_PLUS` → `Enterprise Plus`.
Valeur inconnue ou absente → afficher la **valeur brute** de l'API (ou `—` si vide) plutôt qu'une chaîne vide :
si le BE ajoute un palier, la colonne reste informative au lieu de paraître cassée.

**Affichage de la transition pendant un changement de licence** (décision du 27/07/2026) : `LicenseTypeCell`
reçoit `licenseType`, `licenseTypeRequested` et `isInFlight`, et rend

| Condition | Rendu |
|---|---|
| `isInFlight` **et** `licenseTypeRequested` présent **et** ≠ `licenseType` | `Premium → Advanced` (les 2 libellés via le même util, séparés par `→`) |
| sinon | le libellé de `licenseType` seul |

**La transition n'est affichée que si la ligne a une tâche en cours** (`isInFlight`, cf. polling ci-dessous), et
c'est volontaire : si un changement de licence **échoue**, l'API peut très bien conserver un
`licenseTypeRequested` différent de `licenseType` sans aucune tâche active. Se fier au seul écart entre les deux
champs afficherait alors « Premium → Advanced » indéfiniment, en promettant un changement qui n'arrivera jamais.
Lier l'affichage à la présence d'une tâche garantit qu'on ne montre une flèche que pendant une opération réelle.

### Badge de statut de la licence

`src/utils/licenseStatus/licenseStatus.ts` → `getLicenseStatusDisplay(status)` renvoie
`{ kind: 'progress' | 'badge', color, i18nKey, rawLabel? }` :

| `licenseStatus` | Rendu | Détail |
|---|---|---|
| `CREATING` | spinner + texte | `OdsSpinner` (taille xs) + libellé « En cours de création » en `information` |
| `UPDATING` | spinner + texte | idem, « Mise à jour en cours » |
| **absent / `null`** | spinner + texte | traité **exactement comme `CREATING`** (AC explicite du ticket) |
| `INSTALLED` | badge `success` | « Actif » |
| `EXPIRED` | badge `critical` | « Expirée » |
| `NOT_SUPPORTED` | badge `critical` | « Non prise en charge » |
| valeur inconnue | badge `information` | libellé = valeur brute (défensif, cf. §12) |

Le rendu « spinner + texte bleu » **n'est pas un `OdsBadge`** : c'est un composant maison
`LicenseStatusCell` (ODS v18 n'a pas de badge avec spinner intégré).
⚠️ Ne **pas** réutiliser `NAMESPACES.STATUS` de `@ovh-ux/manager-common-translations` pour ces libellés :
sa clé `expired` vaut « Résilier » (sémantique service, pas licence). Libellés définis dans le namespace du module.

### Menu d'actions de ligne

`BackupServerActionsCell` — `ActionMenu` MRC `isCompact variant=ghost` dans un `DataGridTextCell`, sur le modèle
de `AgentActionsCell`, avec 2 entrées (libellés repris de `@ovh-ux/manager-common-translations` : `actions:edit`,
`actions:delete`, la seconde en `color: ODS_BUTTON_COLOR.critical`).

**Les deux entrées sont `isDisabled: true` tant que 2.3/2.4 ne sont pas livrés** (décision du 27/07/2026) : elles
existent — l'AC « chaque ligne a un menu d'actions Modifier / Supprimer » est donc satisfaite — mais aucun clic
n'envoie l'utilisateur sur une 404. Pas de `href`, donc pas de `useHref` ni de route stub. Quand 2.3/2.4
arriveront, il suffira de remplacer `isDisabled` par le `href` correspondant.

`ActionMenuItem.isDisabled` existe bien dans MRC v2.43 (vérifié dans les types).

### Polling des opérations asynchrones (BKP-1220)

Les POST/PUT/DELETE sur un serveur VBR sont asynchrones : la ressource porte une ou plusieurs `currentTasks`
tant que l'opération n'est pas terminée.

**Déclenchement — piloté par la donnée, pas par l'événement.** Le ticket dit « après un POST/PUT/DELETE
réussi, démarrer le polling », mais ces mutations sont les tickets 2.2/2.3/2.4, hors périmètre. On implémente
donc la règle équivalente et plus robuste : **on polle dès qu'au moins une ligne de la liste a une tâche en
cours**. Avantages : ça couvre aussi l'arrivée depuis le tunnel de commande et le rechargement de page en cours
de provisionnement (un déclencheur purement événementiel perdrait le polling au refresh). Quand 2.2/2.3/2.4
arriveront, elles n'auront **rien à câbler** : il leur suffira d'invalider `queryKeys.backupServers.all()`
après la mutation, le polling démarrera de lui-même.

**On polle la route de liste, pas la route de détail.** Le ticket cite
`GET …/backupLicenses/{backupServerId}`, mais : (a) cette route est incohérente avec celle de la liste
(`…/backupLicenses/backupServer`) et ressemble à une coquille du ticket (cf. §11) ; (b) un seul rafraîchissement
de la liste toutes les 10 s met à jour **toutes** les lignes concernées, là où le polling par ligne
multiplierait les requêtes ; (c) la liste renvoie déjà `currentState` complet, seule chose nécessaire pour
mettre la ligne à jour. Si le BE confirme que la liste ne renvoie pas `currentTasks`, il faudra basculer sur la
route de détail — d'où l'isolement de la logique dans un hook dédié.

`src/hooks/useBackupServersPolling/useBackupServersPolling.ts` :

- Constantes (`src/module.constants.ts`) : `POLLING_INTERVAL_MS = 10_000`, `POLLING_TIMEOUT_MS = 300_000`
  (10 s / 5 min, valeurs du ticket).
- `refetchInterval` passé au `useQuery` sous forme de **fonction** (React Query v5) :
  `hasInFlightServers(data) && !hasTimedOut ? POLLING_INTERVAL_MS : false`. React Query gère alors seul le
  démarrage et l'arrêt — pas de `setInterval` maison.
- **Timeout 5 min** : la date de début de la séquence est mémorisée dans un `ref` à la transition
  « aucune tâche → au moins une tâche », et remise à zéro quand plus aucune ligne n'est en cours. Au-delà de
  `POLLING_TIMEOUT_MS`, le hook coupe le polling et expose `hasTimedOut: true` ; la page affiche alors un
  `OdsMessage color=warning` : « L'opération prend plus de temps que prévu. Rafraîchissez la page. ».
  Un clic sur « Rafraîchir » (topbar) réarme la séquence.
- `src/utils/inFlightServer/inFlightServer.ts` (externalisé, testé) :
  `isServerInFlight(server)` = `(server.currentTasks?.length ?? 0) > 0`, et
  `hasInFlightServers(servers)` = `servers.some(isServerInFlight)`.

**Rendu de la ligne en cours d'opération :**

- **Statut** : `LicenseStatusCell` reçoit un booléen `isInFlight` ; s'il est vrai, on rend le spinner + texte
  `information` **quel que soit** `licenseStatus`. Le rendu est donc identique à celui de `CREATING`/`UPDATING`
  (§ mapping ci-dessus) : deux sources différentes de « opération en cours », un seul rendu, pour ne pas
  inventer un troisième visuel.
- **Actions** : `BackupServerActionsCell` reçoit `isDisabled={isInFlight}` et le passe à
  `ActionMenu` (prop `isDisabled`, disponible sur le composant MRC). On désactive **le menu entier** plutôt que
  ses deux entrées une par une : le menu ne contient que « Modifier » et « Supprimer », tous deux à désactiver,
  et un bouton ⋮ grisé est plus lisible qu'un menu qui s'ouvre sur deux entrées inertes.
- **Fin d'opération** : rien de spécial à coder. Le refetch renvoie la ligne avec `currentTasks: []` et son
  `currentState` à jour → le badge normal et les actions reviennent d'eux-mêmes. Une ligne supprimée disparaît
  simplement de la réponse.

### Topbar

- Gauche : `OdsButton` primaire « Ajouter un serveur », **désactivé (`isDisabled`) tant que 2.2 n'est pas livré**,
  par cohérence avec le menu ⋮ : la règle « rien ne mène à une 404 » vaut aussi pour ce bouton. Il reste
  **visible**, comme l'exige l'AC. Contrepartie assumée : sur une liste vide, le CTA de l'empty state est grisé —
  état volontairement transitoire, 2.2 étant le ticket suivant. Ne pas oublier de retirer le `isDisabled` en même
  temps que le câblage de 2.2.
  **Pas de `ManagerButton`/IAM** : aucune règle IAM n'est définie pour `backupLicenses` (cf. §11) ; un
  `ManagerButton` sans `iamActions` pertinent n'apporterait rien.
- Droite : bouton ghost « Rafraîchir » (`actions:refresh`) → `queryClient.invalidateQueries({ queryKey:
  queryKeys.backupServers.all() })`, désactivé pendant le chargement. Sert aussi de sortie de secours après un
  timeout de polling (§ ci-dessus) : il réarme la séquence. Justification en §12.

---

## 9. Arborescence des fichiers (cible)

```
modules/backup-licenses/src/
  routes/
    routes.constants.ts                  # MAJ : subRoutes/routeUrls des 4 slugs, SERVICE_NAV_TABS (isDisabled
                                         #       sur 3 onglets), suppression complète de stubRoutes
    routes.tsx                           # MAJ : route de layout + route linked-servers
  module.constants.ts                    # MAJ : namespaces DASHBOARD + LINKED_SERVERS,
                                         #       LABELS.BACKUP_LICENSES, POLLING_INTERVAL_MS / POLLING_TIMEOUT_MS
  types/
    BackupServer.type.ts                 # NEW : BackupServer + LicenseStatus
    Resource.type.ts                     # MAJ : currentTasks + CurrentTask + TaskStatus
  utils/
    apiRoutes/apiRoutes.ts               # MAJ : getBackupServersRoute (+ .spec.ts existant)
    licenseStatus/licenseStatus.ts       # NEW + .spec.ts
    licenseLabel/licenseLabel.ts         # NEW + .spec.ts
    osTypeLabel/osTypeLabel.ts           # NEW + .spec.ts
    formatIpList/formatIpList.ts         # NEW + .spec.ts
    inFlightServer/inFlightServer.ts     # NEW + .spec.ts (isServerInFlight / hasInFlightServers)
  data/
    api/backupServers/backupServers.requests.ts   # NEW
    queries/tenants.queries.ts                    # NEW
    queries/backupServers.queries.ts              # NEW
    queries/queryKeys.ts                          # MAJ
  mocks/backupServers/
    backupServers.mock.ts                # NEW
    backupServers.handler.ts             # NEW
  hooks/
    useServiceTabs/useServiceTabs.ts               # NEW + .spec.ts
    useLinkedServersColumns/useLinkedServersColumns.tsx  # NEW
    useBackupServersPolling/useBackupServersPolling.ts   # NEW + .spec.ts (BKP-1220)
  pages/
    service/ServiceLayout.page.tsx       # NEW (1215)
    linked-servers/LinkedServers.page.tsx # NEW + .spec.tsx (1216)
    onboarding/OnboardingGuard.page.tsx  # MAJ : Navigate vers routeUrls.linkedServers
    order/Order.page.tsx                 # MAJ : fin de tunnel vers routeUrls.linkedServers
  components/linked-servers/
    LinkedServersError/                  # NEW
    LinkedServersTopbar/                 # NEW
    LicenseStatusCell/                   # NEW
    LicenseTypeCell/                     # NEW
    OsTypeCell/                          # NEW
    ServerIpsCell/                       # NEW
    BackupServerActionsCell/             # NEW
  public/translations/dashboard/Messages_{8 locales}.json      # NEW
  public/translations/linked-servers/Messages_{8 locales}.json # NEW
```

Convention de nommage : dossier de feature en kebab-case (`linked-servers`, aligné sur le slug de route),
composant en PascalCase avec suffixe `.component.tsx`, hooks/utils en camelCase — cohérent avec
`components/order/` et `hooks/useOrderForm/` déjà en place.

---

## 10. i18n

- Deux nouveaux namespaces dans `src/module.constants.ts` :
  `DASHBOARD: 'module-backup-licenses/dashboard'` (libellés des 4 onglets uniquement) et
  `LINKED_SERVERS: 'module-backup-licenses/linked-servers'` (colonnes, statuts, types de licence, OS,
  empty state, erreur, boutons, message de timeout du polling).
  Le titre H1 n'est **pas** dans l'i18n : c'est un nom de produit, donc une constante
  `LABELS.BACKUP_LICENSES` non traduite (même choix que `LABELS` dans `backup-agent`).
- Fichiers dans `public/translations/<ns>/Messages_{lng}.json`, **8 locales** comme `onboarding` et `order`
  (`fr_FR`, `fr_CA` = copie stricte de `fr_FR`, `en_GB`, `de_DE`, `es_ES`, `it_IT`, `pl_PL`, `pt_PT`),
  clés strictement identiques d'un fichier à l'autre, structure imbriquée (`column.*`, `status.*`, `license.*`,
  `empty_state`, `error.*`, `os.*`, `polling.timeout`).
- **Mécanisme de copie vérifié** (point resté ouvert dans la spec 1206) : le `tsconfig.json` du module inclut
  `public/**/*.json` avec `resolveJsonModule`, donc `tsc` émet `dist/public/translations/**` ; le
  `vite.config.mjs` de l'app copie `<module>/dist/public/**/*` → `translations/module-backup-licenses/`, ce que
  le `loadPath` i18next de l'app (`translations/${namespace}/Messages_${lng}.json`) résout correctement. Le
  module frère `backup-agent` a exactement la même configuration et un `dist/public/translations/` peuplé.
  **Aucune modification côté app n'est nécessaire pour ajouter un namespace.**
- Clés réutilisées de `@ovh-ux/manager-common-translations` : `actions:edit`, `actions:delete`,
  `actions:refresh`, et `dashboard:general_information` pour le libellé du 4ᵉ onglet.
  Tout le reste (IP publique/privée, version VBR, OS, statuts de licence) n'existe pas en commun → à définir.
- Ton : conserver les conventions établies en §9 de la spec 1208 (formulation orientée solution, pas
  impérative ; pas de duplication d'information sur un même écran).
- Traductions non-fr générées par IA → **à faire relire par le CDS** avant mise en prod, comme les namespaces
  existants. L'app HPC ne déclare toujours que `fr_FR` dans `availablesLocales`.

---

## 11. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **`GET …/backupLicenses/backupServer`** | Endpoint pas encore déployé, mais **un exemple de réponse a été fourni par le BE le 27/07/2026** (§16) : les types sont écrits d'après lui, pas d'après le ticket (dont les noms de champs sont faux, cf. §5). | Reste à confirmer : liste exhaustive des valeurs de `osType` et de `status`, et comportement d'un serveur en cours de création (quels champs sont absents ?). |
| **~~`licenseType` vs `licenseTypeRequested`~~** | **Tranché (27/07/2026)** : on affiche la transition `Premium → Advanced` pendant une opération en cours, le libellé simple sinon (§8). | Reste à confirmer BE : que devient `licenseTypeRequested` si le changement de licence **échoue** ? La règle « transition affichée seulement si une tâche est en cours » nous protège, mais le comportement réel est à connaître. |
| **Orthographe du nom produit** | **Tranché (27/07/2026) : le nom est « Backup Licenses »**, valeur de `LABELS.BACKUP_LICENSES`. Deux autres graphies subsistent dans le repo et sont **incorrectes** : l'entrée de nav du container dit « Veeam Backup Licenses » (8 locales) et l'i18n de l'onboarding dit « Backup Lic**e**nces ». | **Hors périmètre de ce ticket, ne pas corriger maintenant** (décision explicite). À reprendre plus tard pour aligner nav + onboarding sur « Backup Licenses ». |
| **Affichage des CIDR** | `formatIpList` retire `/32` et `/128` et conserve tout autre préfixe (§8). | Faire valider par le design/PO : c'est un choix de lisibilité, réversible en une ligne. |
| **`vspcType`/`enabledAddons`** | Contrat déjà signalé comme non confirmé dans la spec 1206 (`VspcTenant.type.ts`). La cascade de queries en dépend indirectement. | Même vérification BE. Si la détection d'abonnement ne marche pas, c'est le 1er endroit à regarder. |
| **~~Titre de la page~~** | **Tranché (27/07/2026)** : libellé produit statique, ni le nom ni l'id du service. Écart assumé avec la lettre du ticket 1215 (« service header with the service name »). | L'identifiant du service devra apparaître dans l'onglet « General information » (ticket 1.4). |
| **Plusieurs services par compte ?** | `GET /v2/backupServices/tenant` renvoie une **liste** ; comme l'id n'est pas dans l'URL (§4), le code prend `data[0]` (même choix que `backup-agent`). Si un compte peut avoir 2 services Backup Licenses, le second serait donc inaccessible, silencieusement. | Confirmer PO : un seul service par compte ? Si oui, rien à faire. Si non → sélecteur de service dans l'en-tête, ou retour de l'id dans l'URL. |
| **Pagination / Iceberg** | Appel simple `v2.get`, pas de pagination. | Si la route supporte Iceberg et que les listes peuvent être longues, passer à `fetchIcebergV2` + pagination `Datagrid`. |
| **IAM** | Aucune règle IAM appliquée (bouton d'ajout et menu d'actions non gatés). | Récupérer les actions IAM `backupLicenses/*` auprès du BE et passer aux `ManagerButton`/`ActionMenuItem.iamActions`, comme `backup-agent`. |
| **Onglets 2/3/4** | Visibles mais **désactivés** (décision 27/07/2026). L'AC 1215 « clicking a tab displays the corresponding content » n'est donc satisfaite que pour « Linked servers ». | Tickets 1.2 (Vaults), 1.3 (Billing), 1.4 (General information) : retirer `isDisabled` de `SERVICE_NAV_TABS` + ajouter la route. |
| **Actions Add / Edit / Delete** | Visibles mais **désactivées** (décision 27/07/2026), donc aucune 404 possible. | Tickets 2.2 / 2.3 / 2.4 : retirer `isDisabled`, brancher le `href`/`onClick`. |
| **~~`currentTasks` dans la réponse de liste~~** | **Résolu (27/07/2026)** : confirmé présent et renseigné dans l'exemple fourni (§16). Le polling s'appuie donc sur la route de liste. | — |
| **Route de détail du ticket 1220** | Le ticket écrit `GET …/vspc/{vspcTenantId}/backupLicenses/{backupServerId}`, sans le segment `backupServer` présent dans la route de liste (`…/backupLicenses/backupServer`). Probable coquille. | À confirmer BE. Non utilisée dans l'implémentation retenue (on polle la liste), donc non bloquant. |
| **Icône de menu Manager** | Entrée de nav `hpc-backup-licenses` déjà ajoutée (nav-reshuffle + legacy), icône à aligner avec le design. Flag CFF `hpc-backup-licenses` toujours à activer côté backend/2API. | Cf. mémoire `hpc-backup-licenses-sidebar-entry`. |

---

## 12. Décisions structurantes (rationale, pour ne pas les défaire par erreur)

- **Routes plates, `backupServicesId` résolu par API** plutôt que dans l'URL (§4) : alignement sur
  `backup-agent`, un seul service par client en pratique, pas de paramètre à propager. Conséquence assumée :
  l'URL n'identifie pas le service.
- **Empty state = `noResultLabel` du `Datagrid`, pas un composant maison** : l'AC demande un empty state « avec
  un CTA Ajouter un serveur », mais ce bouton est **au-dessus** du tableau, dans la topbar — laquelle est rendue
  par le `Datagrid` quelle que soit la taille de la liste. Le CTA est donc déjà là ; un composant d'empty state
  dédié ne ferait que dupliquer le bouton. Une seule phrase dans `noResultLabel` suffit.
- **Deux traitements d'erreur distincts** : `ErrorBanner` (pleine page, standard Manager) quand c'est
  **le service** qui est introuvable — AC de 1215 ; `OdsMessage` + « Réessayer » **dans l'onglet** quand c'est
  la liste qui échoue — l'utilisateur garde ses onglets et le bouton d'ajout, et le retry est un `refetch()`
  ciblé plutôt qu'un rechargement complet de la page.
- **Bouton « Rafraîchir » conservé malgré le polling** : il couvre les deux cas que le polling ne couvre pas —
  polling à l'arrêt (aucune tâche en cours) mais l'utilisateur veut revérifier, et sortie de secours après le
  timeout de 5 min, où il réarme la séquence. Le ticket 1220 demande d'ailleurs explicitement de dire à
  l'utilisateur de rafraîchir : autant lui en donner le moyen sans recharger toute la page.
- **Polling piloté par la donnée (`currentTasks` non vide) et non par l'événement de mutation**, et **sur la
  route de liste** plutôt que par ligne : rationale détaillé en §8. Conséquence à connaître : les mutations
  2.2/2.3/2.4 n'auront qu'à invalider la query, sans logique de polling propre.
- **Un seul rendu « opération en cours »** : `licenseStatus` à `CREATING`/`UPDATING`/absent et `currentTasks` non
  vide produisent le **même** spinner + texte `information`. Ce sont deux signaux différents de la même réalité
  côté utilisateur ; leur donner deux visuels distincts n'aurait aucun sens pour lui.
- **`licenseStatus` absent = `CREATING`** : demandé explicitement par le ticket (une licence qui n'a pas encore
  de statut est en cours de provisionnement). En revanche, une **valeur inconnue** (non prévue par l'enum) est
  affichée en badge `information` avec le libellé brut, et **non** ramenée à « En cours de création » : on ne
  veut pas prétendre qu'un statut inconnu est un provisionnement en cours.
- **Colonnes non triables** plutôt que triables-mais-inertes (§8).
- **« Désactivé » plutôt que « stub qui 404 », partout** (onglets 2/3/4, bouton d'ajout, entrées Modifier /
  Supprimer) : l'élément reste **visible** — les AC exigent sa présence, et il annonce la cible du produit — mais
  aucun clic ne casse l'écran. C'est un **changement de parti pris par rapport au tunnel 1208**, qui assumait la
  404 sur `stubRoutes.dashboard` : là-bas la cible était le ticket immédiatement suivant et le stub était invisible
  à l'utilisateur, ici il s'agit d'éléments d'interface bien visibles. Conséquence directe : **`stubRoutes`
  disparaît du module** et aucune page placeholder n'est créée.
- **Corollaire à ne pas oublier** : chaque livraison de 1.2/1.3/1.4/2.2/2.3/2.4 doit **retirer un `isDisabled`**.
  Les points d'entrée sont volontairement centralisés (`SERVICE_NAV_TABS` pour les onglets,
  `LinkedServersTopbar` pour l'ajout, `BackupServerActionsCell` pour les 2 actions de ligne).
- **Réutilisation de `LicenseApiValue`** (tunnel) pour `licenseType` au lieu d'un nouvel enum : les valeurs
  écrites dans le tunnel sont exactement celles relues ici. Un doublon divergerait tôt ou tard.
- **`ShellContext.environment.getApplicationName()` pour le breadcrumb**, pas de contexte maison façon
  `BackupAgentContext` : le module n'a besoin de rien d'autre de l'app, et un contexte imposerait un provider
  à chaque coquille (HPC puis Bare Metal).
- **Affichage de toutes les IP** (join `, `) plutôt que `[0]` seul (§8).
- **Titre H1 = libellé produit statique**, pas le nom/id du service : un UUID en H1 n'apprend rien à
  l'utilisateur, l'identifiant du service a sa place dans « General information » (1.4), et le titre devient
  indépendant de toute query — donc affiché même quand la résolution du tenant échoue.
- **Transition de licence affichée uniquement pendant une tâche en cours** (`Premium → Advanced`) et non sur le
  simple écart `licenseType` ≠ `licenseTypeRequested` : sinon un changement échoué afficherait éternellement une
  promesse de changement (§8).

---

## 13. Tests prévus

Convention (mémoire `react-coding-conventions`, règle 8) : **uniquement les branches conditionnelles**, jamais
l'affichage d'un texte statique. Tests colocalisés, pas de `__tests__/`.

| Fichier | Ce qui est testé |
|---|---|
| `utils/licenseStatus/licenseStatus.spec.ts` | 5 statuts connus + `null` + `undefined` (→ CREATING) + valeur inconnue (→ badge information, libellé brut) |
| `utils/licenseLabel/licenseLabel.spec.ts` | 4 valeurs connues + valeur inconnue (→ brute) + absente (→ `—`) |
| `utils/formatIpList/formatIpList.spec.ts` | `undefined`, `[]`, 1 IP, N IP, `/32` et `/128` retirés, autre préfixe (`/24`) conservé, IP sans masque |
| `utils/osTypeLabel/osTypeLabel.spec.ts` | `WINDOWS`, `LINUX`, valeur inconnue (→ brute), absente (→ `—`) |
| `utils/inFlightServer/inFlightServer.spec.ts` | `currentTasks` `undefined` / `[]` / non vide ; liste sans aucune tâche / avec au moins une |
| `hooks/useBackupServersPolling/useBackupServersPolling.spec.ts` | polling armé quand une tâche est en cours, coupé quand plus aucune, coupé + `hasTimedOut` au-delà de 5 min (timers `vi.useFakeTimers`), réarmement après refresh |
| `utils/apiRoutes/apiRoutes.spec.ts` (MAJ) | route `backupLicenses/backupServer` bien construite |
| `hooks/useServiceTabs/useServiceTabs.spec.ts` | onglet actif selon `pathname`, y compris sur une sous-route ; un onglet `isDisabled` n'est jamais actif |
| `components/linked-servers/LicenseTypeCell.component.spec.tsx` | transition affichée si `isInFlight` + `licenseTypeRequested` ≠ `licenseType` ; libellé simple si l'un des trois manque (dont le cas « écart sans tâche en cours ») |
| `pages/linked-servers/LinkedServers.page.spec.tsx` | les 3 branches d'état : loading, erreur + clic « Réessayer » (refetch appelé), liste rendue (dont le cas vide → `noResultLabel` affiché et topbar toujours présente) |
| `data/queries/backupServers.queries.spec.ts` | cascade : la liste est demandée avec les ids résolus |

Composants purement présentationnels sans branche (`LinkedServersTopbar`, `OsTypeCell`, `ServerIpsCell`,
`ServiceLayout.page`) → **pas de test dédié**, par choix : leur logique est dans les utils ci-dessus, déjà
couverts.
Les cellules qui **ont** une branche conditionnelle sont testées :
`LicenseStatusCell.spec.tsx` (spinner forcé quand `isInFlight`, même si `licenseStatus` vaut `INSTALLED`),
`BackupServerActionsCell.spec.tsx` (menu désactivé quand `isInFlight` — et entrées désactivées tant que 2.3/2.4
ne sont pas livrés) et `LicenseTypeCell` (ci-dessus).

Rappel : 73 tests / 11 fichiers passants sur le module avant ce ticket.

---

## 14. Critères d'acceptation (checklist de fin de dev)

**BKP-1216**
- [x] L'appel `GET …/backupLicenses/backupServer` est déclenché au chargement de l'onglet « Linked servers ».
- [x] Le tableau affiche les 7 colonnes avec les bons champs API.
- [x] `licenseType` est affiché avec son libellé lisible (Foundation / Advanced / Premium / Enterprise Plus).
- [x] Le badge de statut respecte le mapping (§8).
- [x] `licenseStatus` absent ou `null` → « En cours de création » avec spinner.
- [x] Chaque ligne a un menu d'actions « Modifier » / « Supprimer » *(entrées désactivées jusqu'à 2.3/2.4)*.
- [x] Le bouton « Ajouter un serveur » est visible au-dessus du tableau *(désactivé jusqu'à 2.2)*.
- [x] Pendant un changement de licence, la colonne affiche `licence effective → licence demandée`.
- [x] Liste vide → empty state « Aucun serveur enregistré… » + CTA « Ajouter un serveur ».
- [x] Un loader est affiché pendant le chargement.
- [x] Erreur API → message d'erreur + bouton « Réessayer ».

**BKP-1220** (polling)
- [x] Le polling démarre automatiquement, toutes les 10 s, dès qu'une ligne a une tâche en cours — donc après un
      POST/PUT/DELETE réussi une fois 2.2/2.3/2.4 livrés (la mutation n'a qu'à invalider la query).
- [x] Le polling s'arrête quand `currentTasks[]` est vide sur toutes les lignes.
- [x] Pendant le polling, la ligne concernée affiche un spinner à la place du badge et son menu d'actions est
      désactivé.
- [x] Au-delà de 5 min, le polling s'arrête et un message d'avertissement invite à rafraîchir.
- [x] À la fin du polling, la ligne est mise à jour depuis `currentState` (badge et actions restaurés).

**BKP-1215** (partie couverte ici)
- [x] La page affiche les 4 onglets dans l'ordre imposé, les 3 derniers désactivés.
- [x] « Linked servers » est l'onglet actif au chargement.
- [x] Cliquer « Linked servers » met à jour l'URL (deep link). ⚠️ **Écart assumé** : les onglets 2/3/4 étant
      désactivés, ils ne naviguent pas — AC satisfaite pour eux à la livraison de 1.2/1.3/1.4.
- [x] ⚠️ **Écart assumé** : le titre affiche le libellé produit, pas le nom du service (§12).
- [x] Aucun `backupServicesId` trouvé (404) → message d'erreur Manager standard.
- [x] *(déjà fait hors ce ticket)* Entrée « Backup Licenses » sous « Storage and Backup » dans le menu latéral —
      reste conditionnée à l'activation du flag CFF.

---

## 15. Reste à faire après ce ticket

- [ ] Confirmer le contrat de `backupServer` avec le BE et retirer les mocks de dev (§11).
- [ ] Tickets 2.2 / 2.3 / 2.4 : ajout, édition, suppression d'un serveur → **retirer les `isDisabled`** du bouton
      d'ajout et des 2 entrées du menu ⋮, et brancher les routes/modales correspondantes.
- [ ] Tickets 1.2 / 1.3 / 1.4 : contenus réels des onglets Vaults / Billing / General information.
- [ ] IAM : gater le bouton d'ajout et le menu d'actions.
- [ ] Relecture CDS des 7 traductions non-fr des 2 nouveaux namespaces.
- [ ] Activer les locales non-fr dans `availablesLocales` de l'app une fois la relecture faite.
- [ ] **Répercuter les vrais noms de champs sur le tunnel de commande (1208)** : son `ServerVaultFormState`
      utilise `backupServerExternalIp`/`backupServerPrivateIp` (chaînes simples), là où l'API parle de
      `externalIps`/`privateIps` (tableaux de CIDR). Le submit étant encore stubé, rien n'est cassé aujourd'hui,
      mais le payload du POST devra être aligné — à vérifier avec le BE en même temps que le contrat du POST.

---

## 16. Annexe — exemple de réponse `GET …/backupLicenses/backupServer`

Fourni par le BE le 27/07/2026. **Source de vérité des noms de champs**, en lieu et place du tableau du ticket
(cf. §5). Deux serveurs : le premier a un changement de licence en cours (`currentTasks` non vide, avec
`licenseType` ≠ `licenseTypeRequested`), le second est au repos (`currentTasks: []`).

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "ENABLED",
    "targetSpec": {
      "displayName": "VBR-CUST-SERV-01",
      "licenseType": "VEEAM_DATA_PLATFORM_ADVANCED",
      "privateIps": ["192.168.10.2/32"],
      "externalIps": ["203.0.113.10/32"]
    },
    "currentState": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "displayName": "VBR-CUST-SERV-01",
      "privateIps": ["192.168.10.2/32"],
      "externalIps": ["203.0.113.10/32"],
      "licenseTypeRequested": "VEEAM_DATA_PLATFORM_ADVANCED",
      "licenseType": "VEEAM_DATA_PLATFORM_PREMIUM",
      "backupServerVersion": "12.1",
      "licenseStatus": "INSTALLED",
      "managementAgentStatus": "INSTALLED",
      "osType": "WINDOWS"
    },
    "currentTasks": [
      {
        "id": "cc0e8400-e29b-41d4-a716-446655440008",
        "link": "/me/task/cc0e8400-e29b-41d4-a716-446655440008",
        "status": "SCHEDULED",
        "type": "BACKUP_LICENSES_SERVER_LICENSE_CHANGE"
      }
    ],
    "createdAt": "2026-05-01T12:00:00Z",
    "updatedAt": "2026-05-05T09:30:00Z"
  },
  {
    "id": "44665544-a716-41d4-8e9b-550e84000002",
    "status": "ENABLED",
    "targetSpec": {
      "displayName": "VBR-CUST-SERV-02",
      "licenseType": "VEEAM_DATA_PLATFORM_FOUNDATION",
      "privateIps": ["10.100.10.2/32"],
      "externalIps": ["203.0.113.25/32"]
    },
    "currentState": {
      "id": "44665544-a716-41d4-8e9b-550e84000002",
      "displayName": "VBR-CUST-SERV-02",
      "privateIps": ["10.100.10.2/32"],
      "externalIps": ["203.0.113.25/32"],
      "licenseTypeRequested": "VEEAM_DATA_PLATFORM_FOUNDATION",
      "licenseType": "VEEAM_DATA_PLATFORM_FOUNDATION",
      "backupServerVersion": "12.1",
      "licenseStatus": "INSTALLED",
      "managementAgentStatus": "INSTALLED",
      "osType": "WINDOWS"
    },
    "currentTasks": [],
    "createdAt": "2026-05-01T12:00:00Z",
    "updatedAt": "2026-05-05T09:30:00Z"
  }
]
```

---

## 17. Écarts entre la spec et l'implémentation livrée

Petits ajustements décidés pendant le développement, tous vérifiés dans le code des dépendances.

| Sujet | Spec | Livré | Pourquoi |
|---|---|---|---|
| Libellé « Modifier » | `actions:edit` | `actions:modify` | `actions:edit` vaut « Éditer » en fr ; l'AC demande « Modifier ». |
| Util de libellé de licence | `getLicenseTypeI18nKey()` → clé | `getLicenseTypeDisplay()` → `{ i18nKey?, rawLabel }` | Le repli sur la valeur brute / le placeholder devient testable dans l'util au lieu d'être répété dans chaque cellule. Même forme pour `getOsTypeDisplay`. |
| `licenseType` / `licenseStatus` | `LicenseApiValue` / `LicenseStatus` | `… \| string` | Sans ça, la branche défensive « valeur inconnue → libellé brut » est du code mort pour TS (`never`). |
| Polling | `refetchInterval` en **fonction** | `refetchInterval` en **valeur** (`number \| false`) issue du hook | Le hook a besoin des serveurs pour armer le garde-fou : il lit la donnée déjà en cache (`queryClient.getQueryData`) avant le `useQuery`, ce qui évite le cycle options ↔ data. Le composant étant abonné, la valeur lue est toujours la plus récente. |
| Garde-fou 5 min | `ref` mémorisant le début de séquence | minuteur armé à la transition « aucune tâche → au moins une », remis à zéro par le *cleanup* de l'effet, et réarmé par un compteur de séquence | Pas de `setState` dans le corps d'un effet (règle `react-hooks/set-state-in-effect`), et aucune date à mémoriser. |
| Résolution du service | queries `backupServicesId()` / `vspcTenantId()` | idem + query `serviceIds()` (clé `queryKeys.serviceIds()`) | La page de service a besoin d'une query observable pour afficher l'`ErrorBanner` quand la cascade échoue. |
| Libellé « en cours » d'une ligne en opération | « identique à `CREATING`/`UPDATING` » | statut déjà `progress` → son libellé ; sinon « Mise à jour en cours » | Une tâche sur une licence déjà provisionnée est une mise à jour, pas une création. |
| Tests | `useServiceTabs.spec.ts` | `.spec.tsx` | Le hook a besoin d'un wrapper `MemoryRouter` + `I18nextProvider`. |
| Harness i18n | — | ne résout que les clés de **premier niveau** (`empty_state` oui, `column.name` non) | Constat de `i18next.addResources` avec des ressources imbriquées : les assertions portent donc sur les clés, sauf pour `empty_state`. |
| Dette lint du module | — | non traitée | Le lint du module était **déjà rouge avant ce ticket** (Order.page.tsx, useOrderForm, isValidIp.spec — erreurs `prettier/prettier`). Seuls les fichiers de ce ticket ont été mis au propre, pour ne pas noyer le diff. **À reprendre dans une passe dédiée.** |
