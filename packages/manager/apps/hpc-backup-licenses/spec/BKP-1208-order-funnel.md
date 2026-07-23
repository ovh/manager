# BKP-1208 — Tunnel de commande (Backup Licences)

Jira: https://jira.ovhcloud.tools/browse/BKP-1208 (Epic BKP-1161, parent de BKP-1240)
Confluence: https://confluence.ovhcloud.tools/display/BCK/04+-+New+Veeam+Enterprise+Agora
Assets ticket (XML JIRA + maquette IA HTML) : `/home/mseme/Documents/Backup licences/Tickets/1208/`

> Ce document décrit l'état **actuel** de la fonctionnalité (référence), pas son historique de construction. Pour le contexte produit de l'onboarding qui précède ce tunnel, voir `BKP-1206-onboarding-page.md`.

Branche `feat/1208-order-tunnel`. État : wizard implémenté et fonctionnel de bout en bout, submit vers Agora encore stubé.

---

## 1. Objectif & périmètre

Ce tunnel sert **exclusivement à associer une licence Veeam à un serveur VBR (Veeam Backup & Replication) et à provisionner son Vault** (stockage S3 de destination). C'est un espace de **gestion de licences**, pas un espace de protection de données.

**Important — ce que ce tunnel ne fait PAS** : il n'existe aucune notion de « quel workload / quelle VM est protégée ». Le VBR est le moteur de sauvegarde ; le choix des éléments à sauvegarder se fait *après*, dans la console Veeam elle-même (création des jobs de sauvegarde), hors du périmètre de cet outil. Ne pas concevoir de copie ou d'écran qui laisserait croire qu'à la sortie du tunnel « quelque chose est protégé » — seul le socle (licence + Vault) est en place.

Le cycle produit complet (au-delà de ce ticket) : **liste des serveurs VBR** (une ligne = un serveur + sa licence) → CTA « Ajouter un serveur » → **ce tunnel** → retour à la liste. La liste elle-même (ticket 1.1, `stubRoutes.dashboard`) n'existe pas encore.

---

## 2. Emplacement du code

**Toute la logique vit dans le module partagé `packages/manager/modules/backup-licenses` (`@ovh-ux/backup-licenses`).** L'app `packages/manager/apps/hpc-backup-licenses` n'est qu'une **coquille** qui monte les routes du module (`src/routes/Routes.tsx`, `{BackupLicensesRoutes}` splicé sous `MainLayoutPage`, catch-all `*` → 404 app).

Raison : un **2ᵉ module** sera accueilli plus tard par la même app coquille — aucune logique métier ne doit donc y être ajoutée. Seule la spec (ce fichier) vit côté app, dans `spec/`.

---

## 3. Stack & contraintes techniques

