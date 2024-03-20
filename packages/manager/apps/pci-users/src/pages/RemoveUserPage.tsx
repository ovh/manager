import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import RemoveUserModal from '@/components/users/RemoveUserModal';
import { useUser } from '@/hooks/useUser';

export default function RemoveSshPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const userId = searchParams.get('userId');
  const { data: user } = useUser(projectId || '', `${userId}`);
  return (
    <>
      <RemoveUserModal
        projectId={`${projectId}`}
        userId={`${userId}`}
        onClose={() => onClose()}
        onSuccess={() => {
          addSuccess(
            t('pci_projects_project_users_delete_success_message', {
              user: user?.username,
            }),
          );
        }}
        onError={(error: Error) => {
          addError(
            <>
              {t('pci_projects_project_users_delete_error_delete', {
                message: error && error.message,
                user: user?.username,
              })}
            </>,
          );
        }}
      />
    </>
  );
}
