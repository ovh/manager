import { useContext } from 'react';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useAllStorages, useDeleteStorage } from '@/api/hooks/useStorages';
import { PAGE_PREFIX } from '@/tracking.constants';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('containers/delete');
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { projectId } = useParams();
  const onClose = () => navigate(`..`);
  const onCancel = () => {
    navigate(`..`);
    tracking?.trackClick({
      name: `${PAGE_PREFIX}storages::objects::delete::cancel`,
      type: 'action',
    });
  };
  const [searchParams] = useSearchParams();

  const { data: storages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );
  const storageToDelete = storages?.resources?.find(
    (storage) => storage.name === searchParams.get('containerId'),
  );
  const isStorageS3 = !!storageToDelete?.s3StorageType;
  const isDeletionDisabled =
    !storageToDelete?.containerType && storageToDelete?.objects?.length > 0;

  const { deleteStorage, isPending: isPendingDelete } = useDeleteStorage({
    projectId,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_delete_error_delete',
              {
                container: storageToDelete?.name,
                message:
                  error?.response?.data?.message || error?.message || null,
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
        <Translation ns="containers/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_delete_success_message',
              { container: storageToDelete?.name },
            )
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const isPending = isPendingDelete || isStoragesPending;

  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_delete_object_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={() => {
        deleteStorage(storageToDelete);
        tracking?.trackClick({
          name: `${PAGE_PREFIX}storages::objects::delete::confirm`,
          type: 'action',
        });
      }}
      isPending={isPending}
      isDisabled={!storageToDelete || isPending || isDeletionDisabled}
      submitText={t(
        'pci_projects_project_storages_containers_container_delete_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_container_delete_cancel_label',
      )}
    >
      <OdsText preset="paragraph">
        <OdsMessage color="warning" className="mt-6">
          {t(
            isStorageS3
              ? 'pci_projects_project_storages_containers_container_delete_warning'
              : 'pci_projects_project_storages_containers_container_delete_object_erase_message',
            { container: storageToDelete?.name },
          )}
        </OdsMessage>
      </OdsText>
    </DeletionModal>
  );
}
