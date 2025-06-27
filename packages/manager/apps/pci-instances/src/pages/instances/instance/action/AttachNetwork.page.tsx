import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { DefaultError } from '@tanstack/react-query';
import Modal from '@/components/modal/Modal.component';
import {
  useAttachNetworkToInstance,
  useRegionInstance,
} from '@/data/hooks/instance/useInstance';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useNetwork } from '@/data/hooks/network/useNetwork';
import { getUnattachedPrivateNetworkByInstance } from '@/data/hooks/network/selectors/network.selector';
import NetworkSelector from '../component/NetworkSelector.component';
import { instancesQueryKey, isApiErrorResponse } from '@/utils';
import queryClient from '@/queryClient';

const AttachNetworkModal: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [networkId, setNetworkId] = useState<string>('');
  const { addError, addSuccess } = useNotifications();

  const { projectId, instanceId, regionId } = useParams() as {
    projectId: string;
    instanceId: string;
    regionId: string;
  };

  const { data: instance, isPending: isInstancePending } = useRegionInstance(
    projectId,
    instanceId,
    regionId,
  );

  const { data: networkOptions, isPending: isNetworkPending } = useNetwork(
    projectId,
    regionId,
    {
      select: (networks) =>
        getUnattachedPrivateNetworkByInstance(networks, instance),
    },
  );

  const {
    isPending: isAttaching,
    mutate: attachNetworkToInstance,
  } = useAttachNetworkToInstance({
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

        // can be replaced by an updateInstanceCache with an instance builder with we have all network payload (we dont have all at the moment)
        queryClient.invalidateQueries({
          queryKey: instancesQueryKey(projectId, [
            'instance',
            instanceId,
            'region',
            regionId,
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
      handleInstanceAction={attachNetworkToInstance}
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
