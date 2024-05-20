import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import { useUser } from '@/api/hooks/useUser.ts';
import GenerateOpenStackTokenModal from './GenerateOpenStackTokenModal';

export default function GenerateOpenStackTokenPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const { data: user } = useUser(projectId, userId);
  return (
    <>
      <GenerateOpenStackTokenModal
        projectId={projectId}
        userId={`${userId}`}
        onClose={() => navigate('..')}
        onError={(error: Error) => {
          addError(
            <Translation ns="common">
              {(t) =>
                t('pci_projects_project_users_openstack-token_error_save', {
                  message: error?.message,
                  user: user?.username,
                })
              }
            </Translation>,
            true,
          );
        }}
      />
    </>
  );
}
