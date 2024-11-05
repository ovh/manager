import { FC } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useDeleteInstance } from '@/data/hooks/instance/useDeleteInstance';
import { updateDeletedInstanceStatus } from '@/data/hooks/instance/useInstances';
import queryClient from '@/queryClient';
import { DeleteModal } from './modal/DeleteModal.component';

const DeleteInstance: FC = () => {
  const { t } = useTranslation(['delete', 'common']);
  const navigate = useNavigate();
  const { projectId } = useParams() as { projectId: string };
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get('instanceId');
  const instanceName = searchParams.get('instanceName');
  const { addError, addSuccess } = useNotifications();

  const handleModalClose = () => {
    navigate('..');
  };

  const handleMutationSuccess = () => {
    updateDeletedInstanceStatus(queryClient, instanceId);
    addSuccess(
      t('pci_instances_delete_instance_success_message', {
        name: instanceName,
      }),
      true,
    );
    handleModalClose();
  };

  const handleMutationError = () => {
    addError(
      t('pci_instances_delete_instance_error_message', { name: instanceName }),
      true,
    );
    handleModalClose();
  };

  const { deleteInstance, isPending } = useDeleteInstance(projectId, {
    onError: handleMutationError,
    onSuccess: handleMutationSuccess,
  });

  const handleDeleteInstance = () => {
    deleteInstance(instanceId as string);
  };

  if (!instanceId || !instanceName) return null;

  return (
    <DeleteModal
      instanceName={instanceName}
      isPending={isPending}
      onModalClose={handleModalClose}
      onModalConfirm={handleDeleteInstance}
    />
  );
};

export default DeleteInstance;
