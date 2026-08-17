# BKP-1226 — Onglet « General information » : page de vue d'ensemble du service

Jira : https://jira.ovhcloud.tools/browse/BKP-1226 (Epic BKP-1161 — « 5.1 General information — Service overview page », 3 points, Ready for Dev)
Maquette de référence : `/home/mseme/Documents/Backup licences/Tickets/1226/image-2026-06-30-10-00-42-253.png` (pièce jointe Jira 588738)
Assets ticket : `/home/mseme/Documents/Backup licences/Tickets/1226/`

**Branche de départ : `feat/1218-update-vbr-server`** — comme pour BKP-1225, c'est la seule branche qui porte la page de service à onglets (BKP-1215), dont cet onglet est un enfant. Elle contient déjà 1206 + 1208 + 1216 + 1219 + 1218.
État : spec validée, implémentation en cours.

> ### Règle de lecture de la maquette
>
> La maquette fait autorité sur le layout 2 colonnes et sur un point que le tableau texte du ticket ne tranche pas : **une section « Contacts » (Administrator / Technical / Billing + lien « Manage contacts → ») existe dans le bloc de droite**, entre « Next due date » et « Termination ». Le commentaire Jira du 30/06 dit littéralement *« Pas de partie contact »* et aucun critère d'acceptation ne la mentionne — **contradiction actée en session : les Contacts sont conservés**, la maquette (plus récente et plus détaillée que le commentaire sur ce point précis) prime.
> Le lien « Terminate license → » est rendu en couleur critique (rouge) dans la maquette, contrairement à « Access VSPC » et « Manage contacts » en bleu primaire — cohérent avec une action destructive.

---

## 1. Objectif & périmètre

Depuis l'onglet « General information » du service Backup Licenses, le client voit les informations générales de son service (référence, nom, accès VSPC) et les informations de gestion de l'abonnement (dates de facturation, contacts, résiliation).

**Layout 2 colonnes, 2 tuiles :**

| Tuile | Colonne | Champs |
|---|---|---|
| **General information** | Gauche | Reference (`backupServicesId`) · Service name · lien « Access VSPC → » |
| **Service management** | Droite | Creation date · Next due date · Contacts (3 rôles + « Manage contacts → ») · lien « Terminate license → » |

**Hors périmètre :**

- Pas de bloc « Subscription »/plan supplémentaire au-delà de ce que montrent le ticket et la maquette.
- Pas de gestion des contacts elle-même (édition, ajout) : seul le lien de renvoi vers l'app `account` est affiché.
- Onglets « Vaults » (1.2) et « Billing » (1.3, cf. spec BKP-1225) restent hors périmètre de ce ticket.

---

## 2. Emplacement dans l'app

L'onglet existe déjà, **désactivé**, dans la page de service livrée par BKP-1215 :

`src/routes/routes.constants.ts` → `SERVICE_NAV_TABS`, entrée `general-information`, `isDisabled: true`, libellé `NAMESPACES.DASHBOARD:general_information` (namespace commun, déjà traduit).

Activation, comme pour BKP-1225 :

1. retirer `isDisabled: true` de l'entrée `general-information` ;
2. ajouter la route enfant (+ sa route petite-fille `terminate`, cf. §7) dans `src/routes/routes.tsx`, sous la route de layout `<Route element={<ServiceLayoutPage />}>` :

```tsx
<Route
  path={subRoutes.generalInformation}
  Component={GeneralInformationPage}
  handle={{ tracking: { pageName: 'general-information', pageType: PageType.dashboard } }}
>
  <Route path={subRoutes.terminate} Component={TerminateServicePage} />
</Route>
```

