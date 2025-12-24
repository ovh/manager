# Guide : Implémentation d'une Modal avec Route (MUK)

Ce guide présente les bonnes pratiques pour implémenter une modal qui s'affiche dans l'UI et qui a une route correspondante, en utilisant les composants MUK (`@ovh-ux/muk`).

## Vue d'ensemble

L'approche consiste à créer une page route qui contient directement un composant Modal de MUK. Cette approche est utilisée dans `bmc-nasha`.

**Package utilisé** : `@ovh-ux/muk` (MUK) pour les composants `Modal` et `UpdateNameModal`

## Usage

Les modals sont utilisées dans différents cas :

- **Alerter les utilisateurs** sur quelque chose qui nécessite leur accord
- **Confirmer une décision** de l'utilisateur
- **Notifier l'utilisateur** d'une information importante

## Types de modals

Il existe cinq types de modals selon l'usage :

- **`neutral`** : Réservé pour les alertes standard
- **`information`** : Fournit des informations contextuelles aux utilisateurs
- **`success`** : Réservé pour fournir des informations de succès statiques et persistantes
- **`warning`** : Réservé pour les modals qui nécessitent l'attention et l'acquittement de l'utilisateur mais qui ne causent pas nécessairement d'erreurs
- **`critical`** : Réservé pour les erreurs, les dysfonctionnements, ainsi que les problèmes critiques

Les modals peuvent être **dismissable** (fermables) ou non, via la propriété `dismissible`.

## Exemple : Modal de suppression avec MUK

```typescript
// packages/manager/apps/bmc-nasha/src/pages/dashboard/partition/snapshots/delete/DeleteSnapshot.page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseLayout, Modal, MODAL_COLOR } from '@ovh-ux/muk';
import { useDeleteSnapshot } from '@/hooks/partitions/useDeleteSnapshot';

export default function DeleteSnapshotPage() {
  const { serviceName, partitionName, customSnapshotName } = useParams();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const deleteSnapshotMutation = useDeleteSnapshot();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    navigate('..', { replace: true });
  };

  const handleConfirm = async () => {
    try {
      const result = await deleteSnapshotMutation.mutateAsync({
        serviceName,
        partitionName,
        customSnapshotName: decodeURIComponent(customSnapshotName),
      });

      const taskId = result?.taskId || result?.id;
      if (taskId) {
        navigate(`../task-tracker`, {
          state: { taskId, operation: 'clusterLeclercCustomSnapDelete' },
        });
      } else {
        navigate('..');
      }
    } catch (error) {
      // Error is handled by the mutation hook
      // Keep modal open on error
    }
  };

  return (
    <BaseLayout>
      <Modal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        type={MODAL_COLOR.critical}
        heading={t('partition:snapshots.delete.title', 'Delete a snapshot')}
        primaryButton={{
          label: t('partition:snapshots.delete.submit', 'Delete snapshot'),
          onClick: handleConfirm,
          loading: deleteSnapshotMutation.isPending,
          testId: 'delete-snapshot-confirm',
        }}
        secondaryButton={{
          label: t('partition:snapshots.delete.cancel', 'Close'),
          onClick: handleClose,
          testId: 'delete-snapshot-cancel',
        }}
      >
        <p>
          {t('partition:snapshots.delete.content', {
            name: decodeURIComponent(customSnapshotName || ''),
            partitionName,
          })}
        </p>
      </Modal>
    </BaseLayout>
  );
}
```

## Exemple : Modal de mise à jour de nom avec MUK

```typescript
// packages/manager/apps/bmc-nasha/src/pages/dashboard/edit-name/EditName.page.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { UpdateNameModal } from '@ovh-ux/muk';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { APP_FEATURES } from '@/App.constants';

export default function EditNamePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['edit-name']);
  const navigate = useNavigate();
  const { data: nasha, isLoading } = useNashaDetail(serviceName ?? '');
  const [customName, setCustomName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (nasha) {
      setCustomName(nasha.customName || '');
    }
  }, [nasha]);

  const handleClose = () => {
    navigate('..', { replace: true });
  };

  const handleUpdateName = async (newName: string) => {
    if (!serviceName || !nasha) return;

    setIsUpdating(true);
    setError(null);

    try {
      await httpV6.put(`${APP_FEATURES.listingEndpoint}/${serviceName}`, {
        customName: newName.trim(),
      });

      navigate('..', {
        replace: true,
        state: { success: t('edit-name:success', 'Name updated successfully') },
      });
    } catch (err) {
      setError(err as Error);
      setIsUpdating(false);
    }
  };

  if (isLoading || !nasha) {
    return <div>Loading...</div>;
  }

  return (
    <UpdateNameModal
      isOpen={true}
      headline={t('edit-name:title', { name: nasha.serviceName })}
      description={t('edit-name:description', 'Update the display name')}
      inputLabel={t('edit-name:label', { name: nasha.serviceName })}
      defaultValue={customName}
      isLoading={isUpdating}
      onClose={handleClose}
      updateDisplayName={handleUpdateName}
      error={error ? error.message : null}
      cancelButtonLabel={t('edit-name:cancel', 'Cancel')}
      confirmButtonLabel={t('edit-name:confirm', 'Confirm')}
    />
  );
}
```

