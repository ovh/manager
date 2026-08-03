import React, { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useDeleteBackupServer } from '@/data/hooks/useDeleteBackupServer/useDeleteBackupServer';
import { backupServersQueries } from '@/data/queries/backupServers.queries';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

/**
 * Modale de suppression d'un serveur VBR (BKP-1219), route enfant de la liste.
 *
 * L'échec reste **dans la modale** au lieu d'être poussé en toast comme le fait le module frère
 * `backup-agent` : l'AC du ticket l'exige, et l'utilisateur peut ainsi réessayer sans rouvrir
 * la modale. Le toast est donc réservé au succès.
 */
export default function DeleteBackupServerPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();
  const { backupServerId } = useParams<{ backupServerId: string }>();

  const closeModal = () => navigate('..');

  // Pas de query de détail : la route citée par le ticket 1220 est probablement une coquille
  // (cf. §11 de la spec BKP-1216). La liste est déjà en cache dès lors qu'on ouvre la modale
  // depuis le tableau ; sur un accès direct par URL, c'est la page parente qui la charge.
  const { data: servers, isPending: areServersPending } = useQuery(
    backupServersQueries.withClient(queryClient).list(),
  );
  const server = servers?.find(({ id }) => id === backupServerId);
  const serverName = server?.currentState.displayName;

  const {
    mutate: deleteBackupServer,
    isPending,
    isSuccess,
    error,
  } = useDeleteBackupServer({
    onSuccess: () => {
      addSuccess(t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:delete.success`, { serverName }));
      closeModal();
    },
  });

  // Serveur introuvable une fois la liste chargée (lien obsolète, serveur déjà supprimé) : la
  // liste rafraîchie derrière fait foi, on y renvoie sans message d'erreur.
  // `isPending`/`isSuccess` gardent cet effet pendant la mutation : la liste est invalidée
  // avant notre `onSuccess`, donc la ligne peut disparaître du cache avant que le toast soit
  // poussé — démonter la modale à ce moment-là ferait sauter le toast.
  useEffect(() => {
    if (!areServersPending && !server && !isPending && !isSuccess) {
      navigate('..', { replace: true });
    }
  }, [areServersPending, server, isPending, isSuccess, navigate]);

  return (
    <Modal
      isOpen
      heading={t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:delete.title`)}
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      primaryButtonTestId="delete-backup-server-submit"
      onPrimaryButtonClick={() => backupServerId && deleteBackupServer(backupServerId)}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending || !server}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
    >
      <div className="flex flex-col gap-4">
        {!!error && (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.critical}
            isDismissible={false}
            data-testid="delete-backup-server-error"
          >
            <OdsText>
              {[
                t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:delete.error`, { serverName }),
                error.response?.data?.message,
              ]
                .filter(Boolean)
                .join(' ')}
            </OdsText>
          </OdsMessage>
        )}
        <OdsText>
          <Trans
            ns={BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}
            i18nKey="delete.content"
            values={{ serverName }}
            components={{ strong: <span className="font-bold" /> }}
          />
        </OdsText>
      </div>
    </Modal>
  );
}
