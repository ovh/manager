import { PropsWithChildren } from 'react';
import { ActionModalContent } from '@/pages/instances/action/modal/ActionModalContent.component';
import Modal, { TModalVariant } from '@/components/modal/Modal.component';
import { Spinner } from '../spinner/Spinner.component';
import { TSectionType } from '@/types/instance/action/action.type';
import { TInstanceDto } from '@/types/instance/api.type';

export type TActionModalProps = PropsWithChildren<{
  title: string;
  isPending: boolean;
  handleInstanceAction: () => void;
  onModalClose: () => void;
  instance?: TInstanceDto;
  section: TSectionType;
  variant?: TModalVariant;
  isLoading: boolean;
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
}: TActionModalProps) => (
  <Modal
    title={title}
    isPending={isPending || isLoading}
    handleInstanceAction={handleInstanceAction}
    onModalClose={onModalClose}
    variant={variant}
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
