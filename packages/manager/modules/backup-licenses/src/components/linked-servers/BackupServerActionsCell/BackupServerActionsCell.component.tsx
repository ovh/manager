import React, { useId } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem, DataGridTextCell } from '@ovh-ux/manager-react-components';

import { routeUrls } from '@/routes/routes.constants';

interface BackupServerActionsCellProps {
  backupServerId: string;
  /** Désactive le menu entier : opération en cours sur la ligne. */
  isDisabled: boolean;
}

/**
 * Menu d'actions de ligne.
 *
 * « Modifier » mène à la page d'édition (BKP-1218), montée au même niveau que `order`
 * (cf. routes.tsx), pas sous `linked-servers`. `ActionMenu` rend un `<a href>` classique (pas
 * un `Link` React Router) : l'`href` doit passer par `useHref` pour être résolu dans le
 * référentiel du routeur (préfixe `#`/basename de l'app hôte) plutôt qu'être un chemin de
 * navigateur littéral, qui sortirait l'utilisateur du SPA.
 *
 * « Supprimer » reste inerte (BKP-2.4, hors périmètre de cette branche).
 *
 * Pendant une opération en cours, c'est le menu entier qui est désactivé plutôt que ses deux
 * entrées : un bouton ⋮ grisé est plus lisible qu'un menu qui s'ouvre sur des entrées inertes.
 */
export default function BackupServerActionsCell({
  backupServerId,
  isDisabled,
}: BackupServerActionsCellProps) {
  const id = useId();
  // `actions:modify` et non `actions:edit` : cette dernière clé vaut « Éditer », là où
  // l'AC du ticket demande « Modifier ».
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const editHref = useHref(routeUrls.edit(backupServerId));

  const actions: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      href: editHref,
    },
    {
      id: 1,
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
      // TODO(BKP-2.4): brancher la modale de suppression sur `onClick`.
    },
  ];

  return (
    <DataGridTextCell>
      <ActionMenu
        id={id}
        items={actions}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        isDisabled={isDisabled}
      />
    </DataGridTextCell>
  );
}
