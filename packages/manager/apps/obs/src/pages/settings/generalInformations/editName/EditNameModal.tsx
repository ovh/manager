import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ObsSettingsOutletContext } from '@/types/ObsSettings.type';
import { useUpdateObservabilityServiceName } from '@/data/hooks/useObservability';

const EditNameModal = () => {
  const navigate = useNavigate();
  const { serviceId, service } = useOutletContext<ObsSettingsOutletContext>();

  const mutation = serviceId
    ? useUpdateObservabilityServiceName(serviceId)
    : null;

  const handleRename = (newDisplayName: string) => {
    if (!serviceId || !service?.checksum || !mutation) return;

    mutation.mutate(
      {
        checksum: service.checksum,
        targetSpec: {
          displayName: newDisplayName === '' ? null : newDisplayName,
        },
      },
      {
        onSuccess: () => {
          navigate('..');
        },
      },
    );
  };

  return (
    <UpdateNameModal
      isOpen
      headline="Update service Display name"
      inputLabel="Display name"
      defaultValue={service?.currentState.displayName ?? ''}
      isLoading={mutation?.isPending ?? false}
      error={mutation?.error ? (mutation.error as Error).message : ''}
      closeModal={() => navigate('..')}
      updateDisplayName={(newDisplayName: string) =>
        handleRename(newDisplayName)
      }
    />
  );
};

export default EditNameModal;
