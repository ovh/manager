import { ReactNode } from 'react';
import { create } from 'zustand';

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
  dismissable?: boolean;
  creationTimestamp: number;
}

export interface NotificationState {
  uid: number;
  notifications: Notification[];
  addNotification: (
    content: ReactNode,
    type: NotificationType,
    dismissable?: boolean,
  ) => void;
  addSuccess: (content: ReactNode, dismissable?: boolean) => void;
  addError: (content: ReactNode, dismissable?: boolean) => void;
  addWarning: (content: ReactNode, dismissable?: boolean) => void;
  addInfo: (content: ReactNode, dismissable?: boolean) => void;
  clearNotification: (uid: number) => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  uid: 0,
  notifications: [],
  addNotification: (
    content: ReactNode,
    type: NotificationType,
    dismissable = false,
  ) =>
    set((state) => ({
      uid: state.uid + 1,
      notifications: [
        ...state.notifications,
        {
          uid: state.uid,
          content,
          type,
          dismissable,
          creationTimestamp: Date.now(),
        },
      ],
    })),
  addSuccess: (content: ReactNode, dismissable = false) =>
    get().addNotification(content, NotificationType.Success, dismissable),
  addError: (content: ReactNode, dismissable = false) =>
    get().addNotification(content, NotificationType.Error, dismissable),
  addWarning: (content: ReactNode, dismissable = false) =>
    get().addNotification(content, NotificationType.Warning, dismissable),
  addInfo: (content: ReactNode, dismissable = false) =>
    get().addNotification(content, NotificationType.Info, dismissable),
  clearNotification: (toRemoveUid: number) =>
    set((state) => ({
      notifications: state.notifications.filter(
        ({ uid }) => uid !== toRemoveUid,
      ),
    })),
  clearNotifications: () =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => Date.now() - notification.creationTimestamp < 1000,
      ),
    })),
}));

export default useNotifications;
