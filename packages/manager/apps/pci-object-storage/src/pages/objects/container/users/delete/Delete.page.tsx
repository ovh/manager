import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useDeleteUser, useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('objects/users/delete');
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate(`..`);
  const onCancel = () => navigate(`..`);
  const [user, setUser] = useState<TUser>(undefined);
  const {
    validUsersWithCredentials: listUsers,
    isPending: isPendingUsers,
  } = useUsers(projectId);
  const { deleteUser, isPending: isPendingDelete } = useDeleteUser({
    projectId,
    userId,
    access: user?.access,
    onError() {
      addError(
        <Translation ns="objects/users/delete">
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
        <Translation ns="objects/users/delete">
          {(_t) =>
            _t('pci_projects_project_storages_containers_users_delete_success')
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  useEffect(() => {
    if (listUsers) {
      setUser(listUsers.find((u) => `${u.id}` === userId));
    }
  }, [listUsers]);
  const onConfirm = () => deleteUser();
  const isPending = isPendingDelete || isPendingUsers;
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
