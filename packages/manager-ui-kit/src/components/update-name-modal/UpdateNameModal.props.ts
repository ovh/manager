import type { ModalOpenChangeDetail } from '@ovhcloud/ods-react';

export type UpdateNameModalProps = Readonly<{
  headline: string;
  description?: string | null;
  inputLabel: string;
  defaultValue?: string | null;
  isLoading?: boolean;
  pattern?: string;
  patternMessage?: string;
  error?: string | null;
  isOpen?: boolean;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  onOpenChange?: (detail?: ModalOpenChangeDetail) => void;
  onClose?: () => void;
  updateDisplayName: (newDisplayName: string) => void;
}>;
