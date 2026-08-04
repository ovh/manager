import React, { useId } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_IAM_RULES } from '@/module.constants';
import { routeUrls, subRoutes } from '@/routes/routes.constants';

interface BackupServerActionsCellProps {
  backupServerId: string;
  /** Désactive le menu entier : opération en cours sur la ligne. */
  isDisabled: boolean;
  /** URN du serveur, pour le check IAM des actions « modifier »/« supprimer ». */
  urn?: string;
}

/**
 * Menu d'actions de ligne.
 *
 * « Modifier » mène à la page d'édition (BKP-1218), montée au même niveau que `order`
 * (cf. routes.tsx), pas sous `linked-servers`. « Supprimer » mène à la modale de suppression
 * (BKP-1219), rendue sous `linked-servers`.
 *
 * Pendant une opération en cours, c'est le menu entier qui est désactivé plutôt que ses deux
 * entrées : un bouton ⋮ grisé est plus lisible qu'un menu qui s'ouvre sur des entrées inertes.
 *
 * « Modifier » et « Supprimer » sont protégés par IAM (`vspc/backupLicenses/edit`/`.../delete`),
 * vérifié nous-mêmes via `useAuthorizationIam` plutôt que par les props `iamActions`/`urn`
 * natives d'`ActionMenuItem`, pour deux raisons :
 * 1. Dans `ActionMenu` (`@ovh-ux/manager-react-components`), un item portant un `href` est rendu
 *    en `<a href=...><OdsButton /></a>` *avant même* de regarder `iamActions` — son mécanisme
 *    `ManagerButton` (check + tooltip auto) est entièrement court-circuité.
 * 2. Même avec `isDisabled` posé sur l'item, l'`<a href>` qui l'enveloppe reste un lien natif
 *    pleinement cliquable/navigable : désactiver le bouton intérieur ne bloque pas la navigation.
 * On utilise donc `onClick` + `navigate()` (jamais `href`) pour que `isDisabled` bloque *réellement*
 * l'action — mêmes patron que `veeam-backup` (`DatagridCell.component.tsx::ActionCell`).
 * Fail-closed : tant que `urn` est absent (contrat API non confirmé, cf. API-STATUS.md) ou que
 * le check est en cours/négatif, l'entrée reste désactivée — jamais de bypass permissif.
 */
export default function BackupServerActionsCell({
  backupServerId,
  isDisabled,
  urn,
}: BackupServerActionsCellProps) {
  const id = useId();
  // `actions:modify` et non `actions:edit` : cette dernière clé vaut « Éditer », là où
  // l'AC du ticket demande « Modifier ».
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();

  const { isAuthorized: isEditAuthorized, isLoading: isEditIamLoading } = useAuthorizationIam(
    [BACKUP_LICENSES_IAM_RULES['vspc/backupLicenses/edit']],
    urn ?? '',
  );
  const { isAuthorized: isDeleteAuthorized, isLoading: isDeleteIamLoading } = useAuthorizationIam(
    [BACKUP_LICENSES_IAM_RULES['vspc/backupLicenses/delete']],
    urn ?? '',
  );
  const canEdit = !!urn && !isEditIamLoading && isEditAuthorized;
  const canDelete = !!urn && !isDeleteIamLoading && isDeleteAuthorized;

  const actions: ActionMenuItem[] = [
    {
      id: 0,
      label: t('modify'),
      onClick: () => navigate(routeUrls.edit(backupServerId)),
      isDisabled: !canEdit,
    },
    {
      id: 1,
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
      // Chemin relatif : la cellule est rendue sous la route `linked-servers`, ce qui donne
      // `/linked-servers/delete/{id}`.
      onClick: () => navigate(`${subRoutes.delete}/${backupServerId}`),
      isDisabled: !canDelete,
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
