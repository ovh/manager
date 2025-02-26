import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';
import { useFlushArchive, useGetArchiveByName } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

export default function FlushArchivePage() {
  const { t } = useTranslation('containers/flush-archive');

  const { addSuccess, addError } = useNotifications();
  const { projectId, archiveName } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const archive = useGetArchiveByName(projectId, archiveName);

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER);

  const { flushArchive, isPending: isFlushArchivePending } = useFlushArchive({
    projectId,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/flush-archive">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_cold_archive_flush_error_delete',
              {
                containerName: archiveName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );

      trackErrorPage();
      goBack();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="containers/flush-archive">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_cold_archive_flush_success_message',
              {
                containerName: archiveName,
              },
            )
          }
        </Translation>,
        true,
      );

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    flushArchive(archiveName);
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const isPending = isFlushArchivePending || !archive;

  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_cold_archive_flush_title',
      )}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onClose}
      isPending={isPending}
      isDisabled={
        isPending || archive?.status === COLD_ARCHIVE_CONTAINER_STATUS.NONE
      }
      confirmationLabel={t(
        'pci_projects_project_storages_containers_container_cold_archive_flush_terminate_input_label',
      )}
      confirmationText="TERMINATE"
      submitText={t(
        'pci_projects_project_storages_containers_container_cold_archive_flush_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_container_cold_archive_flush_cancel_label',
      )}
    >
      <OdsMessage color="warning" className="w-full" isDismissible={false}>
        <div>
          <span className="block">
            {t(
              'pci_projects_project_storages_containers_container_cold_archive_flush_archive_status_archived_restored_warning_1',
              {
                containerName: archiveName,
                objetsCount: archive?.objectsCount,
              },
            )}
          </span>
          <span className="block mt-2">
            {t(
              'pci_projects_project_storages_containers_container_cold_archive_flush_archive_status_archived_restored_warning_2',
            )}
          </span>
        </div>
      </OdsMessage>
    </DeletionModal>
  );
}
