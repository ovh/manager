import React, { useId } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem, DataGridTextCell } from '@ovh-ux/manager-react-components';

interface BackupServerActionsCellProps {
  /** Désactive le menu entier : opération en cours sur la ligne. */
  isDisabled: boolean;
}

/**
 * Menu d'actions de ligne.
 *
 * Les deux entrées sont actives mais sans effet, en attendant les tickets 2.3 (édition) et
 * 2.4 (suppression) : c'est un état de revue visuelle, demandé pour juger le rendu du menu.
 * La spec BKP-1216 (§2.3/2.4) les veut au contraire **désactivées** tant que les modales
 * n'existent pas, une entrée inerte étant trompeuse pour l'utilisateur final : remettre
 * `isDisabled: true` avant la PR, ou brancher les modales sur les `onClick`.
 *
 * Pendant une opération en cours, c'est le menu entier qui est désactivé plutôt que ses deux
 * entrées : un bouton ⋮ grisé est plus lisible qu'un menu qui s'ouvre sur des entrées inertes.
 */
export default function BackupServerActionsCell({ isDisabled }: BackupServerActionsCellProps) {
  const id = useId();
  // `actions:modify` et non `actions:edit` : cette dernière clé vaut « Éditer », là où
  // l'AC du ticket demande « Modifier ».
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  const actions: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      // TODO(BKP-2.3): brancher la modale d'édition sur `onClick`.
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
