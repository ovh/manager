# BKP-1208 — Page de commande (Backup Licences) — **refonte sur maquette**

Jira: https://jira.ovhcloud.tools/browse/BKP-1208 (Epic BKP-1161, parent de BKP-1240)
Confluence: https://confluence.ovhcloud.tools/display/BCK/04+-+New+Veeam+Enterprise+Agora
Maquette de référence : `/home/mseme/Documents/Backup licences/Tickets/1208/Veeam.png` (2026-07-29)
Assets ticket : `/home/mseme/Documents/Backup licences/Tickets/1208/` (XML JIRA + ancienne maquette IA HTML)

> **Ce document remplace `BKP-1208-order-funnel.md`.** Le wizard livré par le commit `04fb5f87b8` a été construit sans la bonne maquette. Le périmètre fonctionnel reste valable ; la structure de la page change. L'ancienne spec est conservée le temps de la refonte comme référence de ce qui existe en base de code, puis à supprimer.
>
> ### Règle de lecture de la maquette
>
> **La maquette ne fait autorité que sur le LAYOUT.** Tout le **contenu** — libellés, features des cartes, prix, périodicités, tooltips, titre de page — vient du **tunnel actuel** (i18n `module-backup-licenses/order`), qui a été relu et validé. Là où la maquette et le tunnel actuel divergent sur du contenu, **le tunnel actuel gagne**, sans exception.
>
> Elle est par ailleurs incomplète : pas de détail des champs, pas d'états d'erreur/chargement, pas de responsive. Tout ce qu'elle ne montre pas et qui existe déjà dans le tunnel actuel est **repris** (cf. §3).

Branche : `feat/1208-order-tunnel` (contient le tunnel à refondre).
État : spec à valider, implémentation non commencée.

---

## 1. Objectif & périmètre (inchangé)

Ce parcours sert **exclusivement à associer une licence Veeam à un serveur VBR (Veeam Backup & Replication) et à provisionner son Vault** (stockage objet S3 de destination). C'est un espace de **gestion de licences**, pas un espace de protection de données.

**Ce que ce parcours ne fait PAS** : il n'existe aucune notion de « quel workload / quelle VM est protégée ». Le VBR est le moteur de sauvegarde ; le choix des éléments à sauvegarder se fait *après*, dans la console Veeam elle-même (création des jobs), hors du périmètre de cet outil. Ne pas concevoir de copie ou d'écran qui laisserait croire qu'à la sortie du parcours « quelque chose est protégé » — seul le socle (licence + Vault) est en place.

Cycle produit complet (au-delà de ce ticket) : **liste des serveurs VBR** (une ligne = un serveur + sa licence) → CTA « Ajouter un serveur » → **cette page** → retour à la liste. La liste (ticket 1.1, `stubRoutes.dashboard`) n'existe pas encore.

---

## 2. Ce qui change par rapport au tunnel actuel

| Sujet | Tunnel actuel (`04fb5f87b8`) | Nouvelle page |
|---|---|---|
| **Navigation** | Wizard : 1 étape = 1 écran, étape pilotée par l'URL (`?step=`), stepper horizontal maison | **Page unique** avec **stepper vertical** MRC (`StepComponent`), toutes les étapes sur le même écran |
| **Nombre d'étapes** | Variable (2 ou 3 selon la famille de licence) | **Fixe : 3** (Licence / Serveur VBR & Vault / Localisation) |
| **Retour en arrière** | Clic sur un dot du stepper | Bouton « Modifier » sur l'étape validée et repliée |
| **Récapitulatif** | Accordéon replié en pied de dernière étape | **Panneau sticky en colonne de droite**, visible en permanence |
| **Prix** | Un seul emplacement : footer de la dernière étape | **Par carte de licence** (bloc en pied de carte) **+ panneau récap** (estimation mensuelle) |
| **CTA de commande** | Footer sticky « Commander » | « Finaliser ma commande » dans le panneau récap |
| **Sortie du parcours** | Bouton « Annuler » dans le footer | Lien retour du `BaseLayout` (`onClickReturn`) |
| **En-tête** | `OdsText heading3` centré, maison | `BaseLayout` MRC : breadcrumb + titre + « Roadmap & Changelog » + « Guides » |
| **Encart Vault** | `VaultInfoPanel` replié/dépliable (offre rappelée) | **Carte cochée non décochable** « Vault — Inclus », une ligne de description |
| **Localisation** | Grille de 3 cartes région | Grille de cartes région (idem), section propre = étape 3 |

Ce qui **ne change pas** : le périmètre fonctionnel, les champs du serveur VBR, le champ « Nom du Vault », la validation IP, la persistance `sessionStorage`, le catalogue de licences hardcodé, les conventions i18n et de ton.

---

## 3. Écarts assumés avec la maquette (décidés avec le PO/dev)

La maquette est incomplète. Les décisions suivantes s'en écartent **volontairement** — ne pas les « corriger » vers la maquette.

