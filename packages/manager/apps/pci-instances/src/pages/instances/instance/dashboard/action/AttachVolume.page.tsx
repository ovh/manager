import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/modal/Modal.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useAttachVolume } from '../hooks/useDashboardAction';
import { useProjectId } from '@/hooks/project/useProjectId';
import VolumeSelector from '../components/VolumeSelector.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { TUnattachedVolume } from '../view-models/selectUnattachedResource';

const AttachVolume: FC = () => {
  const { t } = useTranslation('actions');
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [volume, setVolume] = useState<TUnattachedVolume | null>(null);

  const { isPending, volumes, attachVolume } = useAttachVolume({
    projectId,
    region,
    instanceId,
  });

  const handleAttachVolume = () => {
    if (!volume) return;

    attachVolume({ volumeId: volume.value });
  };

  return (
    <Modal
      title={t('pci_instances_actions_instance_volume_attach_title')}
      isPending={isPending}
      disabled={!volume}
      handleInstanceAction={handleAttachVolume}
      onModalClose={handleModalClose}
      variant="primary"
    >
      {isPending ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <VolumeSelector
          volume={volume}
          volumes={volumes}
          onValueChange={setVolume}
        />
      )}
    </Modal>
  );
};

export default AttachVolume;
