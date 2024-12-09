import { useNavigate, useParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import RemoveSshModal from '@/components/ssh-keys/RemoveSshModal';

export default function RemoveSshPage() {
  const { projectId, sshId } = useParams();

  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <RemoveSshModal
      projectId={`${projectId}`}
      sshId={`${sshId}`}
      onClose={() => onClose()}
      onSuccess={() => {
        addSuccess(
          <Translation ns="common">
            {(t) => t('pci_projects_project_sshKeys_remove_success')}
          </Translation>,
          true,
        );
      }}
      onError={(error: Error) => {
        addError(
          <Translation ns="common">
            {(t) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: t('pci_projects_project_sshKeys_remove_error', {
                    error: error?.message,
                  }),
                }}
              ></span>
            )}
          </Translation>,
          true,
        );
      }}
    />
  );
}
