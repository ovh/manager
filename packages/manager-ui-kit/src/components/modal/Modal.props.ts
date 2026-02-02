import { ComponentPropsWithRef, ReactNode } from 'react';

import { MODAL_COLOR, Modal, ModalOpenChangeDetail } from '@ovhcloud/ods-react';

import { MODAL_TYPE } from '@/components/modal/Modal.constants';

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
  type?: MODAL_COLOR | MODAL_TYPE;
  /** Is loading state for display a spinner */
  loading?: boolean;
  /** Primary button details */
  primaryButton?: ModalButton;
  /** Secondary button details */
  secondaryButton?: ModalButton;
  /** Properties for the step number displayed on the top right of the modal */
  step?: {
    /** Current step displayed on the modal (must define heading and total) */
    current?: number;
    /** Total number of steps in the modal (must defined heading and current) */
    total?: number;
  };
  /** Display dismissible button */
  dismissible?: boolean;
  /** Callback fired when the modal open state changes. */
  onOpenChange?: (detail?: ModalOpenChangeDetail) => void;
  /** Is modal open state */
  open?: boolean;
  /** Children of modal */
  children?: ReactNode;
};
