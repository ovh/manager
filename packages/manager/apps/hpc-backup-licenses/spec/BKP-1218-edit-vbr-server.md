# BKP-1218 — Onglet « Linked servers » : édition d'un serveur VBR

Jira: https://jira.ovhcloud.tools/browse/BKP-1218 (2.3, Epic BKP-1161)
Assets ticket (XML JIRA) : `/home/mseme/Documents/Backup licences/Tickets/1218/BKP-1218.xml`

> Ce document décrit la **cible** de la fonctionnalité et les décisions de conception, pas un historique.
> Amont : `BKP-1216-linked-servers-list.md` (domaine, colonnes, `LicenseTypeCell`) et
> `BKP-1219-delete-vbr-server.md` (routing en modale enfant, mutation, conventions de test) — **modèles
> directs** de ce ticket. C'est la **deuxième mutation** du module et la dernière des trois `isDisabled`
> posées par 1216 à lever (§15 de sa spec : 2.2 ajout — reste à faire —, 2.4 suppression — livrée —,
> **2.3 édition**, ce ticket). Le commentaire `// TODO(BKP-2.3): retirer isDisabled et brancher la modale
> d'édition.` dans `BackupServerActionsCell.component.tsx` désigne explicitement ce ticket.

Branche `feat/1218-update-vbr-server`, partant du commit de merge de la PR #1219 (`master` actuel).
État : **spec, dev non commencé**.

---

## 1. Objectif & périmètre

Le client modifie les propriétés d'un serveur VBR déjà enregistré : nom, type de licence (upgrade/downgrade),
IP publique, IP privée. **Un changement de licence est différé** : la demande est enregistrée immédiatement,
mais la licence effective ne change qu'au 1er du mois suivant — le nom et les IP, eux, sont appliqués
immédiatement. C'est la même asymétrie synchrone/asynchrone que 1219, mais côté « mise à jour » plutôt que
« suppression ».

**Dans le périmètre :**