`subRoutes.generalInformation` / `routeUrls.generalInformation` existent déjà. `subRoutes.terminate` (`'terminate'`) est **nouveau**, à ajouter. Rien à toucher dans `ServiceLayout.page.tsx` (en-tête, fil d'Ariane, `Notifications`, `ErrorBanner` de résolution du service déjà portés par le layout).

**Toute la logique vit dans `packages/manager/modules/backup-licenses`.** L'app `hpc-backup-licenses` reste une coquille ; seule cette spec vit côté app.

---

## 3. Chaîne de résolution des données

Aucun identifiant dans l'URL (même principe que 1216/1225) :

```
① tenantsQueries.withClient(qc).backupServicesId()     [déjà écrit — BKP-1216]
      GET /v2/backupServices/tenant                     → backupServicesId

② tenantsQueries.withClient(qc).vspcTenantId()          [déjà écrit — BKP-1216]
      GET /v2/backupServices/tenant/{backupServicesId}/vspc → vspcTenantId

③ GET /v2/backupServices/tenant/{backupServicesId}/vspc/{vspcTenantId}/backupLicenses
      → BackupLicenseResource                            (⚠ contrat non confirmé, cf. §13)
      → resourceName (champ de jointure vers /services, nom exact à confirmer)

④ useServiceDetailsQueryOption({ resourceName })         (module @ovh-ux/manager-module-common-api, déjà en dépendance)
      GET /v6/services?resourceName={resourceName}      → serviceId
      GET /v6/services/{serviceId}                       → ServiceDetails
      → resource.displayName, billing.lifecycle.current.creationDate,
        billing.nextBillingDate, customer.contacts
```

**Le ticket écrit littéralement que ③ renvoie directement « serviceId (=id) »**, sans passer par `resourceName` → `/services?resourceName=`. C'est incohérent avec le reste du contrat `/services` (v6) utilisé partout ailleurs dans le monorepo (y compris dans la propre section « Termination » de ce même ticket, qui *elle* décrit l'étape resourceName → serviceId explicitement). **Confirmé (règle générale produits) : un produit renvoie un ID de ressource (`resourceName`), qui est ensuite utilisé pour appeler `/services` et obtenir le `serviceId`** — le champ renvoyé par ③ n'est donc pas un `serviceId` Agora numérique directement exploitable, malgré la formulation du ticket. Décision figée : passer systématiquement par `useServiceDetailsQueryOption`/`useDeleteService` (qui encapsulent déjà cette résolution — cf. §7).

**Pas de nouvel appel réseau pour « Access VSPC »** : le lien et le statut de provisionnement se lisent depuis le tenant VSPC déjà résolu par la cascade ② (`tenantsQueries.vspcTenants(backupServicesId)`, déjà en cache). Le ticket décrit un `GET .../vspc/{vspcTenantId}` séparé pour obtenir le lien ; en pratique la route liste (`.../vspc`) et la route unitaire (`.../vspc/{id}`) partagent la même forme de ressource en API Iceberg v2, donc le lien doit déjà être présent sur l'élément de la liste. **Confirmé par précédent réel : `backup-agent`, sur cette même route `.../vspc`, expose déjà `currentState.accessUrl` sur la ressource de liste** (`VSPC_TENANTS_MOCKS` de `packages/manager/modules/backup-agent/src/mocks/tenant/vspcTenants.mock.ts`). Le champ **`accessUrl`** (et non `link`, pour rester aligné sur ce précédent) est ajouté à `VspcTenant.type.ts` (optionnel, non encore modélisé côté `backup-licenses`) plutôt que de refaire un appel redondant.

---

## 4. « Access VSPC » et l'état de provisionnement

