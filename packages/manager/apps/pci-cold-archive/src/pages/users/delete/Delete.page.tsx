import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useDeleteUser, useGetUser } from '@/api/hooks/useUsers';

export default function UserDelete() {
  const { t } = useTranslation('users/delete');

  const { projectId, userId } = useParams();

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'users/delete',
  });

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
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey: 'pci_projects_project_storages_containers_users_delete_error',
        error,
      });
      onClose();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_containers_users_delete_success',
      });
      onClose();
    },
  });

  const onConfirm = deleteUser;

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
