# Suivi des appels API — Backup Licenses

But de ce fichier : donner, ticket par ticket, la liste des appels API attendus et leur état réel dans le
code (implémenté / moqué / manquant / ambigu), pour pouvoir **démoquer rapidement** dès que le back-end
livre un endpoint. Source : la section « Technical » de chaque ticket Jira, les fichiers de spec de
`spec/*.md`, une lecture du code réel du module `packages/manager/modules/backup-licenses`, et la spec
Confluence « 05 - New Veeam Enterprise APIv2 », qui documente le contrat des routes
`vspc`/`backupLicenses`/`vault`.

**Constat transverse, valable pour tout le module** : `src/mocks/mocks.config.ts` déclare
`USE_API_MOCKS = true`. Tant que ce flag est à `true`, **toutes** les requêtes qui le consultent renvoient
des données mockées — y compris celles dont le code d'appel réel est déjà écrit et correct. Démoquer un
endpoint suppose donc deux choses distinctes : (1) que le endpoint soit déployé côté BE et confirmé, (2) que
le flag global repasse à `false`. Font exception, et appellent le réseau réel sans aucune garde
`USE_API_MOCKS` : `getLocations` (`/location`), `getBackupServicesCatalog`
(`/order/catalog/public/backupServices`), `getBackupServicesTenants` (`/v2/backupServices/tenant`), les
appels de `@ovh-ux/manager-module-common-api` utilisés par BKP-1226 (`useServiceDetailsQueryOption`,
`useDeleteService`), et toute la surface de commande Agora de `src/data/api/order/order.requests.ts`
(BKP-1208 et BKP-1223, cf. ci-dessous).

Légende : ✅ Implémenté (réel) · 🎭 Moqué · ❌ Manquant · ❓ Ambigu / point d'ombre.

---

## BKP-1206 — Onboarding page

| Endpoint | Usage | Statut | Détails / fichiers |
|---|---|---|---|
| `GET /backupServices/tenant/{id}/vspc` | Recherche d'une entrée `vspcType==='ADVANCED'` + addon `BACKUP_LICENSES` | 🎭 Moqué | `getVspcTenants`, même fichier, servi par `mockVspcTenants` |

Contrat de réponse **confirmé par un exemple réel le 2026-08-04** (payload transmis par le PO/BE) : tableau
d'objets `{createdAt, currentState, currentTasks, iam, id, resourceStatus, targetSpec, updatedAt}`, où
`currentState` porte `accessUrl`, `backupAgents[]`, `backupLicenses{backupServers[], id}`, `companyName`,
`enabledAddons[]`, `id`, `name`, `region`, `status`, `vaults[]`, `vspcType`. Structure cohérente avec le
typage déjà utilisé côté front pour `getVspcTenants` — rien à corriger dans le code d'appel, uniquement à
lever côté suivi.

---

## BKP-1208 — Page de commande (order)

Submit branché le 2026-08-06 : `src/pages/order/Order.page.tsx:57-64` monte
`useOrderBackupLicenses` (`src/data/hooks/useOrderBackupLicenses/useOrderBackupLicenses.ts`), qui
compose le panier depuis l'état du formulaire (`src/utils/orderComposition/orderComposition.ts`) et
l'exécute. Aucun de ces appels ne consulte `USE_API_MOCKS` : ils partent sur le réseau réel, comme le
catalogue et `/location`.

| Endpoint | Usage | Statut | Détails / fichiers |
|---|---|---|---|
| `POST /order/cart` | Ouvre le panier pour la subsidiary du compte | ✅ Implémenté (réel) | `order.requests.ts::createOrderCart` |
| `GET /order/cart/{cartId}/backupServices` | Découverte des **plans offerts** pour l'item principal, tarifs compris : c'est de là que sortent `pricingMode`/`duration`/`quantity` du POST | ✅ Implémenté (réel) | `order.requests.ts::getBackupServicesCartProductDefinitions` (`order.cart.GenericProductDefinition[]`) |
| `GET /order/cart/{cartId}/backupServices/options?planCode={plan de l'item principal}` | Idem pour les **addons offerts** au plan principal | ✅ Implémenté (réel) | `order.requests.ts::getBackupServicesCartOptionDefinitions` (`order.cart.GenericOptionDefinition[]`) |
| `POST /order/cart/{cartId}/backupServices` | Item principal `backup-tenant`, aux conditions que le GET ci-dessus a annoncées | ✅ Implémenté (réel) | `order.requests.ts::addBackupServicesCartItem` |
| `GET /order/cart/{cartId}/item/{itemId}/requiredConfiguration` | Découverte des labels réclamés, item par item | ✅ Implémenté (réel) | `order.requests.ts::getCartItemRequiredConfiguration`, apparié par `utils/cartConfiguration/cartConfiguration.ts::planCartConfigurations` |
| `POST /order/cart/{cartId}/item/{itemId}/configuration` | Une configuration par label réclamé | ✅ Implémenté (réel) | `order.requests.ts::configureCartItem` |
| `POST /order/cart/{cartId}/backupServices/options` | Addons `vspc-tenant`, `vspc-tenant-backuplicenses`, `backup-vault-backuplicenses-500G`, **dans cet ordre**, chacun aux conditions de sa propre définition | ✅ Implémenté (réel) | `order.requests.ts::addBackupServicesCartItemOption` |
| `POST /order/cart/{cartId}/assign` | Rattache le panier au compte connecté | ✅ Implémenté (réel) | `order.requests.ts::assignOrderCart` |
| `GET /order/cart/{cartId}/checkout` | Simulation : contrats (CGV) + prix, n'engage rien | ✅ Implémenté (réel) | `order.requests.ts::getOrderCartCheckout` |
| `POST /order/cart/{cartId}/checkout` | **Engage la commande** (`autoPayWithPreferredPaymentMethod`, `waiveRetractationPeriod`) | ✅ Implémenté (réel) | `order.requests.ts::executeOrderCartCheckout`, mêmes drapeaux que `bmc-backup-agent-baremetal::useCheckoutBackupAgentCart` |