- **ODS `@ovhcloud/ods-components` v18** (web components wrappés React, préfixe `Ods*`, import `@ovhcloud/ods-components/react`). **Ne PAS importer `@ovhcloud/ods-react`** : cette lib alternative (API pure React, Tile/FormField/RadioGroup...) est hoistée en racine mais **non déclarée** dans le `package.json` du module → dépendance fantôme + risque de mismatch React 18/19 (cf. mémoire `build-failures-types-react-v19-mismatch`).
- Composants v18 utilisés : `OdsButton`, `OdsInput` (via `OrderTextField`), `OdsToggle`, `OdsBadge`, `OdsDivider`, `OdsIcon`, `OdsMessage`, `OdsText`.
- Pas de `Stepper` ni de carte sélectionnable réutilisable dans ODS/MRC v18 → composants maison (`OrderStepper`, cartes `LicenseTypeCard`/`VdpTierCard`/`RegionCard`).
- Formulaire géré en **state React simple** + validation externalisée (`isValidIp`) — pas de react-hook-form/zod (form de 4 champs, pas de nouvelle dépendance).
- **Échelle d'espacement Tailwind non standard** : `@ovh-ux/manager-tailwind-config` (preset partagé, consommé via `tailwind.config.mjs` de l'app) **redéfinit tout `theme.spacing`** (`8`=1.5rem, `9`=2rem, `10`=2.5rem, `11`=3rem — pas les valeurs Tailwind par défaut). Vérifier ce fichier avant de choisir une classe `gap-*`/`p-*`/`m-*`.
- Design tokens ODS exposés en **variables CSS**, consommées en valeurs arbitraires Tailwind : `text-[var(--ods-color-primary-500)]`, etc. Familles disponibles : `primary`, `success`, `critical`, `information`, `warning`, `neutral` (shades `-000`…`-900`).
- **Règle couleur : pas de violet, tout accent de sélection/mise en avant = `primary`** (violet absent d'ODS). Checks par défaut / étape validée / badges « inclus » = `success`. Erreurs = `critical`. Classes centralisées dans `src/utils/orderAccent/orderAccent.ts`.
- **Cart Agora** : référence = `createCart` de `@ovh-ux/manager-module-order` (`modules/order/src/api/cart.ts`). Contrat API (planCodes, structure du cart) **non figé** → submit stubé (voir §10).

---

## 4. Routing

- `subRoutes.order = 'order'`, `routeUrls.order = '/order'` (`src/routes/routes.constants.ts`).
- `<Route path={subRoutes.order} Component={OrderPage} handle={{ tracking: { pageType: PageType.funnel } }} />` (`src/routes/routes.tsx`), monté sous `/` par l'app coquille → URL finale `/order`.
- CTA de l'onboarding : `navigate(routeUrls.order)`.
- `stubRoutes.dashboard = '/dashboard'` : route réelle inexistante (ticket 1.1) — tombe sur le catch-all `*` de l'app coquille. Acceptable tant que 1.1 n'existe pas.

---

## 5. Domaine (`src/types/Order.type.ts`)

- `LicenseFamily` : `ENTERPRISE_PLUS` | `DATA_PLATFORM`.
- `VdpTier` : `FOUNDATION` | `ADVANCED` | `PREMIUM` (uniquement si `DATA_PLATFORM`).
- `LicenseApiValue` : valeur d'enum envoyée à l'API (`licenseType`) — **non figée**, issue du ticket, à confirmer BE.
- `OrderStepId` : `LICENSE_TYPE` | `VDP_TIER` | `SERVER_VAULT`.
- `LicenseFeatureItem` : `{ key: string; highlight?: boolean }` — `highlight` = feature mise en avant (accent `primary` + gras) vs check `success` par défaut.
- `LicenseCardData` / `VdpTierCardData` : cartes des étapes 1/2, avec `apiValue`, `recommended`, `features`.
- `VaultRegionData` : `{ apiValue, flag, i18nKey }`.
- `ServerVaultFormState` : `{ displayName, backupServerExternalIp, isBehindNat, backupServerPrivateIp, vaultDisplayName, regionApiValue }`.

---

## 6. State & navigation (`src/hooks/useOrderForm/useOrderForm.ts`)

- **L'étape courante est pilotée par l'URL** (`?step=license-type|vdp-tier|server-vault`, via `useSearchParams`) : le bouton précédent du navigateur revient à l'étape précédente au lieu de quitter le funnel. `goToStep`/`goNext`/`goBackStep` font un `push` (nouvelle entrée d'historique par étape).
- **Persistance sessionStorage** (`src/hooks/useOrderForm/orderFormStorage.ts`, clé `hpc-backup-licenses.order-funnel`) : `family`/`tier`/`form` sont sauvegardés à chaque changement et relus au montage, pour survivre à un refresh ou un aller-retour hors du funnel (démontage de `OrderPage`). Portée **session** volontaire (pas de `localStorage`). État de validation UI (`touched`, `submitAttempted`) **non persisté**. `clearPersistedOrderState()` est appelé au submit réussi.
- **Présélection par défaut** : la famille et le tier marqués `recommended: true` dans `licenses.data.ts` sont présélectionnés à l'arrivée (`DEFAULT_FAMILY`/`DEFAULT_TIER`), sauf reprise d'un état persisté. Le bouton primaire des étapes 1/2 est donc actif dès l'arrivée si rien n'a été explicitement changé.
- `getSteps(family)` calcule l'ordre effectif des étapes : `ENTERPRISE_PLUS` → `[LICENSE_TYPE, SERVER_VAULT]` (saute VDP) ; `DATA_PLATFORM` → `[LICENSE_TYPE, VDP_TIER, SERVER_VAULT]` ; `null` → `[LICENSE_TYPE]`.
- Validation : `errors` (par champ, affichée seulement si `touched` ou `submitAttempted`), `isServerVaultValid`, `isCurrentStepValid`, `canSubmit`, et `firstInvalidField` (premier champ bloquant dans l'ordre d'affichage, **indépendant** de touched/submitAttempted — sert au scroll-to-error, cf. §7).
- `resolvedLicenseApiValue` : résout l'enum API final à partir de `family`(+`tier` si VDP).

