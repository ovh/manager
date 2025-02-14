import {
  DeletionModal,
  useProductRegionsAvailability,
} from '@ovh-ux/manager-pci-common';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  COLD_ARCHIVE_CONTAINER_STATUS,
  COLD_ARCHIVE_TRACKING,
} from '@/constants';
import { useArchives, useFlushArchive } from '@/api/hooks/useArchive';
import useTracking from '@/hooks/useTracking';

export default function FlushArchivePage() {
  const { t } = useTranslation('containers/flush-archive');

  const { addSuccess, addError } = useNotifications();
  const { projectId, archiveName } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const { data: allArchives, isPending: isPendingArchive } = useArchives(
    projectId,
  );
  const archive = allArchives?.find((a) => a.name === archiveName);

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER);

  const { flushArchive, isPending: isPendingStartArchive } = useFlushArchive({
    projectId,
    region: regions?.[0],
    containerName: archiveName,
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
    flushArchive();
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const isPending =
    isPendingArchive || isRegionsPending || isPendingStartArchive;

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