1. Entrée « Modifier » du menu ⋮ rendue **fonctionnelle** (aujourd'hui `isDisabled: true`, posée par 1216).
2. Modale pré-remplie avec les valeurs courantes du serveur : nom, type de licence (select), IP publique, IP
   privée (4 champs, tous en édition — pas de champs en lecture seule comme dans `EditConfiguration.page.tsx`
   de `backup-agent`, cf. §5).
3. Message d'info sous le champ licence, affiché uniquement si la sélection diffère de la licence
   **actuellement installée**, annonçant l'effet différé au 1er du mois.
4. Appel `PUT …/backupLicenses/backupServer/{backupServerId}` avec le corps complet (deuxième mutation du
   module, sur le modèle de `useDeleteBackupServer`).
5. Badge de changement de licence programmé sur la ligne du tableau — **déjà livré par 1216** (§8 de sa
   spec : transition `Premium → Advanced` dans la colonne « Licence », pilotée par
   `currentState.licenseTypeRequested`), cf. décision §4.
6. Post-submit : spinner sur le bouton, succès → fermeture + toast + rafraîchissement de la liste, erreur →
   message **dans la modale**, qui reste ouverte (même parti pris que 1219).

**Hors périmètre :** le bouton « Ajouter un serveur » (2.2) n'est pas touché. L'entrée « Supprimer » (2.4,
livrée) n'est pas modifiée.

---

## 2. État de départ à corriger dans `BackupServerActionsCell`

`src/components/linked-servers/BackupServerActionsCell/BackupServerActionsCell.component.tsx` :

```tsx
const actions: ActionMenuItem[] = [
  {
    id: 0,
    label: t('modify'),
    isDisabled: true,
    // TODO(BKP-2.3): retirer `isDisabled` et brancher la modale d'édition.
  },
  { id: 1, label: t('delete'), color: ODS_BUTTON_COLOR.critical, href: deleteHref },
];
```

Devient, **exactement sur le modèle de l'entrée « Supprimer »** :

```tsx
const editHref = useHref(`${subRoutes.edit}/${backupServerId}`);
// …
const actions: ActionMenuItem[] = [
  { id: 0, label: t('modify'), href: editHref },
  { id: 1, label: t('delete'), color: ODS_BUTTON_COLOR.critical, href: deleteHref },
];
```

Retirer le commentaire `TODO(BKP-2.3)` en même temps. Le composant ne reçoit aucune nouvelle prop :
`backupServerId` est déjà là depuis 1216. `isDisabled` (menu entier grisé pendant une opération en cours,
`isServerInFlight`) est conservé tel quel et couvre aussi bien l'édition que la suppression.

Test `BackupServerActionsCell.component.spec.tsx` — le test `keeps the modify action disabled until ticket
2.3 ships` est **à remplacer** par un test d'`href`, copie conforme de celui de suppression :

```tsx
it('links the modify action to the edit modal of the row', async () => {
  await renderWithProviders(
    <Routes>
      <Route
        path="/linked-servers"
        element={<BackupServerActionsCell backupServerId="server-1" isDisabled={false} />}
      />
    </Routes>,
    { initialEntries: ['/linked-servers'] },
  );

  expect(screen.getByRole('button', { name: 'modify' })).toHaveAttribute(
    'data-href',
    '/linked-servers/edit/server-1',
  );
});
```

---

## 3. Déclenchement & routing

**Décision : route modale enfant, identique au mécanisme de suppression (§3 de la spec 1219).** Même
rationale : deep link, `pageType: PageType.popup` natif, montage à la demande, pas d'état de sélection à
porter dans `LinkedServers.page.tsx` (qui a déjà son `<Outlet />`, cf. 1219 §3 — aucune modification requise
ici).

`src/routes/routes.constants.ts` :

```ts
export const subRoutes = {
  // …
  delete: 'delete' as const,
  edit: 'edit' as const,
} as const;
```

`src/routes/routes.tsx` — route enfant de `linkedServers`, sœur de `delete` :

```tsx
const EditBackupServerPage = React.lazy(
  () => import('@/pages/linked-servers/edit/EditBackupServer.page'),
);

// …
<Route path={subRoutes.linkedServers} Component={LinkedServersPage} handle={{ … }}>
  <Route
    path={`${subRoutes.delete}/${urlParams.backupServerId}`}
    Component={DeleteBackupServerPage}
    handle={{ tracking: { pageName: 'delete-backup-server', pageType: PageType.popup } }}
  />
  <Route
    path={`${subRoutes.edit}/${urlParams.backupServerId}`}
    Component={EditBackupServerPage}
    handle={{ tracking: { pageName: 'edit-backup-server', pageType: PageType.popup } }}
  />
</Route>
```

- `href` côté cellule : `useHref(`${subRoutes.edit}/${backupServerId}`)`, résolu en
  `/linked-servers/edit/{id}` — même mécanisme relatif que la suppression (§2).
- Fermeture : `navigate('..')`, utilisé par le bouton secondaire, la croix et le succès.
- Pas d'entrée dans `routeUrls` (pas de navigation transverse vers cette modale, comme pour `delete`).

---

## 4. Domaine & chaîne API

### Noms de champs : réalité API, pas le tableau du ticket

Le ticket décrit un corps `PUT` avec `backupServerExternalIp`/`backupServerPrivateIp` (chaînes simples) et une
route `…/vspc/{vspcTenantId}/backupLicenses/{backupServerId}` (sans le segment `backupServer`). Les deux sont
des écarts déjà identifiés par les tickets amont (§5 de la spec 1216, §11 : « route de détail 1220, probable
coquille ») : le contrat réel, confirmé par le BE et déjà en place dans `BackupServer.type.ts`, est
`externalIps`/`privateIps` (tableaux de CIDR), et la route de ressource unique est
`getBackupServerRoute(...)` (déjà écrite pour le `DELETE`, cf. §4 de la spec 1219). **On réutilise ces deux
éléments tels quels** plutôt que de suivre la lettre du ticket — même décision que pour la suppression.

### Chaîne API

| # | Appel | État |
|---|---|---|
| 1 | `GET /v2/backupServices/tenant` → `backupServicesId` | déjà codé |
| 2 | `GET /v2/backupServices/tenant/{id}/vspc` → `vspcTenantId` | déjà codé |
| 3 | `PUT …/vspc/{vspcTenantId}/backupLicenses/backupServer/{backupServerId}` | **à créer** |

`src/data/api/backupServers/backupServers.requests.ts` :

```ts
export type EditBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
  displayName: string;
  licenseType: string;
  externalIps: string[];
  privateIps: string[];
};

/**
 * Édition d'un serveur VBR (BKP-1218). Nom et IP sont appliqués immédiatement ; un changement
 * de `licenseType` est différé au 1er du mois suivant côté backend (§1) — le front envoie la
 * cible dans le même corps, il n'y a rien de spécifique à faire ici pour ce décalage.
 */
export const editBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupServerId,
  ...payload
}: EditBackupServerParams): Promise<void> => {
  if (USE_API_MOCKS) {
    simulateBackupServerUpdate(backupServerId, payload);
    return;
  }

  await v2.put(getBackupServerRoute(backupServicesId, vspcTenantId, backupServerId), payload);
};
```

`src/data/hooks/useEditBackupServer/useEditBackupServer.ts` (copie de `useDeleteBackupServer`, payload en
plus de l'id) :

```ts
export type EditBackupServerPayload = Omit<EditBackupServerParams, 'backupServicesId' | 'vspcTenantId'>;

export const useEditBackupServer = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<void, TApiCustomError, EditBackupServerPayload>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditBackupServerPayload) => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      return editBackupServer({ backupServicesId, vspcTenantId, ...payload });
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
      onSuccess?.(...params);
    },
    ...options,
  });
};
```

Aucune nouvelle clé de query : `queryKeys.backupServers.all()` suffit (même accroche que 1219).

### Résolution du serveur à éditer

Pas de query de détail, même choix que 1219 : on lit la liste déjà en cache
(`backupServersQueries.withClient(queryClient).list()`) et on y cherche l'id. Bouton primaire désactivé tant
que `!server`, redirection `navigate('..', { replace: true })` si l'id reste introuvable une fois la liste
chargée (serveur supprimé entretemps).

---

## 5. La modale (`src/pages/linked-servers/edit/EditBackupServer.page.tsx`)

**Décision : `Modal` de MRC, comme la suppression — pas `Drawer` + react-hook-form/zod comme
`EditConfiguration.page.tsx` de `backup-agent`.** Deux raisons : (1) `backup-licenses` n'a pas
react-hook-form/zod en dépendance et le reste du module (tunnel de commande) valide ses formulaires « à la
main » (`useOrderForm`, cf. plus bas) — introduire RHF/zod pour 4 champs serait une dépendance nouvelle pour
un gain marginal ; (2) le ticket écrit explicitly « modal », et `AgentDownload.page.tsx` de `backup-agent`
prouve que `Modal` est un pattern déjà éprouvé dans la même famille de modules. Pas de `type`
(`ODS_MODAL_COLOR`) passé : action non destructive, contrairement à la suppression.

**Révision post-dev #1 (retour PO, heuristiques de Nielsen) :** la première version de cette modale (select
simple pour la licence, aucun rappel des valeurs précédentes) a été jugée insuffisante pour une opération
qu'il n'est pas trivial d'annuler une fois enregistrée. Deux ajustements, détaillés plus bas :
1. **Reconnaissance plutôt que rappel** : chaque champ affiche sa valeur installée en `hint`, et un récap
   « avant → après » liste les champs effectivement modifiés juste avant le bouton « Enregistrer ».
2. **Visibilité du système / choix éclairé** : le type de licence n'est plus un `OdsSelect` opaque, pour que
   l'utilisateur voie ce qu'il gagne ou perd à changer de licence sans quitter la modale.

**Révision post-dev #2 (contrainte technique découverte en cours de dev) :** une première mise en œuvre du
point 2 (grille de 4 cartes complètes à plat) rendait la modale « trop serrée ». Cause : `Modal` de MRC
encapsule un `OdsModal` dont la largeur/hauteur max est **codée en dur à 512×512px** (`$ods-modal-size` dans
le SCSS d'ODS) sans prop ni `::part()` exposé pour la dépasser — donc pas de `size`/`width` possible, dans un
sens comme dans l'autre. 4 cartes complètes dans 512px de large (2 colonnes ≈ 240px chacune) ne pouvaient pas
rester lisibles. Une deuxième tentative (pastilles compactes maison + panneau de détail) a corrigé
l'exiguïté mais introduisait un nouveau défaut, relevé en revue : elle aplatissait 4 valeurs API dans une
liste unique alors qu'Enterprise Plus et les 3 niveaux Data Platform ne sont **pas au même niveau
hiérarchique** (Enterprise Plus est une licence à part entière, Foundation/Advanced/Premium sont 3 niveaux
*à l'intérieur* de Data Platform) — un risque de confusion, et des pastilles maison qui dénotaient visuellement
face au reste du module.

**Décision retenue : réutilisation directe de `LicenseTypeCard` (choix de la famille) et `VdpTierCard` (choix
du niveau, affiché seulement si la famille est Data Platform)** — exactement les composants du tunnel de
commande, avec la même hiérarchie à 2 niveaux, initialisés depuis la licence installée au lieu de partir
vierge. Empilées en **1 colonne** (`grid-cols-1`, pas de `sm:grid-cols-2` — ce breakpoint réagit à la largeur
du *viewport*, pas à celle de la modale, et écraserait quand même les cartes sur un écran de bureau normal) :
chaque carte garde presque toute la largeur des 512px, le contenu vertical excédentaire défile dans la
modale (`overflow-y: auto` déjà porté par `OdsModal`). Aucun nouveau composant visuel : `LicenseOptionPill`/
`LicenseOptionDetail`/`LICENSE_OPTIONS`/`LicenseOptionData` (revisions précédentes) sont supprimés.

### Formulaire

Nouveau hook `src/hooks/useEditBackupServerForm/useEditBackupServerForm.ts`, sur le modèle de `useOrderForm`
mais sans étapes ni persistance (la modale est ouverte/fermée par le routeur, rien à survivre à un refresh) :

```ts
export type EditFormField = 'displayName' | 'externalIp' | 'privateIp';
export type EditFormErrors = Record<EditFormField, string | null>;

type EditFormState = {
  displayName: string;
  licenseType: string;
  externalIp: string;
  privateIp: string;
};

export function useEditBackupServerForm(server?: BackupServerResource) {
  const [form, setForm] = useState<EditFormState | null>(null);
  const [touched, setTouched] = useState<Set<EditFormField>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Seeding unique depuis la donnée serveur, ajusté PENDANT LE RENDU plutôt que dans un effet
  // (cf. react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes,
  // requis par la règle eslint react-hooks/set-state-in-effect) : `form` reste `null` tant
  // qu'elle n'est pas chargée, puis se fige à sa première valeur pour ne pas écraser la saisie
  // de l'utilisateur au refetch suivant (polling, invalidation d'une autre mutation, etc.).
  if (server && form === null) {
    setForm({
      displayName: server.currentState.displayName,
      licenseType: server.currentState.licenseType ?? '',
      externalIp: firstIpWithoutMask(server.currentState.externalIps),
      privateIp: firstIpWithoutMask(server.currentState.privateIps),
    });
  }

  // setField / touchField / errors (requis + isValidIp, sur le modèle de useOrderForm) / isValid …

  // `changes` : récap avant/après (cf. révision post-dev ci-dessus). Ne liste que les champs
  // dont la valeur saisie diffère de celle installée sur le serveur — avant/après en valeurs
  // brutes, la page se charge de traduire le libellé de licence.
  const changes: EditFormChange[] = /* comparaison form vs server.currentState, un item par champ modifié */ [];
}
```

`firstIpWithoutMask` : petite extraction de `stripHostPrefix` (aujourd'hui privée dans
`utils/formatIpList/formatIpList.ts`) en fonction exportée réutilisable, pour pré-remplir un champ texte à
partir du premier élément d'un tableau de CIDR sans dupliquer la regex. `formatIpList.spec.ts` gagne les cas
correspondants.

**Champs :**

| Champ | Composant | Pré-rempli depuis | Validation |
|---|---|---|---|
| Nom du serveur | `OrderTextField` (réutilisé tel quel, cf. décision ci-dessous), `hint` = valeur installée | `currentState.displayName` | non vide |
| Type de licence | `LicenseTypeCard` (famille) puis `VdpTierCard` (niveau, si Data Platform), cf. ci-dessous, sous-titre = licence installée | `currentState.licenseType` | toujours une valeur (pas d'option vide) |
| IP publique | `OrderTextField`, `hint` = valeur installée | `firstIpWithoutMask(currentState.externalIps)` | `isValidIp`, non vide |
| IP privée | `OrderTextField`, `hint` = valeur installée | `firstIpWithoutMask(currentState.privateIps)` | `isValidIp`, non vide |

**Réutilisation de `OrderTextField`** (aujourd'hui dans `components/order/`) tel quel pour les 3 champs
texte : c'est un composant générique (id/label/value/placeholder/hint/error/required/onChange/onBlur), rien
dans son implémentation n'est spécifique au tunnel de commande. Le déplacer dans un dossier neutre
(`components/common/` ou similaire) serait un renommage cosmétique hors périmètre de ce ticket — à faire le
jour où un troisième consommateur apparaît, pas avant (cf. mémoire `react-coding-conventions`, ne pas
introduire d'abstraction non demandée). Le `hint` de chaque champ affiche la valeur installée
(`edit.current_value`, « Valeur actuelle : {{value}} ») : reconnaissance plutôt que rappel, l'utilisateur
garde la référence sous les yeux pendant qu'il tape la nouvelle valeur.

**Pas de champs en lecture seule** contrairement à `EditConfiguration.page.tsx` de `backup-agent` (qui bloque
nom/IP et n'autorise que la politique) : le ticket 1218 liste explicitement les 4 champs comme éditables.

**Sélecteur de licence : réutilisation directe de `LicenseTypeCard` + `VdpTierCard` du tunnel de commande**
(`components/order/LicenseTypeCard/` et `VdpTierCard/`, aucun composant nouveau) — remplace le `OdsSelect`
initialement prévu (retour PO : un select seul ne dit rien des avantages respectifs des licences), puis une
grille à plat de 4 cartes (cf. révision post-dev #2 ci-dessus, écartée pour cause de largeur ET de hiérarchie
famille/niveau perdue). Décision finale : garder exactement la structure à 2 niveaux du tunnel.

- Une ligne (1 colonne) de `LicenseTypeCard` pour `LICENSE_CARDS` (Enterprise Plus / Data Platform),
  `role="radiogroup"`. `selectedFamily` dérivé de `form.licenseType` (`ENTERPRISE_PLUS` ⇒ famille Enterprise
  Plus, toute autre valeur ⇒ Data Platform).
- Si `selectedFamily === LicenseFamily.DATA_PLATFORM`, une seconde ligne de `VdpTierCard` pour
  `VDP_TIER_CARDS` (Foundation/Advanced/Premium). `selectedTier` dérivé de la correspondance
  `card.apiValue === form.licenseType`.
- Choisir Enterprise Plus pose directement `form.licenseType = LicenseApiValue.ENTERPRISE_PLUS` (pas de
  niveau). Choisir Data Platform alors qu'on n'y est pas déjà pose le niveau **recommandé**
  (`VDP_TIER_CARDS.find(c => c.recommended)`, comme le tunnel) ; si on y est déjà, le niveau actif est
  conservé. Choisir un niveau pose directement son `apiValue`.
- Les deux `<div role="radiogroup">` sont en **1 colonne** (`grid-cols-1`), pas `sm:grid-cols-2` comme dans
  `LicenseTypeStep`/`VdpTierStep` : ce breakpoint dépend de la largeur du *viewport*, pas de celle de la
  modale (512px) — il continuerait à écraser les cartes sur un écran de bureau normal.

**Message d'info licence différée**, sous la grille, affiché si
`form.licenseType !== server.currentState.licenseType` (comparaison à la licence **installée**, pas à
`licenseTypeRequested` — un changement déjà programmé reste modifiable, et c'est la nouvelle sélection qui
compte) :

```tsx
{form.licenseType !== server.currentState.licenseType && (
  <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
    {t('edit.license_change_notice')}
  </OdsMessage>
)}
```

**Récap « avant → après » (`edit-backup-server-changes-recap`)**, juste avant le bouton « Enregistrer »,
affiché seulement si `changes.length > 0` : liste chaque champ modifié au format
`{{libellé du champ}} : {{avant}} → {{après}}` (même convention que la transition de `LicenseTypeCell`, sans
clé i18n dédiée pour la flèche). Complète le message de licence différée : celui-ci explique **quand** le
changement s'applique, le récap confirme **quoi** a changé, tous champs confondus.

### Bouton primaire

`primaryLabel={t('actions:save')}` (« Enregistrer ») — pas `actions:confirm` (suppression) ni `actions:edit`
(« Éditer », déjà écarté pour l'entrée de menu par 1216 §17). `onPrimaryButtonClick` déclenche
`handleSubmit` local (marque `submitAttempted`, appelle la mutation si le formulaire est valide).

---

## 6. Comportement post-submit

| Cas | Comportement |
|---|---|
| Clic « Enregistrer » | `editBackupServer({ backupServerId, displayName, licenseType, externalIps: [externalIp], privateIps: [privateIp] })` ; spinner sur le bouton primaire, bouton secondaire désactivé |
| Succès | invalidation de `backupServers.all()` → `addSuccess(edit.success)` → `closeModal()` |
| Erreur | **la modale reste ouverte**, `OdsMessage color=critical` au-dessus du formulaire, bouton primaire réactivé — même parti pris que 1219, pour la même raison (permettre un nouvel essai sans perdre la saisie) |

Le corps envoyé est **toujours complet** (les 4 champs), y compris quand seul le nom ou une IP a changé — l'AC
l'exige explicitement (« The PUT call is sent with the full body »), et ça évite une logique de diff.

**Toast de succès formulé au passé accompli** (contrairement à `delete.success`) : nom et IP sont appliqués
**immédiatement** par ce `PUT` (contrairement à la suppression, asynchrone). Seul le volet licence est
différé, et ce point est déjà communiqué par le message d'info **dans** la modale avant l'envoi — le toast
n'a donc pas à le répéter. Libellé : « Les modifications ont été enregistrées. »

**Pas de nouveau libellé de statut de ligne.** Contrairement à la suppression (`isServerBeingDeleted`, §6 de
la spec 1219), un changement de licence en cours est **déjà** représenté par la transition
`licence → licence demandée` de `LicenseTypeCell` (1216 §8) : ce ticket ne crée pas de currentTask
« générique » de mise à jour dont il faudrait masquer le libellé, seul le volet licence produit une tâche
(§7).

---

## 7. Mocks de développement

`USE_API_MOCKS` toujours à `true` (aucun des 3 endpoints n'est déployé).

`src/mocks/backupServers/backupServers.mock.ts` : `simulateBackupServerUpdate(backupServerId, payload)` —

```ts
export const simulateBackupServerUpdate = (
  backupServerId: string,
  { displayName, licenseType, externalIps, privateIps }: Omit<EditBackupServerParams, 'backupServicesId' | 'vspcTenantId' | 'backupServerId'>,
) => {
  const server = mockBackupServers.find(({ id }) => id === backupServerId);
  if (!server) return;

  // Nom et IP : appliqués immédiatement (§1).
  server.currentState.displayName = displayName;
  server.currentState.externalIps = externalIps;
  server.currentState.privateIps = privateIps;

  // Licence : différée. On ne touche pas `licenseType` (licence installée), on pose la cible
  // dans `licenseTypeRequested` et une tâche programmée — exactement le rendu du 1er serveur
  // de l'exemple BE (§16 de la spec 1216), pour que la transition `LicenseTypeCell` soit
  // revuable sans attendre le vrai backend.
  if (licenseType !== server.currentState.licenseType) {
    server.currentState.licenseTypeRequested = licenseType;
    server.currentTasks = [
      ...server.currentTasks,
      {
        id: `${backupServerId}-license-change`,
        link: `/me/task/${backupServerId}-license-change`,
        status: 'SCHEDULED',
        type: 'BACKUP_LICENSES_SERVER_LICENSE_CHANGE',
      },
    ];
  }
};
```

`src/mocks/backupServers/backupServers.handler.ts` : ajouter l'entrée `method: 'put'` sur
`…/backupServer/:backupServerId`, paramètre `isEditBackupServerError` (`status: 500` sinon `200`), sur le
modèle de `isDeleteBackupServerError`.

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
│   ├── useEditBackupServerForm.ts                         (N) + `changes` (récap avant/après)
│   └── useEditBackupServerForm.spec.ts                     (N)
├── pages/linked-servers/
│   └── edit/
│       ├── EditBackupServer.page.tsx                      (N)
│       └── EditBackupServer.page.spec.tsx                 (N)
├── components/linked-servers/BackupServerActionsCell/
│   ├── BackupServerActionsCell.component.tsx              (M) href + retrait isDisabled Modifier
│   └── BackupServerActionsCell.component.spec.tsx          (M) test href au lieu de disabled
├── mocks/backupServers/
│   ├── backupServers.handler.ts                           (M) handler put
│   └── backupServers.mock.ts                              (M) simulateBackupServerUpdate
├── routes/
│   ├── routes.constants.ts                                (M) subRoutes.edit
│   └── routes.tsx                                          (M) route modale enfant
└── utils/formatIpList/
    ├── formatIpList.ts                                     (M) + firstIpWithoutMask exportée
    └── formatIpList.spec.ts                                (M)
```

**Aucune modification côté app `hpc-backup-licenses`** hormis ce fichier de spec et l'`INDEX.md`.

---

## 9. i18n

Nouvelles clés dans le namespace existant `module-backup-licenses/linked-servers`, sous-arbre `edit.*`,
**8 locales** :

```json
"edit": {
  "title": "Modifier le serveur",
  "field": {
    "name": { "label": "Nom du serveur", "error": "Il nous manque juste le nom de votre serveur." },
    "license_type": { "label": "Type de licence" },
    "public_ip": {
      "label": "Adresse IP publique",
      "error": "Cette adresse IP ne semble pas valide — vérifiez le format IPv4 ou IPv6."
    },
    "private_ip": {
      "label": "Adresse IP privée (LAN)",
      "error": "Cette adresse IP ne semble pas valide — vérifiez le format IPv4 ou IPv6."
    }
  },
  "license_change_notice": "Le changement de licence prendra effet le 1er du mois prochain. D'ici là, la licence actuelle reste active.",
  "current_value": "Valeur actuelle : {{value}}",
  "recap": {
    "title": "Résumé des modifications"
  },
  "success": "Les modifications ont été enregistrées.",
  "error": "Le serveur {{serverName}} n'a pas pu être modifié."
}
```

- `current_value`/`recap.title` : ajoutés en révision post-dev pour le récap avant/après (cf. §5). Pas de clé
  dédiée pour la flèche `→` du récap, sur le modèle de `LicenseTypeCell` qui la pose déjà en dur.
- Le sélecteur de licence (`LicenseTypeCard`/`VdpTierCard`) réutilise les clés existantes du namespace `order` (`license.*`/`tier.*`,
  `badge.recommended`, `feature.*`) — aucune nouvelle clé à traduire pour elle.
- Libellés des messages d'erreur IP repris **mot pour mot** de `order:field.public_ip.error` /
  `field.private_ip.error` (même règle de validation, même ton) — pas de nouvelle formulation pour la même
  erreur.
- Bouton primaire : `actions:save` (« Enregistrer »), déjà présent dans
  `@ovh-ux/manager-common-translations`. Bouton secondaire : `actions:cancel`. Rien à créer pour les deux.
- `fr_CA` = copie stricte du `fr_FR`. Les 6 autres locales : traduction IA + relecture CDS, comme le reste du
  module.

---

## 10. Tests prévus

Convention du module : uniquement les branches conditionnelles, tests colocalisés.

| Fichier | Ce qui est testé |
|---|---|
| `utils/formatIpList/formatIpList.spec.ts` (MAJ) | `firstIpWithoutMask` : IP `/32`/`/128` démasquée, autre préfixe conservé, tableau vide/absent → chaîne vide |
| `hooks/useEditBackupServerForm/useEditBackupServerForm.spec.ts` | seeding une seule fois depuis `server` (un changement ultérieur de `server` ne réécrase pas la saisie) ; erreurs requis/IP par champ selon `touched`/`submitAttempted` ; `isValid` ; `changes` : vide juste après seeding, liste le champ modifié, licence comparée à l'installée (pas une valeur par défaut), revenir à la valeur installée retire le champ du récap |
| `data/hooks/useEditBackupServer/useEditBackupServer.spec.tsx` | la request est appelée avec les ids résolus par la cascade + le payload ; invalidation avant `onSuccess` (ordre vérifié) ; pas d'invalidation en cas d'échec ; cascade en échec → pas d'appel API |
| `pages/linked-servers/edit/EditBackupServer.page.spec.tsx` | pré-remplissage depuis `currentState` (dont la famille/le niveau de licence installés cochés) ; récap absent juste après ouverture puis affiché dès qu'un champ change ; message d'info licence affiché seulement si la sélection diffère de l'installée ; sélectionner Enterprise Plus masque les cartes de niveau VDP ; revenir sur Data Platform restaure le niveau recommandé ; succès → `addSuccess` + navigation vers `..` ; erreur → modale toujours montée + message critique + **pas** de navigation ; `isPending` → bouton primaire en loading ; bouton primaire désactivé si formulaire invalide ; id introuvable après chargement → redirection |
| `components/linked-servers/BackupServerActionsCell.component.spec.tsx` (MAJ) | `href` de modification construit avec l'id (remplace le test « disabled ») |

Pas de test dédié pour `routes.tsx`/`routes.constants.ts` (pas de branche), ni pour le handler de mock.

---

## 11. Non figé / à confirmer (ne pas trancher seul)

| Sujet | État | Action |
|---|---|---|
| **`PUT …/backupServer/{id}`** | Endpoint pas déployé (le ticket porte lui-même un commentaire « Specific backupServer endpoint, not existing yet »). Route déduite de celle du `DELETE`, déjà confirmée. | Confirmer BE l'URL exacte, le code retour, et **si le `licenseType` est bien appliqué au 1er du mois côté backend** (un commentaire du ticket demandait explicitement si un `PATCH` sur `targetSpec.licenseType` s'applique directement — la description finale répond « non, différé », mais à reconfirmer avec le BE avant dev). |
| **Corps du `PUT`** | Supposé `{ displayName, licenseType, externalIps: string[], privateIps: string[] }`, par analogie avec le `GET` de liste (§4). | Confirmer BE, notamment si les IP doivent être envoyées en notation CIDR (comme en lecture) ou en adresse nue (comme saisies) — même question ouverte que pour le `POST` du tunnel (§15 de la spec 1216). |
| **Serveur avec plusieurs IP d'un type** (ex. `VBR-CUST-SERV-05` du mock, 2 IP privées) | Le formulaire n'expose **qu'un seul champ par type d'IP** (comme le ticket), donc un `PUT` sur un tel serveur **tronque silencieusement** les IP additionnelles à une seule. | Faire valider par le PO : est-ce le comportement voulu, ou faut-il un champ multi-valeurs / avertir l'utilisateur avant écrasement ? |
| **Badge « Scheduled change »** | Le ticket demande un « Info badge » dédié sur la ligne ; **décision de cette spec** : réutiliser la transition `licence → licence demandée` déjà livrée par 1216 (`LicenseTypeCell`, pilotée par `licenseTypeRequested`), qui porte la même information. | Écart visuel assumé (arrow inline vs badge séparé) : à faire valider par le design/PO avant la fin du dev, réversible en un composant si refusé. |
| **Édition d'un serveur en cours d'opération** | Le menu ⋮ est déjà désactivé quand `currentTasks` n'est pas vide (1216) → l'édition est de fait impossible pendant une opération en cours, y compris un changement de licence déjà programmé. | Confirmer PO : veut-on pouvoir modifier/annuler un changement de licence déjà programmé avant le 1er du mois ? Si oui, il faudra un accès à la modale même quand `isInFlight`. |
| **IAM** | Aucune règle IAM appliquée, cohérent avec 1216/1219. | Reprendre avec le BE en même temps que le reste du module. |
| **Icône « avertissement » avant écrasement d'IP** | Non prévu par le ticket. | Optionnel côté UX : si le PO valide le tronquage silencieux ci-dessus, pas d'action ; sinon prévoir un message. |

---

## 12. Critères d'acceptation (checklist de fin de dev)

- [x] Cliquer « Modifier » dans le menu ⋮ ouvre la modale, pré-remplie avec les valeurs courantes du serveur.
- [x] Les valeurs pré-remplies viennent de `currentState` (nom, licence, IP publique, IP privée).
- [x] Chaque champ affiche sa valeur installée en `hint` (« Valeur actuelle : … »).
- [x] Le type de licence se choisit via les cartes du tunnel (`LicenseTypeCard`/`VdpTierCard`, titre, prix,
      avantages), en respectant la hiérarchie famille → niveau VDP, pas un select opaque.
- [x] Modifier le type de licence affiche le message d'info sur l'effet différé au 1er du mois.
- [x] Un récap « avant → après » apparaît juste avant le bouton « Enregistrer » dès qu'au moins un champ a
      été modifié, et liste chaque champ concerné ; absent si rien n'a changé.
- [x] L'appel `PUT` part avec le corps complet, sur le bon `backupServerId`.
- [ ] Le badge/l'indicateur de changement de licence programmé est visible sur la ligne quand
      `licenseTypeRequested` ≠ `licenseType` (réutilisation de `LicenseTypeCell`, cf. §11).
- [x] Succès → modale fermée, toast affiché, liste rafraîchie.
- [x] Erreur → message d'erreur affiché **dans la modale**, qui reste ouverte, nouvel essai possible.
- [x] `tsc --noEmit` propre, lint propre sur les fichiers touchés.
- [ ] Revue visuelle en navigateur (via `USE_API_MOCKS`, l'endpoint réel n'existant pas).

---

## 13. Reste à faire après ce ticket

- [ ] Ticket 2.2 (ajout) : dernier `isDisabled` du module à lever (bouton « Ajouter un serveur »).
- [ ] Retirer les mocks (`USE_API_MOCKS`, `simulateBackupServerUpdate`) quand les 3 endpoints seront déployés.
- [ ] Relecture CDS des 6 traductions non-fr de `edit.*`.
- [ ] IAM sur le menu d'actions (édition + suppression).
- [ ] Trancher avec le PO le sort du « badge dédié » vs la réutilisation de `LicenseTypeCell` (§11).

---

## 14. Annexe — rappel du corps `PUT` (ticket vs réalité retenue)

Corps du ticket (noms de champs non alignés sur l'API réelle, cf. §4) :

```json
{
  "displayName": "<value>",
  "licenseType": "<value>",
  "backupServerExternalIp": ["<value>"],
  "backupServerPrivateIp": ["<value>"]
}
```

Corps effectivement envoyé par ce ticket, aligné sur `BackupServer.type.ts` (1216) :

```json
{
  "displayName": "<value>",
  "licenseType": "<value>",
  "externalIps": ["<value>"],
  "privateIps": ["<value>"]
}
```
