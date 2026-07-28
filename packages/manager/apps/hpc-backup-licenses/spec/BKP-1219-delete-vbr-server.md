# BKP-1219 — Onglet « Linked servers » : suppression d'un serveur VBR

Jira: https://jira.ovhcloud.tools/browse/BKP-1219 (2.4, Epic BKP-1161)
Assets ticket (XML JIRA) : `/home/mseme/Documents/Backup licences/Tickets/1216/BKP-1219.xml`
Contrat API : https://confluence.ovhcloud.tools/pages/viewpage.action?pageId=942871206

> Ce document décrit la **cible** de la fonctionnalité et les décisions de conception, pas un historique.
> Amont : `BKP-1216-linked-servers-list.md` — ce ticket est la **première mutation** du module, et lève l'un des
> trois `isDisabled` posés par 1216 (§15 de cette spec : 2.2 ajout, 2.3 édition, **2.4 suppression**).

Branche `feat/1219-delete-vbr-server`, partant de `feat/1216-servers-list` (non encore mergée dans `master`).
État : **développé (29/07/2026)** — 188 tests / 27 fichiers passants sur le module, `tsc --noEmit` propre, **lint
du module entièrement vert** (la dette préexistante de 1216 a été soldée au passage, cf. §13).
4 décisions tranchées avec le PO front : §3 routing, §7 mock, §9 toast, §6 libellé de statut dédié à la
suppression (revient sur §8 de la spec 1216).
Écarts d'implémentation assumés en §13.

---

## 1. Objectif & périmètre

Le client supprime un serveur VBR de son service depuis le menu d'actions de la ligne. La suppression **révoque
la licence VSPC associée** côté backend — c'est le seul effet métier, il n'y a rien à désinstaller côté client
depuis le Manager.

**Dans le périmètre :**

