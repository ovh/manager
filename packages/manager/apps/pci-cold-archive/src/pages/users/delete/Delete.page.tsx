import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import { useDeleteUser, useUser } from '@/api/hooks/useUsers';

export default function UserDelete() {
  const { t } = useTranslation('users/delete');

  const { projectId, userId } = useParams();

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'users/delete',
  });

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY}`,
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };
  const onClose = onCancel;

  const { data: user, isPending: isUserPending } = useUser(
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

      trackErrorPage();
      goBack();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_containers_users_delete_success',
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    deleteUser();
  };

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
