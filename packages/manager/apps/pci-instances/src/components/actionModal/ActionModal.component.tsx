import { PropsWithChildren } from 'react';
import { ActionModalContent } from '@/pages/instances/action/modal/ActionModalContent.component';
import Modal from '@/components/modal/Modal.component';
import { TSectionType } from '@/pages/instances/action/InstanceAction.page';

type TActionModalProps = PropsWithChildren<{
  title: string;
  isPending: boolean;
  handleInstanceAction: () => void;
  handleModalClose: () => void;
  instanceName: string;
  section: TSectionType;
  variant?: 'primary' | 'warning';
}>;

export const ActionModal = ({
  title,
  isPending,
  handleInstanceAction,
  handleModalClose,
  children,
  instanceName,
  section,
  variant,
}: TActionModalProps) => {
  return (
    <Modal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      variant={variant}
    >
      <ActionModalContent type={section} instanceName={instanceName} />
      {children}
    </Modal>
  );
};

export default ActionModal;