---

## 7. Flux du wizard & footer

**Stepper** (`OrderStepper`) : dots `done`(vert, coche)/`active`(bleu, numéro)/`idle`(gris). **Cliquable pour revenir à une étape déjà franchie** (`onStepSelect`, uniquement `index < currentIndex` — sauter en avant est bloqué pour ne pas court-circuiter la validation).

**Footer** (`OrderFooter`) — un seul composant pour toutes les étapes :
| Étape | Bouton gauche | Bouton primaire |
|---|---|---|
| 1 (License Type) | « Annuler » → onboarding | « Continuer »/« Serveur & Vault → » (ent)/« Choisir le niveau VDP → » (vdp), désactivé si `!isCurrentStepValid` |
| 2 (VDP Tier) | « ← Retour » → étape 1 | « Serveur & Vault → », désactivé si aucun tier |
| 3 (Server & Vault, dernière) | « ← Retour » → étape précédente | « Commander » |

**Sur la dernière étape, le bouton « Commander » n'est jamais désactivé.** Un clic avec formulaire invalide déclenche `setSubmitAttempted(true)` (révèle les erreurs inline) puis un scroll+focus vers `firstInvalidField` (mapping id DOM dans `Order.page.tsx::FIELD_ELEMENT_IDS`) — feedback actionnable plutôt qu'un bouton grisé silencieux.

Le footer est **sticky** (`bottom-4`, carte flottante bordée) uniquement sur la dernière étape, et affiche le **prix estimé** (`priceLabel`/`priceValue`) à gauche du bouton — seul endroit où le prix est affiché (pas de doublon dans le récapitulatif, voir §8).

---

## 8. Arborescence des composants (état actuel)

```
src/pages/order/Order.page.tsx        # orchestrateur : state du form (useOrderForm) + étape courante + footer
                                       # pas encore de Order.page.spec.tsx
src/components/order/
  OrderStepper/                       # dots done/active/idle, cliquable en retour arrière
  LicenseTypeStep/ + LicenseTypeCard/ # étape 1 : 2 cartes (Enterprise Plus / Data Platform)
  VdpTierStep/ + VdpTierCard/         # étape 2 : 3 cartes (Foundation/Advanced/Premium), audience avec <b> (Trans)
  FeatureList/ + RadioIndicator/      # partagés par les cartes de licence/tier
  VbrVaultStep/                       # étape 3 : conteneur, 3 sections séparées par OdsDivider, gap-9 inter-section / gap-6 intra
  VbrServerFields/                    # section 1 : nom service, IP publique, toggle NAT, IP privée conditionnelle
  VaultInfoPanel/                     # section 2a : encart Vault, REPLIÉ par défaut (gris neutre + résumé),
                                       # détail (métriques + atouts) déplié à la demande — cf. §11 pour le rationale
  OrderTextField/                     # champ texte + label + hint + erreur, réutilisé partout
  RegionSelector/ + RegionCard/       # section 3 : grille de cartes région (radiogroup)
  OrderSummary/ + OrderSummaryRow/    # récap en accordéon, replié, en pied de la dernière étape
                                       # a un .spec.tsx (6 tests)
  OrderFooter/                        # boutons gauche/primaire + prix (dernière étape) + mode sticky
src/data/
  licenses.data.ts                    # cartes étape 1/2 hardcodées (titres/features/enums via i18n)
  regions.data.ts                     # 3 régions FR hardcodées (stub Agora)
src/utils/
  isValidIp/                          # validation IPv4/IPv6 (27 tests)
  orderAccent/                        # classes Tailwind centralisées (accent primary/success)
src/hooks/useOrderForm/
  useOrderForm.ts                     # cf. §6 (20 tests)
  orderFormStorage.ts                 # persistance sessionStorage (pas de spec dédié actuellement)
```

