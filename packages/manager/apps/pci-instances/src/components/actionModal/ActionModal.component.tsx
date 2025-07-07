import { PropsWithChildren } from 'react';
import { ActionModalContent } from '@/pages/instances/action/components/modal/ActionModalContent.component';
import Modal, { TModalVariant } from '@/components/modal/Modal.component';
import { Spinner } from '../spinner/Spinner.component';
import { TSectionType } from '@/types/instance/action/action.type';
import { TInstanceActionModalViewModel } from '@/pages/instances/action/view-models/selectInstanceForActionModal';

export type TActionModalProps = PropsWithChildren<{
  title: string;
  isPending: boolean;
  handleInstanceAction?: () => void;
  onModalClose: () => void;
  instance: TInstanceActionModalViewModel;
  section: TSectionType;
  variant?: TModalVariant;
  isLoading: boolean;
  dismissible?: boolean;
  wrapper?: React.ComponentType<PropsWithChildren<unknown>>;
}>;

export const ActionModal = ({
  title,
  isPending,
  handleInstanceAction,
  onModalClose,
  children,
  instance,
  section,
  variant,
  isLoading,
  dismissible,
  wrapper,
}: TActionModalProps) => (
  <Modal
    title={title}
    isPending={isPending || isLoading}
    handleInstanceAction={handleInstanceAction}
    onModalClose={onModalClose}
    variant={variant}
    dismissible={dismissible}
    wrapper={wrapper}
  >
    {isPending ? (
      <div className="pt-8">
        <Spinner />
      </div>
    ) : (
      <ActionModalContent
        isLoading={isLoading}
        type={section}
        instance={instance}
      >
        {children}
      </ActionModalContent>
    )}
  </Modal>
);

export default ActionModal;
