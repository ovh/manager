import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import AddSshModal from '@/components/ssh-keys/AddSshModal';

export default function AddSshPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('common');
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
        addSuccess(t('pci_projects_project_sshKeys_add_success'), true);
      }}
      onError={(error: Error) => {
        addError(
          <span
            dangerouslySetInnerHTML={{
              __html: t('pci_projects_project_sshKeys_add_error', {
                error: error?.message,
              }),
            }}
          ></span>,
        );
      }}
    />
  );
}
