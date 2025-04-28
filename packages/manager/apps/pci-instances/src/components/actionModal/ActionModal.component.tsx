import { PropsWithChildren } from 'react';
import { ActionModalContent } from '@/pages/instances/action/modal/ActionModalContent.component';
import Modal from '@/components/modal/Modal.component';
import { Spinner } from '../spinner/Spinner.component';
import { TSectionType } from '@/types/instance/action/action.type';

export type TActionModalProps = PropsWithChildren<{
  title: string;
  isPending: boolean;
  handleInstanceAction: () => void;
  handleModalClose: () => void;
  instanceName?: string;
  section: TSectionType;
  variant?: 'primary' | 'warning';
  isLoading: boolean;
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
  isLoading,
}: TActionModalProps) => (
  <Modal
    title={title}
    isPending={isPending || isLoading}
    handleInstanceAction={handleInstanceAction}
    handleModalClose={handleModalClose}
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
        instanceName={instanceName}
      >
        {children}
      </ActionModalContent>
    )}
  </Modal>
);

export default ActionModal;
