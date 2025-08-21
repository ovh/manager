import React from 'react';

export type DeleteModalProps = {
  serviceTypeName?: string;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  onClose?: () => void;
  error?: string;
  children?: React.ReactNode;
  open?: boolean;
};