1. Entrée « Supprimer » du menu ⋮ rendue **fonctionnelle** (elle est aujourd'hui inerte, cf. §2).
2. Modale de confirmation : titre, message nommant le serveur, bouton destructif, bouton d'annulation.
3. Appel `DELETE …/backupLicenses/backupServer/{backupServerId}` (première mutation du module).
4. Post-submit : spinner sur le bouton, succès → fermeture + toast + rafraîchissement de la liste,
   erreur → message **dans la modale**, qui reste ouverte.

**Hors périmètre :** l'entrée « Modifier » (ticket 2.3) et le bouton « Ajouter un serveur » (2.2) ne sont pas
touchés — sauf pour remettre « Modifier » à `isDisabled: true` (§2).

---

## 2. État de départ à corriger dans `BackupServerActionsCell`

Le composant livré par 1216 est dans un état **transitoire assumé** : ses deux entrées sont **actives mais sans
`onClick`**, état de revue visuelle demandé pendant le dev de 1216 (cf. le commentaire de tête du fichier, à
supprimer). Ce ticket normalise la situation :

| Entrée | Avant | Après |
|---|---|---|
| « Modifier » (`actions:modify`) | active, sans effet | **`isDisabled: true`** jusqu'à 2.3 — règle 1216 : rien d'inerte, rien qui mène à une 404 |
| « Supprimer » (`actions:delete`, `color: critical`) | active, sans effet | **`href`** vers la route modale (§3) |

Le composant reçoit une prop supplémentaire `backupServerId: string`, fournie par
`useLinkedServersColumns` (`server.id` — celui de la ressource, pas `currentState.id`, cf. §5 de la spec 1216).
`isDisabled` (menu entier grisé pendant une opération en cours) est conservé tel quel.

---

## 3. Déclenchement & routing

**Décision (28/07/2026) : route modale enfant, pas d'état local.** Alignement sur `backup-agent`
(`DeleteAgent.page.tsx`, route `agents/delete/:agentId`), qui est le modèle le plus proche : menu ⋮ d'une ligne
de listing → modale de suppression. Bénéfices : deep link, `pageType: PageType.popup` obtenu nativement par le
`handle` de la route, montage de la modale seulement à l'ouverture, et pas d'état de sélection à porter dans la
page. Un `useState<BackupServerResource | null>` dans `LinkedServers.page.tsx` ferait le même travail mais
sortirait du pattern du module frère pour un gain nul.

`src/routes/routes.constants.ts` :

```ts
export const subRoutes = {
  // …
  delete: 'delete' as const,
} as const;

export const urlParams = {
  backupServerId: ':backupServerId' as const,
} as const;
```

`src/routes/routes.tsx` — route enfant de `linkedServers`, pour que la modale se superpose à la liste :

```tsx
<Route path={subRoutes.linkedServers} Component={LinkedServersPage} handle={{ … }}>
  <Route
    path={`${subRoutes.delete}/${urlParams.backupServerId}`}
    Component={DeleteBackupServerPage}
    handle={{ tracking: { pageName: 'delete-backup-server', pageType: PageType.popup } }}
  />
</Route>
```

- `LinkedServers.page.tsx` doit rendre un **`<Outlet />`** (il n'en a pas aujourd'hui), à la fin de sa `<section>`.
  Il est rendu dans les 3 états de la page sauf l'état d'erreur (retour anticipé `LinkedServersError`) : cohérent,
  on ne supprime pas depuis une liste qui n'a pas pu être chargée.
- `href` côté cellule : `useHref(`${subRoutes.delete}/${backupServerId}`)` — chemin **relatif**, résolu en
  `/linked-servers/delete/{id}` puisque la cellule est rendue sous la route `linked-servers` (même mécanisme que
  `AgentActionsCell`). Pas d'entrée dans `routeUrls` : aucune navigation transverse vers cette modale.
- Fermeture : `navigate('..')` (retour à `/linked-servers`), utilisé par le bouton secondaire, la croix
  (`onDismiss`) et le succès.

---

## 4. Chaîne API & mutation

| # | Appel | État |
|---|---|---|
| 1 | `GET /v2/backupServices/tenant` → `backupServicesId` | déjà codé (`tenantsQueries.backupServicesId()`) |
| 2 | `GET /v2/backupServices/tenant/{id}/vspc` → `vspcTenantId` | déjà codé (`tenantsQueries.vspcTenantId()`) |
| 3 | `DELETE /v2/…/vspc/{vspcTenantId}/backupLicenses/backupServer/{backupServerId}` | **à créer** |

Les 3 `GET` listés par le ticket (dont celui de la liste) sont **déjà en place** : la cascade d'ids est résolue par
les queries existantes et le `backupServerId` vient de la ligne du tableau. La question ouverte du ticket
(« Where do the ids come from ? ») est donc sans objet côté front.

- `src/utils/apiRoutes/apiRoutes.ts` : ajouter
  ```ts
  export const getBackupServerRoute = (
    backupServicesId: string,
    vspcTenantId: string,
    backupServerId: string,
  ) => `${getBackupServersRoute(backupServicesId, vspcTenantId)}/${backupServerId}`;
  ```
- `src/data/api/backupServers/backupServers.requests.ts` : `deleteBackupServer({ backupServicesId,
  vspcTenantId, backupServerId })` via `v2.delete`, avec la même garde `USE_API_MOCKS` que `getBackupServers`
  (§7).
- `src/data/hooks/useDeleteBackupServer/useDeleteBackupServer.ts` (**nouveau dossier `data/hooks`**, emplacement
  de `backup-agent` pour les mutations ; un dossier par unité + test colocalisé, convention du module) :

  ```ts
  export const useDeleteBackupServer = ({ onSuccess, ...options }: …) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (backupServerId: string) => {
        const tenants = tenantsQueries.withClient(queryClient);
        const backupServicesId = await tenants.backupServicesId();
        const vspcTenantId = await tenants.vspcTenantId();
        return deleteBackupServer({ backupServicesId, vspcTenantId, backupServerId });
      },
      onSuccess: async (...params) => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
        onSuccess?.(...params);
      },
      ...options,
    });
  };
  ```

  Copie du pattern `useDeleteVault` de `backup-agent`, aux ids près. **Aucune clé de query à ajouter** :
  `queryKeys.backupServers.all()` suffit, et c'est exactement le point d'accroche prévu par §8 de la spec 1216
  (« il leur suffira d'invalider `queryKeys.backupServers.all()`, le polling démarrera de lui-même »).

---

## 5. La modale (`src/pages/linked-servers/delete/DeleteBackupServer.page.tsx`)

`Modal` de MRC, `type={ODS_MODAL_COLOR.critical}` — c'est ce qui donne le bouton primaire rouge exigé par l'AC,
il n'y a pas de variante de couleur à passer au bouton lui-même.

| Élément | Valeur |
|---|---|
| `heading` | `delete.title` — « Supprimer le serveur » |
| corps | `delete.content` via `<Trans>`, nom du serveur en gras |
| `primaryLabel` | `actions:delete` (« Supprimer ») — le ticket impose ce libellé, là où `backup-agent` utilise `actions:confirm` |
| `secondaryLabel` | `actions:cancel` (« Annuler ») |
| `isPrimaryButtonLoading` | `isPending` (spinner exigé par l'AC) |
| `onDismiss` / `onSecondaryButtonClick` | `closeModal` |

**Résolution du serveur.** Pas de query de détail : la route de détail citée par le ticket 1220 est probablement
une coquille (§11 de la spec 1216) et n'est pas utilisée par le module. On lit donc la liste déjà en cache et on
y cherche l'id, comme `DeleteVault.page.tsx` :

```ts
const { data: servers, isPending } = useQuery(backupServersQueries.withClient(queryClient).list());
const server = servers?.find(({ id }) => id === backupServerId);
```

- Cas normal (ouverture depuis la liste) : la query est déjà résolue, le nom est disponible immédiatement.
- Deep link direct sur `/linked-servers/delete/{id}` : la page parente déclenche la même query, donc un court
  `isPending` → bouton primaire désactivé tant que `!server`.
- Chargement terminé et **id introuvable** (serveur déjà supprimé, lien obsolète) : `navigate('..', { replace:
  true })` dans un effet. Pas de message d'erreur : la liste rafraîchie derrière est déjà la bonne réponse.

**Nom en gras.** `<Trans>` avec `components={{ strong: <span className="font-bold" /> }}` et la clé portant
`<strong>{{serverName}}</strong>`. Pas le `[&::part(text)]:font-bold` de `DeleteAgent.page.tsx` : ici seul le nom
est en gras, pas tout le paragraphe.

---

## 6. Comportement post-submit

| Cas | Comportement |
|---|---|
| Clic « Supprimer » | `deleteBackupServer(backupServerId)` ; spinner sur le bouton primaire, bouton secondaire désactivé |
| Succès | invalidation de `backupServers.all()` → `addSuccess(delete.success)` → `closeModal()` |
| Erreur | **la modale reste ouverte**, `OdsMessage color=critical` au-dessus du texte, bouton primaire réactivé (nouvel essai possible) |

**Décision : pas de `onSettled: closeModal`**, contrairement à `useDeleteVault`/`useDeleteTenantAgent` de
`backup-agent` qui ferment la modale dans tous les cas et poussent l'erreur en toast. L'AC de ce ticket est
explicite : *« On error, the error message is displayed inside the modal »*. On garde donc l'erreur dans la modale,
et le toast est réservé au succès. C'est un écart **volontaire** avec le module frère.

Message d'erreur : libellé traduit `delete.error` (avec le nom du serveur), suivi du `message` renvoyé par l'API
s'il est présent (`(error as TApiCustomError).response?.data?.message`) — le détail API sert au support, le libellé
traduit à l'utilisateur.

**Disparition de la ligne — écart assumé.** L'AC dit « la ligne disparaît du tableau ». En pratique les mutations
sur un serveur VBR sont **asynchrones** (§8 de la spec 1216) : le `DELETE` renvoie une tâche, donc après
invalidation la ligne est **encore là**, avec sa `currentTasks` non vide → spinner de statut + menu ⋮ désactivé,
et le polling BKP-1220 démarre seul. La ligne disparaît au refetch qui suit la fin réelle de la tâche. Si le BE
confirme un `DELETE` synchrone, la ligne disparaîtra dès l'invalidation et le rendu sera conforme à la lettre de
l'AC — dans les deux cas le code est le même.

**Libellé de statut dédié — décision du 29/07/2026, revient sur §8 de la spec 1216.** 1216 posait volontairement
« un seul rendu opération en cours » (`licenseStatus` `CREATING`/`UPDATING` et `currentTasks` non vide sont deux
signaux de la même réalité). La suppression casse cette équivalence : contrairement à une mise à jour, la ligne
qui affiche « Mise à jour en cours » pendant qu'elle est en fait en train de disparaître induit en erreur — d'où
la décision d'un libellé propre, « Suppression en cours ».

- `utils/inFlightServer/inFlightServer.ts` : `isServerBeingDeleted(server)` — vrai si une tâche **progressante**
  (même définition que `isServerInFlight`) a un `type` contenant `DELETE`. Valeur de `type` non confirmée par le
  BE (comme le reste de ce ticket, cf. §11) : posée par le mock (`BACKUP_LICENSES_SERVER_DELETE`, §7).
- `LicenseStatusCell` reçoit une prop `isDeleting`, prioritaire sur le fallback `UPDATING` mais **après**
  `hasFailedTask` (une suppression qui a échoué doit retomber sur le badge « Erreur », pas rester
  « Suppression en cours » — cohérent, `isServerBeingDeleted` exclut déjà les tâches `ERROR`).
- `useLinkedServersColumns` passe `isDeleting={isServerBeingDeleted(server)}`.
- Nouvelle clé i18n `status.deleting` (8 locales), même sous-arbre `status.*` que `updating`/`creating`.

---

## 7. Mocks de développement

`USE_API_MOCKS` est **à `true`** sur la branche 1216 (l'endpoint de liste n'est pas déployé), et l'endpoint
`DELETE` ne l'est pas davantage (« Endpoint not existing yet » dans le ticket). Pour que le parcours soit
revuable de bout en bout :

- `deleteBackupServer` en mode mock (**décision du 28/07/2026**) : ne retire **rien** de `mockBackupServers`,
  mais **ajoute une `currentTask` de suppression** au serveur ciblé, puis résout. Après l'invalidation, la ligne
  passe en spinner de statut + menu ⋮ désactivé et le polling démarre : c'est exactement le rendu qu'aura le vrai
  backend asynchrone (§6). La ligne ne disparaît pas — le mock ne simule pas la fin de tâche — mais tout
  l'enchaînement modale → toast → réaction de la ligne est revuable. Un no-op strict laisserait le tableau
  parfaitement identique et ne permettrait de vérifier que la fermeture de la modale.
- `src/mocks/backupServers/backupServers.handler.ts` : ajouter l'entrée `method: 'delete'` sur
  `…/backupServer/:backupServerId` (paramètre `isDeleteBackupServerError` pour la branche d'échec), pour les tests
  qui passent par MSW. Les tests unitaires restent sur `vi.mock` des requests, convention du module.
- À retirer en même temps que le reste des mocks quand les endpoints seront déployés (§15 de la spec 1216).

---

## 8. Arborescence des fichiers

```
packages/manager/modules/backup-licenses/src/
├── data/
│   ├── api/backupServers/backupServers.requests.ts        (M) + deleteBackupServer
│   └── hooks/                                            (N) nouveau dossier
│       └── useDeleteBackupServer/
│           ├── useDeleteBackupServer.ts                   (N)
│           └── useDeleteBackupServer.spec.tsx             (N)
├── pages/linked-servers/
│   ├── LinkedServers.page.tsx                             (M) + <Outlet />
│   └── delete/
│       ├── DeleteBackupServer.page.tsx                    (N)
│       └── DeleteBackupServer.page.spec.tsx               (N)
├── components/linked-servers/BackupServerActionsCell/
│   ├── BackupServerActionsCell.component.tsx              (M) href + isDisabled Modifier
│   └── BackupServerActionsCell.component.spec.tsx         (M)
├── hooks/useLinkedServersColumns/useLinkedServersColumns.tsx (M) passe server.id
├── mocks/backupServers/
│   ├── backupServers.handler.ts                           (M) handler delete
│   └── backupServers.mock.ts                              (M) simulateBackupServerDeletion (dev)
├── routes/
│   ├── routes.constants.ts                                (M) subRoutes.delete, urlParams
│   └── routes.tsx                                         (M) route modale enfant
└── utils/apiRoutes/
    ├── apiRoutes.ts                                       (M) getBackupServerRoute
    └── apiRoutes.spec.ts                                  (M)
```

**Aucune modification côté app `hpc-backup-licenses`** (ni route, ni i18n : le namespace `linked-servers` existe
déjà, cf. §10 de la spec 1216) — hormis ce fichier de spec et l'`INDEX.md`.

---

## 9. i18n

Nouvelles clés dans le namespace existant `module-backup-licenses/linked-servers`, sous-arbre `delete.*`,
**8 locales** (`fr_FR`, `fr_CA` = copie stricte, `en_GB`, `de_DE`, `es_ES`, `it_IT`, `pl_PL`, `pt_PT`) :

```json
"delete": {
  "title": "Supprimer le serveur",
  "content": "Voulez-vous vraiment supprimer le serveur <strong>{{serverName}}</strong> ? La licence associée sera révoquée. Cette action est irréversible.",
  "success": "La suppression du serveur {{serverName}} a bien été lancée.",
  "error": "Le serveur {{serverName}} n'a pas pu être supprimé."
}
```

- Libellés de boutons repris de `@ovh-ux/manager-common-translations` : `actions:delete` (« Supprimer »),
  `actions:cancel` (« Annuler »). Rien à créer.
- `delete.success` est formulé **au lancement** et non au passé accompli (« a bien été supprimé ») — **décision
  du 28/07/2026** : la suppression est asynchrone (§6), annoncer un fait accompli alors que la ligne est encore
  affichée avec un spinner serait contradictoire, et mensonger si la tâche échoue côté backend. Écart de forme
  assumé avec le ticket (« Server deleted successfully. »).
- Traductions non-fr générées par IA → relecture CDS, comme le reste du module.
- Le commentaire Jira demandant d'ajouter au message que la facturation s'arrête à la résiliation est
  **écarté par décision du 28/07/2026** : ce n'est pas un oubli, la description du ticket reste la source.

---

## 10. Tests prévus

Convention : uniquement les branches conditionnelles, tests colocalisés.

| Fichier | Ce qui est testé |
|---|---|
| `data/hooks/useDeleteBackupServer/useDeleteBackupServer.spec.tsx` | la request est appelée avec les ids résolus par la cascade ; `backupServers.all()` est invalidée **avant** `onSuccess` (ordre vérifié) ; pas d'invalidation en cas d'échec ; cascade en échec → pas d'appel API |
| `pages/linked-servers/delete/DeleteBackupServer.page.spec.tsx` | succès → `addSuccess` + navigation vers `..` ; erreur → modale toujours montée + message critique affiché + **pas** de navigation ; `isPending` → bouton primaire en loading ; id introuvable après chargement → redirection |
| `components/linked-servers/BackupServerActionsCell.component.spec.tsx` (MAJ) | `href` de suppression construit avec l'id ; entrée « Modifier » désactivée ; menu entier désactivé si `isDisabled` |
| `utils/apiRoutes/apiRoutes.spec.ts` (MAJ) | `getBackupServerRoute` construit bien `…/backupServer/{id}` |

Pas de test dédié pour `LinkedServers.page.tsx` (l'ajout de l'`<Outlet />` n'introduit pas de branche) ni pour le
handler de mock.

---

## 11. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **`DELETE …/backupServer/{id}`** | Endpoint **pas encore déployé** ; le ticket porte lui-même « Endpoints to be confirmed by Sreekanth ». La route est déduite de celle de la liste, déjà confirmée. | Confirmer BE l'URL exacte, le code de retour (204 ? 200 + tâche ?) et le format d'erreur. |
| **Synchrone ou asynchrone ?** | Supposé **asynchrone** (tâche dans `currentTasks`), cf. §6. Le code est identique dans les deux cas, seul le rendu observé diffère. | Confirmer BE. Si asynchrone, faire valider au PO que la ligne reste visible avec un spinner avant de disparaître (écart avec l'AC « the row disappears »). |
| **~~Formulation du toast~~** | **Tranché (28/07/2026)** : « La suppression … a bien été lancée » plutôt que « supprimé avec succès », à cause de l'asynchronisme (§9). | Relecture CDS avec le reste des libellés. Si le `DELETE` s'avère synchrone, repasser au passé accompli. |
| **Serveur avec une opération en cours** | Le menu ⋮ est déjà désactivé quand `currentTasks` n'est pas vide (1216) → la suppression est de fait interdite pendant une autre opération. Aucun garde-fou supplémentaire côté modale. | Confirmer PO que c'est le comportement voulu (vs autoriser la suppression d'un serveur en cours de provisionnement). |
| **IAM** | Aucune règle IAM appliquée, cohérent avec 1216 : les actions `backupLicenses/*` ne sont pas définies. | Reprendre avec le BE en même temps que le reste du module, puis passer `iamActions` à l'`ActionMenuItem`. |
| **Erreur affichée dans la modale** | Écart volontaire avec `backup-agent` (qui ferme et pousse un toast d'erreur), imposé par l'AC. | Rien à faire, mais ne pas « harmoniser » par erreur avec le module frère plus tard. |

---

## 12. Critères d'acceptation (checklist de fin de dev)

- [x] Cliquer « Supprimer » dans le menu ⋮ ouvre la modale de confirmation.
- [x] Le nom du serveur (`currentState.displayName`) est affiché **en gras** dans le message.
- [x] Le bouton « Supprimer » est en style destructif (rouge) — via `type={ODS_MODAL_COLOR.critical}`.
- [x] Le bouton « Annuler » et la croix ferment la modale sans appel API.
- [x] L'appel `DELETE` part sur le bon endpoint, avec le bon `backupServerId`.
- [x] Pendant l'appel, le bouton primaire affiche un spinner (et le bouton secondaire est désactivé).
- [x] Succès → modale fermée, toast affiché, liste rafraîchie *(⚠️ la ligne ne disparaît qu'à la fin de la tâche
      si le `DELETE` est asynchrone, cf. §6)*.
- [x] Erreur → message d'erreur affiché **dans la modale**, qui reste ouverte, nouvel essai possible.
- [x] L'entrée « Modifier » est désactivée (jusqu'à 2.3), le bouton « Ajouter un serveur » inchangé.
- [x] `tsc --noEmit` propre, lint propre sur les fichiers touchés, 188 tests / 27 fichiers au vert.
- [ ] **Revue visuelle non faite** : l'écran n'a pas été ouvert dans un navigateur (l'endpoint n'existe pas, le
      parcours passe par `USE_API_MOCKS`). À faire avant la PR.

---

## 13. Écarts entre la spec et l'implémentation livrée

| Sujet | Spec | Livré | Pourquoi |
|---|---|---|---|
| Message d'erreur API | util dédié / guard `isApiCustomError` | `error.response?.data?.message` en direct | La mutation est typée `TApiCustomError`, donc le champ est déjà typé : le guard n'aurait servi qu'à convaincre TS d'un fait déjà connu. |
| `<Outlet />` de la liste | `<Outlet />` simple | `<Suspense fallback={null}><Outlet /></Suspense>` | La modale est un `React.lazy`. Sans `Suspense` local, la suspension remonterait à celui de `ServiceLayout` et masquerait toute la liste pendant le chargement du chunk. |
| Effet de redirection « serveur introuvable » | `if (!isPending && !server) navigate('..')` | idem + gardes `!isPending && !isSuccess` sur la **mutation** | La liste est invalidée *avant* notre `onSuccess` : sans ces gardes, la ligne disparaissant du cache démontait la modale avant que le toast soit poussé — le toast était perdu. |
| Test du hook de mutation | `.spec.ts` | `.spec.tsx` | `renderHook` a besoin d'un wrapper `QueryClientProvider`, donc de JSX. |
| Test du `href` de suppression | rendu simple du composant | rendu dans un `<Routes>` reproduisant la route `linked-servers` | `useHref` est **relatif** : hors de la route parente il résout `/delete/{id}` au lieu de `/linked-servers/delete/{id}`. Le premier jet du test l'a révélé — l'imbrication fait partie du contrat du composant, elle doit être dans le test. |
| Handler MSW du `DELETE` | entrée `method: 'delete'` | idem, `status: 204` par défaut et paramètre `isDeleteBackupServerError` | Code de retour supposé (§11) : à ajuster quand le BE aura confirmé. |
| Dette lint du module | hors périmètre | **traitée** : lint du module entièrement vert | Les 37 erreurs préexistantes (`prettier/prettier` sur `Order.page.tsx`, `OrderSummary`, `useOrderForm`, `isValidIp.spec`, `tenants.mock`) ont été corrigées par `manager-lint --fix` à la demande du dev. Tout est cosmétique **sauf** un `no-unnecessary-type-assertion` dans `Order.page.tsx` : `(el as HTMLElement \| null)?.focus?.()` → `el?.focus?.()`, `getElementById` renvoyant déjà ce type. Ces fichiers sortent du périmètre fonctionnel du ticket : à mentionner en description de PR. |

---

## 14. Reste à faire après ce ticket

- [ ] Ticket 2.3 (édition) : retirer le `isDisabled` de l'entrée « Modifier » et brancher sa modale — la route
      modale et le `data/hooks/` posés ici lui servent de modèle direct.
- [ ] Retirer les mocks (`USE_API_MOCKS`, mutation en place du tableau) quand les endpoints seront déployés.
- [ ] Relecture CDS des 7 traductions non-fr de `delete.*`.
- [ ] IAM sur le menu d'actions.
