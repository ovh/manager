import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { groupBy } from 'lodash-es';

import { MAX_NOTIFICATIONS } from './constants';
import Notifications from './Notifications/Notifications';
import style from './notifications-sidebar.module.scss';

import { useHeader } from '@/context/header';
import { Notification } from '@/core/notification';
import useNotifications from '@/core/notifications';
import useDate from '@/helpers/useDate';

type NotificationByDate = {
  [fromDate: string]: Notification;
}

type Props = {
  environment?: Environment;
};

const NotificationsSidebar = ({ environment = {} }: Props): JSX.Element => {
  const locale = environment.getUserLocale();
  const { fromNow } = useDate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groupedNotifications, setGroupedNotifications] = useState<NotificationByDate[]>([]);

  const { isNotificationsSidebarVisible } = useHeader();
  const {
    notifications,
    loadNotifications,
    setNotificationsCount,
    getActiveNotifications,
  } = useNotifications();

  const getGroupedNotifications = (notificationToDisplay: Notification[]): NotificationByDate[] => {
    return groupBy(notificationToDisplay, ({ date }) => fromNow(date, locale));
  };

  useEffect(() => {
    setIsLoading(true);
    loadNotifications().finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const notificationToDisplay =
      notifications.length > MAX_NOTIFICATIONS
        ? notifications.slice(0, MAX_NOTIFICATIONS)
        : notifications;

    setNotificationsCount(getActiveNotifications(notificationToDisplay).length);
    setGroupedNotifications(getGroupedNotifications(notificationToDisplay));
  }, [notifications]);

  return (
    <div
      className={`${
        style.notificationsSidebar
      } ${isNotificationsSidebarVisible && style.notificationsSidebar_toggle}`}
      role="menu"
    >
      <Notifications>
        { isLoading ? (
          <Notifications.Loading />
        ) : notifications.length == 0 ? (
          <Notifications.Empty />
        ) : (
          <>
            {Object.keys(groupedNotifications).map((groupTime, index) => (
              <Notifications.Group
                notifications={groupedNotifications[groupTime]}
                title={groupTime}
                key={index}
              />
            ))}
          </>
        )}
      </Notifications>
    </div>
  );
};

export default NotificationsSidebar;
