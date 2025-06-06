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
  | 'reinstall'
  | 'billing/monthly/activate';

export type TBaseInstanceActionPageProps = {
  title: string;
  section: BaseInstanceActionSection;
  projectId: string;
  onError: (error: unknown) => void;
  onSuccess: () => void;
  onModalClose: () => void;
  instance?: TInstanceDto;
  isLoading: boolean;
};

const BaseInstanceActionPage: FC<TBaseInstanceActionPageProps> = ({
  title,
  section,
  projectId,
  onError,
  onSuccess,
  onModalClose,
  instance,
  isLoading,
}) => {
  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    {
      onError,
      onSuccess,
    },
  );

  const handleInstanceAction = () => {
    if (instance) mutationHandler(instance);
  };

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={onModalClose}
      instance={instance}
      section={section}
      variant={section === 'delete' ? 'critical' : 'primary'}
      isLoading={isLoading}
    />
  );
};

export default BaseInstanceActionPage;
