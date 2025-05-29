import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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

  const { trackClick, trackPage } = useOvhTracking();

  const onClose = () => navigate('..');

  const { deleteNetwork, isPending } = useDeleteNetwork({
    projectId,
    region,
    networkId,
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
      trackPage({
        pageName: `delete_privateNetwork::${region}`,
        pageType: PageType.bannerSuccess,
      });
    },
    onError: (error: ApiError) => {
      onClose();
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
      trackPage({
        pageName: `delete_privateNetwork::${region}`,
        pageType: PageType.bannerError,
      });
    },
  });

  return (
    <DeleteModal
      networkId={networkId}
      isPending={isPending}
      onClose={() => {
        onClose();
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_privateNetwork', 'cancel', region],
        });
      }}
      onConfirm={() => {
        deleteNetwork();
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_privateNetwork', 'confirm', region],
        });
      }}
    />
  );
}
