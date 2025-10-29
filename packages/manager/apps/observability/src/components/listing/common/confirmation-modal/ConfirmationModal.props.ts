import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

export interface ConfirmationModalProps {
  title: string;
  message?: string;
  onDismiss: () => void;
  onConfirm?: () => void;
  type?: ODS_MODAL_COLOR;
  isLoading?: boolean;
  confirmButtonLabel?: string;
  isConfirmButtonLoading?: boolean;
  isConfirmButtonDisabled?: boolean;
  cancelButtonLabel?: string;
  error?: string;
}
