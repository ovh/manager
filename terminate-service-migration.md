# Migration — Résiliation de service VSPC (Backup Agent)

> Document de référence pour la migration de la fonctionnalité "Terminate service" depuis
> le repo `manager-beta` vers un repo cible. Contient endpoints, règles métier, types,
> composants, et traductions — suffisant pour une implémentation complète.

---

## 1. Contexte

Dans le manager Bare Metal, la page **Backup Agent** expose une carte "Service management"
(onglet Dashboard d'un VSPC Tenant). Cette carte affiche les informations de facturation et
un bouton **"Terminate service"** qui ouvre une modale de confirmation pour résilier le
service OVHcloud sous-jacent.

La fonctionnalité à migrer est **uniquement la résiliation du service** (pas la suppression
de vault, pas la suppression d'agent).

---

## 2. Flux utilisateur

```
[DashboardTab] → ServiceManagementCard
  → Bouton "Terminate service" (color=critical, variant=outline)
  → isDeleteOpen = true
  → <DeleteTenantModal> s'ouvre
    → Texte : "Un lien de confirmation vous sera envoyé par e-mail."
    → Clic "Confirm"
      → POST /services/{serviceId}/terminate
      → Toast succès → navigation vers listing (/bare-metal/backup-agent ou équivalent)
      → En cas d'erreur → Toast critical, modal fermée
```

---

## 3. Endpoints

### 3.1 Résoudre le `serviceId` OVHcloud à partir du `resourceId` VSPC

```
GET /services?resourceName={vspcResourceId}    (API v6)
Réponse : number[]
```

- `vspcResourceId` = valeur du champ `id` retourné par `GET /backupServices/tenant/{tenantId}/vspc/{vspcId}` (champ racine, pas dans `currentState`)
- La réponse est un tableau de nombres. Prendre `data[0] ?? null`.
- Retourne `[]` si l'utilisateur n'a pas les droits sur ce service → traiter comme "no access" (afficher un message "permissions insuffisantes").

### 3.2 Détail billing du service (optionnel — pour afficher date de création, renouvellement)

```
GET /services/{serviceId}    (API v6)
Réponse : ServiceDetails (voir section 5)
```

- Requête séquentielle : n'activer qu'une fois le `serviceId` connu.
- Utilisée pour afficher : date de création, prochaine date de renouvellement, mode de
  renouvellement, contacts.
- **Optionnelle pour la résiliation** — l'implémentation minimale n'en a pas besoin.

### 3.3 Résiliation (mutation principale)

```
POST /services/{serviceId}/terminate    (API v6)
Body : (vide)
Réponse : { terminationDate?: string }
```

- Pas de body à envoyer.
- Une fois la mutation réussie, OVHcloud envoie un **email de confirmation** à l'adresse du
  compte. L'utilisateur doit cliquer sur le lien dans l'email pour valider la résiliation.
- La mutation ne résilie pas immédiatement : elle initie le processus de résiliation avec
  confirmation par email.

### 3.4 Endpoints contextuels (pour obtenir vspcResourceId)

Ces endpoints sont nécessaires si le repo cible ne dispose pas déjà du `vspcResourceId` :

```
GET /backupServices/tenant                                     (API v2)
Réponse : Tenant[]   → { id: string; name: string }

GET /backupServices/tenant/{tenantId}/vspc                     (API v2)
Réponse : VSPCTenant[]

GET /backupServices/tenant/{tenantId}/vspc/{vspcId}            (API v2)
Réponse : Resource<VSPCTenant>  → champ racine `id` = vspcResourceId
```

---

## 4. Règles métier

1. **Confirmation email obligatoire** : `POST /services/{serviceId}/terminate` initie
   seulement le processus. L'utilisateur reçoit un email avec un lien à cliquer. Mentionner
   cela explicitement dans le texte de la modale.

2. **Bouton non affiché si "no access"** : si `GET /services?resourceName=...` retourne `[]`,
   l'utilisateur n'a pas les droits IAM pour gérer ce service. Le bouton "Terminate" ne doit
   pas apparaître (ou afficher un message d'avertissement).

3. **Bouton non affiché pendant le chargement** : tant que le `serviceId` n'est pas résolu,
   ne pas rendre le bouton (éviter un appel avec `serviceId = ""`).

4. **Texte d'aide sous le bouton** : une légende "Une étape de confirmation vous sera
   demandée." doit accompagner le bouton (pas seulement du texte dans la modale).

5. **Après résiliation réussie** : naviguer vers la page listing du service (équivalent de
   `/bare-metal/backup-agent` dans le repo source). Invalider le cache de la liste des
   tenants.

6. **En cas d'erreur réseau** : fermer la modale et afficher un toast d'erreur critical.
   Ne pas naviguer.

7. **Le serviceId est un `number` en interne** (retourné par l'API v6 comme `number[]`) mais
   est converti en `string` pour le passage au composant modal :
   `serviceId={serviceId != null ? String(serviceId) : ""}`.

---

## 5. Types TypeScript

```typescript
// Wrapper générique pour les ressources backupServices
interface Resource<T> {
  id: string;           // vspcResourceId — à passer à GET /services?resourceName=
  resourceStatus: ResourceStatus;
  currentState: T;
}

type ResourceStatus = "CREATING" | "DELETING" | "ERROR" | "READY" | "SUSPENDED" | "UPDATING";

interface VSPCTenant {
  id: string;
  name: string;
  region: string;
  accessUrl: string;
}

interface Tenant {
  id: string;
  name: string;
}

// Réponse de GET /services/{serviceId}
interface ServiceDetails {
  billing: {
    lifecycle: {
      current: {
        creationDate: string | null;
        state: "active" | "terminated" | string;
      };
    };
    nextBillingDate: string | null;
    renew: {
      current: {
        mode: "automatic" | "manual" | null;
        period: string | null;  // ISO 8601 duration ex: "P1M", "P1Y"
      };
    } | null;
  };
  customer: {
    contacts: Array<{
      customerCode: string;
      type: "administrator" | "billing" | "technical" | string;
    }>;
  };
}

// Props du composant modal
interface DeleteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  vspcName: string;    // currentState.name du VSPCTenant — affiché dans la modale
  serviceId: string;   // String(serviceId) — l'ID numérique converti en string
}
```

---

## 6. Composants source (repo manager-beta)

### 6.1 `DeleteTenantModal.tsx`

Chemin source : `src/pages/bare-metal/backup-agent/general/DeleteTenantModal.tsx`

```tsx
// Logique essentielle — à adapter selon les conventions du repo cible

const { mutateAsync: terminateService, isPending } = useTerminateVspcService();

const handleConfirm = async () => {
  try {
    await terminateService(serviceId);
    toast.success(t("deleteModal.successNotification", { name: vspcName }));
    navigate("/bare-metal/backup-agent"); // adapter selon le repo cible
  } catch {
    toast.critical(t("deleteModal.errorNotification"));
  } finally {
    onClose();
  }
};
```

Le composant utilise un `DeleteModal` générique (composant partagé MDS) avec :
- `serviceTypeName` : label du type de service (ex: "tenant")
- `serviceName` : nom du VSPC affiché dans le titre de la modale
- `onConfirmDelete` : callback de confirmation
- `loading` : désactive le bouton pendant la mutation
- Contenu body : `<Trans>` avec une balise `<strong>` pour mettre en gras "lien de confirmation" et "e-mail"

Si le repo cible n'a pas de `DeleteModal` partagé, la modale peut être construite manuellement
avec un titre, un texte de confirmation, et deux boutons (Annuler / Confirmer).

### 6.2 `ServiceManagementCard` dans `DashboardTab.tsx`

Chemin source : `src/pages/bare-metal/backup-agent/general/dashboard/DashboardTab.tsx` (l. 410–582)

Séquence de résolution des données :
```
1. useVspcTenant(tenantId, vspcId)         → Resource<VSPCTenant>
   → vspcDetail.id = vspcResourceId

2. useVspcServiceId(vspcResourceId)         → number | null
   → GET /services?resourceName={vspcResourceId}

3. useVspcServiceDetails(serviceId)         → ServiceDetails
   → GET /services/{serviceId}
```

États UI à gérer :
- `serviceLoading` : skeleton (tant que serviceId ou serviceDetails chargent)
- `hasNoAccess` : `serviceId === null` après chargement → message warning "permissions insuffisantes"
- `serviceNetworkError` : erreur réseau → message critical + bouton "Réessayer"
- Nominal : afficher les infos + bouton Terminate

Le bouton "Terminate" n'est rendu que si `!serviceLoading && !hasNoAccess`.

---

## 7. Hook mutation (TanStack Query)

```typescript
// À créer dans le fichier queries du repo cible

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTerminateVspcService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) =>
      // Adapter avec le wrapper API du repo cible (POST sans body sur /services/{id}/terminate)
      fetch(`/engine/apiv6/services/${serviceId}/terminate`, { method: "POST" })
        .then(res => res.json()),
    onSuccess: () => {
      // Invalider la liste des tenants pour forcer un rechargement
      void queryClient.invalidateQueries({ queryKey: ["backupAgent", "tenants"] });
      // Adapter la clé de cache selon les conventions du repo cible
    },
  });
}
```

Dans le repo source, l'utilitaire `ovhPostNoBody<T>(path)` appelle l'API OVH v6 sans body.
Adapter selon le système d'appel API du repo cible.

---

## 8. Traductions i18n (clés anglaises de référence)

### Fichier `actions.json` (espace de noms : `bare-metal/backup-agent/actions`)

```json
{
  "deleteModal": {
    "serviceTypeName": "tenant",
    "confirmationLinkInfo": "A <strong>confirmation link</strong> will be sent to you by <strong>email</strong>. You will need to click on this link to confirm the service termination.",
    "successNotification": "Your Tenant {{name}} has been successfully deleted",
    "errorNotification": "An error occurred while deleting the Tenant. Please try again later."
  }
}
```

### Fichier `dashboard.json` (espace de noms : `bare-metal/backup-agent/general/dashboard`)

```json
{
  "links": {
    "terminate": "Terminate service",
    "terminateHelperText": "A confirmation step will be required."
  }
}
```

Les 13 langues supportées dans le repo source :
`de`, `en`, `en-GB`, `es`, `es-US`, `fi-FI`, `fr-CA`, `it`, `pl`, `pt`, `pt-PT`, `cs-CZ`, `fr`

---

## 9. Résumé des fichiers à créer dans le repo cible

| Fichier | Contenu |
|---|---|
| `TerminateServiceModal.tsx` | Modale de confirmation (adapter le nom et le composant modal) |
| Fichier queries | Hook `useTerminateVspcService()` + `useVspcServiceId()` + `useVspcServiceDetails()` |
| Locales `actions.json` | Clés `deleteModal.*` (13 langues) |
| Locales `dashboard.json` | Clés `links.terminate` + `links.terminateHelperText` (13 langues) |
| Section dans la carte existante | Bouton + légende + intégration de la modale |

---

## 10. Points d'attention pour l'implémentation

- **`serviceId` est un `number`** retourné par l'API v6, à convertir en `string` pour la
  mutation `POST /services/{id}/terminate`.
- **La résolution du `serviceId` est en 2 temps** : d'abord le `vspcResourceId` (champ
  racine `id` du `Resource<VSPCTenant>`), puis `GET /services?resourceName=` pour obtenir
  le `serviceId` OVHcloud.
- **Le `vspcResourceId` ≠ `vspcId`** : `vspcId` est l'identifiant interne backupServices
  (utilisé dans les URLs `/backupServices/tenant/{tenantId}/vspc/{vspcId}`), tandis que
  `vspcResourceId` est le champ `id` à la racine de la réponse (pas dans `currentState`).
- **Ne pas confondre avec la suppression de vault** : `DELETE /backupServices/tenant/{tenantId}/vault/{vaultId}`
  est une action distincte, pas concernée par cette migration.

---

## 11. Conventions du repo cible (`packages/manager/modules/backup-agent`)

### 11.1 Chemins des fichiers à créer

```
src/
├── data/
│   ├── api/
│   │   └── services/
│   │       └── services.requests.ts          ← terminateService()
│   ├── hooks/
│   │   └── useTerminateVspcService.ts        ← hook mutation
│   └── queries/
│       └── queryKeys.ts                      ← ajouter queryKeys.tenants.vspc.serviceId()
├── pages/
│   └── services/
│       └── dashboard/
│           └── terminate/
│               └── TerminateService.page.tsx ← modale
├── routes/
│   ├── routes.tsx                            ← ajouter la route imbriquée
│   └── routes.constants.ts                  ← ajouter subRoutes.terminate + urls.terminate
└── public/translations/
    └── services/
        └── dashboard/
            ├── Messages_en_GB.json           ← ajouter les clés terminate_*
            ├── Messages_fr_FR.json
            └── ... (11 autres langues)
```

### 11.2 `servicesQueries.agoraServiceId` — déjà disponible

**Ne pas recréer** un hook pour `GET /services?resourceName=`. Il existe déjà dans
`src/data/queries/services.queries.ts` :

```typescript
// services.queries.ts — extrait existant
const agoraServiceId = (resourceName: string) =>
  queryOptions({
    queryKey: getResourceServiceIdQueryKey({ resourceName }),
    queryFn: () => getResourceServiceId({ resourceName }),
  });

export const servicesQueries = { all, agoraServiceId, withClient };
```

Usage dans la page modale :

```typescript
const { data: vspcDetail } = useQuery(tenantsQueries.withClient(queryClient).vspcDetail());
const vspcResourceId = vspcDetail?.id; // champ racine, PAS currentState.id

const { data: serviceIdData, isPending: isServiceIdLoading } = useQuery({
  ...servicesQueries.agoraServiceId(vspcResourceId!),
  enabled: !!vspcResourceId,
});
const serviceId = serviceIdData?.[0] ?? null;
const hasNoAccess = !isServiceIdLoading && vspcResourceId !== undefined && serviceId === null;
```

### 11.3 Client API — `postJSON` de `Client.api.ts`

Utiliser `postJSON` depuis `@/data/api/Client.api.ts` pour appeler l'API v6 sans body :

```typescript
// src/data/api/services/services.requests.ts
import { postJSON } from '@/data/api/Client.api';

export interface TerminateServiceResponse {
  terminationDate?: string;
}

export const terminateService = (serviceId: number): Promise<TerminateServiceResponse> =>
  postJSON<TerminateServiceResponse>('v6', `/services/${serviceId}/terminate`);
```

### 11.4 Hook mutation — pattern à suivre

Copier le pattern de `useDeleteVSPCTenant.ts` :

```typescript
// src/data/hooks/useTerminateVspcService.ts
import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { terminateService, TerminateServiceResponse } from '@/data/api/services/services.requests';
import { queryKeys } from '@/data/queries/queryKeys';

export const useTerminateVspcService = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<TerminateServiceResponse, ApiError, number>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: number) => terminateService(serviceId),
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      onSuccess?.(...params);
    },
    ...options,
  });
};
```

### 11.5 Notifications — `useNotifications`, pas `toast`

Le repo cible n'utilise **pas** de `toast`. Utiliser `useNotifications` de
`@ovh-ux/manager-react-components` :

```typescript
const { addSuccess, addError } = useNotifications();
// onSuccess → addSuccess(t('terminate_service_banner_success', { vspcName }))
// onError   → addError(t('terminate_service_banner_error'))
// onSettled → closeModal()  // = navigate('..')
```

### 11.6 Composant Modal

```typescript
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

<Modal
  isOpen
  heading={t('terminate_service_modal_title')}
  primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
  onPrimaryButtonClick={handleConfirm}
  isPrimaryButtonLoading={isPending}
  isPrimaryButtonDisabled={isPending}
  secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
  onSecondaryButtonClick={closeModal}
  onDismiss={closeModal}
  type={ODS_MODAL_COLOR.critical}
>
  <OdsText>{t('terminate_service_modal_content', { vspcName })}</OdsText>
</Modal>
```

### 11.7 Routes — modifications à apporter

**`routes.constants.ts`** — ajouter dans `subRoutes` et `urls` :

```typescript
export const subRoutes = {
  // ... existant ...
  terminate: 'terminate',   // ← ajouter
} as const;

export const urls = {
  // ... existant ...
  dashboardTenantTerminate: `/${subRoutes.service}/${subRoutes.terminate}`,   // ← ajouter
} as const;
```

**`routes.tsx`** — ajouter la route imbriquée sous `subRoutes.service` :

```tsx
const TerminateServicePage = React.lazy(
  () => import('@/pages/services/dashboard/terminate/TerminateService.page'),
);

// Dans le JSX, sous <Route path={subRoutes.service} ...>
<Route path={subRoutes.terminate} Component={TerminateServicePage} />
```

### 11.8 Traductions — namespace et fichiers

- Namespace : `BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD` = `module-backup-agent/services/dashboard`
- Dossier : `public/translations/services/dashboard/`

Clés à ajouter dans chaque `Messages_<lang>.json` du dossier dashboard :

```json
{
  "terminate_service_button": "Terminate service",
  "terminate_service_helper_text": "A confirmation step will be required.",
  "terminate_service_modal_title": "Terminate service",
  "terminate_service_modal_content": "A <strong>confirmation link</strong> will be sent to you by <strong>email</strong>. You will need to click on this link to confirm the termination of {{vspcName}}.",
  "terminate_service_banner_success": "The termination of {{vspcName}} has been initiated. Check your email to confirm.",
  "terminate_service_banner_error": "An error occurred while terminating the service. Please try again later.",
  "terminate_service_no_access": "You do not have sufficient permissions to terminate this service."
}
```

Langues à créer : `de`, `en`, `en-GB`, `es`, `es-US`, `fi-FI`, `fr-CA`, `it`, `pl`, `pt`,
`pt-PT`, `cs-CZ`, `fr` (fichiers `Messages_<lang>.json` — respecter la casse existante du
dossier, ex: `Messages_fr_FR.json` pour `fr`).

### 11.9 `queryKeys` — clé à ajouter (optionnel)

Si `servicesQueries.agoraServiceId` est utilisé directement via `getResourceServiceIdQueryKey`
(déjà géré), aucune clé custom n'est nécessaire. Si un accès centralisé est souhaité, ajouter
dans `queryKeys.ts` :

```typescript
tenants: {
  // ... existant ...
  vspc: {
    // ... existant ...
    serviceId: (resourceName: string) => [...queryKeys.tenants.vspc.all(), 'serviceId', resourceName],
  },
},
```

---

## 12. Checklist d'implémentation

```
[x] 1. Créer src/data/api/services/services.requests.ts → terminateService()
[x] 2. Créer src/data/hooks/useTerminateVspcService.ts
[x] 3. Créer src/pages/services/dashboard/terminate/TerminateService.page.tsx
        - useQuery(tenantsQueries.withClient(qc).vspcDetail()) → vspcResourceId + vspcName
        - useQuery(servicesQueries.agoraServiceId(vspcResourceId)) → serviceId
        - Gérer hasNoAccess (serviceId === null après chargement)
        - useMutation useTerminateVspcService → addSuccess/addError/closeModal
        - navigate('..') à onSettled (fermeture modale = retour parent)
[x] 4. Ajouter subRoutes.terminate + urls.dashboardTenantTerminate dans routes.constants.ts
[x] 5. Ajouter <Route path={subRoutes.terminate} Component={TerminateServicePage} /> dans routes.tsx
[x] 6. Mettre à jour GeneralInformation.page.tsx
        - BillingInformationsTileStandard déjà présent avec onResiliateLinkClick
        - onResiliateLinkClick redirige vers urls.dashboardTenantTerminate (était dashboardTenantDelete)
[x] 7. Ajouter les clés de traduction dans Messages_fr_FR.json (traductions FR uniquement)
```

### Notes d'implémentation

- Le bouton "Terminate" est géré par `BillingInformationsTileStandard` (déjà présent dans
  `GeneralInformation.page.tsx`). Ce composant gère l'appel à `GET /services?resourceName=`
  en interne et affiche le bouton uniquement si l'utilisateur a les droits IAM. Il n'a pas été
  nécessaire d'ajouter un bouton manuellement.
- La gestion des rôles (`hasNoAccess`) est doublement couverte : par `BillingInformationsTileStandard`
  (qui masque le bouton si pas de droits) et dans la modale elle-même (OdsMessage warning si
  `serviceId === null` après chargement).
- `navigate('..')` est utilisé dans `onSettled` (et non après succès uniquement) pour fermer
  la modale dans tous les cas, conformément au pattern `DeleteTenant.page.tsx`.
- Traductions ajoutées uniquement en français (`Messages_fr_FR.json`). Les autres langues
  restent à compléter si nécessaire.
