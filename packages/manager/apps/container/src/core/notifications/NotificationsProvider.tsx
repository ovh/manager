import React, { useContext, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { useReket } from '@ovh-ux/ovh-reket';
import { find } from 'lodash-es';

import { NOTIFICATION_STATUS_ENUM } from './constants';
import NotificationsContext from './context';
import useNotification, { APINotification, Notification } from './notification';

type Props = {
  children: JSX.Element | JSX.Element[];
  environment: Partial<Environment>;
};

export const NotificationsProvider = ({
  children = null,
  environment = {},
}: Props): JSX.Element => {
  const reketInstance = useReket();

  let notificationsContext = useContext(NotificationsContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  /**
   * Call 2API notifications to get notifications that needs to be displayed.
   * @return {Promise<void>}
   */
  const loadNotifications = async (): Promise<void> => {
    return reketInstance
      .get('/notification', {
        requestType: 'aapi',
        params: {
          target: environment.getRegion(),
          lang: environment.getUserLocale(),
        },
      })
      .then((notifs: APINotification[]) => {
        const newNotifications: APINotification[] = [];
        notifs.forEach((notif: APINotification) => {
          newNotifications.push({
            ...notif,
            urlDetails: {
              href: notif.urlDetails ? notif.urlDetails.href : '',
            },
          });
        });
        setNotifications(newNotifications.map(useNotification));
      })
      .catch(() => {
        setNotifications([]);
      });
  };

  /**
   * Retrieve active notifications.
   * @param  {Array.<Object>} notifs Notifications to filters.
   *                                 If none provided, filters loaded notifications.
   * @return {Array.<Object>}
   */
  const getActiveNotifications = (notifs: Notification[]): Notification[] => {
    const notificationsToFilter = notifs || notifications;

    return notificationsToFilter.filter((notification) =>
      notification.isActive(),
    );
  };

  const getNotificationById = (notificationId: string): Notification => {
    return find(notifications, {
      id: notificationId,
    });
  };

  const updateNotications = (status: unknown): Promise<unknown> => {
    return reketInstance.post('/notification', status, { requestType: 'aapi' });
  };

  const updateNotificationReadStatus = (
    notification: Notification,
    status: string,
  ): Promise<unknown> => {
    notification.setUpdating(true);

    return updateNotications({
      [status]: [notification.id],
    })
      .then(() => {
        notification.setStatus(status);
      })
      .finally(() => {
        notification.setUpdating(false);
        setNotifications([...notifications]);
      });
  };

  const readAllNotifications = (
    notificationsToUpdate: Notification[] = notifications,
  ): Promise<unknown> => {
    return Promise.all(
      notificationsToUpdate.map((notification: Notification) =>
        !notification.updating && notification.isActive()
          ? updateNotificationReadStatus(
              notification,
              NOTIFICATION_STATUS_ENUM.ACKNOWLEDGED,
            )
          : Promise.resolve(),
      ),
    );
  };

  /**
   * Toggle the read status of a notification
   * @param  {String}   notificationId  The notification id to toggle.
   * @param  {Boolean}  linkClicked     Flag that tell if the toggle comes from a click event or not.
   * @return {Promise}
   */
  const toggleNotificationReadStatus = (
    notificationId: string,
    linkClicked = false,
  ): Promise<unknown> => {
    const notificationToUpdate = getNotificationById(notificationId);

    if (notificationToUpdate.isActive() && !notificationToUpdate.updating) {
      // mark as read
      return updateNotificationReadStatus(
        notificationToUpdate,
        NOTIFICATION_STATUS_ENUM.ACKNOWLEDGED,
      );
    }
    if (
      !notificationToUpdate.isActive() &&
      !notificationToUpdate.updating &&
      !linkClicked
    ) {
      // mark as unread
      return updateNotificationReadStatus(
        notificationToUpdate,
        NOTIFICATION_STATUS_ENUM.ACTIVE,
      );
    }

    return Promise.resolve();
  };

  notificationsContext = {
    notifications,
    getActiveNotifications,
    loadNotifications,
    readAllNotifications,
    toggleNotificationReadStatus,
    notificationsCount,
    setNotificationsCount,
  };

  return (
    <NotificationsContext.Provider value={notificationsContext}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
