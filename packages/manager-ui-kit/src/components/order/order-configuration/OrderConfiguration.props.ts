import { ReactNode } from 'react';

export type OrderConfigurationProps = {
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isValid: boolean;
};
