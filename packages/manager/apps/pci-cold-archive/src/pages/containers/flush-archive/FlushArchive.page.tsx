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

export default function FlushArchivePage() {
  const { addSuccess, addError } = useNotifications();
  const nagivate = useNavigate();
  const { projectId, archiveName } = useParams();
  const { t } = useTranslation('containers/flush-archive');
  const { tracking } = useContext(ShellContext).shell;
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

  const trackFlushArchiveModalClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}::${action}`,
      type: 'action',
    });
  };
  const trackFlushArchiveModalPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}_${action}`,
      type: 'navigation',
    });
  };

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
      trackFlushArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      nagivate('..');
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
      trackFlushArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
      nagivate('..');
    },
  });

  const onConfirm = () => {
    trackFlushArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    flushArchive();
  };
  const onCancel = () => {
    trackFlushArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    nagivate(`..`);
  };
  const onClose = () => onCancel();

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
