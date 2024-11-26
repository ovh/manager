import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import DeleteModal from '@/components/delete/DeleteModal.component';
import { useDeletePrivateNetwork } from '@/data/hooks/networks/useNetworks';

export default function DeleteLocalZone() {
  const navigate = useNavigate();
  const location = useLocation();

  const { addError, addSuccess } = useNotifications();
  const { projectId } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const networkId = searchParams.get('networkId');
  const region = searchParams.get('region');

  const onClose = () => navigate('..');

  const { deletePrivateNetwork, isPending } = useDeletePrivateNetwork({
    projectId,
    region,
    networkId,
    onError: (e) => {
      const error = (e as unknown) as ApiError;
      addError(
        <Translation ns="listing">
          {(t) =>
            t('pci_projects_project_network_private_delete_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess: () => {
      addSuccess(
        <Translation ns="listing">
          {(t) =>
            t('pci_projects_project_network_private_delete_success', {
              name: networkId,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  return (
    <DeleteModal
      networkId={networkId}
      isPending={isPending}
      onClose={onClose}
      onConfirm={deletePrivateNetwork}
    />
  );
}
