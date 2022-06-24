import { createContext } from 'react';

import { Notification } from './notification';

export type NotificationsContextType = {
  notifications: Notification[];
  getActiveNotifications(notifs: Notification[]): Notification[];
  loadNotifications(): Promise<void>;
  readAllNotifications(notifs?: Notification[]): Promise<unknown>;
  toggleNotificationReadStatus(
    notificationId: string,
    linkClicked?: boolean,
  ): Promise<unknown>;
  notificationsCount: number;
  setNotificationsCount(count: number): void;
};

const NotificationsContext = createContext<NotificationsContextType>(
  {} as NotificationsContextType,
);

export default NotificationsContext;
