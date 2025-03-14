import { PropsWithChildren } from 'react';
import { ActionModalContent } from '@/pages/instances/action/modal/ActionModalContent.component';
import Modal from '@/components/modal/Modal.component';
import { TSectionType } from '@/pages/instances/action/InstanceAction.page';
import { Spinner } from '../spinner/Spinner.component';

export type TActionModalProps = PropsWithChildren<{
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
}: TActionModalProps) => (
  <Modal
    title={title}
    isPending={isPending}
    handleInstanceAction={handleInstanceAction}
    handleModalClose={handleModalClose}
    variant={variant}
  >
    {isPending ? (
      <Spinner />
    ) : (
      <>
        <ActionModalContent type={section} instanceName={instanceName} />
        {children}
      </>
    )}
  </Modal>
);

export default ActionModal;