- Le lien « Access VSPC → » ouvre `vspcTenant.currentState.accessUrl` dans un nouvel onglet (`target="_blank" rel="noopener"`).
- **« Being provisioned »** (AC du ticket) : mappé sur `vspcTenant.resourceStatus === 'CREATING'` (valeur déjà dans l'union `ResourceStatus` de `Resource.type.ts`, même modèle que le reste du module). **Figé (précédent identique dans `backup-agent`, même route/même logique de statut, cf. §3)**. Si vrai : le lien est désactivé et remplacé par le texte « Available after provisioning » (nouvelle clé i18n), pas de `href`.
- Si `accessUrl` est absent alors que le statut n'est pas `CREATING` (cas non prévu par le contrat), retomber sur `EMPTY_VALUE_PLACEHOLDER` plutôt que planter — tolérance du même type que celles déjà actées en 1216/1225.

---

## 5. Stack & contraintes techniques

Identiques aux specs 1216/1225 du module :

- **ODS v18** (`@ovhcloud/ods-components/react`) et **MRC v2.43** (`@ovh-ux/manager-react-components`). Import interdit : `@ovhcloud/ods-react` (mismatch React 18/19, cf. mémoire `build-failures-types-react-v19-mismatch`).
- **`@ovh-ux/backup-agent` ne doit pas être importé** (dépendance fantôme, non exportée de toute façon).
- **`ManagerTile`** (composant générique de MRC : `Title` / `Divider` / `Item` / `Item.Label` / `Item.Description`) est le bloc de construction des deux tuiles — c'est exactement la structure visuelle de la maquette (carte + titre + séparateur + lignes label/valeur).
- **`@ovh-ux/manager-module-common-api`** (déjà en dépendance `^0.6.7`) fournit `useServiceDetailsQueryOption`, `useDeleteService`, le type `ServiceDetails` (avec `customer.contacts: CustomerContact[]`, `type: 'administrator'|'billing'|'technical'`) et les mocks MSW `getServicesMocks`.
- **Décision : ne pas réutiliser `BillingInformationsTileStandard`** (module `@ovh-ux/manager-billing-informations`, déjà en dépendance) malgré la piste initiale. Deux raisons : (1) il affiche un champ « State » que ni le ticket ni la maquette ne demandent ; (2) il n'a **aucun slot pour les Contacts**, et sa version composable (`BillingInformationsTile` sans suffixe, avec les sous-parties `.CreationDate`/`.NextBillingDate`/`.ResiliateLink` prises séparément) **n'est pas exportée** par le package (`index.ts` ne réexporte que `BillingInformationsTileStandard`). Recomposer à la main avec `ManagerTile` + `useServiceDetailsQueryOption` donne le contrôle exact du contenu et de l'ordre attendus par la maquette, sans dépendre de choix internes d'un autre module.
- **Formatage de date** : `useFormatDate()` (hook recommandé de MRC, non déprécié) avec le format `'d MMMM yyyy'` (date-fns) → « 15 April 2027 », conforme à l'exemple du ticket. Ne pas utiliser `useFormattedDate`/`DateFormat.fullDisplay` (marqué `@deprecated` dans MRC) malgré son usage dans `billing-informations`.
- **Lien « Terminate license »** : composant `Links`/`LinkType.next` de MRC (même primitive que `ResiliateLink` de billing-informations), en couleur critique pour matcher la maquette.
- Conventions de code (mémoire `react-coding-conventions`) : composants < 200 lignes, 1 composant par fichier, cellules/tuiles extraites, utils externalisés, test colocalisé. Commentaires : uniquement le « pourquoi » (mémoire `feedback-code-comments-why-only`).

---

## 6. Structure de la page

```
GeneralInformation.page.tsx   (rendu dans l'Outlet de ServiceLayout — pas de BaseLayout ici)
  <section className="flex md:flex-row flex-col gap-8">
    <GeneralInformationTile />     ← colonne gauche : Reference / Service name / Access VSPC
    <ServiceManagementTile />      ← colonne droite : Creation date / Next due date / Contacts / Terminate
  </section>
  <Outlet />                       ← route enfant "terminate" → modale (§7)
```

Trois états globaux, mutuellement exclusifs (même logique que `BillingError`/`LinkedServersError`) :

| État | Rendu |
|---|---|
| **Chargement** | `OdsSkeleton` par valeur (le champ `Description` de chaque `ManagerTile.Item`), pas de squelette de page entière — cohérent avec le pattern `CreationDate`/`ResiliateLink` de billing-informations. |
| **Erreur** (échec de ③ ou ④) | Bandeau `OdsMessage` critique + bouton « Réessayer », à la place des deux tuiles. L'échec de ①/② reste géré par l'`ErrorBanner` globale de `ServiceLayout` (résolution de service, déjà en place). |
| **Contenu** | Les deux tuiles, chaque valeur individuellement dégradée en `EMPTY_VALUE_PLACEHOLDER` si son champ précis est absent (pas d'état d'erreur pour un champ isolé manquant, seulement pour l'échec complet de la requête). |

---

## 7. Résiliation (« Terminate license »)

**Décision (actée en session) : modale de confirmation interne avant l'appel API**, même pattern que `TerminateService.page.tsx` de `backup-agent` :

- Route enfant `subRoutes.terminate` (`'terminate'`) sous `general-information`, rendue via l'`Outlet` de la page (§6).
- `TerminateServicePage` : `Modal` de MRC, `type={ODS_MODAL_COLOR.critical}`, titre + texte de confirmation, bouton d'annulation → `navigate(routeUrls.generalInformation)`.
- Confirmation → `useDeleteService(...).terminateService({ resourceName })` (module `common-api`) : cette mutation encapsule déjà la résolution `resourceName → serviceId` **et** le `POST /services/{serviceId}/terminate` (avec la variante `DELETE` pour le sous-tiers US, gérée automatiquement via `ShellContext`). Aucune plomberie à réécrire.
- **Comportement post-résiliation (actée en session) : une fois tous les appels envoyés (mutation `terminateService` réglée, succès ou échec), on redirige vers le hub** (sortie du contexte du service, cohérent avec une ressource résiliée qui n'a plus lieu d'être consultée). Diffère des précédents `backup-agent`/`okms` (ci-dessous), qui se contentent de fermer la modale sans redirection — décision spécifique à Backup Licenses.
  - **Implémentation** : l'URL cible (`https://manager.eu.ovhcloud.com/#/hub/` sur l'exemple donné en session) est résolue dynamiquement via `useNavigationGetUrl(['hub', '', {}])` (même mécanisme que le lien « Manage contacts », déjà utilisé ailleurs dans le monorepo pour une navigation inter-app, ex. `OrderServiceButton` de `logs-to-customer`) plutôt que codée en dur : une URL figée casserait sur les autres régions/sous-tiers (CA/US) et les environnements de dev/staging.
  - Références trouvées dans le monorepo pour un flux de résiliation via `/services` en modale interne, à titre de comparaison :
    - `backup-agent` (`TerminateService.page.tsx` + `useTerminateVspcService.ts`) : `onSettled` ferme systématiquement la modale (succès **et** échec), notification globale (`addSuccess`/`addError`), pas de message inline ni de redirection.
    - `okms`/secret-manager (`OkmsTerminateModal.component.tsx`) : même hook `useDeleteService` que celui prévu ici, même logique — fermeture systématique + notification globale (`clearNotifications` puis `addSuccess`/`addError`), invalidation des queries du service, pas de redirection.
  - Notification globale (`addSuccess`/`addError`) à conserver avant la redirection, même pattern que les deux précédents.

Le lien « Terminate license → » dans `ServiceManagementTile` n'est qu'une navigation (`NavLink`/`Link` vers `routeUrls.generalInformation + '/terminate'`), pas un appel direct — la modale porte toute la logique.

---

## 8. Contacts

- Source : `serviceDetails.customer.contacts` (`CustomerContact[]`, `type: 'administrator' | 'billing' | 'technical'`, `customerCode` = nic-handle du type `ls48478-ovh`).
- Affichage : une ligne par contact, code à gauche + libellé de rôle traduit à droite (ordre de la maquette), les 3 rôles dans l'ordre `administrator` → `technical` → `billing` (ordre du ticket/maquette, à confirmer si l'API ne garantit pas cet ordre — trier côté front sur une liste de rôles fixe si besoin).
- Lien « Manage contacts → » : navigation inter-app vers l'app `account`, route `/contacts/services`, via `useNavigationGetUrl(['account', '/contacts/services', { ... }])` (`@ovh-ux/manager-react-shell-client`) — **paramètres exacts à confirmer** (les usages trouvés dans le repo passent `category`/`serviceName` selon le produit ; à vérifier à l'implémentation, cf. §13).
- Si `customer.contacts` est vide ou absent : masquer la section plutôt que d'afficher 3 lignes vides (tolérance, pas de comportement documenté par le ticket sur ce cas).

