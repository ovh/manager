import { useEffect, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { create } from 'zustand';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export interface Notification {
  content: ReactNode;
  type: NotificationType;
}

export interface NotificationState {
  notifications: Notification[];
  addNotification: (content: ReactNode, type: NotificationType) => void;
  addSuccess: (content: ReactNode) => void;
  addError: (content: ReactNode) => void;
  addWarning: (content: ReactNode) => void;
  addInfo: (content: ReactNode) => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  notifications: [],
  addNotification: (content: ReactNode, type: NotificationType) =>
    set((state) => ({
      notifications: [...state.notifications, { content, type }],
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

export const useReadNotifications = () => {
  const location = useLocation();
  const { notifications, clearNotifications } = useNotifications();
  useEffect(() => {
    clearNotifications();
  }, [location]);
  return useMemo(() => notifications, [location]);
};

export default useNotifications;
