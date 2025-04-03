import { FC } from 'react';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TInstanceDto } from '@/types/instance/api.type';
import ActionModal from '@/components/actionModal/ActionModal.component';

type BaseInstanceActionSection =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall';

export type TBaseInstanceActionPageProps = {
  title: string;
  section: BaseInstanceActionSection;
  projectId: string;
  handleMutationError: (error: unknown) => void;
  handleMutationSuccess: () => void;
  handleModalClose: () => void;
  instance: TInstanceDto;
};

const BaseInstanceActionPage: FC<TBaseInstanceActionPageProps> = ({
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
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance.name}
      section={section}
    />
  );
};

export default BaseInstanceActionPage;