---

## 9. Types & couche data à créer

```ts
// src/types/BackupLicense.type.ts   (nouveau)
export type BackupLicense = {
  id: string;
  resourceName: string;
};
export type BackupLicenseResource = Resource<BackupLicense>;

// src/types/VspcTenant.type.ts   (complété)
export type VspcTenant = {
  id: string;
  vspcType?: string;
  enabledAddons?: string[];
  /** Aligné sur `currentState.accessUrl` de backup-agent (même route `.../vspc`, cf. §3). */
  accessUrl?: string;
};
```

Routes à ajouter dans `src/utils/apiRoutes/apiRoutes.ts` :

```ts
export const getBackupLicensesRoute = (backupServicesId: string, vspcTenantId: string) =>
  `${getVspcTenantsRoute(backupServicesId)}/${vspcTenantId}/backupLicenses`;
```

On suit ici le texte littéral du ticket **BKP-1226** (BKP-1225 est un autre ticket, hors périmètre de cette décision), cohérent avec l'existant (`getBackupServersRoute` est déjà nichée sous `.../vspc/{vspcTenantId}/backupLicenses/backupServer`).

Clés de query à ajouter dans `src/data/queries/queryKeys.ts` :

```ts
backupLicense: {
  resourceName: () => ['backup-licenses', 'backup-license', 'resource-name'],
},
```

