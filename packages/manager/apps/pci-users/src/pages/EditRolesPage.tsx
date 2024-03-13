import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNotifications from '@/hooks/useNotifications';
import EditRolesModal from '@/components/users/EditRolesModal';

export default function EditRolesPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const userId = parseInt(searchParams.get('userId'), 10) || null;
  return (
    <>
      <EditRolesModal
        projectId={`${projectId}`}
        userId={userId || 0}
        onClose={() => onClose()}
        onSuccess={() => {
          addSuccess(t('pci_projects_project_users_roles_edit_success'));
        }}
        onError={(error: Error) => {
          addError(
            <>
              {t('pci_projects_project_users_roles_edit_error', {
                message: error && error.message,
              })}
            </>,
          );
        }}
      />
    </>
  );
}
