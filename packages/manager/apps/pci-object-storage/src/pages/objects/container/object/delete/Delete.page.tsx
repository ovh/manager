import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDeleteObject } from '@/api/hooks/useObject';
import { useStorage } from '@/api/hooks/useStorages';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('objects/delete');

  const navigate = useNavigate();
  const { projectId, storageId, objectName } = useParams();
  const decodedObjectName = objectName.replace(/~2F/g, '/');
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const { storage, isPending: isPendingStorage } = useStorage(
    projectId,
    region,
    storageId,
  );
  const goBack = () => navigate(`../?region=${region}`);
  const onCancel = goBack;
  const onClose = goBack;
  const { deleteObject, isPending: isPendingDelete } = useDeleteObject({
    projectId,
    objectName: decodedObjectName,
    storage,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="objects/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_object_delete_object_error_delete',
              {
                object: decodedObjectName,
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
        <Translation ns="objects/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_object_delete_object_success_message',
              {
                object: decodedObjectName,
              },
            )
          }
        </Translation>,
        true,
      );
      goBack();
    },
  });
  const onConfirm = () => {
    deleteObject();
    goBack();
  };
  const isPending = isPendingStorage || isPendingDelete;
  return (
    <DeletionModal
      title={t(
        'pci_projects_project_storages_containers_container_object_delete_object_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      isDisabled={isPending}
      submitText={t(
        'pci_projects_project_storages_containers_container_object_delete_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_container_object_delete_cancel_label',
      )}
    >
      <OdsText>
        {t(
          'pci_projects_project_storages_containers_container_object_delete_content',
          { object: decodedObjectName },
        )}
      </OdsText>
    </DeletionModal>
  );
}
