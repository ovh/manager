import React from 'react';

import NotificationIcon from './Icon.jsx';
import NotificationLink from './Link.jsx';
import NotificationContent from './Content.jsx';
import NotificationBadge from './Badge.jsx';

import style from './notification.module.scss';

const Notification = ({ children }) => {
  return (
    <div className={`${style.notification} position-relative d-flex`}>
      {children}
    </div>
  );
};

Notification.Icon = NotificationIcon;
Notification.Link = NotificationLink;
Notification.Content = NotificationContent;
Notification.Badge = NotificationBadge;

export default Notification;
