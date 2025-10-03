export type UpdateNameModalProps = {
  headline: string;
  description?: string;
  inputLabel: string;
  defaultValue?: string;
  onClose?: () => void;
  updateDisplayName: (newDisplayName: string) => void;
  isLoading?: boolean;
  error?: string;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  pattern?: string;
  patternMessage?: string;
  isOpen?: boolean;
};
