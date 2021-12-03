import React from 'react';

import NotificationsLoading from './Loading.jsx';
import NotificationsGroup from './Group.jsx';
import NotificationsEmpty from './Empty.jsx';

import style from './notifications.module.scss';

const Notifications = ({ children }) => {
  return <ul className={style.notificationsList}>{children}</ul>;
};

Notifications.Loading = NotificationsLoading;
Notifications.Group = NotificationsGroup;
Notifications.Empty = NotificationsEmpty;

export default Notifications;
