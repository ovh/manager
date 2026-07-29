# BKP-1206 — Onboarding page (Backup Licenses product introduction)

Jira: https://jira.ovhcloud.tools/browse/BKP-1206 (Epic BKP-1161)
Assets ticket (maquette + wireframe): `/home/mseme/Documents/Backup licences/Tickets/1206/`

**État: implémentation faite (module + coquille HPC). Jamais buildé/lint/testé pour de vrai — cf.
"Build/install" plus bas avant de lancer quoi que ce soit.**

## Architecture

Le contenu onboarding vit dans un **module partagé**, pas dans l'app (à l'inverse du pattern
`@ovh-ux/backup-agent`, où l'onboarding est dupliqué par app et seul le dashboard post-souscription est
mutualisé — ici c'est l'inverse car ce même onboarding doit être consommé par 2 apps coquilles, HPC et
Bare Metal à venir).

- **Module** `packages/manager/modules/backup-licenses` (`@ovh-ux/backup-licenses`) — contient toute la
  logique (détection, redirection, page, i18n). `src/lib.ts` exporte `BackupLicensesRoutes` +
  `BACKUP_LICENSES_NAMESPACES`.
- **App** `packages/manager/apps/hpc-backup-licenses` — coquille : `src/routes/Routes.tsx` importe
  `{ BackupLicensesRoutes }` depuis le module et le splice dans son propre `<Route path={urls.root}>`
  (même mécanisme que `hpc-backup-agent-iaas` avec `@ovh-ux/backup-agent`).
- Racine du repo : `package.json` → `workspaces.packages` doit contenir
  `"packages/manager/modules/backup-licenses"` pour que le module soit résolu (vérifier que l'entrée est
  toujours là avant de builder — le fichier a été retouché depuis, cf. "Build/install").

### Fichiers clés du module

| Fichier | Rôle |
|---|---|
| `src/pages/onboarding/OnboardingGuard.page.tsx` | Point d'entrée de la route `onboarding`. Appelle le hook de détection ; loading → `OdsSpinner`, actif → `<Navigate to={stubRoutes.dashboard}>`, sinon → `Onboarding.page` |
| `src/pages/onboarding/Onboarding.page.tsx` | Contenu réel : `OnboardingLayout` + `OnboardingDescription` + `OnboardingHighlights` + 1 `Card` tutoriel + CTA `useNavigate(stubRoutes.orderFunnel)` |
| `src/hooks/useHasActiveBackupLicensesSubscription/checkHasActiveBackupLicensesSubscription.ts` | Logique pure de détection (testable sans React) |
| `src/data/api/tenants/tenants.requests.ts` | Appels `fetchIcebergV2` vers `/backupServices/tenant` et `.../vspc` |
| `src/utils/hasBackupLicensesAddon/hasBackupLicensesAddon.ts` | Prédicat `vspcType === 'ADVANCED' && enabledAddons.includes('BACKUP_LICENSES')` |
| `src/routes/routes.constants.ts` | `stubRoutes.orderFunnel`/`stubRoutes.dashboard` — routes stub, TODO explicite |
| `src/module.constants.ts` | Namespace i18n `module-backup-licenses/onboarding`, `TUTORIAL_DOC_URL` (placeholder) |

Chaque fichier de `hooks/`, `utils/`, `components/`, `pages/` a son test colocalisé au même endroit
(convention du projet : sous-dossier par unité, pas de `__tests__/`).

## Détection & routes — logique

1. `GET /backupServices/tenant/` → ids de tenant. 404 ou liste vide → pas d'abonnement.
2. Pour chaque tenant : `GET /backupServices/tenant/{id}/vspc`, on cherche une entrée avec
   `vspcType === "ADVANCED"` et `enabledAddons` contenant `"BACKUP_LICENSES"`.
3. Abonnement actif trouvé → `<Navigate to={stubRoutes.dashboard}>` (route pas encore réelle, ticket 1.1).
4. Sinon → page onboarding, CTA "Commander" → `navigate(stubRoutes.orderFunnel)` (route pas encore réelle,
   ticket 0.2). Les deux routes sont des chaînes en dur (`/dashboard`, `/order`) qui tombent sur le `*`
   NotFound de l'app tant que 0.2/1.1 n'existent pas — c'est voulu, pas un bug.

**Contrat API non confirmé** : le ticket JIRA lui-même a un commentaire "Check with Sreekanth if endpoint
is good" sur `vspcType`/`enabledAddons`. J'ai supposé ces champs nichés sous `currentState` (comme le reste
de la resource VSPC déjà utilisée par `@ovh-ux/backup-agent`). Si la détection ne marche jamais en vrai,
**c'est le premier endroit à vérifier** (`src/types/VspcTenant.type.ts` + `hasBackupLicensesAddon.ts`).

