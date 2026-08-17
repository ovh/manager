# BKP-1225 — Onglet « Facturation » : tableau de consommation

Jira : https://jira.ovhcloud.tools/browse/BKP-1225 (Epic BKP-1161 — « 4.1 Billing — Consumption table », 3 points, Ready for Dev)
Maquette de référence : `/home/mseme/Documents/Backup licences/Tickets/1225/image-2026-06-30-10-00-23-810.png` (pièce jointe Jira 588737)
Assets ticket : `/home/mseme/Documents/Backup licences/Tickets/1225/`

**Branche de départ : `feat/1218-update-vbr-server`** — c'est la seule qui porte la page de service à onglets (BKP-1215), dont cet onglet est un enfant. Elle contient déjà 1206 + 1208 + 1216 + 1219 + 1218.
État : spec à valider, implémentation non commencée.

> ### Règle de lecture de la maquette
>
> La maquette ne montre que le tableau (3 lignes, en-têtes bleus, thème sombre) — pas d'en-tête de page, pas de bouton, pas d'état vide ni d'erreur. **Elle fait autorité sur le layout et sur un point de contenu que la description texte omet : le vault inclus affiche un badge vert « Included », pas un prix** (cf. §7). Tout le reste vient de la description du ticket et des conventions déjà en place dans le module.
>
> **La maquette ne montre que 3 colonnes** (Nom / Consommation / Prix) : elle est antérieure à la décision, prise en session et non par le ticket, d'ajouter la colonne « Prix licence » (§1, §7). Elle ne fait donc pas autorité sur le positionnement de cette 4<sup>e</sup> colonne (ordre, largeur) — à valider en revue de design le moment venu.
>
> Le fichier `/home/mseme/Documents/Backup licences/facturation.png` (bandeau « Consommation actuelle » + prévision fin de mois, « Points d'attention », « Liste des factures ») **n'est pas la maquette de ce ticket** : c'est une exploration annotée de questions ouvertes (« Where does the data come from ? »), très au-delà des critères d'acceptation. Hors périmètre — ne pas s'en inspirer.

---

## 1. Objectif & périmètre

Depuis l'onglet « Facturation » du service Backup Licenses, le client voit **la consommation de stockage de ses vaults et le coût associé, ainsi que le prix de la licence qui leur est rattachée**, tel que facturé par Agora.

**Une ligne = un vault.** Quatre colonnes : nom, volume consommé en Go, prix de la licence, prix de la consommation du vault (stockage).

> **Revirement sur le périmètre (tranché en session, prime sur le ticket)** : le ticket ne décrit que 3 colonnes et annote lui-même le prix de licence « Check if the price can be shown somewhere else », sans trancher. Décision prise ici : **la licence est rattachée à un serveur, lui-même rattaché à un vault** — la relation est donc bien 1-vault-1-ligne, et le prix de licence prend place dans cette table sans créer l'hétérogénéité redoutée (c'est un montant en €, pas un nombre de workloads). Cf. §3 pour la chaîne de résolution et §14 pour le champ de jointure vault ↔ licence, non confirmé côté API.
>
> **Périodicité, tranchée** : les deux prix affichés (licence et consommation du vault) sont **le montant de la période de facturation en cours (mensuel)**, jamais un cumul depuis le début de la souscription. Répond au commentaire Jira du 30/06 (« we need to precise if it's monthly or from the beginning »). Reste à vérifier côté BE que les routes consommées le garantissent (§14).

**Hors périmètre, décidé :**

- **Pas de liste de factures, pas de prévision fin de mois, pas de « points d'attention »** (cf. règle de lecture ci-dessus).
- **Pas de lien vers un tableau de bord de vault** depuis la colonne « Nom » : ce module n'a pas d'écran de détail de vault (contrairement à `@ovh-ux/backup-agent`, dont la cellule nom est un lien). Texte simple.

---

## 2. Emplacement dans l'app

L'onglet existe déjà, **désactivé**, dans la page de service livrée par BKP-1215 :

`src/routes/routes.constants.ts` → `SERVICE_NAV_TABS`, entrée `billing`, `isDisabled: true`, libellé `module-backup-licenses/dashboard:tab.billing` (« Facturation », déjà traduit dans les 8 locales).

Le travail d'activation est exactement celui prévu par le commentaire de `ServiceNavTab.isDisabled` :

1. retirer `isDisabled: true` de l'entrée `billing` ;
2. ajouter la route enfant dans `src/routes/routes.tsx`, sous la route de layout `<Route element={<ServiceLayoutPage />}>` (là où se trouve le `TODO(1.2/1.3/1.4)`) :

```tsx
<Route
  path={subRoutes.billing}
  Component={BillingPage}
  handle={{ tracking: { pageName: 'billing', pageType: PageType.listing } }}
/>
```

`subRoutes.billing` (`'billing'`) et `routeUrls.billing` existent déjà. Rien à toucher dans `ServiceLayout.page.tsx` : l'en-tête, le fil d'Ariane, les `Notifications` et l'`ErrorBanner` de résolution du service sont portés par le layout, l'onglet ne rend que son contenu.

**Toute la logique vit dans le module `packages/manager/modules/backup-licenses`.** L'app `hpc-backup-licenses` reste une coquille (contexte + tracking + preloader) ; seule cette spec vit côté app.

---

## 3. Chaîne de résolution des données

Aucun identifiant n'est dans l'URL. Deux chaînes distinctes par vault : le stockage (déjà spécifié) et la licence (nouveau).

### 3.1 Stockage du vault

```
① tenantsQueries.withClient(qc).backupServicesId()          [déjà écrit — BKP-1216]
      GET /v2/backupServices/tenant                         → backupServicesId

② GET /v2/backupServices/tenant/{backupServicesId}/vault    → VaultResource[]
      filtre vaultProductLine === 'BACKUP_LICENSES'         (⚠ contrat non confirmé, cf. §14)

   pour chaque vault :
③    GET /v6/services?resourceName={vault.currentState.resourceName}   → number[]
        → serviceId = data[0]
④    GET /v6/services/{serviceId}/consumption/element        → ServiceConsumption[]
        → élément dont planCode ∈ BACKUP_LICENSES_VAULT_PLAN_CODES
        → quantity (Go) + price.text + price.value
```

**③ ne s'écrit pas à la main** : `getResourceServiceId({ resourceName })` et `getResourceServiceIdQueryKey` viennent de `@ovh-ux/manager-module-common-api` (déjà en peer/devDependency du module, déjà utilisé dans `src/test-utils/setupMsw.ts` via `getServicesMocks`). Signature : `Promise<ApiResponse<number[]>>` → lire `.data[0]`.

**④ : c'est bien `/consumption/element`, pas `/consumption`.** Le ticket mentionne les deux (`/consumption` pour `price.value`, `/element` pour `quantity`), mais `/services/{id}/consumption` nu n'est appelé **nulle part** dans le monorepo, alors que `/consumption/element` l'est en production (`@ovh-ux/backup-agent`, `apps/veeam-backup`) et renvoie **à la fois** `quantity` et `price`. Un seul appel suffit donc.

**Plan codes attendus** (`module.constants.ts`) :

```ts
export const BACKUP_LICENSES_VAULT_PLAN_CODES = [
  'backup-vault-backuplicenses-500g-consumption',
  'backup-vault-backuplicenses-paygo-consumption',
] as const;
```

La sélection se fait par appartenance à cette liste, et non par égalité à un code unique (`@ovh-ux/backup-agent` n'en a qu'un, `backup-vault-paygo-consumption`) : l'offre Backup Licenses a deux modes de facturation du stockage — le bundle 500 Go et le paygo.

### 3.2 Prix de la licence (nouveau)

Chaîne donnée par le ticket (section « Technical » du XML Jira, non reprise dans le corps de la description initiale) :

```
⑤ GET /v2/backupServices/tenant/{backupServicesId}/backupLicenses   → BackupLicenseResource[]
      (⚠ route non vérifiée pour ce module, contrat à confirmer — cf. §14,
       même statut que la route ② déjà signalée)

   pour chaque vault, résoudre la licence du serveur qui lui est rattaché :
      ⚠ champ de jointure vault ↔ licence/serveur non confirmé côté API (cf. §14).
      Tant que non confirmé, ne pas figer le nom du champ dans le code —
      l'isoler dans un unique sélecteur (`matchLicenseToVault`) pour n'avoir
      qu'un point à corriger une fois le contrat connu.

⑥    GET /v6/services?resourceName={license.resourceName}   → number[]
        → serviceId = data[0]                                (même helper qu'en ③)
⑦    GET /v6/services/{serviceId}/consumption                → price.text + price.value
        (pas de `/element` ici : la licence n'a pas de quantité à lire, seulement un prix)
```

**Pourquoi `/consumption` et non `/consumption/element` pour la licence** : contrairement au stockage (§3.1), il n'y a pas de `quantity` à extraire — uniquement `price`. Le ticket cite explicitement cette route pour ce cas (`/services/{serviceId}/consumption` → `Field: price.value`), contrairement au stockage où il cite les deux routes par erreur (cf. §3.1).

**⚠ À vérifier avec le BE avant de figer l'implémentation** : que `price.value`/`price.text` de cette route porte bien le montant de la période de facturation en cours, et non un cumul depuis le début de la souscription (cf. clarification §1). Le stockage bénéficie déjà de `beginDate`/`endDate` par élément de consommation (§6) ; rien ne garantit que la route licence expose la même chose.

---

## 4. Architecture de query : une query agrégée

`@ovh-ux/backup-agent` fait **une query par cellule** (`BillingUsageCell` et `BillingPriceCell` interrogent chacune `consumptionQueries.byResource(vaultId)` avec un `select` différent — React Query déduplique, une seule requête réseau par vault) et affiche un `OdsSkeleton` par cellule.

**Ce n'est pas le pattern retenu ici.** Les critères d'acceptation demandent **un** loader, **une** erreur avec un bouton « Réessayer » et **un** bouton de rafraîchissement — trois états globaux qu'une query par cellule obligerait à ré-agréger depuis la page. On écrit donc une query unique qui construit les lignes :

```ts
// src/data/queries/billing.queries.ts
const consumptionRows = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.billing.consumptionRows(),
    queryFn: async () => {
      const backupServicesId = await tenantsQueries.withClient(queryClient).backupServicesId();
      const vaults = selectBackupLicensesVaults(await getVaults(backupServicesId));
      const licenses = await getBackupLicenses(backupServicesId); // §3.2

      return Promise.all(
        vaults.map(async (vault) => {
          const license = matchLicenseToVault(licenses, vault); // §3.2, jointure non confirmée
          const [storage, licensePrice] = await Promise.allSettled([
            resolveVaultStorageConsumption(vault, queryClient),
            license ? resolveLicensePrice(license, queryClient) : Promise.reject(),
          ]);
          return toVaultConsumptionRow(vault, storage, licensePrice);
        }),
      );
    },
  });
```

**Deux `Promise.allSettled` indépendants par vault, pas un seul global au niveau du stockage.** Chaque colonne de prix dégrade indépendamment : si la résolution de la licence échoue (ou si aucune licence n'est appariée au vault, jointure non confirmée cf. §14) alors que le stockage répond, la ligne affiche le prix stockage normalement et `—` en colonne « Prix licence », et inversement. **Un vault ne perd toute sa ligne que si `selectBackupLicensesVaults` / ② échoue globalement** (l'état d'erreur de page, §8, reste réservé à cet échec-là) — pas si l'une des deux résolutions par ligne échoue.

Type de ligne (`src/types/VaultConsumption.type.ts`) :

```ts
export type VaultConsumptionRow = {
  vaultId: string;
  name: string;
  /** Volume consommé sur la période de facturation en cours, déjà en Go côté API. */
  quantityGb?: number;
  /** Prix du stockage du vault, montant formaté par l'API (devise et séparateurs inclus). */
  storagePriceText?: string;
  /** Sert à distinguer « inclus » (0) d'« inconnu » (undefined) — cf. §7. */
  storagePriceValue?: number;
  /** Prix de la licence rattachée au vault (via son serveur), formaté par l'API. `undefined` si la résolution échoue ou si aucune licence n'est appariée. */
  licensePriceText?: string;
};
```

`beginDate` / `endDate` du premier élément de consommation sont remontés à part, pour la mention de période (§6).

---

## 5. Stack & contraintes techniques

Identiques à celles des specs 1216/1218/1219 du module :

- **ODS v18** (`@ovhcloud/ods-components/react`, préfixe `Ods*`) et **MRC v2.43** (`@ovh-ux/manager-react-components`).
- **Imports interdits** : `@ovhcloud/ods-react` (dépendance fantôme + mismatch React 18/19, cf. mémoire `build-failures-types-react-v19-mismatch`), `@ovh-ux/muk`, `@datatr-ux/uxlib`.
- **`@ovh-ux/backup-agent` ne doit pas être importé** : il n'est déclaré dans aucune dépendance de `backup-licenses` (il résoudrait par hoisting = dépendance fantôme), et il **n'exporte de toute façon pas** `consumption.queries`, `consumption.selectors` ni `Consumption.type` dans son champ `exports`. La couche consommation est donc **recopiée** (décision validée, §13).
- `Datagrid` de MRC : `noResultLabel` (état vide) et `isLoading` (lignes squelette) sont des **props**, pas des composants à écrire. Sans `pagination`, aucune pagination n'est rendue — ce qu'on veut ici.
- ⚠️ **La prop `topbar` du `Datagrid` atterrit dans le conteneur de gauche** (`#left-side`, `flex-1 w-full`). Pour un bouton en haut à droite, il faut l'envelopper : `topbar={<div className="flex justify-end">…</div>}`.
- ⚠️ **`Price` de MRC attend des micro-cents** (`value / 1e8`) : inutilisable ici, l'API renvoie déjà `price.text` formaté. Ne pas non plus utiliser `useBytes` : `quantity` est **déjà en Go**, la concaténation avec `t('unit_size_GB')` suffit (même choix que `@ovh-ux/backup-agent`).
- ⚠️ En ODS v18 l'icône de rafraîchissement est **`refresh`** en minuscules (`ODS_ICON_NAME.refresh`) ; `arrowRotateRight` n'existe pas, `ODS_ICON_NAME.REFRESH` est du v17.
- Conventions de code (mémoire `react-coding-conventions`) : composants < 200 lignes, un composant par fichier, cellules extraites, utils externalisés, test colocalisé. Commentaires : le « pourquoi » d'un choix non évident uniquement (mémoire `feedback-code-comments-why-only`).

---

## 6. Structure de la page

```
Billing.page.tsx  (rendu dans l'Outlet de ServiceLayout — pas de BaseLayout ici)
  <section className="flex flex-col gap-4">
    ① mention de période         ← OdsText, une ligne
    ② erreur globale             ← BillingError (exclusif avec ③)
    ③ Datagrid
         topbar   = <div className="flex justify-end"><BillingTopbar /></div>
         columns  = useBillingColumns()
         items    = rows ?? []
         totalItems / isLoading / noResultLabel
```

**Mention de période** — le commentaire Jira du 30/06 le demande explicitement (« Be careful with the price tag, we need to precise if it's monthly or from the beginning »). Les éléments de consommation portent `beginDate` / `endDate` : on affiche donc au-dessus du tableau, en `OdsText` de préset `caption`, « Consommation de la période de facturation en cours, du {{begin}} au {{end}}. », et la variante sans dates (`period_notice_fallback`) si l'API ne les renvoie pas. Formatage des dates avec `date-fns` (déjà en peerDependency du module).

---

## 7. Colonnes du tableau

Le ticket n'en décrit que 3 (Nom / Consommation / Prix) ; la 3<sup>e</sup> est scindée en deux ici suite à la décision §1 d'ajouter le prix de licence — **4 colonnes au total**. Toutes non triables (`isSortable: false`) : sans `sorting`/`onSortChange` passés au `Datagrid`, un en-tête cliquable ne trierait rien — même décision que `useLinkedServersColumns`.

| # | Libellé | Clé i18n | Contenu |
|---|---|---|---|
| 1 | Nom | `NAMESPACES.DASHBOARD:name` | `row.name` en `DataGridTextCell`. Pas de lien (§1). |
| 2 | Consommation | `NAMESPACES.DASHBOARD:consumption` | `VaultUsageCell` : `« {{quantityGb}} Go »` (`NAMESPACES.BYTES:unit_size_GB`), sinon `EMPTY_VALUE_PLACEHOLDER` (`—`). |
| 3 | Prix licence | `billing:column.license_price` (nouvelle clé) | `LicensePriceCell` : voir ci-dessous. |
| 4 | Prix stockage | `billing:column.storage_price` (nouvelle clé, remplace l'usage direct de `NAMESPACES.FORM:price`) | `VaultPriceCell` : voir ci-dessous (inchangé). |

**Pourquoi renommer la 4<sup>e</sup> colonne (`NAMESPACES.FORM:price` → `billing:column.storage_price`)** : avec deux colonnes de prix côte à côte, un simple « Prix » réutilisé tel quel serait ambigu pour l'utilisateur (lequel des deux ?). Les deux libellés sont donc à créer en `fr_FR` puis à propager (§11) ; `NAMESPACES.FORM:price` n'est plus réutilisé sur cette page.

**`VaultPriceCell` (prix stockage) — trois branches, inchangées depuis la version précédente de la spec** :

1. `storagePriceValue === 0` → **badge `OdsBadge` `success`, libellé « Inclus »** (`billing:badge.included`). C'est le comportement de la maquette (`vault-veeam-multi-region`, 487 Go, badge vert « Included »).
2. `storagePriceText` défini → le texte tel quel (`« 0,05 € »`). Déjà formaté par l'API, devise comprise.
3. sinon → `EMPTY_VALUE_PLACEHOLDER`.

**Pourquoi `storagePriceValue === 0` et non `vault.currentState.type === 'BUNDLE'`** : un vault bundle en dépassement de ses 500 Go est facturé ; l'afficher « Inclus » serait faux. Le prix nul est le seul signal fiable de « rien à payer ». Règle à faire confirmer par le PO (§14).

**`LicensePriceCell` (prix licence) — deux branches, pas de badge « Inclus »** :

1. `licensePriceText` défini → le texte tel quel.
2. sinon → `EMPTY_VALUE_PLACEHOLDER` (résolution en échec, licence non appariée au vault, ou vault sans licence — cf. §3.2/§14).

**Pas de badge « Inclus » sur la licence** : contrairement au stockage, aucune règle métier connue ne rend une licence gratuite à prix nul ; un prix de licence à 0 (s'il arrivait) s'afficherait donc tel quel (`« 0,00 € »`) plutôt que comme un badge, faute de cas d'usage identifié qui justifierait de le masquer.

**Les deux colonnes affichent le prix de la période de facturation en cours (mensuel), jamais un cumul depuis le début de la souscription** (décision §1). Pour le stockage, c'est déjà garanti par `beginDate`/`endDate` de l'élément de consommation choisi (§6). Pour la licence, **à vérifier avec le BE** (§3.2, §14) : rien ne garantit aujourd'hui que `/services/{serviceId}/consumption` scope son `price.value` à la période en cours plutôt qu'à un cumul lifetime.

Le ticket demande « prix en euros avec deux décimales » : c'est `price.text` qui le garantit côté API (`« 0.05 € »` dans les mocks de `backup-agent`) pour le stockage ; à vérifier que la route licence (§3.2) applique le même format. On ne reformate pas côté front — un client hors zone euro verrait sa propre devise, ce qui est le comportement souhaitable.

---

## 8. États

| État | Rendu | Détail |
|---|---|---|
| **Chargement** | `isLoading={isPending}` sur le `Datagrid` | Lignes squelette natives MRC (5 par défaut). Pas de squelette par cellule : la query est agrégée (§4). |
| **Liste vide** | `noResultLabel={t('empty_state')}` | « Aucune consommation enregistrée pour la période en cours. » (formulation du ticket). Rendu par le `Datagrid` lui-même ; la topbar reste affichée, donc le rafraîchissement reste accessible. |
| **Erreur** | `BillingError` à la place du `Datagrid` | `OdsMessage` `critical` non dismissible + bouton `outline` « Réessayer » (`NAMESPACES.ACTIONS:retry`) qui appelle `refetch()`. Calque exact de `LinkedServersError` — même raison : l'utilisateur garde ses onglets et le réessai est ciblé, l'`ErrorBanner` pleine page reste réservé à l'échec de résolution du service dans `ServiceLayout`. |
| **Rafraîchissement** | `BillingTopbar` | Bouton `ghost`, libellé `NAMESPACES.ACTIONS:refresh`, `isDisabled={isLoading}`, `onClick` → `queryClient.invalidateQueries({ queryKey: queryKeys.billing.all() })`. Aligné sur `LinkedServersTopbar` (même variante, même clé), **pas** sur le `ReloadButton` icon-only de `backup-agent` : la cohérence interne au module primer. |

Les trois états sont mutuellement exclusifs, dans cet ordre : erreur → chargement → liste (la liste vide n'est pas un état de page, c'est une ligne du tableau).

**La dégradation par colonne (§4) n'est pas non plus un état de page.** Si la résolution du prix de licence échoue pour un vault (ou si aucune licence ne lui est appariée), sa ligne s'affiche normalement avec `—` dans la seule colonne « Prix licence » — ce n'est ni l'état « Erreur », ni l'état « Liste vide », et ça ne déclenche aucun bandeau ni bouton « Réessayer » supplémentaire. Seul l'échec de ② (résolution des vaults eux-mêmes) déclenche l'état « Erreur » global.

---

## 9. Types & couche data à créer

```ts
// src/types/Vault.type.ts          (copie réduite du type de backup-agent)
export type VaultBillingType = 'BUNDLE' | 'PAYGO';
export type Vault = {
  id: string;
  name: string;
  resourceName: string;
  region: string;
  type: VaultBillingType;
  /** ⚠ Champ attendu par le ticket, absent de tout contrat connu — cf. §14. */
  vaultProductLine?: string;
};
export type VaultResource = Resource<Vault>;

// src/types/Consumption.type.ts    (copie de backup-agent)
export type CurrencyCode = 'EUR' | 'USD' | … ;
export type Price = { currencyCode: CurrencyCode; text: string; value: number };
export type ServiceConsumption = {
  beginDate: string | null; endDate: string | null;
  pricingMode: string; quantity: number;
  planCode: string; planFamily: string; price: Price;
  uniqueId: string | null; metadata?: ServiceMetadata | null;
};

// src/types/BackupLicense.type.ts  (nouveau)
export type BackupLicense = {
  id: string;
  resourceName: string;
  /** ⚠ Champ de jointure vers le vault attendu, nom exact non confirmé — cf. §14. */
  [joinField: string]: unknown;
};
export type BackupLicenseResource = Resource<BackupLicense>;
```

Routes à ajouter dans `src/utils/apiRoutes/apiRoutes.ts` :

```ts
export const getVaultsRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/vault`;

export const getServiceConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption/element`;

// nouveau — prix de licence (§3.2)
export const getBackupLicensesRoute = (backupServicesId: string) =>
  `${getBackupServicesBaseRoute(backupServicesId)}/backupLicenses`;

export const getLicenseConsumptionRoute = (serviceId: string) =>
  `/services/${serviceId}/consumption`;
```

Clés de query à ajouter dans `src/data/queries/queryKeys.ts` :

```ts
billing: {
  all: () => ['backup-licenses', 'billing'],
  consumptionRows: () => [...queryKeys.billing.all(), 'consumption-rows'],
},
```

**Mocks de développement** : toutes les requêtes passent par le drapeau `USE_API_MOCKS` de `src/mocks/mocks.config.ts`, comme `getBackupServers`. Indispensable ici : la route `/vault` de ce produit n'est pas vérifiée, `vaultProductLine` n'existe dans aucun contrat, la route `/backupLicenses` et le champ de jointure licence↔vault non plus, et les plan codes ne sont pas confirmés. Jeux de données à écrire dans `src/mocks/vaults/`, `src/mocks/consumptions/` et `src/mocks/backupLicenses/` (nouveau), calqués sur la maquette (un vault inclus à 487 Go prix 0, deux paygo à 7 Go / 0,05 € et 142 Go / 0,99 €, chacun avec un prix de licence mensuel mocké). **`USE_API_MOCKS` doit être remis à `false` avant la revue** (il est resté à `true` sur la branche 1218).

---

## 10. Arborescence cible

```
src/pages/billing/
  Billing.page.tsx                          # 3 états + Datagrid                    (NOUVEAU)
  Billing.page.spec.tsx
src/components/billing/
  BillingTopbar/                            # bouton rafraîchir, aligné à droite     (NOUVEAU)
  BillingError/                             # OdsMessage critical + Réessayer        (NOUVEAU)
  VaultUsageCell/                           # « {{n}} Go » | —                       (NOUVEAU)
  VaultPriceCell/                           # badge « Inclus » | prix | —            (NOUVEAU)
  LicensePriceCell/                         # prix licence | —                       (NOUVEAU)
  BillingPeriodNotice/                       # mention de période                     (NOUVEAU)
src/hooks/
  useBillingColumns/useBillingColumns.tsx   # 4 colonnes                             (NOUVEAU)
src/data/api/
  vaults/vaults.requests.ts                 # getVaults + garde USE_API_MOCKS        (NOUVEAU)
  services/consumption.requests.ts          # getServiceConsumption                  (NOUVEAU)
  backupLicenses/backupLicenses.requests.ts # getBackupLicenses + garde USE_API_MOCKS (NOUVEAU)
src/data/queries/billing.queries.ts         # query agrégée (§4)                     (NOUVEAU)
src/data/selectors/
  vaults.selectors.ts                       # selectBackupLicensesVaults             (NOUVEAU)
  vaultConsumption.selectors.ts             # selectVaultConsumptionElement          (NOUVEAU)
  licenses.selectors.ts                     # matchLicenseToVault (§3.2, §14)        (NOUVEAU)
src/types/  Vault.type.ts · Consumption.type.ts · VaultConsumption.type.ts · BackupLicense.type.ts   (NOUVEAUX)
src/mocks/  vaults/ · consumptions/ · backupLicenses/                                (NOUVEAUX)
```

Modifiés : `routes/routes.tsx` (route enfant), `routes/routes.constants.ts` (retrait d'`isDisabled`), `utils/apiRoutes/apiRoutes.ts`, `data/queries/queryKeys.ts`, `module.constants.ts` (plan codes), `BackupLicenses.translations.ts`/`module.constants.ts` (namespace `BILLING`), `test-utils/i18ntest.utils.ts` (chargement du namespace).

---

## 11. i18n

Nouveau namespace **`module-backup-licenses/billing`** → `BILLING` dans `BACKUP_LICENSES_NAMESPACES` (`src/module.constants.ts`), fichier `public/translations/billing/Messages_{lng}.json`, **8 locales** (`fr_FR`, `fr_CA` = copie stricte de `fr_FR`, `en_GB`, `de_DE`, `es_ES`, `it_IT`, `pl_PL`, `pt_PT`) structurellement alignées. À enregistrer aussi dans `src/test-utils/i18ntest.utils.ts` (`addTranslations` + `labels`).

**Réutilisé, rien à créer** : `NAMESPACES.DASHBOARD:name` / `:consumption`, `NAMESPACES.BYTES:unit_size_GB` (« Go »), `NAMESPACES.ACTIONS:refresh` / `:retry`, et `module-backup-licenses/dashboard:tab.billing` (libellé de l'onglet, déjà traduit). **`NAMESPACES.FORM:price` n'est plus réutilisé** (cf. §7, remplacé par les deux libellés de colonne dédiés).

**Clés à créer** (fr_FR) :

```json
{
  "empty_state": "Aucune consommation enregistrée pour la période en cours.",
  "period_notice": "Consommation de la période de facturation en cours, du {{begin}} au {{end}}.",
  "period_notice_fallback": "Consommation de la période de facturation en cours.",
  "column": { "license_price": "Prix licence", "storage_price": "Prix stockage" },
  "badge": { "included": "Inclus" },
  "error": { "loading": "Votre consommation n'a pas pu être chargée." }
}
```

Conventions de ton du module : erreurs bienveillantes orientées solution (« … n'a pas pu être chargée. », pas « Erreur 500 »), pas d'impératif sec. Traductions non-fr **générées, non relues par CDS** — à faire relire (même dette que sur 1206/1208/1216).

---

## 12. Tests

Convention (mémoire `react-coding-conventions`, règle 8) : **ne tester que les branches conditionnelles**, jamais un texte statique. Tests colocalisés.

| Cible | Cas |
|---|---|
| `vaults.selectors.spec.ts` | filtre `vaultProductLine` : garde `BACKUP_LICENSES`, écarte une autre valeur, **garde les vaults dont le champ est absent** (tolérance §14). |
| `vaultConsumption.selectors.spec.ts` | sélectionne l'élément dont le `planCode` est dans la liste (bundle **et** paygo), renvoie `undefined` si aucun ne correspond. |
| `licenses.selectors.spec.ts` | `matchLicenseToVault` : apparie sur le champ de jointure une fois confirmé (§14) ; renvoie `undefined` si aucune licence ne correspond au vault. |
| `VaultPriceCell.component.spec.tsx` | les 3 branches : `storagePriceValue === 0` → badge « Inclus » ; `storagePriceText` → texte ; ni l'un ni l'autre → `—`. |
| `LicensePriceCell.component.spec.tsx` | les 2 branches : `licensePriceText` → texte ; `undefined` → `—`. Pas de branche badge (§7). |
| `VaultUsageCell.component.spec.tsx` | valeur → « 7 Go » ; `undefined` → `—`. |
| `billing.queries.spec.ts` | un vault dont la consommation de stockage échoue produit une ligne « nom + — (Go) + prix licence + — (prix stockage) » ; un vault dont **seule** la résolution de licence échoue garde son prix stockage et affiche `—` en prix licence ; aucun des deux cas **n'empêche** les autres lignes (deux `allSettled` indépendants, §4). |
| `Billing.page.spec.tsx` | intégration MSW : liste (4 colonnes), liste vide (`empty_state`), erreur de `/vault` → message + bouton « Réessayer », clic sur « Rafraîchir » → nouvelle requête. |

Outils déjà en place : `renderWithProviders`, `initTestI18n`, `setupMsw` (avec `getServicesMocks` de `@ovh-ux/manager-module-common-api`, qui répond `[1234567890]` sur `/services` — utilisable tel quel pour ③ et ⑥). Handlers MSW à écrire pour `/backupServices/tenant/:id/vault`, `/backupServices/tenant/:id/backupLicenses` (nouveau), `/services/:serviceId/consumption/element` et `/services/:serviceId/consumption` (nouveau, licence) — (⚠ le handler de `backup-agent` contient une espace parasite en tête d'URL — ne pas recopier ce bug).

---

## 13. Décisions structurantes (rationale — ne pas les défaire par erreur)

- **Une query agrégée, pas une query par cellule.** Le pattern de `@ovh-ux/backup-agent` est écarté parce que les AC exigent un loader, une erreur et un rafraîchissement **globaux** (§4). Conséquence assumée : le tableau s'affiche d'un coup, pas colonne par colonne.
- **Deux `Promise.allSettled` indépendants par vault** (stockage et licence), pas un seul (§4). Chaque colonne de prix dégrade sur son propre échec sans affecter l'autre — pertinent depuis que la ligne porte deux prix résolus par deux chaînes d'appels distinctes.
- **Recopie de la couche consommation depuis `backup-agent`, pas d'extraction en package partagé** (choix validé). `backup-agent` est en production et n'exporte pas ces modules ; l'élargissement de PR n'est pas justifié pour ~150 lignes. **Dette assumée** : à terme, `/consumption/element` + le type `ServiceConsumption` ont leur place dans `@ovh-ux/manager-module-common-api`, qui possède déjà `/services` et `getResourceServiceId` mais aucun code de consommation. Même nature que la dette `AgentInstallationPanel` (mémoire `backup-agent-panel-refactor`).
- **`/consumption/element` et non `/consumption`, pour le stockage uniquement** : seule route réellement utilisée en production dans le monorepo pour ce cas, et elle porte `quantity` **et** `price` — un appel au lieu de deux (§3.1). **Pour la licence, c'est l'inverse** : `/consumption` (sans `/element`), car il n'y a pas de `quantity` à lire, seulement un prix (§3.2). Ne pas harmoniser les deux routes par erreur.
- **Badge « Inclus » dérivé du prix nul, pas du type de vault** (§7) : un bundle en dépassement est facturé. **Ne s'applique qu'au stockage** — pas de badge équivalent sur la licence, faute de règle métier connue qui la rendrait gratuite.
- **Prix affiché tel que l'API le formate** (`price.text`) : pas de reformatage front, pas de `Price` MRC (micro-cents), la devise du client est respectée. Vaut pour les deux colonnes de prix.
- **Bouton « Rafraîchir » textuel en `ghost`**, comme `LinkedServersTopbar`, et non le bouton icône seule de `backup-agent` : la cohérence à l'intérieur du module passe devant la ressemblance avec le module voisin.
- **Prix des licences désormais dans le tableau, en colonne dédiée par vault** (tranché en session, §1) : contrairement à la version précédente de cette spec, ce n'est plus hors périmètre. La relation retenue est licence → serveur → vault, ce qui justifie une colonne par ligne plutôt qu'un renvoi vers un autre écran. Le champ de jointure exact reste à confirmer (§14).
- **Les deux prix affichés sont ceux de la période de facturation en cours, jamais un cumul depuis le début de la souscription** (tranché en session, §1/§7). Garanti pour le stockage par `beginDate`/`endDate` ; à vérifier côté BE pour la licence (§14).
- **Pas de pagination ni de tri** : une poignée de vaults, et un en-tête triable sans `onSortChange` serait un leurre.

---

## 14. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **`vaultProductLine`** | **0 occurrence dans tout le monorepo.** Champ demandé par le ticket, absent du type `Vault` de `backup-agent` comme de tout contrat connu. | Confirmer avec le BE. **Tolérance à implémenter en attendant** : le filtre garde les vaults dont le champ est `undefined`, sinon l'écran serait vide dès que le BE ne renvoie pas encore le champ. Filtrage **côté front** (le support Iceberg de cette route n'est pas documenté). |
| **Plan codes** | Le ticket écrit `backup-vault-backuplicenses-500G`, puis `backup-vault-backuplicenses-*500g-consumption` avec un balisage italique cassé. Graphie exacte incertaine (casse du `G`). | Confirmer avec Agora/BE avant de figer `BACKUP_LICENSES_VAULT_PLAN_CODES`. |
| **Périodicité du prix** | **Décidé** (§1/§7) : les deux prix affichés (licence et stockage) sont ceux de la période de facturation en cours, jamais un cumul depuis la souscription. Garanti pour le stockage par `beginDate`/`endDate` (§6). Pour la licence, **rien ne confirme** que `/services/{serviceId}/consumption` (§3.2) expose la même chose plutôt qu'un cumul lifetime. | Vérifier avec le BE que la route licence scope bien son `price.value` à la période en cours. Si non : demander une route/paramètre équivalent, ou reconsidérer l'affichage. |
| **Badge « Inclus »** | Règle `storagePriceValue === 0` (§7), **stockage uniquement**. | Confirmation PO. |
| **Prix de la licence — colonne** | **Décidé** (§1) : affiché en colonne dédiée, par vault, via la relation licence → serveur → vault. | Rien à arbitrer côté PO ; reste la confirmation technique ci-dessous. |
| **Champ de jointure licence ↔ vault** | **0 occurrence confirmée dans le contrat API.** Le ticket ne relie jamais explicitement une entrée `/backupLicenses` à un vault ; la relation « licence → serveur → vault » est affirmée par le métier mais son support technique (nom de champ, sens de la relation) n'est pas vérifié. | Confirmer avec le BE avant de figer `matchLicenseToVault`. **Tolérance à implémenter en attendant** (même logique que `vaultProductLine` ci-dessus) : si aucune licence n'est appariée à un vault, sa colonne « Prix licence » affiche `—` plutôt que de faire échouer la ligne entière. |
| **Route `/backupLicenses`** | Route déduite par analogie avec `/vault` (§3.2), **non vérifiée** pour ce produit — même statut que la ligne suivante. | Vérifier avec le BE ; `USE_API_MOCKS` permet de développer sans. |
| **Route `/vault` de ce produit** | Empruntée à `@ovh-ux/backup-agent` (`/backupServices/tenant/{id}/vault`, v2). Non vérifiée pour Backup Licenses. | Vérifier avec le BE ; `USE_API_MOCKS` permet de développer sans. |
| **Onglet « Vaults » (1.2)** | Reste désactivé. Ce ticket n'active **que** « Facturation ». | BKP à venir. |

---

## 15. Reste à faire

- [ ] Faire valider cette spec avant toute implémentation.
- [ ] Confirmer avec le BE : `vaultProductLine`, plan codes, route `/vault`, présence de `beginDate`/`endDate`, route `/backupLicenses`, **champ de jointure licence ↔ vault**, **périodicité (mensuelle vs cumul) du prix retourné par `/services/{serviceId}/consumption` pour la licence**.
- [ ] Créer la branche depuis `feat/1218-update-vbr-server`.
- [ ] Implémenter : types (dont `BackupLicense.type.ts`), `apiRoutes` (dont routes licence), requests (+ garde `USE_API_MOCKS`), selectors (dont `matchLicenseToVault`), `billing.queries` (deux `allSettled` par vault), `useBillingColumns` (4 colonnes), cellules (dont `LicensePriceCell`), `BillingTopbar`, `BillingError`, `BillingPeriodNotice`, `Billing.page`.
- [ ] Activer l'onglet : retrait d'`isDisabled` + route enfant.
- [ ] Namespace i18n `billing` en `fr_FR` (dont `column.license_price` / `column.storage_price`), puis propagation aux 7 autres locales + enregistrement dans `i18ntest.utils.ts`.
- [ ] Mocks de développement (vaults + consommations + `backupLicenses`) calqués sur la maquette.
- [ ] Tests (§12).
- [ ] Remettre `USE_API_MOCKS` à `false`.
- [ ] Ajouter la ligne à `spec/INDEX.md` (l'index de la branche 1218 ne connaît pas encore ce fichier) :
      `| [BKP-1225-billing-consumption-table.md](./BKP-1225-billing-consumption-table.md) | Onglet « Facturation » : tableau de consommation des vaults (nom / Go / prix licence / prix stockage) | En cours |`
- [ ] Relecture CDS des 7 traductions non-fr.
