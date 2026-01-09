import { MODAL_COLOR } from '@ovhcloud/ods-react';

export interface ConfirmationModalProps {
  title: string;
  message?: string;
  onDismiss: () => void;
  onConfirm?: () => void;
  type?: MODAL_COLOR;
  isLoading?: boolean;
  confirmButtonLabel?: string;
  isConfirmButtonLoading?: boolean;
  isConfirmButtonDisabled?: boolean;
  cancelButtonLabel?: string;
  error?: Error;
}
