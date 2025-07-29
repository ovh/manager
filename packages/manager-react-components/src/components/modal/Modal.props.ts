import { ReactNode, ComponentPropsWithRef } from 'react';
import { Modal, MODAL_COLOR } from '@ovhcloud/ods-react';

type ModalButton = {
  /** Label of the button */
  label: string;
  /** loading state for primary button */
  loading?: boolean;
  /** disabled state for primary button */
  disabled?: boolean;
  /** Action of primary button */
  onClick?: () => void;
  /** Test id of primary button */
  testId?: string;
};

export type ModalProps = ComponentPropsWithRef<typeof Modal> & {
  /** Title of modal */
  heading?: string;
  /** Type of modal. It can be any of `ODS_MODAL_COLOR` */
  type?: MODAL_COLOR;
  /** Is loading state for display a spinner */
  loading?: boolean;
  /** Primary button details */
  primaryButton?: ModalButton;
  /** Secondary button details */
  secondaryButton?: ModalButton;
  /** Display dismissible button */
  dismissible?: boolean;
  /** Callback fired when the modal open state changes. */
  onOpenChange?: () => void;
  /** Is modal open state */
  open?: boolean;
  /** Children of modal */
  children?: ReactNode;
};