| Point | Maquette | Décision retenue | Raison |
|---|---|---|---|
| **Cartes de licence** | 4 cartes à plat (VDP Foundation, VDP Advanced, VDP Premium, Enterprise Plus) | **2 cartes** (Veeam Data Platform / Veeam Enterprise Plus), puis **dévoilement des 3 cartes de niveau VDP** si Data Platform est choisi | Comportement du tunnel actuel, conservé : 4 cartes à plat mélangent deux niveaux de décision (famille de produit vs palier) |
| **Champs serveur VBR** | Absents | **Repris** de l'étape 3 actuelle : nom du service, IP publique, toggle « derrière un NAT », IP privée conditionnelle | Sans eux, la licence ne peut pas être associée à un VBR — l'objectif même du ticket |
| **Nom du Vault** | Absent (carte « Inclus » seule) | **Champ conservé**, dans l'étape 2 à côté de la carte Vault | Décision explicite ; le nom est irréversible côté BE |
| **Structure** | Page unique scrollée, sections empilées | **Stepper vertical** avec étapes repliées après validation | La réintégration des champs VBR rend la page unique trop longue ; le repli garde la page courte |
| **CTA « Finaliser ma commande »** | Affiché 2 fois (panneau récap + pied de page) | **Une seule fois**, dans le panneau récap | Deux boutons = deux états à synchroniser pour aucun gain ; en responsive le panneau retombe en fin de page, l'ordre de lecture reste correct |
| **Contenu des cartes** (titres, features, tooltips, prix) | Listes de features très détaillées (Veeam ONE Complete, Threat Center, SureReplica + SOBR, Recovery Orchestrator…) | **Contenu du tunnel actuel conservé à l'identique** (clés `license.*`, `tier.*`, `feature.*`) | Le contenu de la maquette n'est pas bon ; celui du tunnel actuel a été relu et validé |
| **Périodicités de prix** | Ligne Licence en « HT/mois », Total en « HT/an » | **Tout en mensuel**, comme le tunnel actuel | Même raison ; l'incohérence mois/an de la maquette n'est pas à reproduire |
| **Titre de la page** | « Veeam Enterprise » | **« Backup Licenses »** (`LABELS.BACKUP_LICENSES`) | « Veeam Enterprise » est l'**ancien** nom du produit. Nommage confirmé par le renommage de `sidebar_backup_licenses` dans les 8 locales du container (« Veeam Backup Licenses » → « Backup Licenses ») |

---

## 4. Emplacement du code (inchangé)

**Toute la logique vit dans le module partagé `packages/manager/modules/backup-licenses` (`@ovh-ux/backup-licenses`).** L'app `packages/manager/apps/hpc-backup-licenses` n'est qu'une **coquille** (contexte + tracking + preloader, `src/pages/Main.layout.tsx` — aucun chrome visuel) qui monte les routes du module.

Raison : un **2ᵉ module** sera accueilli plus tard par la même app coquille — aucune logique métier ne doit y être ajoutée. Seule la spec (ce fichier) vit côté app, dans `spec/`.

**Point de montage** — vérifié : `MainLayout.component.tsx` du module (celui qui rend `BaseLayout` + les `OdsTabs`) est monté sur `path=""` **sans routes enfants** ; `onboarding` et `order` sont des routes **sœurs**. `Order.page` n'hérite donc d'aucun `BaseLayout` et doit rendre le sien (cf. §7). Pas de tabs à neutraliser.

---

## 5. Stack & contraintes techniques

- **ODS `@ovhcloud/ods-components` v18** (web components wrappés React, préfixe `Ods*`, import `@ovhcloud/ods-components/react`).
- **Imports interdits** dans ce module :
  - `@ovhcloud/ods-react` — hoistée en racine mais **non déclarée** dans le `package.json` du module → dépendance fantôme + risque de mismatch React 18/19 (cf. mémoire `build-failures-types-react-v19-mismatch`).
  - `@ovh-ux/muk` (MRC V3) — dépend de `@ovhcloud/ods-react` 19.5.0. Concerne notamment `GuideMenu`, `ChangelogMenu`, `Step`, `Text`.
  - `@datatr-ux/uxlib` (funnels `pci-object-storage`, `pci-ai-tools`, `pci-databases-analytics`) — hors ODS.
- **Composants MRC réutilisés** (`@ovh-ux/manager-react-components` v2.43, ODS v18 ✅) :
  - `StepComponent` — stepper **vertical** officiel, cf. §6. **Correction d'une affirmation fausse de l'ancienne spec** (« pas de Stepper dans ODS/MRC v18 ») : il n'y en a pas dans ODS, mais MRC en fournit un. `OrderStepper` maison était une réinvention → à supprimer.
  - `BaseLayout` + `Headers` (`PageLayout` est `@deprecated`).
  - `ChangelogButton` (`{ links: { changelog, roadmap, 'feature-request' }, chapters? }`) et `GuideButton` (`{ items }`). `GuideButton` est marqué `@deprecated` au profit de `GuideMenu`, **mais `GuideMenu` est dans muk → interdit** : on reste sur `GuideButton`.
  - `Breadcrumb`, `Notifications`, `Price` (formatage « XX,XX € HT/mois »).
