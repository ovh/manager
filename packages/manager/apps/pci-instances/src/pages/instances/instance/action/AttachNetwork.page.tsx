import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/modal/Modal.component';
import { useRegionInstance } from '@/data/hooks/instance/useInstance';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useNetwork } from '@/data/hooks/network/useNetwork';
import { getUnattachedPrivateNetworkByInstance } from '@/data/hooks/network/selectors/network.selector';
import NetworkSelector from '../component/NetworkSelector.component';

const AttachNetworkModal: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [networkIds, setNetworkIds] = useState<string[]>([]);

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

  const isPending = isInstancePending || isNetworkPending;

  return (
    <Modal
      title={t('pci_instances_actions_instance_network_network_attach_title')}
      isPending={isPending || !networkIds.length}
      handleInstanceAction={() => {}}
      onModalClose={handleModalClose}
      variant="primary"
    >
      {isPending ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <NetworkSelector
          networkIds={networkIds}
          setNetworkIds={setNetworkIds}
          networkOptions={networkOptions ?? []}
        />
      )}
    </Modal>
  );
};

export default AttachNetworkModal;
