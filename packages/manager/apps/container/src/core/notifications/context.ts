import { createContext } from 'react';

import { Notification } from './notification';

export type NotificationsContextType = {
  notifications: Notification[];
  getActiveNotifications(): Notification[];
  loadNotifications(): Promise<Notification[]>;
  readAllNotifications(): Promise<boolean>;
  toggleNotificationReadStatus(
    notificationId: string,
    linkClicked?: boolean,
  ): Promise<boolean>;
  notificationsCount: number;
  setNotificationsCount(count: number): void;
};

const NotificationsContext = createContext<NotificationsContextType | null>();

export default NotificationsContext;
