import { ReactNode } from 'react';

export interface SubscriptionsDrawerProps {
  title: string;
  onDismiss: () => void;
  isLoading?: boolean;
  children?: ReactNode;
}
