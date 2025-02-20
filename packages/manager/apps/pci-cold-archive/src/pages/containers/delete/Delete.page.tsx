import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import { MANAGE_ARCHIVE_DOC_LINK } from '@/constants';
import { useDeleteArchive, useGetArchiveByName } from '@/api/hooks/useArchive';

export default function DeletePage() {
  const { t } = useTranslation('containers/delete');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'containers/delete',
  });

  const { projectId, archiveName } = useParams();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const documentationUrl = MANAGE_ARCHIVE_DOC_LINK[ovhSubsidiary];

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}`,
  );

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const archive = useGetArchiveByName(projectId, archiveName);

  const { deleteArchive, isPending: isDeleteArchivePending } = useDeleteArchive(
    {
      projectId,
      onError(error: ApiError) {
        addErrorMessage({
          i18nKey:
            'pci_projects_project_storages_containers_container_cold_archive_delete_error_delete',
          error,
          values: {
            containerName: archiveName,
          },
        });

        trackErrorPage();
        goBack();
      },
      onSuccess() {
        addSuccessMessage({
          i18nKey:
            'pci_projects_project_storages_containers_container_cold_archive_delete_success_message',
          values: {
            containerName: archiveName,
          },
        });

        trackSuccessPage();
        goBack();
      },
    },
  );

  const onConfirm = () => {
    trackConfirmAction();
    deleteArchive(archiveName);
  };

  const isPending = isDeleteArchivePending || !archive;

  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_title',
      )}
      confirmationLabel={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_terminate_input_label',
      )}
      confirmationText={archive?.objectsCount > 0 ? undefined : 'TERMINATE'}
      cancelText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_cancel_label',
      )}
      isPending={isPending}
      isDisabled={archive?.objectsCount > 0 || isPending}
      onCancel={onCancel}
      submitText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_submit_label',
      )}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {archive?.objectsCount > 0 ? (
        <OdsMessage
          color="warning"
          className="block"
          isDismissible={false}
          data-testid="delete-archive_warning-message"
        >
          <div>
            <span className="block w-full">
              {t(
                'pci_projects_project_storages_containers_container_cold_archive_delete_archive_status_active_warning_1',
                {
                  containerName: archiveName,
                  objetsCount: archive?.objectsCount,
                },
              )}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  'pci_projects_project_storages_containers_container_cold_archive_delete_archive_status_active_warning_2',
                  {
                    docUrl: documentationUrl,
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
