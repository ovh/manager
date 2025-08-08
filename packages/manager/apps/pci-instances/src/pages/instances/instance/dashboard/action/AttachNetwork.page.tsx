import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { DefaultError } from '@tanstack/react-query';
import Modal from '@/components/modal/Modal.component';
import { useAttachNetwork } from '@/data/hooks/instance/useInstance';
import { Spinner } from '@/components/spinner/Spinner.component';
import { isApiErrorResponse } from '@/utils';
import NetworkSelector from '../components/NetworkSelector.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useUnattachedPrivateNetworks } from '../hooks/useDashboardAction';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';

const AttachNetworkModal: FC = () => {
  const { t } = useTranslation('actions');
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [networkId, setNetworkId] = useState<string>('');
  const { addError, addSuccess } = useNotifications();

  const {
    networks,
    instance,
    isPending: isNetworkPending,
  } = useUnattachedPrivateNetworks({ projectId, region, instanceId });

  const { isPending: isAttaching, mutate: attachNetwork } = useAttachNetwork({
    projectId,
    instanceId,
    region,
    callbacks: {
      onSuccess: (_data, variables) => {
        const network = networks.find(
          ({ value }) => value === variables.networkId,
        );

        addSuccess(
          t(
            'pci_instances_actions_instance_network_network_attach_success_message',
            {
              network: network!.label,
              instance,
            },
          ),
          true,
        );

        handleModalClose();
      },
      onError: (error) => {
        const errorMessage = isApiErrorResponse(error)
          ? error.response?.data.message
          : (error as DefaultError).message;
        addError(
          t('pci_instances_actions_instance_attach_error_message', {
            message: errorMessage,
          }),
          true,
        );
        handleModalClose();
      },
    },
  });

  const isPending = isNetworkPending || isAttaching;

  return (
    <Modal
      title={t('pci_instances_actions_instance_network_network_attach_title')}
      isPending={isPending || !networkId}
      handleInstanceAction={() => attachNetwork({ networkId })}
      onModalClose={handleModalClose}
      variant="primary"
    >
      {isPending ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <NetworkSelector onValueChange={setNetworkId} networks={networks} />
      )}
    </Modal>
  );
};

export default AttachNetworkModal;
