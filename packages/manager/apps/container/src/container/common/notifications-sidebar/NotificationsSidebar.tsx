import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { groupBy } from 'lodash-es';
import PropTypes from 'prop-types';

import { MAX_NOTIFICATIONS } from './constants';
import Notifications from './Notifications/Notifications';
import style from './notifications-sidebar.module.scss';

import { useHeader } from '@/context/header';
import useNotifications from '@/core/notifications';
import useDate from '@/helpers/useDate';

type Props = {
  environment: Environment;
};

const NotificationsSidebar = ({ environment }: Props): JSX.Element => {
  const locale = environment.getUserLocale();
  const { fromNow } = useDate();

  const [isLoading, setIsLoading] = useState(false);
  const [groupedNotifications, setGroupedNotifications] = useState([]);

  const { isNotificationsSidebarVisible } = useHeader();
  const {
    notifications,
    loadNotifications,
    setNotificationsCount,
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

NotificationsSidebar.propTypes = {
  environment: PropTypes.object,
};

NotificationsSidebar.defaultProps = {
  environment: {},
};

export default NotificationsSidebar;
