# BKP-1218 — Onglet « Linked servers » : édition d'un serveur VBR

Jira: https://jira.ovhcloud.tools/browse/BKP-1218 (2.3, Epic BKP-1161)

> **Ce document décrit la cible livrée**, pas un historique — sauf le §2, qui explique
> pourquoi elle diffère de la première version envoyée en revue.

Branche `feat/1218-update-vbr-server-v2`, basée directement sur `project/backup-licenses` : la
branche `feat/1218-update-vbr-server` d'origine avait divergé d'une ancienne référence du tunnel
de commande, réécrite depuis, d'où la reconstruction plutôt qu'un rebase conflictuel.

**Indépendante de BKP-1219 (suppression)**, qui vit dans sa propre PR : une première itération de
cette branche avait été construite par-dessus `feat/1219-delete-vbr-server` (mêmes conventions de
routing/tests, cf. §3), mais a été **rebasée pour retirer ce commit** — les deux tickets doivent
pouvoir être revus/mergés indépendamment. Le code d'édition ne dépend donc plus, à l'exécution, du
code de suppression : `useEditBackupServer` et son composant de page s'inspirent de son design
(cascade de résolution des ids, gestion d'erreur dans la page plutôt qu'en toast) sans en
importer quoi que ce soit. `getBackupServerRoute` (route de ressource unique, utile aux deux
mutations) est donc dupliquée ici plutôt que partagée tant que #1219 n'est pas mergée.
État : **implémenté** (tests + `tsc` + lint propres), revue visuelle restante (§11).

---

## 1. Objectif & périmètre

Le client modifie les propriétés d'un serveur VBR déjà enregistré : nom, type de licence
(upgrade/downgrade), IP publique, IP privée. **Un changement de licence est différé** : la
demande est enregistrée immédiatement, mais la licence effective ne change qu'au 1er du mois
suivant — le nom et les IP, eux, sont appliqués immédiatement. Même asymétrie synchrone/
asynchrone que 1219 (suppression), côté « mise à jour » plutôt que « suppression ».

**Dans le périmètre :**

1. Entrée « Modifier » du menu ⋮ rendue **fonctionnelle** (jusqu'ici `isDisabled: true`, posée
   par 1216).
2. Page d'édition pré-remplie avec les valeurs courantes du serveur : nom, type de licence,
   IP publique, IP privée (4 champs, tous en édition — pas de champs en lecture seule).
3. Message d'info sous le sélecteur de licence, affiché uniquement si la sélection diffère de
   la licence **actuellement installée**, annonçant l'effet différé au 1er du mois.
4. Appel `PUT …/backupLicenses/backupServer/{backupServerId}` avec le corps complet — première
   mutation livrée sur cette branche ; conçue sur le modèle de `useDeleteBackupServer` de
   BKP-1219 (PR indépendante, cf. §2), sans en dépendre au runtime.
5. Badge de changement de licence programmé sur la ligne du tableau — déjà livré par 1216
   (transition `Premium → Advanced` dans la colonne « Licence », pilotée par
   `currentState.licenseTypeRequested`), réutilisé tel quel (§9).
6. Post-submit : bouton désactivé pendant l'appel, succès → retour à la liste + toast, erreur →
   message **dans le panneau récap**, la page reste ouverte.

**Hors périmètre :** le bouton « Ajouter un serveur » (2.2) n'est pas touché. L'entrée
« Supprimer » (2.4) reste inerte sur cette branche — elle est livrée indépendamment par
BKP-1219 (§2), les deux PR se recombinent au merge dans `project/backup-licenses`.

---

## 2. Pivot de conception : modale → page pleine (stepper du tunnel de commande)