Composants **sans** feature/effet notable **n'ont pas de test dédié** (convention rule 8, §12) : `OrderStepper`, `LicenseTypeCard`, `VdpTierCard`, `FeatureList`, `RadioIndicator`, `RegionSelector`, `RegionCard`, `VaultInfoPanel`, `OrderFooter`, `VbrServerFields`, `VbrVaultStep`, `OrderTextField`. Ce n'est pas un oubli mais un choix — à réévaluer seulement si une branche conditionnelle non triviale y apparaît.

---

## 9. i18n

- Namespace `module-backup-licenses/order` (`BACKUP_LICENSES_NAMESPACES.ORDER`), fichier `public/translations/order/Messages_{lng}.json`.
- **8 locales présentes** (`fr_FR`, `fr_CA`, `en_GB`, `de_DE`, `es_ES`, `it_IT`, `pl_PL`, `pt_PT`), alignées structurellement sur `onboarding` — mêmes 102 clés dans chaque fichier. `fr_CA` = copie stricte de `fr_FR` (convention déjà en place côté onboarding). **Traductions non-fr générées par IA, pas encore relues par CDS** — à faire relire avant toute mise en prod, comme pour l'onboarding.
- L'app HPC ne déclare pour l'instant que `fr_FR` dans `availablesLocales` (indépendant de la présence des fichiers) — les autres locales sont prêtes mais pas encore activées côté runtime.
- Prix = tokens placeholder `██,██ €` (catalogue Agora non branché). Convention par locale : décimales à virgule + `€` après le nombre pour fr/de/es/it/pl/pt (`██,██ €`) ; décimales à point + `€` avant le nombre pour en_GB (`€██.██`), cohérent avec le style déjà utilisé dans `onboarding`.