- **Pas de radio-card dans ODS v18 ni dans MRC** (liste exhaustive des wrappers vérifiée) → les cartes sélectionnables maison (`LicenseTypeCard`, `VdpTierCard`, `RegionCard`, `RadioIndicator`) restent justifiées. `TileChoice`/`TilesInputChoice` de `@ovh-ux/manager-pci-common` conviendraient techniquement mais tirent un contexte PCI (project/discovery) → écartés.
- **Pas de panneau récap sticky réutilisable** dans le monorepo : les implémentations existantes violent les contraintes d'import (`pci-instances/components/cart` → ods-react ; `pci-object-storage` → uxlib). À composer avec `OdsCard` + `OrderSummaryRow` (déjà écrit ici, réutilisable tel quel). `Order.Summary` de MRC est un **faux ami** : c'est l'écran de confirmation post-redirection legacy, pas un récap de prix.
- **Échelle d'espacement Tailwind non standard** : `@ovh-ux/manager-tailwind-config` **redéfinit tout `theme.spacing`** (`8`=1.5rem, `9`=2rem, `10`=2.5rem, `11`=3rem). Vérifier ce fichier avant de choisir une classe `gap-*`/`p-*`/`m-*`.
- Design tokens ODS en **variables CSS**, consommées en valeurs arbitraires Tailwind : `text-[var(--ods-color-primary-500)]`. Familles : `primary`, `success`, `critical`, `information`, `warning`, `neutral` (shades `-000`…`-900`).
- **Règle couleur : pas de violet, tout accent de sélection/mise en avant = `primary`.** Checks par défaut / badges « inclus » = `success`. Erreurs = `critical`. Classes centralisées dans `src/utils/orderAccent/orderAccent.ts`.
- Formulaire en **state React simple** + validation externalisée (`isValidIp`) — pas de react-hook-form/zod.
- **Cart Agora** : référence = `createCart` de `@ovh-ux/manager-module-order`. Contrat API non figé → submit stubé (§15).

---

## 6. `StepComponent` : comportement exact à respecter

Source lue : `node_modules/@ovh-ux/manager-react-components/dist/src/components/container/step/Step.component.js`.

```ts
type TStepProps = {
  id?: string; title?: string | JSX.Element; subtitle?: string | JSX.Element;
  isOpen: boolean; isChecked: boolean; isLocked: boolean; order: number;
  next?: { action: (id: string) => void; label; isDisabled?; isLoading? };
  edit?: { action: (id: string) => void; label; isDisabled? };
  skip?: { action: (id: string) => void; label; isDisabled?; hint? };
  children?: JSX.Element | JSX.Element[];
};
```

Contraintes issues de l'implémentation :

- Le bouton **`edit` ne s'affiche que si `isLocked === true`**. Chaque étape franchie doit donc être `check()` **+** `lock()`, sinon aucun retour arrière n'est possible.
- **Étape repliée = `isOpen: false`** → `subtitle`, `children` et les boutons `next`/`skip` sont tous masqués. Le rappel du choix (« VDP Premium ») doit donc être injecté dans **`title`**, qui accepte du JSX.
- `isLocked` avec `isOpen: true` grise le contenu (`opacity-50 pointer-events-none`) et masque `next`/`skip` : c'est le comportement de `pci-workflow`. **Ce n'est pas celui retenu ici** — on ferme l'étape (`close()`) pour raccourcir la page.
- La pastille affiche `order` (numéro) ou une **coche `primary`** si `isChecked`.
- Le composant ne gère **pas** l'URL : le pilotage `?step=` de l'ancien tunnel disparaît (régression assumée, cf. §14).

**Pattern d'état à reprendre** : `useStep` (`apps/pci-workflow/src/pages/new/hooks/useStep.ts`) → `{ isOpen, isChecked, isLocked, open, close, check, uncheck, lock, unlock }`, orchestré par un hook parent (`useWorkflowStepper.ts` comme modèle). Ce hook n'est pas exporté par un package → à recopier dans le module (25 lignes).

**Règle de cascade au « Modifier »** (modèle `useWorkflowStepper.ts:77`) : rouvrir une étape (`unlock`) **réinitialise toutes les étapes suivantes** (`uncheck` + `unlock` + `close`) et remet à zéro les champs qu'elles portent. Indispensable ici : changer de licence change les niveaux VDP disponibles.

---

## 7. Structure de la page

