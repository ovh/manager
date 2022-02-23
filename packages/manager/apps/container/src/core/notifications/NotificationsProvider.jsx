import React, { useContext, useState } from 'react';
import { useReket } from '@ovh-ux/ovh-reket';
import { find } from 'lodash-es';

import NotificationsContext from './context';
import useNotification from './notification';
import { NOTIFICATION_STATUS_ENUM } from './constants';

export const NotificationsProvider = ({ children, environment }) => {
  const reketInstance = useReket();

  let notificationsContext = useContext(NotificationsContext);

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState([]);

  /**
   * Call 2API notifications to get notifications that needs to be displayed.
   * @return {Promise<Array.<Object>>}
   */
  const loadNotifications = async () => {
    return reketInstance
      .get('/notification', {
        requestType: 'aapi',
        params: {
          target: environment.getRegion(),
          lang: environment.getUserLocale(),
        },
      })
      .then((notifs) => {
        setNotifications(notifs.map(useNotification));
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
  const getActiveNotifications = (notifs) => {
    const notificationsToFilter = notifs || notifications;

    return notificationsToFilter.filter((notification) =>
      notification.isActive(),
    );
  };

  const getNotificationById = (notificationId) => {
    return find(notifications, {
      id: notificationId,
    });
  };

  const updateNotications = (status) => {
    return reketInstance.post('/notification', status, { requestType: 'aapi' });
  };

  const updateNotificationReadStatus = (notification, status) => {
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

  const readAllNotifications = (notifs) => {
    const notificationsToUpdate = notifs || notifications;

    return Promise.all(
      notificationsToUpdate.map((notification) =>
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
    notificationId,
    linkClicked = false,
  ) => {
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
