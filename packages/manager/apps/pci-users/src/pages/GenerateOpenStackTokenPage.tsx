import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import GenerateOpenStackTokenModal from '@/components/users/GenerateOpenStackTokenModal';
import { useUser } from '@/hooks/useUser.ts';

export default function GenerateOpenStackTokenPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('common');
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const { data: user } = useUser(`${projectId}`, `${userId}`);
  return (
    <>
      <GenerateOpenStackTokenModal
        projectId={`${projectId}`}
        userId={`${userId}`}
        onClose={() => navigate('..')}
        onError={(error: Error) => {
          addError(
            <>
              {t('pci_projects_project_users_delete_error_delete', {
                message: error?.message,
                user: user?.username,
              })}
            </>,
          );
        }}
      />
    </>
  );
}