```
BaseLayout
  breadcrumb   = <Breadcrumb appName rootLabel />
  header       = { title: LABELS.BACKUP_LICENSES,   // « Backup Licenses »
                   changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
                   headerButton: <GuideButton items={useMainGuideItem()} /> }
  onClickReturn / backLinkLabel → retour vers routeUrls.onboarding
  ├── colonne principale : 3 × StepComponent
  │     ① Licence
  │     ② Serveur VBR & Vault
  │     ③ Localisation
  └── <aside className="sticky top-8 self-start"> : panneau récap
```

L'ordre de rendu de `Headers` place `changelogButton` **avant** `headerButton` → « Roadmap & Changelog » à gauche de « Guides », conforme à la maquette.

Note : `LABELS.BACKUP_LICENSES` valait `'Backup Agent'` (reste de copie du module `backup-agent`) — **corrigé en `'Backup Licenses'`** dans `src/module.constants.ts:2`. Le `MainLayout` du module consommait déjà cette constante et affichait donc le mauvais titre.

Le titre `t('title')` du tunnel actuel (« Configurer une licence Veeam ») disparaît : le `BaseLayout` porte désormais le titre produit, et les 3 étapes portent leurs propres intitulés.

Grille 2 colonnes en `lg:` (modèle `TunnelStepsSidebar` de `bmc-backup-agent-baremetal` : `lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`), empilée en dessous.

---

## 8. Étape ① — Licence