## Configuration de la route

Les modals sont définies comme routes enfants dans la configuration des routes :

```typescript
// routes.tsx
{
  path: 'dashboard/partition/:partitionName/snapshots',
  ...lazyRouteConfig(() => import('@/pages/dashboard/partition/snapshots/Snapshots.page')),
  children: [
    {
      path: 'delete/:customSnapshotName',
      ...lazyRouteConfig(() =>
        import('@/pages/dashboard/partition/snapshots/delete/DeleteSnapshot.page')
      ),
    },
  ],
}
```

## Exemple de définition complète

```typescript
import { Modal, MODAL_COLOR } from '@ovh-ux/muk';

<Modal
  heading={'Example of modal'}
  type={MODAL_COLOR.warning}
  loading={false}
  primaryButton={{
    label: 'Confirm',
    loading: false,
    onClick: () => {},
    disabled: false,
  }}
  secondaryButton={{
    label: 'Cancel',
    loading: false,
    onClick: () => {},
    disabled: false,
  }}
  onOpenChange={() => {}}
  open={true}
  dismissible={true}
>
  <div>Example of content</div>
</Modal>
```

## Fonctionnalité Step Indicator

La modal peut afficher un indicateur de progression "Step X of Y" dans l'en-tête.

### Exemple avec Step Indicator

```typescript
import { Modal, MODAL_COLOR } from '@ovh-ux/muk';

<Modal
  heading={'Multi-step modal'}
  type={MODAL_COLOR.information}
  open={true}
  step={{
    current: 2,
    total: 5,
  }}
  primaryButton={{
    label: 'Next',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
  onOpenChange={() => {}}
>
  <div>Step 2 content</div>
</Modal>
```

**Note** : Pour afficher l'indicateur de progression, il faut définir à la fois `heading`, `step.current` et `step.total`.

## Points importants

- **Utiliser `BaseLayout`** : Wrapper la page avec `BaseLayout` de MUK
- **État `open`** : Le composant `Modal` de MUK gère l'état `open` via `useState(true)`
- **Type de modal** : Utiliser `MODAL_COLOR` pour définir le type de modal (neutral, information, success, warning, critical)
- **Dismissible** : Utiliser `dismissible={true}` (par défaut) ou `dismissible={false}` pour empêcher la fermeture
- **Configuration des boutons** : Les boutons sont configurés via `primaryButton` et `secondaryButton`
- **Step Indicator** : Utiliser la propriété `step` avec `current` et `total` pour afficher la progression
- **Composants spécialisés** : Pour les modals spécialisées, utiliser des composants dédiés comme `UpdateNameModal`
- **Navigation** : Toujours utiliser `navigate('..', { replace: true })` pour fermer la modal

## Bonnes pratiques

### 1. Navigation

- **Utiliser des chemins relatifs** : `navigate('..', { replace: true })` pour fermer la modal
- **Navigation après succès** : Naviguer vers la page parent ou une URL spécifique après une action réussie
- **Gestion des erreurs** : Ne pas naviguer en cas d'erreur, laisser l'utilisateur corriger (garder la modal ouverte)

### 2. État de chargement

- **Afficher un état de chargement** pendant le chargement des données nécessaires à la modal
- **Désactiver les boutons** pendant les mutations en utilisant la propriété `loading` sur les boutons

### 3. Fermeture de la modal

- **Dismissible** : Par défaut, les modals sont dismissable (`dismissible={true}`). Utiliser `dismissible={false}` pour empêcher la fermeture
- **Fermeture par clic extérieur** : Géré automatiquement par le composant `Modal` de MUK via `onOpenChange` (si `dismissible={true}`)
- **Fermeture par Escape** : Géré automatiquement par le composant `Modal` de MUK (si `dismissible={true}`)
- **Fermeture par bouton** : Utiliser `navigate('..', { replace: true })` dans le handler

