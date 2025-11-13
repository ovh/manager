import { MODAL_COLOR } from '@ovh-ux/muk';

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
  error?: string;
}
