import { useNotifications } from '@ovhcloud/manager-components';
import { Translation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import DeleteModal from '@/components/delete/DeleteModal.component';
import { useDeleteNetwork } from '@/api/hooks/useNetwork';

export default function DeleteLocalZone() {
  const navigate = useNavigate();
  const location = useLocation();

  const { addError, addSuccess } = useNotifications();
  const { projectId } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const networkId = searchParams.get('networkId');
  const region = searchParams.get('region');

  const onClose = () => navigate('..');

  const { deleteNetwork, isPending } = useDeleteNetwork({
    projectId,
    region,
    networkId,
    onSuccess: () => {
      addSuccess(
        <Translation>
          {(t) =>
            t('pci_projects_project_network_private_delete_success', {
              name: networkId,
            })
          }
        </Translation>,
      );
      onClose();
    },
    onError: (error: ApiError) => {
      onClose();
      addError(
        <Translation>
          {(t) =>
            t('pci_projects_project_network_private_delete_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
      );
    },
  });

  return (
    <DeleteModal
      networkId={networkId}
      isPending={isPending}
      onClose={onClose}
      onConfirm={deleteNetwork}
    />
  );
}
