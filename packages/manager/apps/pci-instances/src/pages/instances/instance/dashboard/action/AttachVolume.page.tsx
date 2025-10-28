import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/modal/Modal.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useAttachVolume } from '../hooks/useDashboardAction';
import { useProjectId } from '@/hooks/project/useProjectId';
import VolumeSelector from '../components/VolumeSelector.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';

const AttachVolume: FC = () => {
  const { t } = useTranslation('actions');
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [volumeId, setVolumeId] = useState<string>('');

  const { isPending, volumes, attachVolume } = useAttachVolume({
    projectId,
    region,
    instanceId,
  });

  return (
    <Modal
      title={t('pci_instances_actions_instance_volume_attach_title')}
      isPending={isPending}
      disabled={!volumeId}
      handleInstanceAction={() => attachVolume({ volumeId })}
      onModalClose={handleModalClose}
      variant="primary"
    >
      {isPending ? (
        <div className="mt-8">
          <Spinner />
        </div>
      ) : (
        <VolumeSelector volumes={volumes} onValueChange={setVolumeId} />
      )}
    </Modal>
  );
};

export default AttachVolume;
