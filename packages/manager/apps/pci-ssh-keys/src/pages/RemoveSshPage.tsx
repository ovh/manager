import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import RemoveSshModal from '@/components/ssh-keys/RemoveSshModal';

export default function RemoveSshPage() {
  const { projectId, sshId } = useParams();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <>
      <RemoveSshModal
        projectId={`${projectId}`}
        sshId={`${sshId}`}
        onClose={() => onClose()}
        onSuccess={() => {
          addSuccess(t('pci_projects_project_sshKeys_remove_success'), true);
        }}
        onError={(error: Error) => {
          addError(
            <span
              dangerouslySetInnerHTML={{
                __html: t('pci_projects_project_sshKeys_remove_error', {
                  error: error && error.message,
                }),
              }}
            ></span>,
            true,
          );
        }}
      />
    </>
  );
}
