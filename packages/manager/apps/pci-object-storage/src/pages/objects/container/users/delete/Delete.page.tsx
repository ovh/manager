import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
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
  const { data: listUsers, isPending: isPendingUsers } = useUsers(projectId);
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
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t('pci_projects_project_storages_containers_users_delete_question')}
      </OsdsText>
    </DeletionModal>
  );
}
