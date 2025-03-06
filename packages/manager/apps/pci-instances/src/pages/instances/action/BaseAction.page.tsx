import { FC } from 'react';
import Modal from '@/components/modal/Modal.component';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';
import { ActionModalContent } from './modal/ActionModalContent.component';
import { TInstanceDto } from '@/types/instance/api.type';

type BaseInstanceActionSection =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall';

const BaseInstanceActionPage: FC<{
  title: string;
  section: BaseInstanceActionSection;
  projectId: string;
  handleMutationError: () => void;
  handleMutationSuccess: () => void;
  handleModalClose: () => void;
  instance: TInstanceDto;
}> = ({
  title,
  section,
  projectId,
  handleMutationError,
  handleMutationSuccess,
  handleModalClose,
  instance,
}) => {
  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    {
      onError: handleMutationError,
      onSuccess: handleMutationSuccess,
    },
  );

  const handleInstanceAction = () => mutationHandler(instance);

  return (
    <Modal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
    >
      <ActionModalContent type={section} instanceName={instance.name} />
    </Modal>
  );
};

export default BaseInstanceActionPage;
