import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { DefaultError } from '@tanstack/react-query';
import Modal from '@/components/modal/Modal.component';
import { useAttachNetwork } from '@/data/hooks/instance/useInstance';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useNetwork } from '@/data/hooks/network/useNetwork';
import { instancesQueryKey, isApiErrorResponse } from '@/utils';
import queryClient from '@/queryClient';
import NetworkSelector from '../components/NetworkSelector.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useParams } from '@/hooks/params/useParams';
import { useDashboard } from '../hooks/useDashboard';
import { selectUnattachedNetwork } from '../view-models/selectUnattachedNetwork';

const AttachNetworkModal: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const projectId = useProjectId();
  const { instanceId, regionId } = useParams('regionId', 'instanceId');
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [networkId, setNetworkId] = useState<string>('');
  const { addError, addSuccess } = useNotifications();

  const { instance, isPending: isInstancePending } = useDashboard({
    region: regionId,
    instanceId,
  });

  const { data: networkOptions, isPending: isNetworkPending } = useNetwork(
    projectId,
    regionId,
    {
      select: (networks) => selectUnattachedNetwork(networks, instance),
    },
  );

  const { isPending: isAttaching, mutate: attachNetwork } = useAttachNetwork({
    projectId,
    instanceId,
    networkId,
    callbacks: {
      onSuccess: () => {
        const network = networkOptions?.find(({ id }) => id === networkId);

        addSuccess(
          t(
            'pci_instances_actions_instance_network_network_attach_success_message',
            {
              network: network?.name,
              instance: instance?.name,
            },
          ),
          true,
        );

        // TODO: can be replaced by an updateDashboardCache if we have all payload to build the network
        queryClient.invalidateQueries({
          queryKey: instancesQueryKey(projectId, [
            'region',
            regionId,
            'instance',
            instanceId,
            'withBackups',
            'withImage',
            'withNetworks',
            'withVolumes',
          ]),
        });

        handleModalClose();
      },
      onError: (error) => {
        const errorMessage = isApiErrorResponse(error)
          ? error.response?.data.message
          : (error as DefaultError).message;
        addError(
          t(
            'pci_instances_actions_instance_network_network_attach_error_message',
            { message: errorMessage },
          ),
          true,
        );
        handleModalClose();
      },
    },
  });

  const isPending = isInstancePending || isNetworkPending || isAttaching;

  return (
    <Modal
      title={t('pci_instances_actions_instance_network_network_attach_title')}
      isPending={isPending || !networkId}
      handleInstanceAction={attachNetwork}
      onModalClose={handleModalClose}
      variant="primary"
    >
      {isPending ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <NetworkSelector
          networkId={networkId}
          setNetworkId={setNetworkId}
          networkOptions={networkOptions ?? []}
        />
      )}
    </Modal>
  );
};

export default AttachNetworkModal;