Le canal est écrit et testé (MSW : `src/data/hooks/useOrderBackupLicenses/useOrderBackupLicenses.spec.tsx`,
`src/pages/order/Order.page.spec.tsx`), mais **jamais exercé de bout en bout** : le catalogue
`backupServices` n'est pas déclaré en production EU (vérifié le 2026-08-06). Jusqu'à publication, la
séquence s'arrête donc à sa première étape de découverte, sur les plan codes ci-dessous.

**Les conditions de facturation ne sont plus supposées (2026-08-06).** Le tunnel posait `duration:
'P1M'`, `pricingMode: 'default'`, `quantity: 1` en dur sur les quatre éléments du panier, alors que la
doc de référencement n'établit ce pattern mensuel que pour l'item principal — « unverified for
consumption addons » côté spec, et les trois addons sont précisément des plans de consommation. La
séquence commence désormais, comme le canal vault (BKP-1223), par **découvrir** les deux routes de
définitions ci-dessus et lit `pricingMode`/`duration`/`quantity` sur le tarif `installation` de chaque
plan (`utils/serviceOffer/serviceOffer.ts::resolveOfferOrderParameters`,
`order.requests.ts::discoverBackupServicesOrderParameters`). `utils/orderComposition` ne décide plus
que *quoi* commander (les plan codes) et *avec quelles valeurs de configuration*.

**Points d'ombre**
- ❓ **Contenu réel des définitions inconnu** : les deux GET de découverte sont ⭐️5 côté contrat
  (routes et types relevés sur le schéma apiv6 de production), mais **ce qu'elles renverront pour ce
  produit reste inconnu tant que le catalogue `backupServices` n'est pas déclaré** — quels plans y
  figureront, quels tarifs porteront `installation`, quelle `duration`/`pricingMode` chacun annoncera,
  et si les addons de consommation y sont exposés comme options du plan `backup-tenant`. Le code ne
  suppose plus rien mais ne peut pas non plus vérifier : un plan de la composition absent des
  définitions, ou sans tarif `installation`, **arrête la commande** avec `UNAVAILABLE_CART_OFFER` et le
  nom du ou des plans fautifs, plutôt qu'un POST voué à un rejet indiagnosticable. Premier passage
  contre un catalogue déclaré = première vérité — y compris sur R2 ci-dessous, qu'un addon absent des
  définitions d'options tranchera dans un sens ou dans l'autre.
- ❓ **Labels de configuration non vérifiés** — c'est le point d'ombre principal, et il est structurel :
  les noms envoyés (`displayName`, `backupServerExternalIp`, `backupServerPrivateIp`,
  `vaultDisplayName`, `region`, `licenseType`) viennent de la colonne « API field » du ticket, et
  `region` n'est nommé par aucune source. Le code ne devine pas : il lit `requiredConfiguration` de
  chaque item et, si un label réclamé n'a pas de valeur candidate, **la commande échoue** avec
  `UNKNOWN_CART_CONFIGURATION` plutôt que de partir incomplète. Premier passage contre un catalogue
  déclaré = première vérité sur ces graphies.
- ❓ `vaultDisplayName` : toujours **non confirmé côté API** (inchangé depuis le 2026-08-04).
- ❓ Plan codes de la composition (`backup-tenant`, `vspc-tenant`, `vspc-tenant-backuplicenses`,
  `backup-vault-backuplicenses-500G`) : ⭐️4, doc de référencement Agora uniquement. Non confirmé non
  plus : **quels addons le catalogue attache tout seul** (les plans de consommation par édition) versus
  ceux que le panier doit ajouter — R2 de la spec.
