import { ReactNode } from 'react';
import { create } from 'zustand';
import { NotificationType, NotificationState } from './Notifications.type';

export const NOTIFICATION_MINIMAL_DISPLAY_TIME = 1000;

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
        {
          uid: state.uid,
          content,
          type,
          dismissible,
          creationTimestamp: Date.now(),
        },
      ],
    })),
  addSuccess: (content: ReactNode, dismissible = true) =>
    get().addNotification(content, NotificationType.Success, dismissible),
  addError: (content: ReactNode, dismissible = true) =>
    get().addNotification(content, NotificationType.Error, dismissible),
  addWarning: (content: ReactNode, dismissible = true) =>
    get().addNotification(content, NotificationType.Warning, dismissible),
  addInfo: (content: ReactNode, dismissible = true) =>
    get().addNotification(content, NotificationType.Info, dismissible),
  clearNotification: (toRemoveUid: number) =>
    set((state) => ({
      notifications: state.notifications.filter(
        ({ uid }) => uid !== toRemoveUid,
      ),
    })),
  clearNotifications: () =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) =>
          Date.now() - notification.creationTimestamp <
          NOTIFICATION_MINIMAL_DISPLAY_TIME,
      ),
    })),
}));

export default useNotifications;
