import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import { useRestoreArchive } from '@/api/hooks/useArchive';

export default function Restore() {
  const { t } = useTranslation('containers/restore');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'containers/restore',
  });

  const { projectId, archiveName } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}`,
  );

  const { restoreArchive, isPending } = useRestoreArchive({
    projectId,
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_restore_error_message',
        values: { containerName: archiveName },
        error,
      });

      trackErrorPage();
      goBack();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_restore_success_message',
        values: { containerName: archiveName },
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    restoreArchive(archiveName);
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_cold_archive_containers_container_restore_title',
      )}
      isDisabled={isPending}
      isPending={isPending}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      submitText={t(
        'pci_projects_project_storages_cold_archive_containers_container_restore_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_cold_archive_containers_container_restore_cancel_label',
      )}
    >
      <div className="flex flex-col gap-6">
        <OdsText preset="paragraph">
          <span
            dangerouslySetInnerHTML={{
              __html: t(
                'pci_projects_project_storages_cold_archive_containers_container_restore_description_1',
                { containerName: `<strong>${archiveName}</strong>` },
              ),
            }}
          ></span>
        </OdsText>
        <OdsText preset="paragraph">
          {t(
            'pci_projects_project_storages_cold_archive_containers_container_restore_description_2',
          )}
        </OdsText>
        <OdsText preset="paragraph">
          {t(
            'pci_projects_project_storages_cold_archive_containers_container_restore_description_3',
          )}
        </OdsText>
      </div>
    </PciModal>
  );
}