**Ajusté à l'implémentation** : pas d'ids dans la clé — la cascade backupServicesId → vspcTenantId se résout à l'intérieur de la `queryFn` (`tenantsQueries.withClient`), même convention que `backupServersQueries.list()` (clé statique `backupServers.all()`), pas de doublon avec la mise en cache déjà faite par `tenantsQueries`.

**Mocks de développement** : garde `USE_API_MOCKS` comme le reste du module pour la route ③ (non confirmée). La route ④ (`/services`) est mockable directement via `getServicesMocks` de `common-api` (déjà utilisé en test), donc pas besoin de mock maison pour elle même hors `USE_API_MOCKS`.

---

## 10. Arborescence cible

```
src/pages/general-information/
  GeneralInformation.page.tsx                (NOUVEAU)
  GeneralInformation.page.spec.tsx
src/pages/general-information/terminate/
  TerminateService.page.tsx                  (NOUVEAU — modale)
  TerminateService.page.spec.tsx
src/components/general-information/
  GeneralInformationTile/                    (NOUVEAU — colonne gauche)
  ServiceManagementTile/                     (NOUVEAU — colonne droite)
  ContactsList/                              (NOUVEAU — sous-bloc de ServiceManagementTile)
src/data/api/
  backupLicenses/backupLicenses.requests.ts  (NOUVEAU — garde USE_API_MOCKS)
src/data/queries/
  backupLicense.queries.ts                   (NOUVEAU)
src/types/
  BackupLicense.type.ts                      (NOUVEAU)
  VspcTenant.type.ts                         (complété — champ `link`)
src/utils/apiRoutes/apiRoutes.ts             (complété)
```

