import React from 'react';

import useNotifications from '@/core/notifications';

import style from './notification.module.scss';

const NotificationIcon = ({ children, url, notificationId }) => {
  const { toggleNotificationReadStatus } = useNotifications();

  const onNotificationLinkClick = () => {
    return toggleNotificationReadStatus(notificationId, true);
  };

  return (
    <a href={url} onClick={onNotificationLinkClick}>
      {children}
    </a>
  );
};

export default NotificationIcon;
