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
}

export interface NotificationState {
  uid: number;
  notifications: Notification[];
  addNotification: (content: ReactNode, type: NotificationType) => void;
  addSuccess: (content: ReactNode) => void;
  addError: (content: ReactNode) => void;
  addWarning: (content: ReactNode) => void;
  addInfo: (content: ReactNode) => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  uid: 0,
  notifications: [],
  addNotification: (content: ReactNode, type: NotificationType) =>
    set((state) => ({
      uid: state.uid + 1,
      notifications: [
        ...state.notifications,
        { uid: state.uid, content, type },
      ],
    })),
  addSuccess: (content: ReactNode) =>
    get().addNotification(content, NotificationType.Success),
  addError: (content: ReactNode) =>
    get().addNotification(content, NotificationType.Error),
  addWarning: (content: ReactNode) =>
    get().addNotification(content, NotificationType.Warning),
  addInfo: (content: ReactNode) =>
    get().addNotification(content, NotificationType.Info),
  clearNotifications: () => set(() => ({ notifications: [] })),
}));

export default useNotifications;