## Contenu de la page (texte source de vérité : wireframe du 16/07)

Titre H1 "Veeam Enterprise", sous-titre + corps + 3 lignes ("500 Go inclus...", "À partir de 10€/mois...",
"Compatible VMware..."), CTA "Commander", 1 card tutoriel Veeam Backup & Replication. Traductions dans
`public/translations/onboarding/Messages_*.json` (8 locales, clé racine `title`/`subtitle`/`description`/
`highlights.*`/`order_cta`/`tutorial_card.*`).

## Points d'attention pour debug

- **Package manager ambigu** : `packageManager: yarn@1.22.22` + `workspaces` classique déclarés, mais les
  `node_modules` déjà installés (ex. `hpc-backup-agent-iaas`) ont des stores `.pnpm` (dépendances tierces)
  avec liens directs vers les packages `@ovh-ux/*` internes (workspace linking). Pas de `pnpm-lock.yaml`/
  `pnpm-workspace.yaml` visible à la racine. `pm:build:ci` appelle `manager-pm --type pnpm --action buildCI`
  (`packages/manager-tools/manager-pm`) qui doit générer un workspace pnpm à la volée
  (`manager-pm-prepare-workspace.js`). → si le module ne se résout pas, regarder ce tool avant de supposer
  un yarn/pnpm classique cassé.
- **Chemin de copie i18n non vérifié empiriquement** : `vite.config.mjs` de l'app copie
  `<module>/dist/public/**/*` → `translations/module-backup-licenses/` via `vite-plugin-static-copy`
  (copié à l'identique du mécanisme `hpc-backup-agent-iaas`/`@ovh-ux/backup-agent`). Si les textes
  s'affichent en clé brute (`module-backup-licenses/onboarding:title`) au lieu du texte, regarder d'abord
  ici — la structure exacte des dossiers copiés vs celle attendue par le `loadPath` i18next
  (`translations/${namespace}/Messages_${lang}.json` dans `src/i18n.ts` de l'app) n'a pas pu être confirmée
  sans lancer un vrai build.
- **Highlights groupés avant le CTA, pas interleavés comme le wireframe** : `OnboardingLayout` n'a qu'un
  seul slot `description` avant le bouton (pas de slot entre bouton et cards) — les 3 lignes sont donc
  toutes dans ce slot plutôt que réparties avant/après le bouton comme sur le wireframe.
- **Pricing "10€/mois" non localisé par devise** : l'app déclare les régions `CA`/`EU`/`US`, mais un seul
  prix en euros est géré, pas de logique de devise par région.
- **Nav toujours derrière un flag commenté** : `hpc-backup-licenses` (CFF) est commenté avec
  `// TODO: décommenter après test visuel` dans
  `packages/manager/apps/container/src/container/nav-reshuffle/sidebar/navigation-tree/services/hostedPrivateCloud.ts`
  et `.../legacy/server-sidebar/universe/HostedPrivateCloudSidebar.tsx`. Rien ne s'affichera dans le vrai
  nav jusqu'à ce que ce flag soit décommenté.

## Build/install — à faire avant de continuer

- [ ] Enregistrer le module dans le workspace racine : `packages/manager/modules/backup-licenses` n'est
      actuellement **pas** listé dans `workspaces.packages` du `package.json` racine, donc pas résolu. Ne
      pas ré-éditer ce fichier à la main — utiliser le script officiel `yarn pm:add:module`
      (`packages/manager-tools/manager-pm/src/manager-pm-add-module.js`), qui fait probablement plus que
      l'ajout de la ligne (catalog, etc.).

## Reste à faire (hors bugs de build)

- [ ] Routes réelles du funnel de commande (ticket 0.2) et du dashboard (ticket 1.1) → remplacer les stubs
      dans `src/routes/routes.constants.ts`.
- [ ] Relecture humaine/CDS des traductions de/es/it/pl/pt (écrites par moi, pas un traducteur pro).
- [ ] Coquille Bare Metal (`bmc-backup-licenses` ?) + sa nav — hors scope de cette session, le module est
      déjà prêt à être réutilisé sans changement pour ça.
- [ ] Décommenter le flag CFF `hpc-backup-licenses` dans les 2 fichiers de nav une fois le rendu validé.
- [ ] Utiliser un appel API pour aller chercher la licence la moins chère pour remplacer le prix de 10€/mois