Modifiés : `routes/routes.tsx` (route enfant + petite-fille `terminate`), `routes/routes.constants.ts` (retrait d'`isDisabled`, ajout `subRoutes.terminate`), `module.constants.ts` (namespace `GENERAL_INFORMATION`), `test-utils/i18ntest.utils.ts` (chargement du nouveau namespace).

---

## 11. i18n

Nouveau namespace **`module-backup-licenses/general-information`** → `GENERAL_INFORMATION` dans `BACKUP_LICENSES_NAMESPACES`, fichier `public/translations/general-information/Messages_{lng}.json`, 8 locales (`fr_FR` source, `fr_CA` = copie stricte, puis 6 traductions générées non relues par CDS — même dette que 1206/1208/1216/1225).

**Réutilisé, rien à créer** : `NAMESPACES.DASHBOARD:general_information` (déjà traduit, libellé de l'onglet), `NAMESPACES.ACTIONS:retry`.

**Clés à créer** (fr_FR, ébauche) :

```json
{
  "tile": { "general_information": "Informations générales", "service_management": "Gestion du service" },
  "field": {
    "reference": "Référence",
    "service_name": "Nom du service",
    "vspc_access": "Accès VSPC",
    "vspc_access_link": "Accéder au VSPC",
    "vspc_provisioning": "Disponible après provisionnement",
    "creation_date": "Date de création",
    "next_due_date": "Prochaine échéance",
    "contacts": "Contacts",
    "manage_contacts": "Gérer les contacts",
    "termination": "Résiliation",
    "terminate_link": "Résilier la licence"
  },
  "contact_role": { "administrator": "Administrateur", "technical": "Technique", "billing": "Facturation" },
  "terminate_modal": {
    "title": "Résilier la licence Backup Licenses",
    "content": "Cette action résiliera votre licence Backup Licenses. Elle est irréversible.",
    "confirm": "Confirmer la résiliation",
    "success": "La résiliation a bien été prise en compte.",
    "error": "La résiliation n'a pas pu être effectuée."
  },
  "error": { "loading": "Les informations du service n'ont pas pu être chargées." }
}
```

---

## 12. Tests

Convention (mémoire `react-coding-conventions`) : tester les branches conditionnelles, pas le texte statique.

| Cible | Cas |
|---|---|
| `GeneralInformationTile.component.spec.tsx` | Reference affichée, Service name affiché, lien VSPC actif ; `resourceStatus === 'CREATING'` → lien désactivé + texte « Available after provisioning » ; `link` absent + statut non `CREATING` → `EMPTY_VALUE_PLACEHOLDER`. |
| `ServiceManagementTile.component.spec.tsx` | dates formatées (`d MMMM yyyy`) ; contacts rendus (3 rôles) ; `customer.contacts` vide → section masquée ; lien Terminate présent. |
| `GeneralInformation.page.spec.tsx` | intégration MSW : contenu complet, état de chargement, échec de ③/④ → bandeau + « Réessayer ». |
| `TerminateService.page.spec.tsx` | confirmation → appel `terminateService` ; succès et échec → notification puis redirection vers le hub (§7). |

Mocks MSW : `getServicesMocks` de `common-api` pour ④ (`GET /services`, `GET /services/:id`, `POST /services/:id/terminate`) ; handler maison pour ③ (`.../backupLicenses`).

---

## 13. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **Route `.../vspc/{vspcTenantId}/backupLicenses`** | Contrat non vérifié pour ce produit. (BKP-1225 est un autre ticket, sa propre route n'entre pas en ligne de compte pour cette décision.) On démarre le développement avec l'hypothèse actuelle (`USE_API_MOCKS` + `BackupLicense { id, resourceName }`), à ajuster dès confirmation BE — décision actée en session, ne bloque pas le reste de la page. | Confirmer avec le BE le contrat de cette route pour BKP-1226. |
| **Champ `accessUrl` sur `VspcTenant`** | **Figé (§3/§4)** : précédent réel trouvé dans `backup-agent` (même route `.../vspc`, champ `currentState.accessUrl` sur la ressource de liste). | — |
| **Mapping « being provisioned »** | **Figé (§4)** : `vspcTenant.resourceStatus === 'CREATING'`, confirmé par précédent identique dans `backup-agent` sur la même route. | — |
| **Paramètres de `useNavigationGetUrl(['account', '/contacts/services', …])`** | Pattern confirmé (route interne à l'app `account`), mais les paramètres exacts (`category`, `serviceName`…) n'ont pas été vérifiés contre un exemple de production. **Décision actée en session : coder un premier jet avec des paramètres plausibles, ajuster ensuite** plutôt que de bloquer l'implémentation dessus. | Vérifier a posteriori contre un exemple de production équivalent. |
| **Comportement post-résiliation** | **Tranché (§7)** : notification globale puis redirection vers `https://manager.eu.ovhcloud.com/#/hub/` une fois la mutation réglée (succès ou échec). | — |

---

## 14. Reste à faire

- [x] Faire valider cette spec avant toute implémentation.
- [ ] Confirmer avec le BE le contrat de la route `backupLicenses` (§13) ; le reste des points de la §13 est figé.
- [x] Créer la branche depuis `feat/1218-update-vbr-server`.
- [x] Implémenter : `BackupLicense.type.ts`, complément `VspcTenant.type.ts`, `apiRoutes` (+ `getBackupLicensesRoute`), `backupLicenses.requests.ts` (+ garde `USE_API_MOCKS`), `backupLicense.queries.ts`, `GeneralInformationTile`, `ServiceManagementTile` (+ `ContactsList`), `GeneralInformation.page`, `TerminateService.page` (modale).
- [x] Activer l'onglet : retrait d'`isDisabled` + route enfant + route petite-fille `terminate`.
- [x] Namespace i18n `general-information` en `fr_FR`, puis propagation aux 7 autres locales + enregistrement dans `i18ntest.utils.ts`.
- [x] Tests (§12) : 246 tests passent sur le module (`yarn test`), lint et build (`tsc`) au vert.
- [x] Ajouter la ligne à `spec/INDEX.md`.
- [ ] Relecture CDS des 7 traductions non-fr.