**Une première itération de ce ticket a été implémentée comme une modale** (`Modal` de MRC),
strictement sur le modèle de la suppression (BKP-1219) : cartes de licence en 1 colonne à cause
de la largeur d'`OdsModal` codée en dur à 512px, récap « avant → après » dans la modale. Cette
version a été **corrigée en cours de revue** : le produit veut une **page pleine avec le stepper
vertical du tunnel de commande** (`Order.page.tsx`, BKP-1208), pas une modale, pour rester
cohérent avec le reste du parcours (l'édition d'un serveur n'est pas une action ponctuelle et
destructive comme la suppression, c'est un mini-tunnel).

**Décision retenue : réutilisation directe de la structure du tunnel de commande.**

| Élément | Tunnel de commande (BKP-1208) | Édition (BKP-1218) |
|---|---|---|
| Conteneur | `BaseLayout` + `StepComponent` (MRC) | **Identique**, réutilisé tel quel |
| Nombre d'étapes | 3 (Licence / Serveur VBR & Vault / Localisation) | **2** (Licence / Serveur VBR) — pas de Vault ni de Localisation, non éditables ici |
| Sélecteur de licence | `LicenseStep` (2 cartes + dévoilement des 3 niveaux VDP) | **`LicenseStep` réutilisé tel quel**, enveloppé par `EditLicenseStep` qui ajoute le message d'effet différé |
| Champs serveur | `VbrServerFields` (nom, IP publique, toggle NAT, IP privée conditionnelle) | **Nouveau composant léger** `EditServerFieldsStep` : nom + IP publique + IP privée, toutes visibles (pas de toggle NAT, pas de bloc Vault — hors périmètre du ticket) |
| Panneau récap | `OrderRecapPanel` (aside sticky, `OdsCard` + `OrderSummaryRow`) | **`EditRecapPanel`**, sur le même modèle + le récap « avant → après » (`EditChangesRecap`) et le message d'erreur (le tunnel de commande ne fait pas encore d'appel réel, l'édition si) |
| Route | Page pleine, sœur de `onboarding` | **Page pleine, sœur de `order`** — pas une modale enfant de `linked-servers` comme la suppression (BKP-1219) |
| Cascade « Modifier » | Rouvrir une étape réinitialise les étapes suivantes (licence → niveaux VDP dépendants) | **Pas de cascade** : les 2 étapes portent des domaines indépendants (licence vs nom/IP), rouvrir l'une ne remet pas en cause l'autre |

Conséquence sur le routing : contrairement à la suppression (modale enfant de `linked-servers`
dans sa propre PR), **l'édition est montée au même niveau que `order`** (`routes.tsx`), pas sous
`ServiceLayoutPage`/`linkedServers`. Le lien « Modifier » de `BackupServerActionsCell` est donc
un **chemin absolu** (`routeUrls.edit(backupServerId)` = `/edit/{id}`), pas un `useHref` relatif
comme le sera le lien « Supprimer » une fois BKP-1219 mergée.

---

## 3. Déclenchement & routing

`src/routes/routes.constants.ts` :

```ts
export const subRoutes = {
  // …
  edit: 'edit' as const,
} as const;

export const routeUrls = {
  // …
  /** Page pleine (sœur de `order`), pas une modale : cf. §2. */
  edit: (backupServerId: string) => `/${subRoutes.edit}/${backupServerId}`,
} as const;
```

`src/routes/routes.tsx` — route sœur de `order`, **pas** enfant de `linkedServers` :

```tsx
<Route
  path={`${subRoutes.edit}/${urlParams.backupServerId}`}
  Component={EditBackupServerPage}
  handle={{ tracking: { pageName: 'edit-backup-server', pageType: PageType.funnel } }}
/>
```

`BackupServerActionsCell.component.tsx` — l'entrée « Supprimer » reste inerte sur cette branche
(BKP-2.4, livrée par BKP-1219 dans sa propre PR) :

```tsx
const editHref = useHref(routeUrls.edit(backupServerId)); // absolu
```

**Piège rencontré en intégration** : `ActionMenu` (`@ovh-ux/manager-react-components`) rend un
`<a href>` DOM classique pour chaque entrée (pas un `Link` React Router, cf. son
`action.component.js`). Un `href` passé comme **chaîne littérale** (`routeUrls.edit(id)` sans
`useHref`) est donc interprété par le navigateur comme une **vraie navigation hors SPA** — HTTP
sur `localhost:9000/edit/{id}`, en cassant le routage en hash de l'app hôte (le fragment
`#/hpc-backup-licenses/…` restait figé sur l'ancienne page pendant que le chemin réel changeait).
`useHref` est nécessaire même pour un chemin absolu : c'est lui qui résout le chemin dans le
référentiel du routeur (préfixe `#`/basename), pas un simple concat de `subRoutes`.

Fermeture / retour : `navigate(routeUrls.linkedServers)`, sur `onClickReturn` du `BaseLayout`,
sur succès de la mutation, et sur redirection (id introuvable).

---

## 4. Domaine & chaîne API

### Noms de champs & route : contrat confirmé par 1219

Contrat API réel (confirmé par le BE pour le `DELETE` de 1219, réutilisé ici à l'identique) :
`externalIps`/`privateIps` (tableaux de CIDR), route de ressource unique
`getBackupServerRoute(...)` (`utils/apiRoutes/apiRoutes.ts`). BKP-1219 vivant dans une PR
indépendante (§2), cette fonction est **dupliquée sur cette branche** plutôt que partagée ; les
deux définitions convergeront trivialement au merge (implémentation identique).

### Chaîne API

| # | Appel | État |
|---|---|---|
| 1 | `GET /v2/backupServices/tenant` → `backupServicesId` | déjà codé |
| 2 | `GET /v2/backupServices/tenant/{id}/vspc` → `vspcTenantId` | déjà codé |
| 3 | `PUT …/vspc/{vspcTenantId}/backupLicenses/backupServer/{backupServerId}` | **créé** (mocké, endpoint non déployé) |

`src/data/api/backupServers/backupServers.requests.ts` :

```ts
export type EditBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
  displayName: string;
  licenseType: string;
  externalIps: string[];
  privateIps: string[];
};

export const editBackupServer = async ({
  backupServicesId, vspcTenantId, backupServerId, ...payload
}: EditBackupServerParams): Promise<void> => {
  if (USE_API_MOCKS) {
    simulateBackupServerUpdate(backupServerId, payload);
    return;
  }
  await v2.put(getBackupServerRoute(backupServicesId, vspcTenantId, backupServerId), payload);
};
```

`src/data/hooks/useEditBackupServer/useEditBackupServer.ts` — copie de `useDeleteBackupServer`
(cascade de résolution des ids, invalidation de `queryKeys.backupServers.all()` avant
`onSuccess`), payload en plus de l'id.

### Résolution du serveur à éditer

Pas de query de détail, même choix que 1219 : lecture de la liste déjà en cache
(`backupServersQueries.withClient(queryClient).list()`), recherche par id. Tant que la liste
charge, la page affiche un spinner plein écran ; si l'id reste introuvable une fois chargée,
`navigate(routeUrls.linkedServers, { replace: true })` (serveur supprimé entretemps).

---

## 5. Structure de la page (`src/pages/linked-servers/edit/EditBackupServer.page.tsx`)

```
BaseLayout                                    ← identique à Order.page.tsx
  breadcrumb / header (LABELS.BACKUP_LICENSES, ChangelogButton, GuideButton)
  onClickReturn → routeUrls.linkedServers      ← différent de order (→ onboarding)
  ├── colonne principale : 2 × StepComponent
  │     ① Licence            (EditLicenseStep : LicenseStep + message licence différée)
  │     ② Serveur VBR        (EditServerFieldsStep : nom + IP publique + IP privée)
  └── <aside className="sticky top-8 self-start"> : EditRecapPanel
```

**Étape ① Licence** : `LicenseStep` réutilisé tel quel (2 cartes `LicenseTypeCard` +
dévoilement conditionnel des 3 `VdpTierCard`), initialisée depuis la licence installée au lieu
de partir vierge (`familyOf`/`tierOf` dans `useEditBackupServerForm`, dérivées de
`server.currentState.licenseType`). `next` = « Continuer » (`order:step.continue`), verrouille
l'étape et ouvre l'étape ②. `edit` = « Modifier » (`order:summary.edit`), visible une fois
verrouillée.

**Étape ② Serveur VBR** : nouveau composant `EditServerFieldsStep`, 3 `OrderTextField`
(nom, IP publique, IP privée), chacun avec `hint` = valeur installée
(`edit.current_value`, « Valeur actuelle : {{value}} ») — reconnaissance plutôt que rappel. Pas
de `next` (dernière étape), le CTA final est dans `EditRecapPanel`.

**Pas de cascade au « Modifier »** contrairement au tunnel de commande : rouvrir l'étape ①
(`license.edit()`) ne touche pas à l'étape ②, et réciproquement — les deux étapes portent des
domaines indépendants (licence vs nom/IP), rien à réinvalider.

**`EditRecapPanel`** (aside sticky, `src/components/linked-servers/EditRecapPanel/`) :
- Relecture : famille/niveau de licence, nom, IP publique, IP privée (`OrderSummaryRow`,
  réutilisé tel quel).
- **Récap « avant → après »** (`EditChangesRecap`, affiché seulement si au moins un champ a
  changé) : liste `{{libellé}} : {{avant}} → {{après}}`, licence traduite via
  `getLicenseTypeDisplay`, comparaison à la licence **installée** (pas `licenseTypeRequested` —
  un changement déjà programmé reste modifiable).
- Message d'erreur (`OdsMessage critical`, `data-testid="edit-backup-server-error"`) si la
  mutation échoue — absent du tunnel de commande (submit stubé côté commande, réel côté édition).
- CTA « Enregistrer » (`actions:save`), **jamais désactivé sauf pendant l'appel** : un clic avec
  formulaire invalide déclenche `setSubmitAttempted(true)` et rouvre l'étape fautive
  (`firstInvalidStepId`), même parti pris que le CTA du tunnel de commande.

**Formulaire** (`src/hooks/useEditBackupServerForm/useEditBackupServerForm.ts`) : sur le modèle
de `useOrderForm`, 2 étapes fixes orchestrées par `useStep` (recyclé tel quel), sans persistance
`sessionStorage` (page ouverte pour éditer un serveur précis, rien à restituer après un
rafraîchissement). Seeding unique depuis `server`, ajusté **pendant le rendu** plutôt que dans un
effet (règle eslint `react-hooks/set-state-in-effect`) : `form` reste `null` tant que la liste
n'est pas chargée, puis se fige à sa première valeur.

`firstIpWithoutMask` (extraction de `stripHostPrefix`, `utils/formatIpList/formatIpList.ts`) :
démasque le premier élément d'un tableau de CIDR pour pré-remplir un champ texte, sans dupliquer
la regex de `formatIpList`.

---

## 6. Comportement post-submit

| Cas | Comportement |
|---|---|
| Clic « Enregistrer », formulaire valide | `editBackupServer({ backupServerId, displayName, licenseType, externalIps: [externalIp], privateIps: [privateIp] })` ; bouton désactivé pendant l'appel |
| Clic « Enregistrer », formulaire invalide | `setSubmitAttempted(true)` révèle les erreurs inline, rouvre l'étape fautive (`license.edit()` ou `serverStep.edit()`) ; **aucun appel API** |
| Succès | invalidation de `backupServers.all()` → `addSuccess(edit.success)` → `navigate(routeUrls.linkedServers)` |
| Erreur | la page reste ouverte, `OdsMessage color=critical` dans `EditRecapPanel`, nouvel essai possible |

Corps envoyé **toujours complet** (les 4 champs), même si un seul a changé — évite une logique
de diff côté front, même choix que documenté pour l'ancienne version modale.

**Toast de succès au passé accompli** (contrairement à `delete.success`) : nom et IP sont
appliqués **immédiatement** par ce `PUT`. Seul le volet licence est différé, déjà communiqué par
le message d'info de l'étape ① — le toast n'a pas à le répéter. Libellé :
« Les modifications ont été enregistrées. »

**Pas de nouveau libellé de statut de ligne** : un changement de licence en cours est déjà
représenté par la transition `licence → licence demandée` de `LicenseTypeCell` (1216).

---

## 7. Mocks de développement

`USE_API_MOCKS` à `true` (endpoint non déployé).

`src/mocks/backupServers/backupServers.mock.ts` — `simulateBackupServerUpdate(backupServerId, payload)` :
nom et IP appliqués immédiatement ; licence non modifiée directement — `licenseTypeRequested` +
tâche `SCHEDULED` de type `BACKUP_LICENSES_SERVER_LICENSE_CHANGE` ajoutée à `currentTasks`, pour
que la transition `LicenseTypeCell` soit revuable sans le vrai backend.

`src/mocks/backupServers/backupServers.handler.ts` — entrée `method: 'put'` sur
`…/backupServer/:backupServerId`, paramètre `isEditBackupServerError` (`status: 500` sinon `200`).

À retirer avec le reste des mocks une fois les 3 endpoints déployés (§15 de la spec 1216).

---

## 8. Arborescence des fichiers

```
packages/manager/modules/backup-licenses/src/
├── data/
│   ├── api/backupServers/backupServers.requests.ts        (M) + editBackupServer
│   └── hooks/useEditBackupServer/
│       ├── useEditBackupServer.ts                         (N)
│       └── useEditBackupServer.spec.tsx                   (N)
├── hooks/useEditBackupServerForm/
│   ├── useEditBackupServerForm.ts                         (N) 2 étapes + `changes`
│   └── useEditBackupServerForm.spec.ts                    (N)
├── pages/linked-servers/
│   └── edit/
│       ├── EditBackupServer.page.tsx                      (N) page pleine, pas modale
│       └── EditBackupServer.page.spec.tsx                 (N)
├── components/linked-servers/
│   ├── BackupServerActionsCell/
│   │   ├── BackupServerActionsCell.component.tsx          (M) href absolu + retrait isDisabled
│   │   └── BackupServerActionsCell.component.spec.tsx     (M)
│   ├── EditLicenseStep/EditLicenseStep.component.tsx      (N) LicenseStep + notice différée
│   ├── EditServerFieldsStep/EditServerFieldsStep.component.tsx (N) nom + 2 IP
│   ├── EditChangesRecap/EditChangesRecap.component.tsx    (N) récap avant → après
│   └── EditRecapPanel/EditRecapPanel.component.tsx        (N) aside sticky + CTA
├── mocks/backupServers/
│   ├── backupServers.handler.ts                           (M) handler put
│   └── backupServers.mock.ts                              (M) simulateBackupServerUpdate
├── routes/
│   ├── routes.constants.ts                                (M) routeUrls.edit
│   └── routes.tsx                                          (M) route pleine, sœur de order
└── utils/formatIpList/
    ├── formatIpList.ts                                     (M) + firstIpWithoutMask exportée
    └── formatIpList.spec.ts                                (M)
```

**Aucune modification côté app `hpc-backup-licenses`** hormis ce fichier de spec et l'`INDEX.md`.

---

## 9. i18n

Namespace existant `module-backup-licenses/linked-servers`, sous-arbre `edit.*`, **8 locales**.
Le sélecteur de licence réutilise les clés existantes du namespace `order` (`license.*`/`tier.*`,
`step.license_type.*`, `step.vdp_tier.*`, `step.continue`, `summary.edit`, `summary.field.*`,
`summary.empty`) — aucune nouvelle clé à traduire pour lui.

```json
"edit": {
  "field": {
    "name": { "label": "Nom du serveur", "error": "Il nous manque juste le nom de votre serveur." },
    "license_type": { "label": "Type de licence" },
    "public_ip": { "label": "Adresse IP publique", "error": "…" },
    "private_ip": { "label": "Adresse IP privée (LAN)", "error": "…" }
  },
  "step": {
    "server": {
      "label": "Serveur VBR",
      "collapsed_title": "Serveur VBR — <b>{{value}}</b>"
    }
  },
  "license_change_notice": "Le changement de licence prendra effet le 1er du mois prochain. D'ici là, la licence actuelle reste active.",
  "current_value": "Valeur actuelle : {{value}}",
  "recap": { "title": "Résumé des modifications" },
  "success": "Les modifications ont été enregistrées.",
  "error": "Le serveur {{serverName}} n'a pas pu être modifié."
}
```

- Pas de clé `edit.title` : contrairement à la modale, la page n'a pas de titre propre — le
  `BaseLayout` porte le titre produit (`LABELS.BACKUP_LICENSES`), comme le tunnel de commande.
- Messages d'erreur IP repris mot pour mot de `order:field.public_ip.error`/`private_ip.error`.
- Bouton primaire : `actions:save`. Bouton retour : `actions:back` (porté par le `BaseLayout`,
  pas `actions:cancel` comme la modale de suppression).
- `fr_CA` = copie stricte du `fr_FR`. Les 6 autres locales : traduction IA, non relue CDS.

---

## 10. Tests

Convention du module : uniquement les branches conditionnelles, tests colocalisés.

| Fichier | Ce qui est testé |
|---|---|
| `utils/formatIpList/formatIpList.spec.ts` (MAJ) | `firstIpWithoutMask` : démasquage du premier élément, tableau vide/absent → chaîne vide |
| `hooks/useEditBackupServerForm/useEditBackupServerForm.spec.ts` | seeding unique ; pas de re-seed au changement de `server` ; validation de l'étape ① ouvre ② sans la verrouiller côté données ; rouvrir ① ne réinitialise pas ② (domaines indépendants) ; erreurs requis (différé)/IP (immédiat) ; `isValid`/`firstInvalidStepId` ; `changes` (vide après seeding, liste un champ modifié, licence comparée à l'installée, retour à la valeur installée retire le champ) ; sélection Enterprise Plus vide le niveau VDP puis le restaure |
| `data/hooks/useEditBackupServer/useEditBackupServer.spec.tsx` | requête appelée avec les ids résolus + le payload ; invalidation avant `onSuccess` ; pas d'invalidation en échec ; cascade en échec → pas d'appel API |
| `pages/linked-servers/edit/EditBackupServer.page.spec.tsx` | étape ① ouverte en premier, pré-remplie ; étape ② révélée après validation de ① ; pas de reset de ② en rouvrant ① ; message licence différée conditionnel ; récap avant/après conditionnel ; succès → toast + navigation ; erreur → message dans le récap, pas de navigation ; redirection si id introuvable |
| `components/linked-servers/BackupServerActionsCell.component.spec.tsx` (MAJ) | `href` absolu de modification (`/edit/{id}`), sans imbrication de route contrairement à la suppression |

Note technique : `OdsInput`/`OdsFormField` (web components ODS) n'exposent pas de forme native
pour `getByDisplayValue`/`fireEvent.input` — mockés localement dans `EditBackupServer.page.spec.tsx`
pour piloter la saisie (`onOdsChange({ detail: { value } })`), alors que `OdsButton` réel répond
tel quel à `fireEvent.click` (cf. `RegionSelector.component.spec.tsx`) et n'a pas besoin d'être
mocké.

---

## 11. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **`PUT …/backupServer/{id}`** | Endpoint pas déployé, route déduite de celle du `DELETE` (confirmée par 1219). | Confirmer BE l'URL exacte, le code retour, et si le `licenseType` est bien différé au 1er du mois côté backend. |
| **Corps du `PUT`** | Supposé `{ displayName, licenseType, externalIps: string[], privateIps: string[] }`. | Confirmer BE, notamment le format des IP (CIDR vs nue). |
| **Serveur avec plusieurs IP d'un type** | Le formulaire n'expose qu'un seul champ par type d'IP → un `PUT` tronque silencieusement les IP additionnelles. | Faire valider par le PO. |
| **Badge « Scheduled change »** | Réutilisation de la transition `LicenseTypeCell` plutôt qu'un badge dédié (décision de spec, comme pour la version modale). | À faire valider par le design/PO. |
| **Édition pendant une opération en cours** | Menu ⋮ déjà désactivé si `currentTasks` non vide (1216) → édition impossible pendant un changement de licence déjà programmé. | Confirmer PO : faut-il un accès malgré tout ? |
| **IAM** | Aucune règle appliquée, cohérent avec 1216/1219. | Reprendre avec le BE. |
| **Revue visuelle** | Page/stepper non revus en navigateur à date de cette spec (`USE_API_MOCKS`, endpoint réel inexistant). | À faire avant la PR. |

---

## 12. Critères d'acceptation (checklist de fin de dev)

- [x] Cliquer « Modifier » dans le menu ⋮ ouvre la page d'édition, pré-remplie avec les valeurs courantes.
- [x] Les valeurs pré-remplies viennent de `currentState` (nom, licence, IP publique, IP privée).
- [x] Chaque champ de l'étape ② affiche sa valeur installée en `hint`.
- [x] Le type de licence se choisit via les cartes du tunnel (`LicenseStep`, réutilisée telle quelle).
- [x] Modifier le type de licence affiche le message d'info sur l'effet différé au 1er du mois.
- [x] Un récap « avant → après » apparaît dès qu'au moins un champ a été modifié ; absent sinon.
- [x] L'appel `PUT` part avec le corps complet, sur le bon `backupServerId`.
- [ ] Le badge/l'indicateur de changement de licence programmé est visible sur la ligne (réutilisation de `LicenseTypeCell`, cf. §11) — dépend de 1216, déjà livré, à revérifier en intégration.
- [x] Succès → retour à la liste, toast affiché, liste rafraîchie.
- [x] Erreur → message d'erreur affiché dans le panneau récap, page toujours montée, nouvel essai possible.
- [x] `tsc --noEmit` propre, lint propre sur les fichiers touchés.
- [ ] Revue visuelle en navigateur (via `USE_API_MOCKS`).

---

## 13. Reste à faire après ce ticket

- [ ] Ticket 2.2 (ajout) : dernier `isDisabled` du module à lever (bouton « Ajouter un serveur »).
- [ ] Retirer les mocks (`USE_API_MOCKS`, `simulateBackupServerUpdate`) quand les 3 endpoints seront déployés.
- [ ] Relecture CDS des 6 traductions non-fr de `edit.*`.
- [ ] IAM sur le menu d'actions (édition + suppression).
- [ ] Trancher avec le PO le sort du « badge dédié » vs la réutilisation de `LicenseTypeCell` (§11).
- [ ] Revue visuelle en navigateur avant PR.
