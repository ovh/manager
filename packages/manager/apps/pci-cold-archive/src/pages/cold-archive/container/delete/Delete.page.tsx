import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProductRegionsAvailability } from '@/api/hooks/useProductRegionsAvailability';
import { useDeleteArchiveContainer } from '@/api/hooks/useArchive';

export default function DeletePage() {
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const { projectId } = useParams();
  const { archiveName } = useParams();
  const { t } = useTranslation('cold-archive/delete-container');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;
  const onClose = () => navigate('..');
  const onCancel = () => navigate('..');

  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(ovhSubsidiary);
  const {
    deleteArchiveContainer,
    isPending: isPendingDelete,
  } = useDeleteArchiveContainer({
    projectId,
    region: regions ? regions[0] : '',
    containerName: archiveName,
    onError() {
      addError(
        <Translation ns="cold-archive/delete-container">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_cold_archive_delete_error_delete',
              {
                containerName: archiveName,
                message: '',
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
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
      navigate('..');
    },
  });

  const onConfirm = () => deleteArchiveContainer();
  const isPending = isPendingDelete || isRegionsPending;
  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_title',
      )}
      confirmationLabel={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_terminate_input_label',
      )}
      confirmationText="TERMINATE"
      cancelText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_cancel_label',
      )}
      isPending={isPending}
      isDisabled={isPending}
      onCancel={onCancel}
      submitText={t(
        'pci_projects_project_storages_containers_container_cold_archive_delete_submit_label',
      )}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_containers_container_cold_archive_delete_description',
          { containerName: archiveName },
        )}
      </OdsText>
    </DeletionModal>
  );
}
