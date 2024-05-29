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
  dismissible?: boolean;
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

export const useNotifications = create<NotificationState>((set, get) => ({
  uid: 0,
  notifications: [],
  addNotification: (
    content: ReactNode,
    type: NotificationType,
    dismissible = false,
  ) =>
    set((state) => ({
      uid: state.uid + 1,
      notifications: [
        ...state.notifications,
        { uid: state.uid, content, type, dismissible },
      ],
    })),
  addSuccess: (content: ReactNode, dismissible = false) =>
    get().addNotification(content, NotificationType.Success, dismissible),
  addError: (content: ReactNode, dismissible = false) =>
    get().addNotification(content, NotificationType.Error, dismissible),
  addWarning: (content: ReactNode, dismissible = false) =>
    get().addNotification(content, NotificationType.Warning, dismissible),
  addInfo: (content: ReactNode, dismissible = false) =>
    get().addNotification(content, NotificationType.Info, dismissible),
  clearNotification: (toRemoveUid: number) =>
    set((state) => ({
      notifications: state.notifications.filter(
        ({ uid }) => uid !== toRemoveUid,
      ),
    })),
  clearNotifications: () => set(() => ({ notifications: [] })),
}));

export default useNotifications;
