import {
  DeletionModal,
  useProductRegionsAvailability,
} from '@ovh-ux/manager-pci-common';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useArchives, useDeleteArchiveContainer } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING, MANAGE_ARCHIVE_DOC_LINK } from '@/constants';

export default function DeletePage() {
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const { projectId } = useParams();
  const { archiveName } = useParams();
  const { t } = useTranslation('cold-archive/delete-container');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const getDocumentationUrl = () => {
    return MANAGE_ARCHIVE_DOC_LINK[ovhSubsidiary];
  };

  const { tracking } = useContext(ShellContext).shell;
  const trackDeleteContainerModalClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}::${action}`,
      type: 'action',
    });
  };
  const trackDeleteContainerModalPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}_${action}`,
      type: 'navigation',
    });
  };

  const onCancel = () => {
    trackDeleteContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    navigate('..');
  };
  const onClose = () => onCancel();

  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const { data: allArchives, isPending: isPendingAllArchives } = useArchives(
    projectId,
    regions?.[0],
  );
  const archive = allArchives?.find((a) => a.name === archiveName);
  const {
    deleteArchiveContainer,
    isPending: isPendingDelete,
  } = useDeleteArchiveContainer({
    projectId,
    region: regions?.[0],
    containerName: archiveName,
    onError(error: ApiError) {
      addError(
        <Translation ns="cold-archive/delete-container">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_cold_archive_delete_error_delete',
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
      trackDeleteContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Translation ns="cold-archive/delete-container">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_cold_archive_delete_success_message',
              {
                containerName: archiveName,
              },
            )
          }
        </Translation>,
        true,
      );
      trackDeleteContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      navigate('..');
    },
  });

  const onConfirm = () => {
    trackDeleteContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    deleteArchiveContainer();
  };
  const isPending = isPendingDelete || isRegionsPending || isPendingAllArchives;

  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_title',
      )}
      confirmationLabel={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_terminate_input_label',
      )}
      confirmationText={archive.objectsCount > 0 ? undefined : 'TERMINATE'}
      cancelText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_cancel_label',
      )}
      isPending={isPending}
      isDisabled={archive.objectsCount > 0 || isPending}
      onCancel={onCancel}
      submitText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_submit_label',
      )}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {archive.objectsCount > 0 ? (
        <OdsMessage color="warning" className="block">
          <div>
            <span className="block w-full">
              {t(
                'pci_projects_project_storages_containers_container_cold_archive_delete_archive_status_active_warning_1',
                {
                  containerName: archiveName,
                  objetsCount: archive.objectsCount,
                },
              )}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  'pci_projects_project_storages_containers_container_cold_archive_delete_archive_status_active_warning_2',
                  {
                    docUrl: getDocumentationUrl(),
                  },
                ),
              }}
            />
          </div>
        </OdsMessage>
      ) : (
        <OdsText preset="paragraph" className="block">
          {t(
            'pci_projects_project_storages_containers_container_cold_archive_delete_description',
            { containerName: archiveName },
          )}
        </OdsText>
      )}
    </DeletionModal>
  );
}
