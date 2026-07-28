import React, { useId } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem, DataGridTextCell } from '@ovh-ux/manager-react-components';

import { subRoutes } from '@/routes/routes.constants';

interface BackupServerActionsCellProps {
  backupServerId: string;
  /** Désactive le menu entier : opération en cours sur la ligne. */
  isDisabled: boolean;
}

/**
 * Menu d'actions de ligne.
 *
 * « Supprimer » mène à la modale de suppression (BKP-1219). « Modifier » reste désactivée
 * jusqu'au ticket 2.3 : aucune entrée ne doit être inerte ni mener à une route inexistante.
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
  // Chemin relatif : la cellule est rendue sous la route `linked-servers`, ce qui donne
  // `/linked-servers/delete/{id}`.
  const deleteHref = useHref(`${subRoutes.delete}/${backupServerId}`);

  const actions: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      isDisabled: true,
      // TODO(BKP-2.3): retirer `isDisabled` et brancher la modale d'édition.
    },
    {
      id: 1,
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
      href: deleteHref,
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