### 4. Structure des fichiers

```
pages/
  dashboard/
    partition/
      snapshots/
        Snapshots.page.tsx          # Page parent
        delete/
          DeleteSnapshot.page.tsx    # Page de la modal
```

### 5. Routes

- **Routes imbriquées** : Les modals sont définies comme `children` de la route parent
- **Lazy loading** : Utiliser `lazyRouteConfig` pour le chargement paresseux
- **Paramètres d'URL** : Utiliser les paramètres d'URL pour passer les données nécessaires à la modal

### 6. Composants MUK

- **Modal** : Composant de base pour les modals génériques
- **UpdateNameModal** : Composant spécialisé pour la mise à jour de nom
- **BaseLayout** : Layout de base pour wrapper les pages
- **MODAL_COLOR** : Enum pour définir le type de modal (neutral, information, success, warning, critical)

### 7. Propriétés du composant Modal

- **`heading`** : Titre de la modal (optionnel)
- **`type`** : Type de modal (`MODAL_COLOR.neutral`, `MODAL_COLOR.information`, `MODAL_COLOR.success`, `MODAL_COLOR.warning`, `MODAL_COLOR.critical`)
- **`loading`** : Affiche un spinner pendant le chargement
- **`primaryButton`** : Configuration du bouton principal (`label`, `loading`, `disabled`, `onClick`, `testId`)
- **`secondaryButton`** : Configuration du bouton secondaire (`label`, `loading`, `disabled`, `onClick`, `testId`)
- **`step`** : Indicateur de progression (`current`, `total`) - nécessite `heading` pour s'afficher
- **`dismissible`** : Permet de fermer la modal (par défaut `true`)
- **`onOpenChange`** : Callback appelé quand l'état d'ouverture change
- **`open`** : État d'ouverture de la modal
- **`children`** : Contenu de la modal

## Exemple complet : Modal de suppression de partition

```typescript
// packages/manager/apps/bmc-nasha/src/pages/dashboard/partitions/delete/DeletePartition.page.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseLayout, Modal, MODAL_COLOR } from '@ovh-ux/muk';
import { useDeletePartition } from '@/hooks/partitions/useDeletePartition';

export default function DeletePartitionPage() {
  const { serviceName, partitionName } = useParams();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const deletePartitionMutation = useDeletePartition();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    navigate('..', { replace: true });
  };

  const handleConfirm = async () => {
    if (!serviceName || !partitionName) {
      return;
    }

    try {
      const result = await deletePartitionMutation.mutateAsync({
        serviceName,
        partitionName,
      });

      const taskId = result?.taskId || result?.id;
      if (taskId) {
        navigate(`../../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercPartitionDelete',
            params: { partitionName },
          },
        });
      } else {
        navigate('../');
      }
    } catch (error) {
      // Error is handled by the mutation hook
      // Keep modal open on error
    }
  };

  return (
    <BaseLayout>
      <Modal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        type={MODAL_COLOR.critical}
        heading={t('partition:delete.title', 'Delete a partition')}
        primaryButton={{
          label: t('partition:delete.submit', 'Delete partition'),
          onClick: handleConfirm,
          loading: deletePartitionMutation.isPending,
          testId: 'delete-partition-confirm',
        }}
        secondaryButton={{
          label: t('partition:delete.cancel', 'Cancel'),
          onClick: handleClose,
          testId: 'delete-partition-cancel',
        }}
      >
        <p>
          {t('partition:delete.content', {
            partitionName,
          })}
        </p>
      </Modal>
    </BaseLayout>
  );
}
```

## Résumé

- **Package** : Utiliser `@ovh-ux/muk` pour tous les composants modals
- **Structure** : Créer une page route qui contient directement le composant Modal
- **Layout** : Wrapper avec `BaseLayout` de MUK
- **Navigation** : Utiliser `navigate('..', { replace: true })` pour fermer la modal
- **État** : Gérer l'état `open` avec `useState(true)`
- **Types** : Utiliser les types appropriés (neutral, information, success, warning, critical)
- **Dismissible** : Par défaut `true`, utiliser `dismissible={false}` pour empêcher la fermeture
- **Boutons** : Configurer via `primaryButton` et `secondaryButton`
- **Step Indicator** : Utiliser `step={{ current: X, total: Y }}` pour afficher la progression
- **Composants spécialisés** : Utiliser `UpdateNameModal` ou autres composants dédiés de MUK selon les besoins