- ❓ Où va l'édition de licence dans le panier (R3) : le code envoie `licenseType` à tout item qui le
  réclame, ce qui couvre les deux hypothèses (configuration sur `vspc-tenant-backuplicenses` ou choix
  d'addon de consommation) sans en trancher aucune.
- CGV : `contractList` remonte du `GET .../checkout` et **transite par le hook**
  (`BackupLicensesOrderResult.contractList`) — rien ne l'affiche, la décision d'inclure la section
  restant ouverte côté PO (R5). Si elle est retenue, la séquence doit se couper entre le GET et le POST
  du checkout : c'est le seul changement à faire, le point est commenté dans le hook. Même pattern que
  `packages/manager/apps/bmc-backup-agent-baremetal`
  (`Step1Selection.component.tsx:123,149,264-274`), qui lui les affiche et les fait cocher.
- `createBackupServicesCart` (wrapper une-passe sur `createCart`, `order.requests.ts`) **n'est pas
  utilisé par le tunnel** : `createCart` poste les configurations à l'aveugle et ajoute les addons en
  parallèle, incompatible avec la découverte des labels et l'ordre de R2. Il reste le chemin court pour
  une composition dont les labels seront confirmés — à supprimer s'il ne sert toujours à rien à ce
  moment-là.

---

## BKP-1215 — Squelette de la page de service (onglets)

Aucun appel API propre à ce ticket : il ne fait que poser le `BaseLayout` + la barre des 4 onglets. La
résolution du service utilise la même cascade que BKP-1216 ci-dessous (tenant → vspc). Pas d'endpoint
supplémentaire à suivre ici.

---

## BKP-1216 — Onglet « Linked servers » (liste) + BKP-1220 (polling)

| Endpoint | Usage | Statut | Détails / fichiers |
|---|---|---|---|
| `GET /v2/backupServices/tenant/{id}/vspc` | 2e maillon de la cascade | 🎭 Moqué | Idem |
| `GET .../vspc/{vspcTenantId}/backupLicenses/backupServer` | Liste des serveurs VBR (7 colonnes du tableau) + support du polling (`currentTasks`) | 🎭 Moqué | Code réel dans `src/data/api/backupServers/backupServers.requests.ts::getBackupServers` (`v2.get`), servi par `mockBackupServers` (`src/mocks/backupServers/backupServers.mock.ts`) tant que `USE_API_MOCKS=true` |

Contrat de réponse **confirmé par un exemple réel le 2026-08-04** : tous les champs de l'exemple
(`currentState.{backupServerVersion,displayName,externalIps,id,licenseStatus,licenseType,
licenseTypeRequested,managementAgentStatus,osType,privateIps}`, `targetSpec` en sous-ensemble, enveloppe
`{createdAt,currentState,currentTasks,id,status,targetSpec,updatedAt}` avec `status` — pas `resourceStatus`
— au top-level) correspondent exactement au typage front déjà écrit (`src/types/BackupServer.type.ts:23-55`,
`Resource.type.ts:20-30`). Rien à corriger dans le code. En revanche l'exemple **ne contient aucun champ
`iam`** sur cette ressource, contrairement au mock qui en pose un sur chaque serveur
(`backupServers.mock.ts`) pour préfigurer le gating — voir le point d'ombre `iam.urn` ci-dessous, dont la
conclusion change avec cet exemple.

Le polling (BKP-1220) ne fait aucun appel supplémentaire : il ré-interroge la même route de liste toutes les
10 s via `refetchInterval` (React Query), cf. `src/hooks/useBackupServersPolling/useBackupServersPolling.ts`.
Purement client, rien à démoquer de spécifique une fois la route de liste réelle.

**Points d'ombre**
- ❓ Liste exhaustive des valeurs possibles de `osType`/`licenseStatus` en régime établi (hors création) :
  toujours non couverte par la spec (exemple unique).
- ❓ Un compte peut-il avoir **plusieurs services** Backup Licenses ? Le code prend `data[0]` de la liste de
  tenants — un 2e service serait silencieusement inaccessible.
- ❓ Pagination / Iceberg de la route de liste non documentée — appel simple non paginé pour l'instant.
- IAM : `GET .../backupLicenses` et `GET .../backupLicenses/backupServer` (liste + détail) →
  `backupServices:apiovh:vspc/backupLicenses/get` ; `POST .../backupServer` et `PUT .../backupServer/{id}` →
  `.../backupLicenses/edit` ; `DELETE .../backupServer/{id}` → `.../backupLicenses/delete`. ✅ « Modifier » et
  « Supprimer » du menu ⋮ sont désormais tous deux gatés (`BackupServerActionsCell.component.tsx`, règles
  `vspc/backupLicenses/edit`/`.../delete` dans `BACKUP_LICENSES_IAM_RULES`), avec en plus un check IAM
  indépendant sur le bouton de soumission de la page d'édition (`EditRecapPanel`) et de la modale de
  suppression (`DeleteBackupServer.page.tsx`) : protège un accès direct par URL qui contournerait le menu.
  Fail-closed partout (revu le 2026-08-04, cf. incident ci-dessous) : `urn` absent, check en cours ou droit
  refusé désactivent le bouton dans les trois cas — jamais de bypass permissif. Sur le menu ⋮ précisément,
  le check IAM n'est **pas** posé via les props `iamActions`/`urn` natives d'`ActionMenuItem` : dans
  `ActionMenu` (`@ovh-ux/manager-react-components`), un item portant un `href` est rendu en
  `<a href=...><OdsButton /></a>` *avant même* de regarder `iamActions`, court-circuitant entièrement son
  mécanisme `ManagerButton` (check + tooltip auto) — et un `<a href>` reste navigable même si le bouton
  qu'il enveloppe est visuellement désactivé. Les deux entrées utilisent donc `onClick` + `navigate()`
  (jamais `href`) avec un check `useAuthorizationIam` fait nous-mêmes dans `BackupServerActionsCell`,
  seule façon de bloquer réellement le clic (même pattern que `veeam-backup::ActionCell`). Pour la modale
  de suppression, `Modal` ne permet pas non plus de wrapper son bouton primaire en `ManagerButton` (rendu en
  interne, hors de portée) : désactivation + message d'avertissement plutôt qu'une tooltip au survol.
  Ce gating dépend d'un champ `iam.urn` sur la ressource serveur (`Resource<T>`, ajouté côté type).
  **Point d'ombre non levé** : deux exemples réels reçus le 2026-08-04 donnent une réponse contrastée.
  L'exemple de `GET .../vspc` (cf. BKP-1206) confirme une enveloppe `iam: {displayName, id, state, tags,
  urn}` **au niveau de la ressource tenant VSPC**. Mais l'exemple de `GET .../backupServer` ci-dessus (même
  jour) n'a **aucun champ `iam`** sur la ressource serveur elle-même, qui est le niveau dont dépend le
  gating de « Modifier »/« Supprimer ». Si ce second exemple reflète le contrat définitif, `urn` restera
  `undefined` sur cette ressource et **tous les boutons resteront désactivés en permanence** (fail-closed
  assumé : mieux vaut une action bloquée à tort qu'un accès non vérifié) — à faire trancher avec le BE :
  soit l'enveloppe `iam` du `backupServer` arrivera dans une version ultérieure du contrat, soit le gating
  doit être repensé (ex. remonter au niveau du tenant VSPC plutôt que du serveur). Bouton d'ajout toujours
  non gaté par IAM (hors périmètre de cette passe).
- La route de détail `GET .../backupLicenses/backupServer/{backupServerId}` existe (spec §5, IAM
  `backupLicenses/get`) — alternative possible au polling sur la liste complète si celui-ci devient coûteux
  avec beaucoup de lignes.
- ❓ **Nouveau, non couvert par un ticket actuel** : la spec documente aussi `POST .../vspc/{vspcTenantId}/backupLicenses/backupServer`
  (« Registers new backup server », IAM `backupLicenses/edit`, body `{displayName, licenseType, privateIps,
  externalIps}`) — un endpoint de **création** de serveur VBR qui n'apparaît dans aucun ticket suivi ici (1216
  liste, 1218 édite, 1219 supprime, mais aucun ticket « ajouter un serveur »). Le bouton « Ajouter » déjà codé
  (`LinkedServersTopbar.component.tsx::add-backup-server`) ne l'appelle pas : il redirige vers le tunnel de
  commande (`routeUrls.order`, BKP-1208), qui depuis le 2026-08-06 exécute bien un panier Agora — à
  confirmer avec le PO/BE si BKP-1208 doit à terme appeler ce POST plutôt que/en plus du panier.

---

## BKP-1218 — Édition d'un serveur VBR

Code présent sur cette branche (`pages/linked-servers/edit/EditBackupServer.page.tsx`,
`hooks/useEditBackupServerForm`, `data/hooks/useEditBackupServer`). L'entrée « Modifier » du menu ⋮ ouvre
bien cette page.

| Endpoint | Usage | Statut | Détails |
|---|---|---|---|
| `GET .../vspc/{vspcTenantId}/backupLicenses/backupServer` | Pré-remplissage du formulaire (valeurs courantes) | 🎭 Moqué (indirect) | Réutilise la même liste que BKP-1216, déjà en cache — même statut mock que ci-dessus |
| `PUT .../vspc/{vspcTenantId}/backupLicenses/backupServer/{backupServerId}` | Enregistrement des modifications (nom, type de licence, IP publique/privée) | 🎭 Moqué | Code réel dans `backupServers.requests.ts::editBackupServer` (`v2.put`), servi par `simulateBackupServerUpdate` tant que `USE_API_MOCKS=true`. Contrat confirmé par la spec (§7) : body `{displayName, licenseType, privateIps, externalIps}` (identique au type `EditBackupServerParams` du code), réponse `200` vide — reste à vérifier le déploiement effectif |

**Points d'ombre**
- ❓ « How does the update will work? If we patch the targetSpec.licenseType, is it gonna be applied
  directly? » — non répondu, y compris par la spec Confluence. Le ticket précise qu'un changement de licence
  prend effet le 1er du mois suivant (badge « Scheduled change → {license} » sur `targetSpec.licenseType ≠
  currentState.licenseType`), mais le comportement exact du PUT (application immédiate vs effective au mois
  suivant) reste à confirmer avec le BE.

---

## BKP-1219 — Suppression d'un serveur VBR

Code de suppression présent sur cette branche (commit `fd04005fa7`, « add modal to delete a server ») —
`deleteBackupServer` dans `backupServers.requests.ts`, `simulateBackupServerDeletion`/`isDeleteBackupServerError`
dans `src/mocks/backupServers/backupServers.mock.ts`/`backupServers.handler.ts`, page
`pages/linked-servers/delete/DeleteBackupServer.page.tsx`.

| Endpoint | Usage | Statut | Détails / fichiers |
|---|---|---|---|
| `GET .../vspc` | Cascade d'ids (réutilisée) | 🎭 Moqué | Identique à BKP-1216 |
| `DELETE .../vspc/{vspcTenantId}/backupLicenses/backupServer/{backupServerId}` | Suppression d'un serveur VBR (révoque la licence VSPC) | 🎭 Moqué | Code réel dans `backupServers.requests.ts::deleteBackupServer` (`v2.delete`), servi par `simulateBackupServerDeletion` tant que `USE_API_MOCKS=true`. Contrat confirmé par la spec (§8) et reconfirmé le 2026-08-04 : la route ne prend **que** les 3 ids en paramètres de chemin (`backupServicesId`, `vspcTenantId`, `backupServerId`), pas de body — cohérent avec `DeleteBackupServerParams` (déjà pas de payload envoyé) et avec la réponse `204` (corps vide) déjà simulée dans le mock (`backupServers.handler.ts:43`) |

**Points d'ombre**
- ❓ **Synchrone ou asynchrone ?** Supposé asynchrone (le `DELETE` renverrait une tâche dans `currentTasks`,
  comme les autres mutations du module) — non confirmé, y compris par la spec Confluence.
- ❓ Format d'erreur API non confirmé — pariera sur le typage `TApiCustomError` déjà utilisé ailleurs dans le
  module, comme pour BKP-1216/1218.
- ❓ Une suppression est-elle autorisée pendant qu'une **autre** opération est déjà en cours sur le même
  serveur ? Le menu ⋮ est déjà désactivé dans ce cas (hérité de 1216) — comportement à faire confirmer PO.

---

## BKP-1223 — Commande d'un vault supplémentaire

Canal réel branché le 2026-08-06 : `orderVault` (`data/api/vaults/vaults.requests.ts`) n'est plus un stub
qui rejette, son canal par défaut est `placeVaultOrder` (`data/api/order/vaultOrder.ts`). Un vault
supplémentaire s'achète **en option sur le service existant** (`cartServiceOption`), pas comme un item de
panier neuf — le tunnel de premier abonnement (BKP-1208 ci-dessus) est l'autre forme du même canal Agora.
La couture `setVaultOrderChannel` reste en place pour les tests qui veulent une issue plutôt qu'une
séquence.

| Endpoint | Usage | Statut | Détails / fichiers |
|---|---|---|---|
| `GET /order/cartServiceOption/backupServices/{serviceName}` | Découverte de l'offre paygo **et de son tarif** : `planCode`, `pricingMode`, `duration`, `minimumQuantity`, `price.text` | ✅ Implémenté (réel) | `order.requests.ts::getBackupServicesOffers`, filtré par `utils/serviceOffer/serviceOffer.ts` |
| `POST /order/cart` | Ouvre le panier pour la subsidiary du compte | ✅ Implémenté (réel) | `order.requests.ts::createOrderCart` |
| `POST /order/cartServiceOption/backupServices/{serviceName}` | Achète l'option `backup-vault-backuplicenses-paygo` sur le service | ✅ Implémenté (réel) | `order.requests.ts::addBackupServicesOption`, corps assemblé depuis l'offre (`getOfferOrderParameters`) |
| `GET /order/cart/{cartId}/item/{itemId}/requiredConfiguration` | Découverte des labels réclamés par l'item vault | ✅ Implémenté (réel) | `order.requests.ts::configureCartItemFromRequirements` (partagé avec BKP-1208) |
| `POST /order/cart/{cartId}/item/{itemId}/configuration` | Nom du vault + région, un appel par label réclamé | ✅ Implémenté (réel) | idem |
| `POST /order/cart/{cartId}/assign` | Rattache le panier au compte connecté | ✅ Implémenté (réel) | `order.requests.ts::assignOrderCart` |
| `GET /order/cart/{cartId}/checkout` | Simulation : contrats + prix, n'engage rien | ✅ Implémenté (réel) | `order.requests.ts::getOrderCartCheckout` |
| `POST /order/cart/{cartId}/checkout` | **Engage la commande** | ✅ Implémenté (réel) | `order.requests.ts::executeOrderCartCheckout`, mêmes drapeaux que le tunnel |
| `GET /backupServices/tenant` → `.../vspc` → `.../backupLicenses` | Résolution du `serviceName` sur lequel l'option est achetée (`currentState.resourceName` de la licence) | 🎭 Moqué (indirect) | `data/queries/backupLicense.queries.ts::resourceName`, lu par `ensureQueryData` dans `useOrderVault` et par `useVaultOrderPrice` |

**Le tarif affiché ne vient plus d'une traduction (dette R1 payée).** `order.pricing_message` porte
désormais `{{price}}` dans les 8 locales ; la valeur est `price.text` de l'offre découverte —
la chaîne déjà formatée par Agora pour la subsidiary du compte. Rendu par
`pages/vaults/order/_components/VaultPricingMessage.component.tsx` : squelette pendant l'appel, puis
**la phrase entière disparaît** si aucun tarif ne revient (catalogue non déclaré, offre sans prix, route
en erreur). Aucun montant en dur ne subsiste dans `src/` ni dans `public/translations/` hors fixtures de
test explicitement fictives (`mocks/order/order.mock.ts`).

**Points d'ombre**
- ❓ **Résolution du `serviceName`** : le `resourceName` retenu est celui de la **licence**
  (`backupLicenses[0].currentState.resourceName`), le seul identifiant `/services` que le module résout
  déjà — c'est lui que `useServiceDetailsQueryOption` et la résiliation de l'abonnement (BKP-1226)
  utilisent. Non confirmé côté Agora : le service qui accepte l'option vault pourrait être une autre
  ressource (le tenant `backupServices` lui-même). `GET /order/cartServiceOption/backupServices` (sans
  `serviceName`) renvoie la liste des services acceptant des options et tranchera au premier passage
  contre un catalogue déclaré.
- ❓ **Labels de configuration non vérifiés**, même angle mort que BKP-1208 : le code propose plusieurs
  graphies candidates pour le nom (`vault_name`, `vaultDisplayName`, `displayName`) et la région
  (`vault_region`, `region`), n'envoie que ce que le panier réclame, et **échoue** avec
  `UNKNOWN_CART_CONFIGURATION` sur un label réclamé qu'aucune ne couvre plutôt que de deviner.
- ❓ Plan code `backup-vault-backuplicenses-paygo` (`BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE`) : ⭐️4,
  doc de référencement Agora seulement. À ne pas confondre avec les plan codes de **consommation**
  (`BACKUP_LICENSES_VAULT_PLAN_CODES`, BKP-1225) : celui-ci s'achète, ceux-là se facturent.
- ❓ Tarif retenu pour l'affichage **et** pour le POST : celui dont les `capacities` portent
  `installation`. Une offre à la consommation pourrait n'en publier aucun de ce type — dans ce cas rien
  n'est commandé et le message disparaît, ce qui est le comportement voulu mais reste non vérifié.
- Séquence non exercée de bout en bout, comme le tunnel : le catalogue `backupServices` n'est pas déclaré
  en production EU (vérifié le 2026-08-06). Testée sous MSW
  (`pages/vaults/order/OrderVault.route.spec.tsx`, `data/api/order/vaultOrder.spec.ts`).
- La classification des erreurs est inchangée et reste basée sur le **statut** : 400/409 avec message →
  erreur sur le champ « nom », tout le reste → bannière dans la modale (`utils/vault/vaultOrderError.ts`,
  point d'ombre R4 côté BE). Elle ne distingue pas *quel* appel de la séquence a échoué.

---

## BKP-1225 — Onglet « Facturation » : tableau de consommation

Implémente `data/api/vaults/vaults.requests.ts::getVaults`,
`data/api/services/consumption.requests.ts::getServiceConsumption`/`getLicenseConsumption`,
`data/queries/billing.queries.ts`, les sélecteurs `licenses.selectors.ts`/`vaults.selectors.ts`/
`vaultConsumption.selectors.ts`, `pages/billing/Billing.page.tsx`, les composants `BillingTopbar`/
`BillingPeriodNotice`/`BillingError`/`LicensePriceCell`/`VaultPriceCell`/`VaultUsageCell`, et les mocks
associés (`consumptions.mock.ts`, `vaults.mock.ts`).

| Endpoint | Usage | Statut | Détails |
|---|---|---|---|
| `GET /v2/backupServices/tenant/{id}/vault` | Liste des vaults du service, filtrée sur `vaultProductLine==='BACKUP_LICENSES'` | 🎭 Moqué | `vaults.requests.ts::getVaults`, servi par `mockVaults` tant que `USE_API_MOCKS=true`. Commentaire du code : route empruntée à `@ovh-ux/backup-agent`, **non vérifiée pour ce produit** |
| `GET /v6/services?resourceName={vault.resourceName}` | Résolution du `serviceId` du vault (facturation) | 🎭 Moqué (indirect) | `resolveServiceId` (`billing.queries.ts`) appelle `getResourceServiceId` de `@ovh-ux/manager-module-common-api`, sauf en mock où le `resourceName` sert lui-même de clé dans `consumptions.mock.ts` |
| `GET /v6/services/{serviceId}/consumption/element` | Volume consommé (Go) + prix du stockage du vault | 🎭 Moqué | `consumption.requests.ts::getServiceConsumption`, servi par `mockStorageConsumptions`. Type `ServiceConsumption` copié de `@ovh-ux/backup-agent` (commentaire du code : « dette assumée, ce module ne peut pas importer `backup-agent` ») — reste le même écart déjà noté : ce type suppose `beginDate`/`endDate`/`pricingMode` à plat, alors que la **réponse réelle testée sur un autre produit (PCC)** imbrique ces champs dans un tableau `details[]` par item. Sélection de l'élément pertinent par appartenance à `BACKUP_LICENSES_VAULT_PLAN_CODES` (`selectVaultConsumptionElement`) |
| `GET .../vspc/{vspcTenantId}/backupLicenses` | Détails de la licence, pour en extraire `resourceName` (jointure billing) puis le prix par vault | 🎭 Moqué | Même code que BKP-1226 : `data/api/backupLicenses/backupLicenses.requests.ts::getBackupLicenses`, servi par `mockBackupLicenses` |
| `GET /v6/services/{serviceId}/consumption` | Prix de la licence (sans quantité) | 🎭 Moqué | `consumption.requests.ts::getLicenseConsumption`, servi par `mockLicenseConsumptions`. Même type `ServiceConsumption` (tableau) que ci-dessus, alors que la **réponse réelle testée sur un autre produit** est un objet unique `{beginDate, endDate, id, orderId, price, priceByPlanFamily, serviceId}` sans `quantity` — écart de contrat resté non résolu dans le commit `b643a77` |

**Points d'ombre**
- Champ de jointure licence ↔ vault : le vault porte `currentState.vspcTenants: [vspcTenantId, ...]` (tableau
  d'ids de tenants VSPC, pas directement un id de licence). La chaîne complète est :
  `vault.currentState.vspcTenants[0]` → `GET .../vspc/{vspcTenantId}/backupLicenses` →
  `currentState.resourceName` = clé de jointure billing de la licence. Il n'y a **pas** de champ direct
  licence→vault, la jointure se fait via le tenant VSPC commun aux deux ressources.
- Nouveau champ `includedSoftQuotaGb` sur `GET .../vault`/`GET .../vault/{id}` (à côté de `vaultProductLine`),
  non demandé par le ticket mais présent dans la réponse exemple de la spec (`500` ou `null` selon le `type`
  du vault, `BUNDLE` vs `PAYGO`) — pertinent pour la règle du badge « Inclus » ci-dessous : pourrait
  remplacer/compléter le calcul par `storagePriceValue === 0`.
- ❓ Plan codes de facturation du stockage (`backup-vault-backuplicenses-500g-consumption` /
  `-paygo-consumption`) : graphie exacte incertaine dans le ticket (casse du « G », balisage cassé) — non
  couvert par la spec Confluence.
- ❓ Périodicité du prix de la licence : contrairement au stockage (garanti par `beginDate`/`endDate` de
  l'élément de consommation), rien ne confirme que `/services/{serviceId}/consumption` scope son `price.value`
  à la période de facturation en cours plutôt qu'à un cumul depuis le début de la souscription — répond
  pourtant à une demande explicite du ticket Jira (commentaire du 30/06). Non couvert par la spec Confluence.
- ❓ Règle du badge « Inclus » (`storagePriceValue === 0`) à faire confirmer par le PO — voir toutefois
  `includedSoftQuotaGb` ci-dessus comme piste alternative plus directe.

---

## BKP-1226 — Onglet « General information »

Implémente `pages/general-information/GeneralInformation.page.tsx` +
`pages/general-information/terminate/TerminateService.page.tsx`, via le hook `useGeneralInformation` et les
helpers génériques déjà utilisés ailleurs dans le monorepo (`@ovh-ux/manager-module-common-api` :
`useServiceDetailsQueryOption`, `useDeleteService`) plutôt que du code maison.

| Endpoint | Usage | Statut | Détails |
|---|---|---|---|
| `GET .../vspc` | Cascade d'ids (réutilisable telle quelle) | 🎭 Moqué (indirect) | Même cascade que BKP-1216 |
| `GET .../vspc/{vspcTenantId}/backupLicenses` | Résolution du `resourceName` de la licence (jointure vers `/services`) | 🎭 Moqué | Code réel dans `data/api/backupLicenses/backupLicenses.requests.ts::getBackupLicenses`, servi par `mockBackupLicenses` tant que `USE_API_MOCKS=true` ; consommé par `data/queries/backupLicense.queries.ts::resourceName` |

**Points d'ombre**
- La cascade retenue (`.../backupLicenses` → `resourceName` → `useServiceDetailsQueryOption`/`useDeleteService`)
  **suppose qu'il n'y a qu'une seule licence par tenant VSPC** (`licenses[0]`), à vérifier si un compte peut
  en avoir plusieurs.
- ❓ « Pas de partie contact » — noté en commentaire du ticket, en contradiction apparente avec la mention
  « to get the informations and contacts » du corps du ticket : le code affiche bien les contacts
  (`ContactsList.component.tsx` consomme `serviceDetails.customer.contacts`) — à confirmer que c'est le
  périmètre voulu par le PO malgré ce commentaire.
- ❓ Comportement du lien VSPC pendant le provisionnement (AC : lien désactivé avec « Available after
  provisioning ») : le code utilise `vspcTenant?.resourceStatus === 'CREATING'` (`isProvisioning`) — à
  confirmer que c'est bien la condition attendue par le PO (le ticket ne précise pas le champ).
- ❓ « API route to be confirmed » (`resource.displayName`) : contrat générique `/services/{serviceId}` déjà
  utilisé ailleurs dans le monorepo, donc a priori fiable, mais pas spécifiquement vérifié pour ce produit.

---

## Endpoint hors périmètre des tickets actuels

`GET /backupServices/tenant/{backupServicesId}/vault/{vaultId}/bucket/{bucketId}/access` (spec Confluence
« 05 - New Veeam Enterprise APIv2 », §9.3, « NEW », IAM `backupServices:apiovh:vault/credentials/get`) — renvoie
les identifiants S3 du bucket (`accessKey`, `secretKey`, `endPoint`, `regionCode`). Aucun ticket suivi ici ne
mentionne cet écran ; probablement pertinent pour un futur onglet exposant les credentials S3 du Vault (pas
couvert par BKP-1225/1226 tels qu'écrits). À signaler si un besoin produit émerge, sinon rien à faire.

---

## Résumé global — checklist à démoquer

Ce résumé couvre tout le code présent **sur `feat/backup-licenses-unmock`**, Billing (BKP-1225) inclus
depuis la reconstruction de la branche le 2026-08-04.

### 🎭 Moqués (code déjà écrit, attend juste un endpoint réel + bascule `USE_API_MOCKS=false`)

| Endpoint | Ticket(s) | Fichier |
|---|---|---|
| `GET /v2/backupServices/tenant/{id}/vspc` | 1206, 1216, (1219), (1226) | `src/data/api/tenants/tenants.requests.ts::getVspcTenants` |
| `GET .../vspc/{vspcTenantId}/backupLicenses/backupServer` (liste) | 1216, 1220, 1218 | `src/data/api/backupServers/backupServers.requests.ts::getBackupServers` |
| `PUT .../backupLicenses/backupServer/{id}` | 1218 | idem `::editBackupServer` |
| `DELETE .../backupLicenses/backupServer/{id}` | 1219 | idem `::deleteBackupServer` |
| `GET .../vspc/{vspcTenantId}/backupLicenses` | 1226, (1225) | `src/data/api/backupLicenses/backupLicenses.requests.ts::getBackupLicenses` |
| `GET .../vault` (liste vaults) | 1225 | `src/data/api/vaults/vaults.requests.ts::getVaults` |
| `GET .../consumption/element` (conso stockage) | 1225 | `src/data/api/services/consumption.requests.ts::getServiceConsumption` |
| `GET .../consumption` (prix licence) | 1225 | idem `::getLicenseConsumption` |

Rappel : même une fois ces endpoints déployés côté BE, il faut aussi repasser `USE_API_MOCKS` à `false` dans
`src/mocks/mocks.config.ts` pour que le code réel (déjà écrit) soit réellement appelé.

### ❌ Manquants (aucun code d'appel écrit sur cette branche)

Aucun. Les deux dernières lignes sont passées ✅ le 2026-08-06 : le submit Agora de BKP-1208 (10 appels
de séquence de panier, les deux découvertes de définitions comprises) puis la commande de vault
supplémentaire de BKP-1223, dont le stub `orderVault` rejetait volontairement. Tout est écrit, réel et
testé (cf. sections BKP-1208 et BKP-1223). Les deux séquences restent non exercées de bout en bout tant
que le catalogue `backupServices` n'est pas déclaré, et ni les labels de configuration qu'elles envoient
ni le contenu des définitions qu'elles lisent ne sont vérifiés — ce sont des points d'ombre, pas du code
manquant.

### Points d'ombre transverses à ne pas perdre de vue

- Labels de configuration du panier de commande (1208, 1223) inconnus tant que le catalogue
  `backupServices` n'est pas déclaré : la commande échoue proprement sur un label réclamé sans valeur,
  elle ne devine pas.
- Même angle mort, un cran plus tôt : le **contenu des définitions de plans** que les deux tunnels
  lisent pour en tirer `pricingMode`/`duration`/`quantity` (1208, 1223) est inconnu jusqu'à déclaration
  du catalogue. Les routes et les types sont sûrs, les valeurs non ; une composition qu'elles ne
  couvrent pas arrête la commande en nommant les plans plutôt que de retomber sur du mensuel en dur.
- Le `serviceName` sur lequel l'option vault est achetée (1223) est le `resourceName` de la licence, seul
  identifiant `/services` que le module résout — non confirmé côté Agora.
- Comportement du `PUT` de 1218 (immédiat vs effectif au mois suivant) non répondu par le BE.
- Synchronicité du `DELETE` de 1219 (tâche asynchrone dans `currentTasks` ou suppression immédiate ?) non
  confirmée.
- Plan codes de facturation du stockage (1225) toujours non confirmés (graphie exacte incertaine).
- BKP-1226 suppose **un seul service Backup Licenses par tenant VSPC** (`licenses[0]`) — même angle mort que
  BKP-1216/1219 pour la cascade tenant → vspc.
- `POST .../backupLicenses/backupServer` (création d'un serveur VBR) n'est couvert par aucun ticket suivi ici —
  à clarifier avec le PO (cf. note dans BKP-1216).
- `GET .../vault/{vaultId}/bucket/{bucketId}/access` (credentials S3) n'est couvert par aucun ticket suivi ici.
- ❓ Champ `iam.urn` sur la ressource serveur (BKP-1216/1218/1219) : ajouté côté type front pour gater les
  actions « Modifier »/« Supprimer » du menu ⋮ (`vspc/backupLicenses/edit`/`.../delete`) ainsi que les boutons
  de soumission de la page d'édition et de la modale de suppression, mais **non confirmé côté contrat API** —
  à vérifier avec le BE dès que l'endpoint de liste sort du mock. Fail-closed tant que ce n'est pas confirmé :
  ces boutons resteront désactivés en permanence plutôt que de bypasser silencieusement le check (cf. section
  BKP-1216 ci-dessus).
