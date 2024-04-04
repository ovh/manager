import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import { useUser } from '@/api/hooks/useUser';
import RemoveUserModal from './RemoveUserModal';

export default function RemoveSshPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const userId = searchParams.get('userId');
  const { data: user } = useUser(projectId || '', `${userId}`);
  return (
    <RemoveUserModal
      projectId={`${projectId}`}
      userId={`${userId}`}
      onClose={() => onClose()}
      onSuccess={() => {
        addSuccess(
          <Translation ns="common">
            {(t) =>
              t('pci_projects_project_users_delete_success_message', {
                user: user?.username,
              })
            }
          </Translation>,
          true,
        );
      }}
      onError={(error: Error) => {
        addError(
          <Translation ns="common">
            {(t) =>
              t('pci_projects_project_users_delete_error_delete', {
                message: error?.message,
                user: user?.username,
              })
            }
          </Translation>,
          true,
        );
      }}
    />
  );
}
