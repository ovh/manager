import { ReactNode } from 'react';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export interface Notification {
  /** unique notification identifier */
  uid: number;
  content: ReactNode;
  type: NotificationType;
  dismissible?: boolean;
  creationTimestamp?: number;
}

export interface NotificationState {
  uid: number;
  notifications: Notification[];
  addNotification: (
    content: ReactNode,
    type: NotificationType,
    dismissible?: boolean,
  ) => void;
  addSuccess: (content: ReactNode, dismissible?: boolean) => void;
  addError: (content: ReactNode, dismissible?: boolean) => void;
  addWarning: (content: ReactNode, dismissible?: boolean) => void;
  addInfo: (content: ReactNode, dismissible?: boolean) => void;
  clearNotification: (uid: number) => void;
  clearNotifications: () => void;
}
