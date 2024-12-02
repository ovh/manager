import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteObject } from '@/api/hooks/useObject';
import { useStorage } from '@/api/hooks/useStorages';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('pci-storages-containers-object-delete');
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
  const onCancel = () => navigate(`../`);
  const onClose = () => navigate(`../`);
  const { deleteObject, isPending: isPendingDelete } = useDeleteObject({
    projectId,
    objectName: decodedObjectName,
    storage,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="pci-storages-containers-object-delete">
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
        <Translation ns="pci-storages-containers-object-delete">
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
      navigate('..');
    },
  });
  const onConfirm = () => {
    deleteObject();
    navigate(`..`);
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
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_storages_containers_container_object_delete_content',
          { object: decodedObjectName },
        )}
      </OsdsText>
    </DeletionModal>
  );
}