**Conventions de ton établies** (à respecter pour tout nouveau texte) :
- Erreurs de champ : formulation bienveillante orientée solution, pas impérative (« Il nous manque juste le nom de votre service. », pas « Veuillez saisir... »).
- `disabled_hint`/messages d'aide : cadrer en « ce qu'il reste à faire » plutôt qu'en obligation.
- Faits clés scannables (type d'entreprise cible, plage de workloads dans `tier.*.audience`) mis en `<b>` via `<Trans i18nKey=... components={{ b: <b /> }} />` — pattern déjà utilisé dans `OnboardingHighlights`.
- Ne pas dupliquer une information déjà affichée ailleurs sur la même étape (ex. prix : uniquement dans le footer, pas dans l'en-tête du récapitulatif).

---

## 10. Non figé / stubé (à ne pas trancher seul, à confirmer PO/BE)

| Sujet | État actuel | Action future |
|---|---|---|
| **Submit Agora** | `Order.page.tsx::handlePrimary` → `clearPersistedOrder()` puis `navigate(stubRoutes.dashboard)`. Aucun appel API. | Brancher `createCart` (`@ovh-ux/manager-module-order`) une fois le contrat de cart figé. |
| **Prix** | Tokens `██,██ €` en dur dans l'i18n. | Câbler `GET /order/catalog/public/backupServices` (recherche par planCode) une fois l'API figée. |
| **Régions** | 3 régions FR hardcodées (`regions.data.ts`) : Paris/Gravelines/Roubaix. | Remplacer par un chargement dynamique du catalogue Agora. |
| **`vaultDisplayName`** | Nom de champ utilisé côté front, **non confirmé** côté API. | À valider avec le BE avant le branchement submit. |
| **CGV** | **Absente du tunnel** (pas de checkbox, pas de lien). | Décision PO en attente — si ajoutée, prévoir une checkbox bloquant « Commander » + lien vers le doc en nouvel onglet. |
| **Dashboard (ticket 1.1)** | N'existe pas — `stubRoutes.dashboard` tombe sur le catch-all `*` de l'app. | Une fois 1.1 livré : rediriger vers l'onglet « Linked servers », 1er VBR en `licenseStatus: CREATING`, polling (ticket 2.5). |

---

## 11. Décisions structurantes (rationale, pour ne pas les défaire par erreur)

- **Encart Vault (`VaultInfoPanel`) replié par défaut, dégradé en gris neutre.** Sur une étape de configuration, l'attention doit aller aux champs à saisir (notamment le seul champ obligatoire de la section, « Nom du Vault »), pas à un rappel d'offre déjà vu aux étapes 1/2. Le détail (3 métriques + grille 2×2 d'atouts) reste accessible à la demande.
- **Prix affiché à un seul endroit** (footer, dernière étape) — pas dans l'en-tête du récapitulatif, pour éviter la redondance et alléger l'écran final.
- **Rythme d'espacement de `VbrVaultStep`** : `gap-9` entre les 3 sections (Serveur / Vault / Localisation), `gap-6` à l'intérieur de chaque section, + un `OdsDivider` entre chaque section (les 3, symétriquement). Le contraste de proximité signale les regroupements ; un espacement plat + séparateurs asymétriques donnait une impression de page non structurée.
- **Pas de warning visuel dédié (encart coloré) sur le nom du Vault / la région**, malgré leur caractère irréversible : l'info est portée par le `hint` du champ (Vault) et le `section_subtitle` (région) — décision explicite de ne pas sur-signaler.
- **Cartes VDP sans distinction de couleur par palier** (pas de badge « catégorie » Foundation/Advanced/Premium, pas de couleur différenciée) : chaque carte doit rester lisible **isolément**, sans obliger à comparer aux autres. Seuls le gras sur workloads/audience et le badge « Recommandé » guident le choix.
- **Texte « chargement dynamique depuis Agora » retiré de `RegionSelector`** : détail d'implémentation non pertinent pour l'utilisateur final.

---

## 12. Tests

Convention (mémoire `react-coding-conventions`, règle 8) : **ne tester que les branches de rendu conditionnelles**, jamais l'affichage d'un texte/élément statique non conditionnel. Tests colocalisés (`*.spec.ts(x)`), pas de dossier `__tests__/`.

Couverture actuelle liée au funnel :
- `useOrderForm.spec.ts` (20 tests) : steps selon famille, validation, NAT conditionnel, persistance.
- `isValidIp.spec.ts` (27 tests) : IPv4/IPv6.
- `OrderSummary.component.spec.tsx` (6 tests) : accordéon replié, rappel offre + Vault/région, placeholder vide, edit → étape licence.

Pas de test au niveau `Order.page.tsx` (orchestrateur) à ce jour — à envisager si sa logique de scroll-to-error / libellés dynamiques grossit.

Total module (toutes features confondues, onboarding inclus) : 73 tests / 11 fichiers passants.

---

## 13. Reste à faire (backlog réel, non un historique)

- [ ] Trancher CGV avec le PO (§10).
- [ ] Câbler prix + régions dynamiques (§10) une fois le catalogue Agora figé.
- [ ] Confirmer `vaultDisplayName` avec le BE.
- [ ] Brancher le submit réel (`createCart`) — actuellement stubé.
- [ ] Rediriger vers le vrai dashboard une fois le ticket 1.1 livré.
- [ ] Relecture CDS des 7 traductions non-fr du namespace `order` (générées par IA, structure/clés validées mais contenu non relu par un traducteur professionnel).
- [ ] Activer les locales non-fr dans `availablesLocales` (app HPC) une fois la relecture CDS faite.
- [ ] Test `Order.page.tsx` si sa complexité augmente.
