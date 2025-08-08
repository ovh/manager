import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DefaultError } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import Modal from '@/components/modal/Modal.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useUnattachedVolumes } from '../hooks/useDashboardAction';
import { useProjectId } from '@/hooks/project/useProjectId';
import VolumeSelector from '../components/VolumeSelector.component';
import { useAttachVolume } from '@/data/hooks/instance/useInstance';
import { isApiErrorResponse } from '@/utils';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';

const AttachVolume: FC = () => {
  const { t } = useTranslation('actions');
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const [volumeId, setVolumeId] = useState<string>('');
  const { addError, addSuccess } = useNotifications();

  const {
    volumes,
    instance,
    isPending: isVolumePending,
  } = useUnattachedVolumes({
    projectId,
    region,
    instanceId,
  });

  const { isPending: isAttaching, mutate: attachVolume } = useAttachVolume({
    projectId,
    instanceId,
    region,
    callbacks: {
      onSuccess: (_data, variables) => {
        const volume = volumes.find(
          ({ value }) => value === variables.volumeId,
        );
        addSuccess(
          t('pci_instances_actions_instance_volume_attach_success_message', {
            volume: volume!.label,
            instance,
          }),
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

  const isPending = isVolumePending || isAttaching;

  return (
    <Modal
      title={t('pci_instances_actions_instance_volume_attach_title')}
      isPending={isPending || !volumeId}
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
