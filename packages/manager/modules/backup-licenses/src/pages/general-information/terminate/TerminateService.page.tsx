import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

/**
 * Modale de résiliation (BKP-1226, §7), route enfant de « General information ».
 *
 * Décision actée en session : contrairement aux précédents `backup-agent`/`okms` (qui se
 * contentent de fermer la modale), on redirige vers le hub une fois la mutation réglée —
 * succès ou échec — puisque la ressource résiliée n'a plus lieu d'être consultée. L'URL est
 * résolue dynamiquement via `useNavigationGetUrl` (comme le lien « Manage contacts ») plutôt
 * que codée en dur, pour rester correcte sur toutes les régions/environnements.
 */
export default function TerminateServicePage() {
  const ns = BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION;
  const { t } = useTranslation([ns, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  const { data: resourceName } = useQuery(
    backupLicenseQueries.withClient(queryClient).resourceName(),
  );
  const { data: hubUrl } = useNavigationGetUrl(['hub', '', {}]);

  const closeModal = () => navigate('..');
  const redirectToHub = () => {
    if (hubUrl) {
      window.location.href = hubUrl as string;
    } else {
      closeModal();
    }
  };

  const { terminateService, isPending } = useDeleteService({
    onSuccess: () => addSuccess(t(`${ns}:terminate_modal.success`)),
    onError: () => addError(t(`${ns}:terminate_modal.error`)),
    onSettled: () => redirectToHub(),
  });

  return (
    <Modal
      isOpen
      heading={t(`${ns}:terminate_modal.title`)}
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t(`${ns}:terminate_modal.confirm`)}
      primaryButtonTestId="terminate-service-submit"
      onPrimaryButtonClick={() => resourceName && terminateService({ resourceName })}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending || !resourceName}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
    >
      <OdsText>{t(`${ns}:terminate_modal.content`)}</OdsText>
    </Modal>
  );
}