- **2 cartes** côte à côte : `Veeam Data Platform` et `Veeam Enterprise Plus`.
- Sélectionner **Data Platform** dévoile, **dans la même étape**, sous les 2 cartes, les **3 cartes de niveau** : Foundation, Advanced, **Premium (badge « Recommandé »)**.
- Sélectionner **Enterprise Plus** ne dévoile rien ; l'étape est complète.
- Présélection par défaut : la famille et le niveau marqués `recommended: true` dans `licenses.data.ts` (sauf reprise d'un état persisté).
- Titre replié : « Licence — Veeam Data Platform Premium ».

**Contenu des cartes : celui du tunnel actuel, inchangé.** Le contenu de la maquette (Veeam ONE Complete, Threat Center, SureReplica + SOBR, Recovery Orchestrator, Gen AI Insights…) **n'est pas retenu**. Clés existantes à conserver telles quelles :

| Bloc i18n | Contenu |
|---|---|
| `license.enterprise_plus` / `license.data_platform` | `title`, `price`, `tag_vbr` (« VBR V12 & V13 » / « VBR V13 »), `tag_os` (« Windows uniquement » / « Windows & Linux ») |
| `tier.foundation` / `.advanced` / `.premium` | `title`, `audience` (avec `<b>` sur le type d'entreprise et la plage de workloads), `price` |
| `feature.*` | `backup_restore`, `vault_500`, `security_base`, `security_permissions`, `cyber_ai`, `orchestration` — chacune avec `label` + `tooltip` |

Composition des `features` par carte : inchangée, cf. `src/data/licenses.data.ts` (dont les `highlight: true` sur `security_permissions`/`cyber_ai`/`orchestration`).

**Prix par carte** : le bloc prix de la maquette est **conservé comme emplacement**, mais avec la copie actuelle — la clé `price` existe déjà sur chaque carte (`license.*.price`, `tier.*.price`), ex. « À partir de ██,██ € hors taxes/mois — par serveur, VM, base de données ou 500 Go de stockage ». Pas de mention TTC (« or XXX incl. VAT/month ») : elle n'existe pas dans le tunnel actuel. Tokens placeholder tant que le catalogue Agora n'est pas branché.

Pas de distinction de couleur ni de badge de catégorie entre paliers : **décision conservée** (cf. §14).

---

## 9. Étape ② — Serveur VBR & Vault

Trois blocs, séparés par `OdsDivider` :

1. **Serveur VBR** (repris de `VbrServerFields`) : nom du service, IP publique, toggle « Mon serveur est derrière un NAT », IP privée affichée conditionnellement.
2. **Vault** : carte à **checkbox cochée et non décochable**, badge/mention « Inclus » à droite, une ligne de description (« 500 Go de stockage d'objets S3 Vault, automatiquement provisionné par OVHcloud. »). Remplace `VaultInfoPanel` (replié/dépliable) → composant plus simple.
3. **Nom du Vault** : `OrderTextField`, seul champ obligatoire du bloc Vault, `hint` rappelant le caractère irréversible.

Titre replié : « Serveur VBR & Vault — <nom du service> ».

---

## 10. Étape ③ — Localisation

- Grille de cartes localisation (`RegionSelector` + `RegionCard`, `role="radiogroup"`), drapeau + nom + zone géographique, alimentée par `GET /location` (API v2, référentiel `location.Location[]`) via `useLocations` (`src/data/hooks/useLocations`). La 4ᵉ carte « Lorem - Lorem » de la maquette est un placeholder, à ignorer.
- **Progressive disclosure** : 3 cartes visibles par défaut, bouton « Voir plus (N) » / « Voir moins » pour déplier/replier le reste du référentiel. La localisation déjà sélectionnée reste visible même repliée.
- Libellé de carte composé côté front depuis l'API (`region.card_title` = `{{country}} – {{city}}`, drapeau dérivé de `countryCode`) — plus de clés i18n par région (`region.par/gra/rbx` supprimées).
- `/location` ne filtre pas sur la commandabilité produit (le champ `services` ne couvre que `OCC`/`PEERING`) : toutes les localisations renvoyées sont affichées, dans l'ordre de l'API. Le filtrage sur les régions réellement commandables pour un Vault Backup viendra du catalogue Agora (§15).
- **Aucune présélection** : `regionApiValue` démarre à `null` (le sous-titre annonce que le choix est définitif, une présélection arbitraire irait à l'encontre de ça). L'étape ③ est donc invalide jusqu'au clic explicite sur une carte.
- Pas de bouton `next` sur cette étape : le CTA de commande est dans le panneau récap.
- Titre replié : « Localisation — France – Paris » (composé via `useLocationLabel`, retombe sur le nom brut de la région tant que le référentiel n'est pas chargé).
- États chargement (`OdsSkeleton` × 3) et erreur (`OdsMessage` critique) gérés dans `RegionSelector`.

---

## 11. Panneau récapitulatif (aside sticky)

Structure d'après la maquette :

```
┌──────────────────────────────────────┐
│ <sur-titre univers — non tranché>    │  ← cf. §15
│ Backup Licenses                      │  ← produit, en gras
├──────────────────────────────────────┤
│ Type de licence  Veeam Data Platform │
│ Niveau                       Premium │
│ Stockage inclus              500 Gio │
│ Nom du Vault           À renseigner  │
│ Localisation          France – Paris │
├──────────────────────────────────────┤
│ Estimation mensuelle   ██,██ € HT/mois│
│     [ Finaliser ma commande → ]      │
└──────────────────────────────────────┘
```

**Contenu : celui de l'accordéon récap actuel, inchangé.** Les clés `summary.*` existent déjà et sont reprises telles quelles :
- lignes `summary.field.*` : `family` (« Type de licence »), `tier` (« Niveau »), `vault_included` (« Stockage inclus », valeur `summary.vault_included_value` = « 500 Gio »), `vault_name` (« Nom du Vault »), `region` (« Localisation ») ;
- placeholder `summary.empty` = « À renseigner » pour une valeur non encore saisie ;
- prix : `summary.price.label` = « Estimation mensuelle », `summary.price.value` = « ██,██ € HT/mois ».

**Pas de ligne « Total » annuelle** : la maquette affiche un Total en HT/an incohérent avec sa propre ligne Licence en HT/mois. On garde la formulation mensuelle unique du tunnel actuel. La clé `summary.edit` (« Modifier ») est réutilisée par les boutons `edit` des `StepComponent`.

- Lignes construites avec `OrderSummaryRow` (existant : `{ label, value, emptyLabel }`, `justify-between`, troncature, placeholder italique si vide).
- Conteneur : `OdsCard` dans `<aside className="sticky top-8 self-start">`. Classes sticky récupérables de `OrderFooter.component.tsx` (`sticky bottom-4 z-10 rounded-xl border … bg-[var(--ods-color-neutral-000)]`).
- **CTA « Finaliser ma commande »** : jamais désactivé. Un clic avec formulaire invalide déclenche `setSubmitAttempted(true)` (révèle les erreurs inline), rouvre l'étape fautive et scrolle/focus vers `firstInvalidField` — feedback actionnable plutôt qu'un bouton grisé silencieux. Comportement repris du tunnel actuel, étendu à la réouverture d'étape.

Le récap n'est plus un accordéon : il est **toujours déplié**, puisqu'il occupe une colonne dédiée et non le pied de page.

---

## 12. Domaine, state & données

**Types (`src/types/Order.type.ts`)** — conservés : `LicenseFamily`, `VdpTier`, `LicenseApiValue`, `LicenseFeatureItem`, `LicenseCardData`, `VdpTierCardData`, `ServerVaultFormState` (avec `vaultDisplayName`, `regionApiValue: string | null` = `location.name`). `VaultRegionData` est **supprimé** : remplacé par `Location` (`src/types/Location.type.ts`), qui reflète le modèle `location.Location` de l'API.

À faire évoluer :
- `OrderStepId` : passe de `LICENSE_TYPE | VDP_TIER | SERVER_VAULT` à **3 étapes fixes** `LICENSE | SERVER_VAULT | LOCATION`. Le niveau VDP n'est plus une étape.
- `LicenseCardData` / `VdpTierCardData` : **rien à ajouter pour le prix** — la clé `license.<i18nKey>.price` / `tier.<i18nKey>.price` se dérive de l'`i18nKey` déjà présent.

**Hook (`src/hooks/useOrderForm/useOrderForm.ts`)** — à refondre :
- **Supprimer** le pilotage de l'étape par l'URL (`useSearchParams`, `?step=`), `getSteps(family)`, `ORDER_STEPS_BY_FAMILY`, `goToStep`/`goNext`/`goBackStep`, `isFirstStep`/`isLastStep`.
- **Ajouter** l'orchestration `useStep` × 3 + les actions `submit`/`edit` par étape, avec la cascade de réinitialisation (§6).
- **Conserver** : validation par champ (`errors`, affichés si `touched` ou `submitAttempted`), `isServerVaultValid`, `firstInvalidField`, `resolvedLicenseApiValue`, `clearPersistedOrderState()`.
- **Conserver la persistance `sessionStorage`** (`orderFormStorage.ts`, clé `hpc-backup-licenses.order-funnel`) : `family`/`tier`/`form` sauvegardés et relus au montage. Portée session volontaire. `touched`/`submitAttempted` non persistés. À étendre : l'état d'avancement des 3 étapes doit être reconstruit au montage (une étape dont les données sont valides revient `checked` + `locked` + fermée).

**Données** : `licenses.data.ts` — **inchangé**. Le catalogue hardcodé (composition des features par carte, `recommended`, `apiValue`) est conservé tel quel. `regions.data.ts` (stub) est **supprimé** : les localisations viennent de `GET /location` (`src/data/api/locations/locations.requests.ts`), consommées via `useLocations` (`src/data/hooks/useLocations`).

---

## 13. Arborescence cible

```
src/pages/order/Order.page.tsx        # BaseLayout + 3 StepComponent + aside récap
src/components/order/
  LicenseStep/                        # ① 2 cartes + dévoilement conditionnel des 3 niveaux VDP
  LicenseTypeCard/                    # + bloc prix en pied de carte          (ADAPTER)
  VdpTierCard/                        # + bloc prix en pied de carte          (ADAPTER)
  FeatureList/ + RadioIndicator/      # partagés par les cartes               (INCHANGÉ)
  ServerVaultStep/                    # ② conteneur 3 blocs + OdsDivider      (ex VbrVaultStep)
  VbrServerFields/                    # nom, IP publique, NAT, IP privée      (INCHANGÉ)
  VaultIncludedCard/                  # carte cochée non décochable « Inclus » (NOUVEAU)
  OrderTextField/                     # champ + label + hint + erreur         (INCHANGÉ)
  LocationStep/                       # ③ conteneur                          (NOUVEAU, léger)
  RegionSelector/ + RegionCard/       # grille de cartes localisation, branchée sur /location (ADAPTER)
  OrderRecapPanel/                    # aside sticky + CTA                    (NOUVEAU)
    + OrderSummaryRow.component.tsx   # déplacé depuis OrderSummary/, code inchangé
src/hooks/
  useStep/                            # recopie de pci-workflow               (NOUVEAU)
  useOrderForm/                       # refondu (§12)
  useLocationLabel/                   # libellé « Pays – Ville » de la localisation choisie (NOUVEAU)
src/data/
  licenses.data.ts                                                            (INCHANGÉ)
  api/locations/locations.requests.ts # GET /location (v2)                    (NOUVEAU)
  hooks/useLocations/                 # react-query, staleTime Infinity       (NOUVEAU)
src/utils/
  isValidIp/ · orderAccent/                                                   (INCHANGÉ)
  locale/apiLanguage.ts               # locale manager → common.LanguageEnum  (NOUVEAU)
  locationLabel/locationLabel.ts      # libellé carte + emoji drapeau         (NOUVEAU)
```

**À supprimer** : `OrderStepper/` (remplacé par `StepComponent` MRC), `OrderFooter/` (CTA déplacé dans l'aside, retour porté par `BaseLayout`), `OrderSummary/` (l'accordéon + son spec sont remplacés par `OrderRecapPanel` ; `OrderSummaryRow.component.tsx` est **conservé et déplacé**), `VaultInfoPanel/`, `LicenseTypeStep/` et `VdpTierStep/` (fusionnés dans `LicenseStep`).

Convention (mémoire `react-coding-conventions`) : composants < 200 lignes, 1 composant par fichier, découpage list/item, utils externalisés, test colocalisé.

---

## 14. Décisions structurantes (rationale, pour ne pas les défaire par erreur)

- **Niveaux VDP dans la même étape, pas dans une étape dédiée.** Le nombre d'étapes reste 3 quelle que soit la licence : la numérotation du stepper ne bouge pas, et `StepComponent` reçoit un `order` fixe. Un choix de palier est un affinage du choix de famille, pas une décision de même rang.
- **Étape validée = repliée, pas grisée.** `pci-workflow` laisse l'étape ouverte et grisée ; ici la page contient 5 cartes de licence + 4 champs + une grille de régions, le repli est ce qui rend le stepper vertical utile.
- **Un seul CTA de commande** (panneau récap), contre deux dans la maquette. Deux boutons = deux états à synchroniser sans gain fonctionnel.
- **Prix affiché à deux endroits assumés** : par carte (aide à la comparaison au moment du choix) et dans le récap (estimation mensuelle). C'est un changement par rapport à l'ancienne règle « prix à un seul endroit », justifié par la maquette : ce ne sont pas les mêmes prix (unitaire vs estimation).
- **La maquette ne fait autorité que sur le layout ; le contenu vient du tunnel actuel** (cf. bloc d'en-tête). Les features détaillées, la mention TTC et le Total annuel de la maquette sont écartés. Ne pas les réintroduire sans arbitrage PO explicite.
- **Étape courante non reflétée dans l'URL** : `?step=` est abandonné avec le wizard. Conséquence acceptée : le bouton retour du navigateur quitte la page au lieu de reculer d'une étape. **La persistance `sessionStorage` est conservée précisément pour ça** — un rafraîchissement ou un aller-retour hors de la page restitue les choix et la saisie.
- **Cartes VDP sans distinction de couleur par palier** (pas de badge catégorie, pas de couleur différenciée) : chaque carte doit rester lisible **isolément**. Seuls le gras sur les faits clés et le badge « Recommandé » guident le choix.
- **Pas de warning visuel dédié sur le nom du Vault / la région** malgré leur caractère irréversible : l'info est portée par le `hint` du champ et le sous-titre de section — décision explicite de ne pas sur-signaler.
- **`GuideButton` malgré son `@deprecated`** : son remplaçant `GuideMenu` est dans muk → ods-react 19 → interdit ici.
- **Pas d'effet hover sur une carte déjà sélectionnée** (`LicenseTypeCard`, `VdpTierCard`, `RegionCard`) : le hover ne s'applique qu'à la branche `border-neutral-200` (non sélectionnée) ; l'état sélectionné (`SELECTED_CARD_CLASS`) ne porte aucune classe `hover:`. Évite un halo supplémentaire qui se cumulerait visuellement avec l'accent de sélection déjà affiché.
- **Aucune présélection de localisation** (contrairement à la présélection « recommandée » des étapes ① et ②) : le référentiel étant désormais dynamique et le choix explicitement définitif, présélectionner « la première région renvoyée par l'API » serait arbitraire.

---

## 15. Non figé / stubé (à ne pas trancher seul)

| Sujet | État | Action future |
|---|---|---|
| **Sur-titre du panneau récap** | « Bare Metal Cloud » sur la maquette, alors que l'app vit dans l'univers HPC. **Non tranché, décision reportée** | Trancher plus tard avec le PO. En attendant, ne pas figer la copie de ce sur-titre |
| **Submit Agora** | Stubé : `clearPersistedOrder()` + `navigate(stubRoutes.dashboard)`, aucun appel API | Brancher `createCart` (`@ovh-ux/manager-module-order`) une fois le contrat de cart figé |
| **Prix** | Tokens `██,██ €` en dur dans l'i18n | Câbler `GET /order/catalog/public/backupServices` (recherche par planCode) |
| **Localisations** | Référentiel géographique complet via `GET /location` (v2), **non filtré sur la commandabilité produit** — ce endpoint ne dit pas quelles régions acceptent un Vault Backup | Filtrer sur les régions réellement commandables une fois le catalogue Agora (`backupServices`) branché ; `/location` restera la source des libellés/drapeaux |
| **`vaultDisplayName`** | Nom de champ front, **non confirmé** côté API — et absent de la maquette | À valider avec le BE avant le branchement submit |
| **CGV** | Absente de la maquette comme du tunnel actuel | Décision PO en attente — si ajoutée : checkbox bloquant le CTA + lien en nouvel onglet |
| **Dashboard (ticket 1.1)** | Inexistant — `stubRoutes.dashboard` tombe sur le catch-all `*` | Une fois 1.1 livré : rediriger vers l'onglet « Linked servers », 1er VBR en `licenseStatus: CREATING`, polling (ticket 2.5) |
| **`CHANGELOG_LINKS`** | À créer dans le module | Modèle : `apps/hycu/src/constants.ts` l.17-23 (GitHub projects org ovh, projet 16) |

---

## 16. i18n

- Namespace `module-backup-licenses/order` (`BACKUP_LICENSES_NAMESPACES.ORDER`), fichier `public/translations/order/Messages_{lng}.json`.
- **8 locales** (`fr_FR`, `fr_CA`, `en_GB`, `de_DE`, `es_ES`, `it_IT`, `pl_PL`, `pt_PT`), structurellement alignées. `fr_CA` = copie stricte de `fr_FR`. **Traductions non-fr générées par IA, non relues par CDS.**
- L'app HPC ne déclare que `fr_FR` dans `availablesLocales` pour l'instant.
- Prix = tokens placeholder `██,██ €`. Convention : décimales à virgule + `€` après le nombre pour fr/de/es/it/pl/pt ; décimales à point + `€` avant pour en_GB.

**Le contenu existant est conservé** : `license.*`, `tier.*`, `feature.*`, `summary.*`, `field.*`, `nat.*`, `badge.*`, `vbr.*`, `vault.*`. Le travail i18n est donc **résiduel** — pas de réécriture de copie.

**Exception : `region.*`.** Les clés par région (`region.par.name/.zone`, `region.gra.*`, `region.rbx.*`) sont **supprimées** dans les 8 locales — les libellés viennent désormais de `GET /location` (nom de ville/pays/zone traduits par l'API via le paramètre `language`). Clés ajoutées à la place : `region.card_title` (format `{{country}} – {{city}}`), `region.show_more` (`{{total}}`), `region.show_less`. `region.section_title`/`.section_subtitle` inchangées.

**Mapping des clés existantes sur les 3 étapes** — les placeholders « Texte - optionnel » de la maquette sont déjà couverts :

| Étape | Titre | Sous-titre |
|---|---|---|
| ① Licence | `step.license_type.label` | `step.license_type.subtitle` |
| ① sous-bloc niveaux VDP | `step.vdp_tier.label` | `step.vdp_tier.subtitle` (devient l'intitulé du sous-bloc, plus d'une étape) |
| ② Serveur VBR & Vault | `step.server_vault.label` | — (blocs internes : `vbr.section_title`, `vault.section_title` + `vault.section_subtitle`) |
| ③ Localisation | `region.section_title` | `region.section_subtitle` |

- **Clés à supprimer** : `title` (« Configurer une licence Veeam », remplacé par le titre du `BaseLayout`), `step.go_to` (aria du stepper cliquable), `footer.*` (`cancel`, `back`, `order`, `continue`, `to_vdp`, `to_server_vault`), `vault_panel.*` (détail déplié de `VaultInfoPanel`).
- **Clés à ajouter** : les 3 titres repliés (« Licence — {{value}} », etc.), le label « Continuer » du bouton `next`, la description de la carte Vault « Inclus », le sur-titre du panneau récap.
- `summary.edit` (« Modifier ») est réutilisée par les boutons `edit` des étapes.

**Conventions de ton (à respecter pour tout nouveau texte)** :
- Erreurs de champ : formulation bienveillante orientée solution (« Il nous manque juste le nom de votre service. », pas « Veuillez saisir… »).
- Messages d'aide : cadrer en « ce qu'il reste à faire » plutôt qu'en obligation.
- Faits clés scannables en `<b>` via `<Trans i18nKey=… components={{ b: <b /> }} />` (pattern déjà utilisé dans `OnboardingHighlights`).

---

## 17. Tests

Convention (mémoire `react-coding-conventions`, règle 8) : **ne tester que les branches de rendu conditionnelles**, jamais l'affichage d'un texte statique. Tests colocalisés (`*.spec.ts(x)`).

À conserver : `isValidIp.spec.ts` (27 tests, inchangé).

À réécrire : `useOrderForm.spec.ts` — la suite actuelle (20 tests) teste massivement `getSteps`/`?step=`/`goNext`, qui disparaissent. Nouveaux cas à couvrir :
- dévoilement des cartes VDP selon la famille sélectionnée ;
- validation par champ + NAT conditionnel (à reprendre) ;
- **cascade « Modifier »** : rouvrir l'étape ① réinitialise ② et ③ ;
- reconstruction de l'état d'avancement depuis `sessionStorage` au montage.

À supprimer : `OrderSummary.component.spec.tsx` (composant supprimé). Les cas encore pertinents (rappel de l'offre, placeholder vide) migrent vers un spec de `OrderRecapPanel` si sa logique le justifie.

Composants sans branche conditionnelle notable : **pas de test dédié** — choix assumé, à réévaluer si une branche non triviale apparaît.

---

## 18. Reste à faire

- [x] Corriger `LABELS.BACKUP_LICENSES` (`'Backup Agent'` → `'Backup Licenses'`) — fait.
- [ ] Faire valider cette spec avant toute implémentation.
- [ ] Trancher le sur-titre du panneau récap plus tard (« Bare Metal Cloud » vs univers HPC, §15).
- [ ] Implémenter : `useStep`, refonte `useOrderForm`, `LicenseStep`, `ServerVaultStep`, `LocationStep`, `VaultIncludedCard`, `OrderRecapPanel`, `Order.page`.
- [ ] Supprimer les composants listés au §13 et nettoyer l'i18n (§16).
- [ ] Ajouter les quelques clés i18n manquantes en `fr_FR` puis propager aux 7 autres locales.
- [ ] Supprimer `BKP-1208-order-funnel.md` une fois la refonte livrée.
- [x] Brancher les régions dynamiques — fait via `GET /location` (reste : filtrer sur la commandabilité produit une fois Agora branché, §15).
- [ ] Brancher le submit réel (`createCart`) et les prix dynamiques.
- [ ] Confirmer `vaultDisplayName` avec le BE.
- [ ] Relecture CDS des 7 traductions non-fr.
