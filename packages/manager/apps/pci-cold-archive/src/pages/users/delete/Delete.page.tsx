import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUser, useGetUser } from '@/api/hooks/useUsers';

export default function UserDelete() {
  const { t } = useTranslation('users/delete');

  const { addSuccess, addError } = useNotifications();
  const { projectId, userId } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = goBack;
  const onClose = goBack;

  const { user, isPending: isUserPending } = useGetUser(
    projectId,
    Number(userId),
  );

  const { deleteUser, isPending: isDeletePending } = useDeleteUser({
    projectId,
    userId: user?.id,
    access: user?.access,
    onError() {
      addError(
        <Translation ns="users/delete">
          {(_t) =>
            _t('pci_projects_project_storages_containers_users_delete_error')
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="users/delete">
          {(_t) =>
            _t('pci_projects_project_storages_containers_users_delete_success')
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const onConfirm = () => deleteUser();

  const isPending = isDeletePending || isUserPending;

  return (
    <DeletionModal
      title={t('pci_projects_project_storages_containers_users_delete_title')}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      isDisabled={isPending || !user}
      submitText={t(
        'pci_projects_project_storages_containers_users_delete_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_users_delete_cancel',
      )}
    >
      <OdsText preset="paragraph">
        {t('pci_projects_project_storages_containers_users_delete_question')}
      </OdsText>
    </DeletionModal>
  );
}
