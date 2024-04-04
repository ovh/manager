import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import EditRolesModal from './EditRolesModal';

export default function EditRolesPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const userId = parseInt(searchParams.get('userId'), 10) || null;
  return (
    <EditRolesModal
      projectId={`${projectId}`}
      userId={userId || 0}
      onClose={() => onClose()}
      onSuccess={() => {
        addSuccess(
          <Translation ns="common">
            {(t) => t('pci_projects_project_users_roles_edit_success')}
          </Translation>,
          true,
        );
      }}
      onError={(error: Error) => {
        addError(
          <Translation ns="common">
            {(t) =>
              t('pci_projects_project_users_roles_edit_error', {
                message: error?.message,
              })
            }
          </Translation>,
          true,
        );
      }}
    />
  );
}
