import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciModal,
  useProductRegionsAvailability,
} from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestoreArchiveContainer } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING } from '@/constants';

export default function Restore() {
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { projectId, archiveName } = useParams();
  const { t } = useTranslation('cold-archive/restore');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const trackRestoreContainerModalClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}::${action}`,
      type: 'action',
    });
  };
  const trackRestoreContainerModalPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}_${action}`,
      type: 'navigation',
    });
  };

  const {
    restoreArchiveContainer,
    isPending: isPendingRestore,
  } = useRestoreArchiveContainer({
    projectId,
    region: regions?.[0],
    containerName: archiveName,
    onError(error: ApiError) {
      addError(
        <Translation ns="cold-archive/restore">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_restore_error_message',
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
      trackRestoreContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Translation ns="cold-archive/restore">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_restore_success_message',
              {
                containerName: archiveName,
              },
            )
          }
        </Translation>,
        true,
      );
      trackRestoreContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
      navigate('..');
    },
  });
  const onConfirm = () => {
    trackRestoreContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    restoreArchiveContainer();
  };
  const onCancel = () => {
    trackRestoreContainerModalPage(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    navigate('..');
  };
  const onClose = () => onCancel();

  const isPending = isPendingRestore || isRegionsPending;
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
