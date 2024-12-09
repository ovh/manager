import { useNavigate, useParams } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import AddSshModal from '@/components/ssh-keys/AddSshModal';

export default function AddSshPage() {
  const { projectId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <AddSshModal
      projectId={`${projectId}`}
      onClose={() => onClose()}
      onSuccess={() => {
        addSuccess(
          <Translation ns="common">
            {(t) => t('pci_projects_project_sshKeys_add_success')}
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
                  __html: t('pci_projects_project_sshKeys_add_error', {
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
