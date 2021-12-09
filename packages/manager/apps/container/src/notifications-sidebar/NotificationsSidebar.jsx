import React, { useContext, useEffect, useState } from 'react';
import { groupBy } from 'lodash-es';

import useNotifications from '@/core/notifications';
import useDate from '@/helpers/useDate';

import Notifications from './Notifications/Notifications.jsx';
import { MAX_NOTIFICATIONS } from './constants';

import style from './notifications-sidebar.module.scss';
import ApplicationContext from '../context/application.context.js';

const NotificationsSidebar = ({ environment }) => {
  const locale = environment.getUserLocale();
  const { shell } = useContext(ApplicationContext);
  const ux = shell.ux();
  const { fromNow } = useDate();

  const [isLoading, setIsLoading] = useState(false);
  const [groupedNotifications, setGroupedNotifications] = useState([]);
  console.log(ux);
  const { isSidebarVisible } = ux;
  const isNotificationsSidebarOpen = isSidebarVisible('notifications');

  const {
    notifications,
    loadNotifications,
    getActiveNotifications,
  } = useNotifications();

  const getGroupedNotifications = (notificationToDisplay) => {
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

    // setNavbarNotificationCount(
    //   getActiveNotifications(notificationToDisplay).length,
    // );
    setGroupedNotifications(getGroupedNotifications(notificationToDisplay));
  }, [notifications]);

  return (
    <div
      className={`${style.notificationsSidebar} ${isNotificationsSidebarOpen &&
        style.notificationsSidebar_toggle}`}
      role="menu"
    >
      <Notifications>
        {isLoading && <Notifications.Loading />}
        {!isLoading &&
          Object.keys(groupedNotifications).map((groupTime, index) => {
            return (
              <Notifications.Group
                notifications={groupedNotifications[groupTime]}
                title={groupTime}
                key={index}
              />
            );
          })}
        {!isLoading && !notifications.length && <Notifications.Empty />}
      </Notifications>
    </div>
  );
};

export default NotificationsSidebar;
