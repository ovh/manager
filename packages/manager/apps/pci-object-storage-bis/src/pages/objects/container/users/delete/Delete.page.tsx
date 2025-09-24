import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useDeleteUser, useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';
import { TRACKING_PREFIX } from '@/constants';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('objects/users/delete');

  const { tracking } = useContext(ShellContext).shell;

  const { projectId, userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<TUser>(undefined);

  const onClose = () => navigate(`..`);

  const onCancel = () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}s3-policies-users::delete::cancel`,
      type: 'action',
    });

    onClose();
  };

  const {
    validUsersWithCredentials: listUsers,
    isPending: isPendingUsers,
  } = useUsers(projectId);

  const { deleteUser, isPending: isPendingDelete } = useDeleteUser({
    projectId,
    userId,
    access: user?.access,
    onError() {
      tracking?.trackPage({
        name: `${TRACKING_PREFIX}s3-policies-users::delete-success`,
        type: 'navigation',
      });

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
      tracking?.trackPage({
        name: `${TRACKING_PREFIX}s3-policies-users::delete-error`,
        type: 'navigation',
      });

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

  const onConfirm = () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}s3-policies-users::delete::confirm`,
      type: 'action',
    });

    deleteUser();
  };

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
