import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTracking } from '@/hooks/useTracking';
import { MANAGE_ARCHIVE_DOC_LINK } from '@/constants';
import { useDeleteArchive, useGetArchiveByName } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

export default function DeletePage() {
  const { t } = useTranslation('containers/delete');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addSuccess, addError } = useNotifications();
  const { projectId, archiveName } = useParams();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const documentationUrl = MANAGE_ARCHIVE_DOC_LINK[ovhSubsidiary];

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER);

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
        addError(
          <Translation ns="containers/delete">
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

        trackSuccessPage();
        goBack();
      },
      onSuccess() {
        addSuccess(
          <Translation ns="containers/delete">
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

        trackErrorPage();
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
        <OdsMessage color="warning" className="block" isDismissible={false}>
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
                    docUrl: documentationUrl(),
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
